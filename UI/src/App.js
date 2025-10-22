import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeviceManager from "./components/DeviceManager";
import DataSubmitter from "./components/DataSubmitter";
import AnalyticsView from "./components/AnalyticsView";
import DataVolumeChart from "./components/DataVolumeView";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
      <div className="App bg-light min-vh-100 d-flex flex-column">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              IoT Logger
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/devices">
                    Devices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/data">
                    Submit Data
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/data-volume">
                    Data Volume
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devices" element={<DeviceManager />} />
            <Route path="/data" element={<DataSubmitter />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/data-volume" element={<DataVolumeChart />} />
          </Routes>
        </main>

        <footer className="text-center text-muted py-3 border-top bg-white">
          <small>© 2025 IoT Logger — Real-time IoT Data Platform</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
