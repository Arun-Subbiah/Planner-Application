import React, { useState, useEffect } from 'react';

function WorkSession({ tasks = [] }) {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [newBreakDuration, setNewBreakDuration] = useState(5);
  const [paused, setPaused] = useState(false);

  const toggleTask = (task) => {
    const alreadySelected = selectedOrder.find(item => item.type === 'task' && item.id === task.id);
    if (alreadySelected) {
      setSelectedOrder(prev => prev.filter(item => !(item.type === 'task' && item.id === task.id)));
    } else {
      setSelectedOrder(prev => [...prev, { ...task, type: 'task' }]);
    }
  };

  const getDueClass = (dueDateStr) => {
    if (!dueDateStr) return '';
    const today = new Date();
    const due = new Date(dueDateStr);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    const diff = (due - today) / (1000*60*60*24);

    if (diff < 0) return 'due-today';
    if (diff === 0) return 'due-today';
    if (diff <= 3) return 'due-soon';
    return 'due-later';
  };

  const addBreakAfter = (index) => {
    const breakItem = {
      type: 'break',
      title: `${newBreakDuration}-minute break`,
      minutes: newBreakDuration,
    };
    const updated = [...selectedOrder];
    updated.splice(index + 1, 0, breakItem);
    setSelectedOrder(updated);
  };

  const startSession = () => {
    if (selectedOrder.length === 0) return;
    setIsRunning(true);
    setPaused(false);
    setCurrentIndex(0);
    setSeconds(selectedOrder[0].minutes * 60);
  };

  useEffect(() => {
    if (!isRunning || paused) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (currentIndex + 1 < selectedOrder.length) {
            const next = selectedOrder[currentIndex + 1];
            setCurrentIndex(i => i + 1);
            setSeconds(next.minutes * 60);
          } else {
            setIsRunning(false);
            setCurrentIndex(0);
            setSeconds(0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, paused, currentIndex, selectedOrder]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Box style for container and items
  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    boxShadow: '2px 2px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
  };

  const togglePause = () => {
    setPaused(prev => !prev);
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Work Session</h2>

      {!isRunning && (
        <div style={boxStyle}>
          <h3>Select Tasks:</h3>
          {tasks.map(task => {
            const isSelected = selectedOrder.some(item => item.type === 'task' && item.id === task.id);
            const dueClass = getDueClass(task.dueDate);

            let bgColor = 'transparent';
            if (isSelected) bgColor = '#d0f0fd'; // selected highlight
            else if (dueClass === 'due-today') bgColor = '#ffcccc';
            else if (dueClass === 'due-soon') bgColor = '#fff5cc';
            else if (dueClass === 'due-later') bgColor = '#d4edda';

            return (
              <label
                key={task.id}
                style={{
                  display: 'block',
                  margin: '8px 0',
                  cursor: 'pointer',
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: bgColor,
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTask(task)}
                  style={{ marginRight: 10 }}
                />
                <strong>{task.title}</strong> ({task.minutes} min) &nbsp; Due: {task.dueDate}
              </label>
            );
          })}

          <h4 style={{ marginTop: 30 }}>Session Order:</h4>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {selectedOrder.map((item, i) => (
              <li
                key={i}
                style={{
                  border: '1px solid #aaa',
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: item.type === 'task' ? '#f0ead8' : '#e8f4fd',
                }}
              >
                <div>
                  {item.type === 'task' ? (
                    <strong>Task:</strong>
                  ) : (
                    <strong>Break:</strong>
                  )}{' '}
                  {item.title} — {item.minutes} min
                </div>
                {item.type === 'task' && (
                  <button
                    onClick={() => addBreakAfter(i)}
                    style={{
                      backgroundColor: '#4CAF50',
                      border: 'none',
                      borderRadius: 4,
                      color: 'white',
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Break After
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 20 }}>
            <label>
              Break duration (min):{' '}
              <input
                type="number"
                value={newBreakDuration}
                onChange={e => setNewBreakDuration(Number(e.target.value))}
                min={1}
                style={{ width: 60, padding: 5, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </label>
          </div>

          <button
            style={{
              marginTop: 25,
              width: '100%',
              padding: 12,
              fontSize: 16,
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: 6,
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={startSession}
          >
            Start Session
          </button>
        </div>
      )}

      {isRunning && selectedOrder[currentIndex] && (
        <div style={{ ...boxStyle, textAlign: 'center' }}>
          <h3>
            {selectedOrder[currentIndex].type === 'task'
              ? `Task: ${selectedOrder[currentIndex].title}`
              : `Break: ${selectedOrder[currentIndex].title}`}
          </h3>
          <h1 style={{ fontSize: 80, margin: '20px 0' }}>{formatTime(seconds)}</h1>
          <p>Step {currentIndex + 1} of {selectedOrder.length}</p>

          <button
            onClick={togglePause}
            style={{
              padding: '10px 20px',
              fontSize: 16,
              backgroundColor: paused ? '#28a745' : '#ffc107', // green if paused, yellow if running
              border: 'none',
              borderRadius: 6,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkSession;
