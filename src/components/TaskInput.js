// src/components/TaskInput.js
import { ref, set, push } from 'firebase/database';
import React, { useState } from 'react';
import { database } from '../firebase';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

function TaskInput({ onClose }) {
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('2024/01/01');
  const [dueDate, setDueDate] = useState('2024/12/31');
  const [priority, setPriority] = useState('Medium');
  const [estimatedTime, setEstimatedTime] = useState('');

  const addTask = (e) => {
    e.preventDefault();
  
    const tasksRef = ref(database, 'tasks'); 
    const newTaskRef = push(tasksRef); 
  
    set(newTaskRef, {
      name: taskName,
      startDate,
      dueDate,
      priority,
      estimatedTime,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    })
      .then(() => {
        setTaskName('');
        setStartDate('2024/01/01');
        setDueDate('2024/12/31');
        setPriority('Medium');
        setEstimatedTime('1');
  
        if (onClose) {
          onClose();
        }
      })
      .catch((error) => {
        console.error('Add Task Failed: ', error);
      });
  };

  return (
    <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      <TextField
        label="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />
      <TextField
        label="Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <TextField
        label="End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <FormControl>
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Estimated Finish Time(hour)"
        type="number"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit">
        Add Task
      </Button>
    </form>
  );
}

export default TaskInput;
