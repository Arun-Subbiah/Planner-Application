import React from 'react';

function Calendar({ tasks }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed (0 = Jan)

  const dueColors = {
    'due-today': '#ffcccc',  // light red
    'due-soon': '#fff5cc',   // light yellow
    'due-later': '#d4edda',  // light green
  };

  const getDueClass = (dueDateStr) => {
    if (!dueDateStr) return '';
    const today = new Date();
    const due = new Date(dueDateStr);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return 'due-today'; // overdue treated as today
    if (diff === 0) return 'due-today';
    if (diff <= 3) return 'due-soon';
    return 'due-later';
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  // Group tasks by dueDate (yyyy-mm-dd)
  const tasksByDate = {};
  tasks.forEach(task => {
    if (!task.dueDate) return;
    if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
    tasksByDate[task.dueDate].push(task);
  });

  const calendarDays = [];

  // Empty cells for days before month start
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<td key={`empty-${i}`} style={{ border: '1px solid #ddd', height: 100 }} />);
  }

  // Cells for each day with tasks
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentYear, currentMonth, day);
    const dateStr = dateObj.toISOString().split('T')[0]; // yyyy-mm-dd
    const dayTasks = tasksByDate[dateStr] || [];

    calendarDays.push(
      <td key={dateStr} style={{ verticalAlign: 'top', border: '1px solid #ddd', padding: 5, height: 100, width: 140 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{day}</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {dayTasks.map((task, index) => {
            const dueClass = getDueClass(task.dueDate);
            const bgColor = dueColors[dueClass] || '#eee';

            return (
              <li
                key={index}
                style={{
                  backgroundColor: bgColor,
                  marginBottom: 4,
                  padding: '3px 6px',
                  borderRadius: 4,
                  fontSize: 14,
                }}
              >
                {task.title}
              </li>
            );
          })}
        </ul>
      </td>
    );
  }

  // Group days into weeks (7 days per row)
  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(<tr key={i}>{calendarDays.slice(i, i + 7)}</tr>);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Calendar for {today.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
            <th>Thu</th><th>Fri</th><th>Sat</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Calendar;
