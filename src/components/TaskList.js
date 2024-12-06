// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { getDatabase, ref, onValue } from "firebase/database";
import TaskItem from './TaskItem';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, 'tasks');
  
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasks = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
  
      tasks.sort((a, b) => (b.aiPriority || 0) - (a.aiPriority || 0));
  
      setTasks(tasks);
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      width : "80%"
    }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;