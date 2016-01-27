var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendfile( 'views/screen/screen-container.html' );
});

router.get('/connection/key:id', function(req, res) {
  res.sendfile( 'views/joypad/joypad-container.html' );
});

module.exports = router;
