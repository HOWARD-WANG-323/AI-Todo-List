// src/components/TaskSplitter.js
import React, { useState } from 'react';
import { Button, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { getDatabase, ref, child, push, update } from "firebase/database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

function TaskSplitter({ task }) {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const splitTask = async () => {
    setLoading(true);

    try {
      const prompt = `
        - Name: ${task.name}
        - Due Date: ${task.dueDate}
        - Priority: ${task.priority}
        - Estimated Time: ${task.estimatedTime} hours
      `.trim();

      const instruction = `You are a helpful task management assistant. You may get a task as input. The task may include data like task name, start date, end date, and estimated finish time. You should analyze the task and try to split it into several subtasks (at most 5).
Return the result in the following JSON format:
{
  "subtasks": [
    { "name": "Subtask 1", "dueDate": "2024-01-01", "priority": "High", "estimatedTime": 2 },
    { "name": "Subtask 2", "dueDate": "2024-01-02", "priority": "Medium", "estimatedTime": 1 }
  ]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: prompt },
        ],
      });

      const modelResponse = completion.choices[0].message.content;
      const validJsonString = modelResponse.replace(/```json\n|\n```/g, '');

      let returnedData;
      try {
        returnedData = JSON.parse(validJsonString);
      } catch (parseError) {
        throw new Error('Failed to parse model response as JSON');
      }

      const returnedSubtasks = returnedData.subtasks || [];

      const formattedSubtasks = returnedSubtasks.map((st) => ({
        ...st,
        parentId: task.id,
        createdAt: new Date().toISOString(),
        completed: false  // 初始化为未完成
      }));

      const db = getDatabase();
      const updates = {};
      formattedSubtasks.forEach((subtask) => {
        const newSubtaskKey = push(child(ref(db), `tasks/${task.id}/subtasks`)).key;
        updates[`/tasks/${task.id}/subtasks/${newSubtaskKey}`] = subtask;
      });

      await update(ref(db), updates);
      setSubtasks(formattedSubtasks);
    } catch (error) {
      console.error('Failed to split task via OpenAI API and update DB:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (index, checked) => {
    setSubtasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: checked };
      return updated;
    });
  };

  return (
    <div style={{ marginTop: '10px'}}>
      <Button variant="outlined" onClick={splitTask} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Splitting'}
      </Button>
      {subtasks.length > 0 && (
        <div>
          <h3>Subtasks:</h3>
          <List>
            {subtasks.map((subtask, index) => (
              <ListItem key={index} disableGutters>
                <Checkbox
                  checked={subtask.completed}
                  onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                />
                <ListItemText primary={subtask.name} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default TaskSplitter;
