import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!text) return;

    await axios.post("http://localhost:5000/tasks", { text });
    setText("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await axios.put(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="form-container">
      <h2>Task Logger</h2>

      <form onSubmit={addTask} className="form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
        />
        <button>Add</button>
      </form>
<ul>
  {tasks.map((task) => (
    <li key={task.id}>
      <span
        onClick={() => toggleTask(task.id)}
        className={task.completed ? "completed" : ""}
      >
        {task.text}
      </span>

      <button onClick={() => deleteTask(task.id)}>❌</button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default TaskApp;
