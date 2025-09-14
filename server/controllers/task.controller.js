import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'All fields are required', success: false });
    }

    const task = await Task.create({ title, description });

    return res.status(201).json({ task, success: true, message: 'Task created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    return res.status(200).json({ tasks, success: true, message: 'Tasks found' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found', success: false });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (completed) task.completed = completed;

    await task.save();

    return res.status(200).json({ task, success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found', success: false });
    }

    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, success: false });
  }
};
