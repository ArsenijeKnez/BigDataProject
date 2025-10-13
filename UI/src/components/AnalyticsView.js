import React, { useEffect, useState } from "react";
import axios from "axios";

const ANALYTICS_API = "http://localhost:4000/api/analytics/avg-temperature";

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    axios.get(ANALYTICS_API).then((res) => setAnalytics(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Analytics</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Avg Temperature (°C)</th>
            <th>Data Count</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((a) => (
            <tr key={a._id}>
              <td>{a._id}</td>
              <td>{a.avgTemperature?.toFixed(2)}</td>
              <td>{a.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
