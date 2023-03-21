const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('ok');
});

module.exports = router;
