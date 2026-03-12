import React from "react";
import confetti from "canvas-confetti";

export default function KanbanBoard({ tasks, setTasks }) {
  const deleteTask = (column, id) => {
    setTasks({
      ...tasks,
      [column]: tasks[column].filter((task) => task.id !== id),
    });
  };

  const onDragStart = (e, task, column) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, column }));
  };

  const onDrop = (e, targetColumn) => {
    const data = JSON.parse(e.dataTransfer.getData("task"));
    const { task, column } = data;
    if (column === targetColumn) return;

    const updatedSource = tasks[column].filter((t) => t.id !== task.id);
    const updatedTarget = [...tasks[targetColumn], task];

    setTasks({
      ...tasks,
      [column]: updatedSource,
      [targetColumn]: updatedTarget,
    });

    if (targetColumn === "done") {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }, 200);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const renderColumn = (title, columnKey) => (
    <div
      className="column"
      onDrop={(e) => onDrop(e, columnKey)}
      onDragOver={allowDrop}
    >
      <h2>{title}</h2>
      {tasks[columnKey].map((task) => (
        <div
          key={task.id}
          className="task"
          draggable
          onDragStart={(e) => onDragStart(e, task, columnKey)}
        >
          {task.title}
          <button onClick={() => deleteTask(columnKey, task.id)}>X</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="board">
      {renderColumn("Todo", "todo")}
      {renderColumn("In Progress", "inprogress")}
      {renderColumn("Done", "done")}
    </div>
  );
}