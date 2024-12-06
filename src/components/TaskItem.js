// src/components/TaskItem.js
import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { getDatabase, ref, child, push, update } from "firebase/database";
import TaskSplitter from './TaskSplitter';

function TaskItem({ task }) {
  const [showSplitter, setShowSplitter] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  const handleSplitTask = () => {
    setShowSplitter(true);
  };

  const handleCheckboxChange = async (event) => {
    setIsCompleted(event.target.checked);
    const db = getDatabase();
    const updates = {};
    updates[`/tasks/${task.id}/isCompleted/`] = event.target.checked;

    await update(ref(db), updates);
  };

  return (
    <Card style={{ marginBottom: '16px', padding: '16px' }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Checkbox
              checked={isCompleted}
              onChange={handleCheckboxChange}
              color="primary"
            />
            <Typography
              variant="h5"
              style={{
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.name}
            </Typography>
          </Box>

          {/* 优先级和DDL */}
          <Box style={{ textAlign: 'right', marginLeft: '16px' }}>
            <Typography color="textSecondary" variant="body2">
              Priority: {task.priority}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              DDL: {task.dueDate}
            </Typography>
          </Box>
        </Box>
        <Box style={{ display: 'flex', marginTop: 'auto' }}>
          <Button variant="outlined" onClick={handleSplitTask}>
            Split the Task
          </Button>
        </Box>

        {showSplitter && <TaskSplitter task={task} />}
      </CardContent>
    </Card>
  );
}

export default TaskItem;
