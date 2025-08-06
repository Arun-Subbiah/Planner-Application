import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import WorkSession from './components/WorkSession';
import Calendar from './components/Calendar';


function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/tasks');
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Tasks</Link> | <Link to="/work-session">Work Session | </Link>
        <Link to="/calendar">Calendar</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
        <Route path="/work-session" element={<WorkSession tasks={tasks} />} />
        <Route path="/calendar" element={<Calendar tasks={tasks} />} />
      </Routes>
    </div>
  );
}

export default App;
