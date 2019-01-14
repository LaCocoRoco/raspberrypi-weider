var header = require('./header');

module.exports = [{
  id      : 'I01',
  tag     : 'Sicherungskette',
  active  : false,
  name    : header.I01.name,
  display : header.I01.display
},{
  id      : 'I02',
  tag     : 'Sperre Heizen',
  active  : false,
  name    : header.I02.name,
  display : header.I02.display
},{
  id      : 'I03',
  tag     : 'Sperre Boiler',
  active  : false,
  name    : header.I03.name,
  display : header.I03.display
},{
  id      : 'I04',
  tag     : 'DruckschalterWP1',
  active  : false,
  name    : header.I04.name,
  display : header.I04.display
},{
  id      : 'I05',
  tag     : 'DruckschalterWP2',
  active  : false,
  name    : header.I05.name,
  display : header.I05.display
},{
  id      : 'I06',
  tag     : 'Niederdruck-WP1',
  active  : false,
  name    : header.I06.name,
  display : header.I06.display
},{
  id      : 'I07',
  tag     : 'Reserve E.E.8',
  active  : false,
  name    : header.I07.name,
  display : header.I07.display
},{
  id      : 'I08',
  tag     : 'Niederdruck-WP2',
  active  : false,
  name    : header.I08.name,
  display : header.I08.display
},{
  id      : 'I09',
  tag     : 'Stroemung-WP1',
  active  : false,
  name    : header.I09.name,
  display : header.I09.display
},{
  id      : 'I10',
  tag     : 'Stroemung-WP2',
  active  : false,
  name    : header.I10.name,
  display : header.I10.display
},{
  id      : 'I11',
  tag     : 'Sperre Raumbed.g',
  active  : false,
  name    : header.I11.name,
  display : header.I11.display
}];
