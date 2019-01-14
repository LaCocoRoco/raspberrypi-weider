var header = require('./header');

module.exports = [{
  id      : 'F01',
  tag     : 'Err Temp.sensor',
  active  : false,
  name    : header.F01.name,
  display : header.F01.display
},{
  id      : 'F02',
  tag     : 'Err Stroemung',
  active  : false,
  name    : header.F02.name,
  display : header.F02.display
},{
  id      : 'F03',
  tag     : 'Err Waermepumpe',  
  active  : false,
  name    : header.F01.name,
  display : header.F03.display
}];
