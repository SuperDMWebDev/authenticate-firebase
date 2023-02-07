import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { auth, db } from '../../config/firebase-config';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { Paper, TextField, Checkbox, Button } from '@material-ui/core';
import { addTask, getTasks, updateTask, deleteTask } from '../../api/api';
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [timer, setTimer] = useState(1);
  const navigate = useNavigate();
  const [authorize, setAuthorized] = useState(false);
  const token = sessionStorage.getItem('accessToken');
  const [tasks, setTasks] = useState([{ task: 'task 1', completed: false }]);
  const [currentTask, setCurrentTask] = useState('');
  const fetchData = async () => {
    if (user) {
      const result = await user.getIdToken();
      const response = await axios.get('http://localhost:5000/api/authorize', {
        headers: {
          Authorization: `Bearer ${result}`,
        },
      });
      if (response.status === 200) {
        setAuthorized(true);
      }
      const { data } = await getTasks(result);
      setTasks(data);
    }
  };
  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) navigate('/');
    fetchData(token);
  }, [user, loading]);

  // useEffect(() => {
  //   const countTime = setInterval(() => {
  //     setTimer((timer) => timer + 1);
  //   }, [1000]);
  //   return () => {
  //     clearInterval(countTime);
  //   };
  // });
  const changeProfile = () => {
    navigate('/profile');
  };
  const logout = () => {
    console.log('logout ');
    signOut(auth);
    sessionStorage.clear();
    navigate('/');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await user.getIdToken();

    try {
      const { data } = await addTask(result, { task: currentTask });
      setTasks([...tasks, data]);
      setCurrentTask('');
    } catch (err) {
      console.log('error ', err);
    }
  };
  const handleChange = (e) => {
    setCurrentTask(e.target.value);
  };
  const handleUpdate = async (currentTask) => {
    const result = await user.getIdToken();
    const newTasks = [...tasks];
    const index = tasks.findIndex((task) => task._id === currentTask);
    newTasks[index] = { ...newTasks[index] };
    newTasks[index].completed = !newTasks[index].completed;
    console.log('newTasks ', ...newTasks);
    setTasks(newTasks);
    await updateTask(result, currentTask, {
      completed: newTasks[index].completed,
    });
  };
  const handleDelete = async (currentTask) => {
    try {
      const result = await user.getIdToken();
      const newTasks = tasks.filter((task) => task._id !== currentTask);
      setTasks(newTasks);
      await deleteTask(result, currentTask);
    } catch (error) {
      setTasks(tasks);
      console.log(error);
    }
  };
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{user?.displayName}</div>
        <div>{user?.email}</div>
        <div>{authorize ? 'Authorized person' : 'Unauthorized person'}</div>
        <button className="dashboard__btn" onClick={changeProfile}>
          Change profile
        </button>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <Paper elevation={3} className="container">
          <h3>Your task list</h3>
          <form
            onSubmit={handleSubmit}
            className="flex"
            style={{ margin: '15px 0px' }}
          >
            <TextField
              variant="outlined"
              size="small"
              style={{ width: '80%' }}
              value={currentTask}
              required={true}
              onChange={(e) => handleChange(e)}
              placeholder="Add New TO-DO"
            />
            <Button
              style={{ height: '40px' }}
              color="primary"
              variant="outlined"
              type="submit"
            >
              Add task
            </Button>
          </form>
          <div className="task-container">
            {tasks.map((task, index) => {
              return (
                <Paper key={task._id} className="flex task_container">
                  <Checkbox
                    checked={task.completed}
                    onClick={() => handleUpdate(task._id)}
                    color="primary"
                  />
                  <div
                    className={task.completed ? 'task line_through' : 'task'}
                  >
                    {task.task}
                  </div>
                  <Button
                    onClick={() => handleDelete(task._id)}
                    color="secondary"
                  >
                    delete
                  </Button>
                </Paper>
              );
            })}
          </div>
        </Paper>
      </div>
    </div>
  );
}
export default Dashboard;
