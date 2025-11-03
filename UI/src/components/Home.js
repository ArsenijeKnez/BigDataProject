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
      <div className="container text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h5>Učitavanje podataka...</h5>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger mb-2">Sistem je trenutno isključen</h3>
        <p className="text-muted">Server nije dostupan. Pokušajte kasnije.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold text-primary">
        Najnoviji IoT podaci
      </h2>

      {logs.length === 0 ? (
        <div className="alert alert-info text-center">Nema novih podataka.</div>
      ) : (
        <div className="row g-4">
          {logs.map((log) => {
            const payload = log.payload || {};
            const imageUrl =
              payload.imageUrl && payload.imageUrl.startsWith("http")
                ? payload.imageUrl
                : payload.imageUrl
                ? `http://localhost:4000${payload.imageUrl}`
                : null;

            return (
              <div key={log._id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Device capture"
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  )}
                  <div className="card-body">
                    <h6 className="card-title text-primary mb-2">
                      {log.deviceId}
                    </h6>

                    {/* Display non-image payload fields */}
                    <ul className="list-unstyled small mb-3">
                      {Object.entries(payload)
                        .filter(([key]) => key !== "imageUrl")
                        .map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </li>
                        ))}
                    </ul>

                    <small className="text-muted d-block mt-auto">
                      {new Date(log.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
