import express from 'express';
import { createTask, deleteTask, getAllTasks, updateTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
