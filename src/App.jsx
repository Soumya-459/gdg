import React, { useState, useEffect } from "react";
import "./App.css";
import MovingWords from "./components/MovingWords";
import confetti from "canvas-confetti";

export default function App() {
  // FIX: Lazy initializer loads from localStorage BEFORE the first render
  // This prevents the "empty state" from overwriting your data on refresh
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("kanbanTasks");
    return saved ? JSON.parse(saved) : { todo: [], inprogress: [], done: [] };
  });

  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // FIX: Only one useEffect needed for saving. 
  // Since we load the data in the useState above, this won't wipe your data.
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const item = { 
      id: Date.now(), 
      title: newTask, 
      description: newDesc 
    };
    setTasks({ ...tasks, todo: [...tasks.todo, item] });
    setNewTask("");
    setNewDesc("");
  };

  const deleteTask = (column, id) => {
    setTasks({ ...tasks, [column]: tasks[column].filter(t => t.id !== id) });
  };

  const editTask = (column, id) => {
    const taskToEdit = tasks[column].find(t => t.id === id);
    const updatedTitle = prompt("Edit Task Title:", taskToEdit.title);
    if (updatedTitle === null) return;

    const updatedDesc = prompt("Edit Description:", taskToEdit.description || "");
    if (updatedDesc === null) return;

    const updatedColumn = tasks[column].map(t => 
      t.id === id ? { ...t, title: updatedTitle, description: updatedDesc } : t
    );
    setTasks({ ...tasks, [column]: updatedColumn });
  };

  const onDragStart = (e, task, column) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, column }));
  };

  const onDrop = (e, targetColumn) => {
    const data = JSON.parse(e.dataTransfer.getData("task"));
    const { task, column } = data;
    if (column === targetColumn) return;

    const updatedSource = tasks[column].filter(t => t.id !== task.id);
    const updatedTarget = [...tasks[targetColumn], task];
    setTasks({ ...tasks, [column]: updatedSource, [targetColumn]: updatedTarget });

    if (targetColumn === "done") {
      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, ticks: 300, gravity: 0.8, scalar: 1.2 });
        confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, ticks: 300, gravity: 0.8, scalar: 1.2 });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const renderColumn = (title, key) => (
    <div className="column" onDrop={(e) => onDrop(e, key)} onDragOver={allowDrop}>
      <h2>{title}</h2>
      {tasks[key].map((task) => (
        <div 
          key={task.id} 
          className="task" 
          draggable 
          onDragStart={(e) => onDragStart(e, task, key)}
        >
          <div 
            style={{ flex: 1, textAlign: 'left', cursor: 'pointer' }} 
            onClick={() => editTask(key, task.id)}
          >
            <strong style={{ display: 'block' }}>{task.title}</strong>
            {task.description && <p className="task-desc">{task.description}</p>}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              deleteTask(key, task.id);
            }} 
            className="delete-btn"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <MovingWords />
      <div className="app">
        <h1>Kanban Task Board</h1>
        <div className="addTask">
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="Task Title..." 
          />
          <input 
            value={newDesc} 
            onChange={(e) => setNewDesc(e.target.value)} 
            placeholder="Description (optional)..." 
          />
          <button onClick={addTask}>Add</button>
        </div>
        <div className="board">
          {renderColumn("Todo", "todo")}
          {renderColumn("In Progress", "inprogress")}
          {renderColumn("Done", "done")}
        </div>
      </div>
    </>
  );
}