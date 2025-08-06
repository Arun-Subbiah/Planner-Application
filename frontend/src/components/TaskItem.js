import React from 'react';

function TaskItem({ task, onDelete }) {
  const { id, title, description, minutes, dueDate } = task;

  return (
    <li style={{ marginBottom: 10 }}>
      <strong>{title}</strong> — {description} | {minutes} mins | Date: {dueDate}
      <button
        style={{ marginLeft: 10 }}
        onClick={() => onDelete(id)}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;