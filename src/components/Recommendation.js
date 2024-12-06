// src/components/Recommendation.js
import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { getDatabase, ref, get } from "firebase/database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function Recommendation() {
  const [recommendedTask, setRecommendedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const getPositionPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const position = await getPositionPromise;
      const { latitude, longitude } = position.coords;
      const currentTime = new Date();

      const db = getDatabase();
      const tasksRef = ref(db, 'tasks');
      const snapshot = await get(tasksRef);
      const data = snapshot.val();

      const tasks = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];

      console.log('Tasks:', tasks);

      const instruction = `
You are a helpful assistant. You have a list of tasks and the current time. The user wants to know which task they should work on right now.
Please consider the tasks' due dates, priorities, and any other relevant information.
Return the result in the following JSON format:

{
  "recommendedTask": {
    "name": "<task name>",
    "dueDate": "YYYY-MM-DD",
    "priority": "High/Medium/Low",
    "reason": "Explain why this task is chosen"
  }
}

Make sure the response is strictly in JSON format and includes only one recommendedTask.
      `;

      const userContent = `
Current Time: ${currentTime.toISOString()}
Location: latitude=${latitude}, longitude=${longitude}

Tasks List:
${tasks.map((t, index) => `Task ${index+1}: ${JSON.stringify(t)}`).join('\n')}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: userContent }
        ],
      });

      const modelResponse = completion.choices[0].message.content;
      const validJsonString = modelResponse.replace(/```json\n|\n```/g, '');

      let returnedData;
      try {
        returnedData = JSON.parse(validJsonString);
      } catch (error) {
        console.error('Failed to parse GPT response as JSON:', error);
        throw new Error('Invalid GPT JSON response');
      }

      const { recommendedTask } = returnedData;
      setRecommendedTask(recommendedTask);

    } catch (error) {
      console.error('Error in Recommendation logic:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        color="primary"
        disabled={loading}
        onClick={fetchRecommendation}
      >
        What should I do now?
      </Button>
      {loading && <Typography>Calculating recommendation...</Typography>}
      {!loading && recommendedTask ? (
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h5">{recommendedTask.name}</Typography>
            <Typography color="textSecondary">
              End Date: {recommendedTask.dueDate}
            </Typography>
            <Typography color="textSecondary">
              Priority: {recommendedTask.priority}
            </Typography>
            {recommendedTask.reason && (
              <Typography variant="body2" style={{ marginTop: '8px' }}>
                Reason: {recommendedTask.reason}
              </Typography>
            )}
          </CardContent>
        </Card>
      ) : (!loading && <Typography>Click the button to find out what you should do now!!!</Typography>)}
    </div>
  );
}

export default Recommendation;
