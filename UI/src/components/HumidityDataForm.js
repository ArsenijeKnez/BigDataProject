import React, { useState } from "react";

export default function HumidityDataForm() {
  const [form, setForm] = useState({
    sensor_id: "",
    value: "",
    unit: "%",
    location: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/api/sensors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, timestamp: new Date().toISOString() }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message || data.error))
      .catch(() => setMessage("Error submitting data"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Humidity Sensor</h3>
      <input name="sensor_id" placeholder="Sensor ID" value={form.sensor_id} onChange={handleChange} required />
      <input name="value" placeholder="Humidity" value={form.value} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <button type="submit">Send</button>
      {message && <p>{message}</p>}
    </form>
  );
}