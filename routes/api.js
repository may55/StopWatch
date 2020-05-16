const express = require ('express');
const router = express.Router();
const Watch = require('../models/stopwatch');

router.get('/watch', (req, res, next) => {
  Watch.find()
    .then(data => res.json(data))
    .catch(next)
});

router.post('/watch', (req, res, next) => {
    if(req.body.timePassed){
      Watch.create(req.body)
        .then(data => res.json(data))
        .catch(next)
    }else {
      res.json({
        error: "Time is Empty"
      })
    }
  });

router.delete('/watch', (req, res, next) => {
  Watch.remove({}, function(err) { 
    console.log('collection removed') 
  })
});

module.exports = router;