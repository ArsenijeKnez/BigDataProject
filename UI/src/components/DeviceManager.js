import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000/api/devices";

export default function DeviceManager() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", location: "" });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const res = await axios.get(API);
    setDevices(res.data);
  };

  const registerDevice = async (e) => {
    e.preventDefault();
    await axios.post(API + "/register", form);
    setForm({ name: "", type: "", location: "" });
    fetchDevices();
  };

  const deleteDevice = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchDevices();
  };

  return (
    <div className="container mt-4">
      <h2>📱 Device Manager</h2>

      <form className="mb-4" onSubmit={registerDevice}>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Type (e.g. temperature)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100">Add Device</button>
          </div>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Registered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.type}</td>
              <td>{d.location}</td>
              <td>{new Date(d.registeredAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteDevice(d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
