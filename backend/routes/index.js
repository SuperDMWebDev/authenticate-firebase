var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).send('Authorized person');
});
router.get('/api/tasks', function (req, res, next) {
  return res.json({
    tasks: [
      {
        title: 'Task1',
      },
      {
        title: 'Task2',
      },
    ],
  });
});
module.exports = router;
