import axios from "axios";

const API = "http://localhost:3000";

export const login = (data) =>
  axios.post(`${API}/login`, data);

export const getAttendance = (token) =>
  axios.get(`${API}/attendance`, {
    headers: { Authorization: token }
  });

export const addUser = (data, token) =>
  axios.post(`${API}/users`, data, {
    headers: { Authorization: token }
  });

  export const enrollFinger = (id, token) =>
  axios.post("http://localhost:3000/enroll",
    { id },
    { headers: { Authorization: token } }
  );