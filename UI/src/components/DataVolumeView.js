import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const DataVolumeChart = () => {
  const [hours, setHours] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (selectedHours = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:4000/api/analytics/data-volume/KB?periodInHours=${selectedHours}`
      );

      const dataVolume = res.data.dataVolume || res.data;

      const fetchedData = Object.entries(dataVolume).map(
        ([hourLabel, entries]) => {
          const totalCount = entries.reduce(
            (sum, e) => sum + (e.dataCount || 0),
            0
          );
          const totalKB = entries.reduce(
            (sum, e) => sum + (e.totalSizeKB || 0),
            0
          );

          return {
            hour: hourLabel.replace("-", ""),
            count: totalCount,
            kb: parseFloat(totalKB.toFixed(2)),
          };
        }
      );

      setData(fetchedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data volume.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(hours);
  }, [hours]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Data Volume Analytics</h3>

      <div className="d-flex justify-content-center mb-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">Hours</span>
          <input
            type="number"
            min="1"
            max="48"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="form-control"
          />
          <button
            className="btn btn-primary"
            onClick={() => fetchData(hours)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              label={{
                value: "Hours Ago",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: "KB", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Count", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="kb"
              stroke="#007bff"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Data Volume (KB)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="#28a745"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Entries Count"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DataVolumeChart;
