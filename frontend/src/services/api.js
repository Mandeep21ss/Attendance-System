import axios from "axios";

const API = "https://attendance-system-cso9.onrender.com";

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
  axios.post("https://attendance-system-cso9.onrender.com/enroll",
    { id },
    { headers: { Authorization: token } }
  );