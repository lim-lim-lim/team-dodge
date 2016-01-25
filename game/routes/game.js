var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendfile( 'views/index.html' );
});

router.get('/room/:id', function(req, res) {
  res.sendfile( 'views/joypad.html' );
});

module.exports = router;
