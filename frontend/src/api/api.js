import axios from 'axios';
const apiUrl = 'http://localhost:5000/api/tasks';

export function getTasks(token) {
  return axios.get(apiUrl, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}

export function addTask(token, task) {
  return axios.post(apiUrl, task, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}

export function updateTask(token, id, task) {
  return axios.put(apiUrl + '/' + id, task, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}

export function deleteTask(token, id) {
  return axios.delete(apiUrl + '/' + id, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
