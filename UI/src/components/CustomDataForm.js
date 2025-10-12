import React, { useState } from "react";

export default function CustomDataForm() {
  const [json, setJson] = useState("{}");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let doc;
    try {
      doc = JSON.parse(json);
    } catch {
      setMessage("Invalid JSON");
      return;
    }
    fetch("http://localhost:4000/api/sensors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message || data.error))
      .catch(() => setMessage("Error submitting data"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Custom Document</h3>
      <textarea
        rows={6}
        cols={40}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder='{"sensor_id":"custom_001","value":123,"unit":"custom"}'
        required
      />
      <br />
      <button type="submit">Send</button>
      {message && <p>{message}</p>}
    </form>
  );
}
