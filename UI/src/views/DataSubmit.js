import React from "react";
import TemperatureDataForm from "../components/TemperatureDataForm";
import HumidityDataForm from "../components/HumidityDataForm";
import NoiseDataForm from "../components/NoiseDataForm";
import AirQualityDataForm from "../components/AirQualityDataForm";
import LightIntensityDataForm from "../components/LightIntensityDataForm";
import CustomDataForm from "../components/CustomDataForm";

export default function DataSubmit() {
  return (
    <div>
      <h2>Submit Sensor Data</h2>
      <TemperatureDataForm />
      <HumidityDataForm />
      <NoiseDataForm />
      <AirQualityDataForm />
      <LightIntensityDataForm />
      <CustomDataForm />
    </div>
  );
}
