import React, { useEffect, useState } from "react";
import axios from "axios";

const DEVICE_API = "http://localhost:4000/api/devices";
const DATA_API = "http://localhost:4000/api/data";

export default function DataSubmitter() {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState("");
  const [payload, setPayload] = useState("");

  useEffect(() => {
    axios.get(DEVICE_API).then((res) => setDevices(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(payload);
      await axios.post(DATA_API, { deviceId: selected, payload: data });
      alert("Data submitted!");
      setPayload("");
    } catch (err) {
      alert("Invalid JSON payload or request failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2> Submit Data to Device</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Device</label>
          <select
            className="form-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {devices.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.type})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">JSON Payload</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder='{"temperature": 25.3}'
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success">Submit Data</button>
      </form>
    </div>
  );
}
