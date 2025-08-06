import React, { useState, useEffect } from 'react';
import AddTask from './AddTask';
import './TaskList.css';
import WorkSession from './WorkSession';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    minutes: '',
    dueDate: '',
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [...prev, newTask].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
      minutes: task.minutes,
      dueDate: task.dueDate || '',
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title: editFormData.title,
      description: editFormData.description,
      minutes: Number(editFormData.minutes),
      dueDate: editFormData.dueDate,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error('Failed to update task');

      const updated = await res.json();

      setTasks(prev =>
        prev
          .map(task => (task.id === editingTaskId ? updated : task))
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      );

      setEditingTaskId(null);
    } catch (err) {
      console.error(err);
      alert('Error updating task');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTasks(prev => prev.filter(task => task.id !== id));
      } else {
        alert('Failed to delete task');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const getDueClass = (dueDateStr) => {
    if (!dueDateStr) return '';
    const today = new Date();
    const due = new Date(dueDateStr);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    const diff = (due - today) / (1000*60*60*24);
    console.log('Due date:', dueDateStr, 'Days diff:', diff);

    if (diff < 0) return 'due-today';
    if (diff === 0) return 'due-today';
    if (diff <= 3) return 'due-soon';
    return 'due-later';
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
      <h1>Task Manager</h1>
      <AddTask onTaskAdded={handleTaskAdded} />

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Minutes</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(({ id, title, description, minutes, dueDate }) => (
            <tr key={id} className={getDueClass(dueDate)}>
              {editingTaskId === id ? (
                <>
                  <td><input name="title" value={editFormData.title} onChange={handleEditFormChange} /></td>
                  <td><input name="description" value={editFormData.description} onChange={handleEditFormChange} /></td>
                  <td><input name="minutes" type="number" value={editFormData.minutes} onChange={handleEditFormChange} /></td>
                  <td><input name="dueDate" type="date" value={editFormData.dueDate} onChange={handleEditFormChange} /></td>
                  <td>
                    <button onClick={handleEditFormSubmit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{title}</td>
                  <td>{description}</td>
                  <td>{minutes}</td>
                  <td>{dueDate || 'No due date'}</td>
                  <td>
                    <button onClick={() => handleEditClick({ id, title, description, minutes, dueDate })}>Edit</button>
                    <button onClick={() => handleDelete(id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
