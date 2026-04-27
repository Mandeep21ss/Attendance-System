import { useState } from "react";
import { login } from "../services/api";

function Login({ setToken }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  const submit = async () => {
    const res = await login({ username, password });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl mb-4">Login</h2>

        <input className="border p-2 mb-2 w-full"
          placeholder="Username"
          onChange={(e)=>setU(e.target.value)} />

        <input className="border p-2 mb-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e)=>setP(e.target.value)} />

        <button onClick={submit}
          className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;