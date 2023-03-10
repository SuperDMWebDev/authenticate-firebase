const Task = require('../models/task');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('vao post routes');
    const task = new Task(req.body);
    await task.save();
    res.send(task);
  } catch (err) {
    res.send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
