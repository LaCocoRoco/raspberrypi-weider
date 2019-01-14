'use strict'

/***********************************/
/*           DECLARATION           */
/***********************************/

const INTERVALL = 1000;
const DISABLE   = 10000;

var timer;

/***********************************/
/*           CONSTRUCTOR           */
/***********************************/

setInterval(() => $.post('getProtocol').done((x) => update(x)), INTERVALL);

/***********************************/
/*              MAIN               */
/***********************************/

function disableRefresh() {
  clearTimeout(timer);
  timer = setTimeout(() => timer = undefined, DISABLE);
}

function update(protocol) {
  for (let code of protocol.code) {
    if (code.display) {
      let element = $('#' + code.id).find('div[name=number]');

      if (!code.io) {
        element.text(code.value);
      } else if (timer === undefined) {
        element.text(code.value);
      }
    }
  }

  for (let measurement of protocol.measurement) {
    if (measurement.display) {
      let element = $('#' + measurement.id).find('div[name=number]');
      element.text(measurement.value);
    }
  }

  for (let output of protocol.output) {
    if (output.display) {
      let element = $('#' + output.id).find('div[name=output]');
      if (output.active) {
        element.addClass('bg-success');
      } else {
        element.removeClass('bg-success');
      }
    }
  }

  for (let input of protocol.input) {
    if (input.display) {
      let element = $('#' + input.id).find('div[name=input]');
      if (input.active) {
        element.addClass('bg-success');
      } else {
        element.removeClass('bg-success');
      }
    }
  }

  for (let failure of protocol.failure) {
    if (failure.display) {
      let element = $('#' + failure.id).find('div[name=failure]');
      if (failure.active) {
        element.addClass('bg-success');
      } else {
        element.removeClass('bg-success');
      }
    }
  }

  for (let error of protocol.error) {
    for (let byte of error.byte) {
      if (byte.display) {
        let element = $('#' + byte.id).find('div[name=error]');
        if (byte.active) {
          element.addClass('bg-success');
        } else {
          element.removeClass('bg-success');
        }
      }
    }
  }
}

function setProtocolCode(element) {
  let name     = $(element).attr('name');
  let header   = $(element).parents('div[name=header]');
  let number   = header.find('div[name=number]');
  let transmit = header.find('div[name=transmit]');
  let id       = header.attr('id');
  let value    = parseInt(number.text());

  if (isNaN(value)) return;

  if (name === 'add') value++;
  if (name === 'sub') value--;

  $.post('getProtocol').done(function(protocol) {
    for (let code of protocol.code) {
      if (code.id === id) {
        if (value < code.min || value > code.max) return;
      }
    }

    disableRefresh();

    number.text(value);

    $.post('setProtocol', { id : id, value : value }).done(function(result) {
      if (result) {
        transmit.addClass('bg-secondary');
        setTimeout(() => transmit.removeClass('bg-secondary'), 200);
      }
    });
  });
}
