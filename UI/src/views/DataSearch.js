import React, { useState } from "react";

export default function DataSearch() {
  const [sensorData, setSensorData] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    fetch(`http://localhost:4000/api/sensors?limit=20`)
      .then((res) => res.json())
      .then((data) => {
        if (query) {
          setSensorData(
            data.filter((item) =>
              item.sensor_id.toLowerCase().includes(query.toLowerCase())
            )
          );
        } else {
          setSensorData(data);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Data Search</h2>
      <input
        type="text"
        placeholder="Search by sensor ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {sensorData.map((item, idx) => (
          <li key={idx}>
            {item.sensor_id}: {item.value} {item.unit} ({item.timestamp})
          </li>
        ))}
      </ul>
    </div>
  );
}
