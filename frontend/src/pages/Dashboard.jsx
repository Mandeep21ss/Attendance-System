import { useEffect, useState } from "react";
import { socket } from "../socket";
import { getAttendance } from "../services/api";
import { Link } from "react-router-dom";

function Dashboard({ token }) {
  const [status, setStatus] = useState(false);
  const [logs, setLogs] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // 📊 Load attendance from backend
  const loadAttendance = async () => {
    const res = await getAttendance(token);
    setAttendance(res.data);
  };

  useEffect(() => {
    loadAttendance();

    // 🔌 WebSocket listeners
    socket.on("status", (data) => {
      setStatus(data.esp32);
    });

    socket.on("device-event", (msg) => {
      setLogs((prev) => [msg, ...prev]);
    });

    socket.on("attendance", (data) => {
      setAttendance((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6">

      {/* 🔝 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Dashboard</h1>

        <Link
          to="/add-user"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </Link>
      </div>

      {/* 📡 ESP32 STATUS */}
      <div className="mb-4">
        <h2 className="text-lg">
          ESP32 Status:
          <span className={`ml-2 font-bold ${status ? "text-green-500" : "text-red-500"}`}>
            {status ? "Online 🟢" : "Offline 🔴"}
          </span>
        </h2>
      </div>

      {/* ⚡ LIVE EVENTS */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Live Device Logs</h3>

        <div className="bg-gray-100 p-3 rounded h-32 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No activity yet</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className="text-sm">{log}</p>
            ))
          )}
        </div>
      </div>

      {/* 📊 ATTENDANCE LIST */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Attendance Records</h3>

        <div className="space-y-2">
          {attendance.map((item, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded shadow flex justify-between"
            >
              <span>{item.name}</span>
              <span className="text-gray-500 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;