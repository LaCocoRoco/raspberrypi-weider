const SerialPort = require('serialport');
const Readline   = SerialPort.parsers.Readline;
const port       = new SerialPort('/dev/ttyUSB1');
const parser     = port.pipe(new Readline('\r\n'));
const logger     = require('../controllers/logger');

let orderM = 'M';
let orderC = 'C';
let orderO = 'O';
let orderI = 'I';
let orderF = 'F';
let orderE = 'E';


let protTextE = `
Errors: 0 0 0 0 00000001 00001000 00000011 00000000
`;

let protBytesE =`
4572 726f 7273 3a20 3020 3020 3020 3020
3030 3030 3030 3031 2030 3030 3031 3030
3020 3030 3030 3030 3131 2030 3030 3030
3030 300d 0a
`;

let protTextF = `
Err Temp.sensor
Err Waermepumpe
`;

let protBytesF = `
4572 7220 5465 6d70 2e73 656e 736f 720d
0a45 7272 2057 6165 726d 6570 756d 7065
0d 0a
`;

let protTextM = `
T-Vorlauf:8888 °C
T-Sole   :  13 °C
T-Aussen :  10 °C
T-Raum   :  15 °C
T-Puffer :  30 °C
T-Boiler :  35 °C
T-WP2    :1234 °C
T-WP1    :4444 °C
T-Reserv1:9999 °C
T-Reserv2:4563 °C
T-Raumsoll  12 °C
T-Vorlauf2  11 °C
T-Sole2  : 123 °C
Pt1000 WP1  22
Pt1000 WP2  23
Steps WP1:  34
Steps WP2:  11
Codier WP1  12 ADC
Codier WP2  34
`;

let protBytesM = `
542d 566f 726c 6175 663a 3838 3838 20c2
b043 0d0a 542d 536f 6c65 2020 203a 2020
3133 20c2 b043 0d0a 542d 4175 7373 656e
203a 2020 3130 20c2 b043 0d0a 542d 5261
756d 2020 203a 2020 3135 20c2 b043 0d0a
542d 5075 6666 6572 203a 2020 3330 20c2
b043 0d0a 542d 426f 696c 6572 203a 2020
3335 20c2 b043 0d0a 542d 5750 3220 2020
203a 3132 3334 20c2 b043 0d0a 542d 5750
3120 2020 203a 3434 3434 20c2 b043 0d0a
542d 5265 7365 7276 313a 3939 3939 20c2
b043 0d0a 542d 5265 7365 7276 323a 3435
3633 20c2 b043 0d0a 542d 5261 756d 736f
6c6c 2020 3132 20c2 b043 0d0a 542d 566f
726c 6175 6632 2020 3131 20c2 b043 0d0a
542d 536f 6c65 3220 203a 2031 3233 20c2
b043 0d0a 5074 3130 3030 2057 5031 2020
3232 0d0a 5074 3130 3030 2057 5032 2020
3233 0d0a 5374 6570 7320 5750 313a 2020
3334 0d0a 5374 6570 7320 5750 323a 2020
3131 0d0a 436f 6469 6572 2057 5031 2020
3132 2041 4443 0d0a 436f 6469 6572 2057
5032 2020 3334 0d0a
`;

let protTextI = `
Sperre Heizen
DruckschalterWP1
DruckschalterWP2
Niederdruck-WP1
Niederdruck-WP2
Stroemung-WP1
Sperre Raumbed.g
`;

let protBytesI = `
5369 6368 6572 756e 6773 6b65 7474 650d
0a53 7065 7272 6520 4865 697a 656e 0d0a
4472 7563 6b73 6368 616c 7465 7257 5031
0d0a 4472 7563 6b73 6368 616c 7465 7257
5032 0d0a 4e69 6564 6572 6472 7563 6b2d
5750 310d 0a4e 6965 6465 7264 7275 636b
2d57 5032 0d0a 5374 726f 656d 756e 672d
5750 310d 0a53 7065 7272 6520 5261 756d
6265 642e 670d 0a
`;

let protTextO = `
UP Heizung
UP Grundwasser
WP1 laeuft
WP2 laeuft
UP Boiler
Reserve A.E.7
UP2 Mischer
Mischer1 Auf
Mischer1 Zu
Mischer2 Auf
Mischer2 Zu
Reserve A.E.14
Reserve A.E.15
`;

let protBytesO = `
5550 2048 6569 7a75 6e67 0d0a 5550 2047
7275 6e64 7761 7373 6572 0d0a 5750 3120
6c61 6575 6674 0d0a 5750 3220 6c61 6575
6674 0d0a 5550 2042 6f69 6c65 720d 0a52
6573 6572 7665 2041 2e45 2e37 0d0a 5550
3220 4d69 7363 6865 720d 0a4d 6973 6368
6572 3120 4175 660d 0a4d 6973 6368 6572
3120 5a75 0d0a 4d69 7363 6865 7232 2041
7566 0d0a 4d69 7363 6865 7232 205a 750d
0a52 6573 6572 7665 2041 2e45 2e31 340d
0a52 6573 6572 7665 2041 2e45 2e31 350d
0a
`;

let protTextC = `
Code 1: 23
Code 2: -999
Code 3: 47
Code 4: 46
Code 5: 27
Code 6: 28
Code 7: 5
Code 8: 9
Code 9: 28
Code 10: 340
Code 11: 0
Code 12: 0
`;

let protBytesC = `
436f 6465 2031 3a20 3233 0d0a 436f 6465
2032 3a20 2d39 3939 0d0a 436f 6465 2033
3a20 3437 0d0a 436f 6465 2034 3a20 3436
0d0a 436f 6465 2035 3a20 3237 0d0a 436f
6465 2036 3a20 3238 0d0a 436f 6465 2037
3a20 350d 0a43 6f64 6520 383a 2039 0d0a
436f 6465 2039 3a20 3238 0d0a 436f 6465
2031 303a 2033 3430 0d0a 436f 6465 2031
313a 2030 0d0a 436f 6465 2031 323a 2030
0d0a 
`;

let protTextCX = `
1
`;

let protBytesCX = `
310d 0a
`;

parser.on('data', function (data) {
  port.write(respond(data), function(err) {
    if (err) return logger.debug('Error write port: ', err.message);
  });
});

function respond(data) {
  logger.debug(data.charAt(0));
  switch(data.charAt(0)) {
    case orderC:
      return data.length > 10 ? decode(protBytesCX) : decode(protBytesC);

    case orderM:
      return decode(protBytesM);

    case orderI:
      return decode(protBytesI);

    case orderO:
      return decode(protBytesO);

    case orderF:
      return decode(protBytesF);

    case orderE:
      return decode(protBytesE);

    default:
      return '';
  }
}

function decode(protocol) {
  return decodeURIComponent(protocol.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
}
