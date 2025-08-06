import React, { useState } from 'react';

function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minutes, setMinutes] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      minutes: minutes ? parseInt(minutes) : 0,
      dueDate,
    };

    try {
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const createdTask = await response.json();

      setTitle('');
      setDescription('');
      setMinutes('');
      setDueDate('');

      if (onTaskAdded) onTaskAdded(createdTask);
    } catch (error) {
      console.error(error);
      alert('Error creating task!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div>
        <label>Title: </label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description: </label>
        <input value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Minutes: </label>
        <input
          type="number"
          value={minutes}
          min="0"
          onChange={e => setMinutes(e.target.value)}
        />
      </div>
      <div>
        <label>Date: </label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTask;