import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Loader2, CheckSquare } from 'lucide-react';

const API_BASE = 'http://65.2.130.83:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // let swarnavo = 'unused variable here';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.description) return;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data.task]);
        setNewTask({ title: '', description: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map((task) => (task._id === id ? data.task : task)));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto p-6">
      <div className="border rounded-2xl shadow-md bg-white p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
          <CheckSquare className="text-blue-600" /> <span>Task Manager Edited</span>
        </h1>

        {/* Add Task */}
        <div className="mb-6 p-4 border rounded-xl bg-gray-50">
          <h3 className="mb-3 font-semibold text-lg">Add New Task</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              rows="2"
            />
            <button
              onClick={createTask}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              <Plus size={18} /> <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h3 className="mb-3 font-semibold text-lg">Tasks</h3>

          {loading ? (
            <p className="flex items-center text-gray-600">
              <Loader2 className="animate-spin mr-2" size={18} /> Loading...
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="mb-3 p-4 border rounded-xl bg-gray-50 shadow-sm">
                {editingId === task._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        setTasks(
                          tasks.map((t) =>
                            t._id === task._id ? { ...t, title: e.target.value } : t,
                          ),
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <textarea
                      value={task.description}
                      onChange={(e) =>
                        setTasks(
                          tasks.map((t) =>
                            t._id === task._id ? { ...t, description: e.target.value } : t,
                          ),
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                      rows="2"
                    />
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          updateTask(task._id, {
                            title: task.title,
                            description: task.description,
                          })
                        }
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                      >
                        <Save size={16} /> <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
                      >
                        <X size={16} /> <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task._id, { completed: !task.completed })}
                        className="mt-1 h-4 w-4 text-blue-600"
                      />
                      <div>
                        <h4
                          className={`font-semibold text-lg ${
                            task.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingId(task._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                      >
                        <Edit3 size={16} /> <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        <Trash2 size={16} /> <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
