import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import DataSearch from "./views/DataSearch";
import DataSubmit from "./views/DataSubmit";
import "./App.css";

function App() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/sensors")
      .then((res) => res.json())
      .then((data) => setSensorData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link> | <Link to="/search">Data Search</Link> |{" "}
            <Link to="/submit">Data Submit</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<DataSearch />} />
            <Route path="/submit" element={<DataSubmit />} />
          </Routes>
        </main>
        <ul>
          {sensorData.map((item, idx) => (
            <li key={idx}>
              {item.sensor_id}: {item.value} {item.unit} ({item.timestamp})
            </li>
          ))}
        </ul>
      </div>
    </Router>
  );
}

export default App;
