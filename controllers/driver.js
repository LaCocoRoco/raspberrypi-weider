'use strict'

/***********************************/
/*           DECLARATION           */
/***********************************/

const REFRESH = 10000;
const TASK    = 2000;
const TIMEOUT = 200;
const RETRIES = 50;
const SLEEP   = 100;

const serial   = require('../controllers/serial');
const protocol = require('../config/protocol');
const order    = require('../config/order');
const logger   = require('../controllers/logger');

var open, alive, update, timeout, refresh, manifold;

/***********************************/
/*           CONSTRUCTOR           */
/***********************************/

open      = false;
alive     = false;
update    = false;
manifold  = null;
timeout   = null;
refresh   = null;

serial.error(serialError);
serial.read(serialRead);

refreshProtocol();
manifoldProtocol();
setInterval(() => task(), TASK);

/***********************************/
/*              MAIN               */
/***********************************/

function timeoutProtocol() {
  clearTimeout(timeout);
  timeout = setTimeout(() => handlerProtocol(), TIMEOUT);
}

function refreshProtocol() {
  update = true;
  clearTimeout(refresh);
  refresh = setTimeout(() => update = false, REFRESH);
};

function serialError() {
  open = false;
}

function serialRead(data) {
  parseProtocol(data);
  timeoutProtocol();
}

function sendOrder() {
    serial.write(order.active);
    timeoutProtocol();
}

function parseMeasurement(data) {
  let measurement = protocol.measurement.find(function(e) {
    return data.match(new RegExp(e.tag, 'g'));
  });

  if (measurement !== undefined) {
    let length = measurement.tag.length;
    measurement.value = parseInt(data.slice(length, length + 4));
  }
}

function parseOutput(data) {
  let output = protocol.output.find(function(e) {
    return data.match(new RegExp(e.tag, 'g'));
  });

  if (output !== undefined) {
    output.active = true
  }
}

function parseInput(data) {
  let input = protocol.input.find(function(e) {
    return data.match(new RegExp(e.tag, 'g'));
  });

  if (input !== undefined) {
    input.active = true;
  }
}

function parseFailure(data) {
  let failure = protocol.failure.find(function(e) {
    return data.match(new RegExp(e.tag, 'g'));
  });

  if (failure !== undefined) {
    failure.active = true;
  }
}

function parseCode(data) {
  if (order.active.length !== 1) {
    let code = protocol.code.find(function(e) {
      return order.active.match(new RegExp(e.id, 'g'));
    });

    if (code !== undefined) {
      code.done = data.charAt(0) === '1' ? true : false;
    }

  } else {
    let code = protocol.code.find(function(e) {
      return data.match(new RegExp(e.tag, 'g'));
    });

    if (code !== undefined) {
      if (code.active) return;
      let length = code.tag.length;
      code.value = parseInt(data.slice(length, length + 5));
    }
  }
}

function parseError(data) {
  let value = parseInt(data.replace(/ /g, '').slice(-34), 2);
  let bitop;

  for (let error of protocol.error) {
    if (error.id === 'E01') bitop = 16777216;
    if (error.id === 'E02') bitop = 65536;
    if (error.id === 'E03') bitop = 256;
    if (error.id === 'E04') bitop = 1;

    for (let byte of error.byte) {
      byte.active = (value & bitop) === bitop;
      bitop = bitop * 2;
    }
  }
}

function parseProtocol(data) {
  switch(order.active.charAt(0)) {
    case order.measurement:
      return parseMeasurement(data);

    case order.input:
      return parseInput(data);

    case order.output:
      return parseOutput(data);

    case order.failure:
      return parseFailure(data);

    case order.error:
      return parseError(data);

    case order.code:
      return parseCode(data);
  }
}

function handlerOrderStart() {
  alive = true;
  order.active = order.code;
  for (let code of protocol.code) code.done = false;
  sendOrder();
}

function handlerOrderCode() {
  order.active = order.measurement;
  for (let code of protocol.code) {
    if (code.active) {
      let id = code.id.replace(order.code, '');
      let value = code.value.toString().padStart(4, '0');
      code.active = false;
      order.active = order.code + id + value + id + value + order.code;
      break;
    }
  }
  sendOrder();
}

function handlerOrderMeasurement() {
  order.active = order.input;
  for (let input of protocol.input) input.active = false;
  sendOrder();
}

function handlerOrderInput() {
  order.active = order.output;
  for (let output of protocol.output) output.active = false;
  sendOrder();
}

function handlerOrderOutput() {
  order.active = order.failure;
  for (let failure of protocol.failure) failure.active = false;
  sendOrder();
}

function handlerOrderFailure() {
  order.active = order.error;
  sendOrder();
}

function handlerOrderError() {
  order.active = order.stop;
  handlerProtocol();
}

function handlerOrderStop() {
  alive = false;
  manifoldProtocol();
}

function handlerProtocol() {
  switch(order.active.charAt(0)) {
    case order.start:
      return handlerOrderStart();

    case order.code:
      return handlerOrderCode();

    case order.measurement:
      return handlerOrderMeasurement();

    case order.input:
      return handlerOrderInput();

    case order.output:
      return handlerOrderOutput();

    case order.failure:
      return handlerOrderFailure();

    case order.error:
      return handlerOrderError();

    case order.stop:
      return handlerOrderStop();
  }
}

function updateProtocol() {
  order.active = order.start;
  handlerProtocol();
}

function manifoldProtocol() {
  manifold = JSON.parse(JSON.stringify(protocol));
}

async function task() {
  if ( update && !open) open = await serial.open();
  if ( update &&  open && !alive) updateProtocol();
  if (!update &&  open && !alive) open = await serial.close();
}

/***********************************/
/*         SETTER & GETTER         */
/***********************************/

exports.setProtocol = async function(id, value) {
  if (isNaN(value)) return false;

  for (let code of protocol.code) {
    if (code.id === id) {
      code.done = false;
      code.active = true;
      code.value = value;

      for (let i = 0; i < RETRIES; i++) {
        if (code.value !== value) {
          return false;
        }

        if (code.done) {
          code.done = false
          return true;
        }

        let sleep = m => new Promise(r => setTimeout(r, m));
        await sleep(SLEEP);
      }
    }
  }

  return false;
}

exports.getProtocol = function() {
  refreshProtocol();
  return manifold;
}
