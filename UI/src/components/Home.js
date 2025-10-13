import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/data/recent");
        setLogs(res.data);
        setConnected(true);
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentData();
    const interval = setInterval(fetchRecentData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h2>Učitavanje podataka...</h2>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="text-center mt-5 text-danger">
        <h2>Sistem je trenutno isključen</h2>
        <p>Server nije dostupan.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">IoT Logger - Najnoviji podaci</h2>
      <div className="row">
        {logs.length === 0 ? (
          <div className="text-center w-100">
            <p>Nema novih podataka.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{log.deviceId}</h5>
                  {log.payload && (
                    <ul className="list-unstyled mb-2">
                      {Object.entries(log.payload).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {String(value)}
                        </li>
                      ))}
                    </ul>
                  )}
                  <small className="text-muted">
                    {new Date(log.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
