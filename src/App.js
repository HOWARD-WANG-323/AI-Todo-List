// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TaskList from './components/TaskList';
import Recommendation from './components/Recommendation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskInput from './components/TaskInput';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: 'relative', minHeight: '100vh', padding: '32px' }}>
        <h1 style={{ textAlign: 'center' }}>AI Todo List</h1>
        
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
          }}
        >
          <AddIcon />
        </Fab>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <TaskList />
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '20px',
            width: '300px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Recommendation />
        </div>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <TaskInput onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
