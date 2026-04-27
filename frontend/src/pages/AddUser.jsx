import { useState } from "react";
import { addUser } from "../services/api";

function AddUser({ token }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!id || !name) {
      alert("Fill all fields");
      return;
    }

    await addUser(
      { id: Number(id), name },
      token
    );

    alert("User Registered!");
    setId("");
    setName("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Register User</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="bg-green-500 text-white px-4 py-2">
          Register
        </button>
      </form>
    </div>
  );
}

export default AddUser;