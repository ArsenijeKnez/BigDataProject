import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DeviceManager from "./components/DeviceManager";
import DataSubmitter from "./components/DataSubmitter";
import AnalyticsView from "./components/AnalyticsView";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link className="navbar-brand" to="/">
              IoT Logger
            </Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/devices">
                Devices
              </Link>
              <Link className="nav-link" to="/data">
                Submit Data
              </Link>
              <Link className="nav-link" to="/analytics">
                Analytics
              </Link>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devices" element={<DeviceManager />} />
            <Route path="/data" element={<DataSubmitter />} />
            <Route path="/analytics" element={<AnalyticsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
