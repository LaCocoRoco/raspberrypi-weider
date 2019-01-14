var driver    = require('../controllers/driver')
var express   = require('express');
var router    = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { protocol : driver.getProtocol() });
});

router.post('/setProtocol', async function(req, res, next) {
  let response = await driver.setProtocol(req.body.id, req.body.value);
  res.json(response);
});

router.post('/getProtocol', function(req, res, next) {
  res.json(driver.getProtocol());
});

module.exports = router;
