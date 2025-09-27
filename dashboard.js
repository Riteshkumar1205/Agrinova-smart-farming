import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [marketPrices, setMarketPrices] = useState([]);
  const [weather, setWeather] = useState(null);
  const [iotData, setIotData] = useState({
    humidity: 0,
    moisture: 0,
    temperature: 0,
    waterLogging: false,
    soilStatus: "",
    rainExpected: false,
    advice: [],
  });
  const [language, setLanguage] = useState("en");
  const [city, setCity] = useState(""); // user can select or auto-detect

  // Fetch market prices
  useEffect(() => {
    fetch("/api/market/prices")
      .then((res) => res.json())
      .then((data) => setMarketPrices(data.prices));
  }, []);

  // Auto-detect city via GPS/NAVIC
  useEffect(() => {
    if (!city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          setCity(geoData.address.city || geoData.address.town || "Delhi");
        },
        (error) => console.warn("Geolocation failed:", error),
        { enableHighAccuracy: true }
      );
    }
  }, [city]);

  // Fetch live weather whenever city changes
  useEffect(() => {
    if (city) {
      const fetchWeather = async () => {
        const res = await fetch(`/api/weather/imd?city=${city}`);
        const data = await res.json();
        setWeather(data);
      };
      fetchWeather();
      const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000);
      return () => clearInterval(weatherInterval);
    }
  }, [city]);

  // Fetch live IoT data every 2 seconds
  useEffect(() => {
    const fetchIoT = async () => {
      const res = await fetch("/api/iot/update");
      const data = await res.json();
      setIotData(data);
    };
    fetchIoT();
    const iotInterval = setInterval(fetchIoT, 2000);
    return () => clearInterval(iotInterval);
  }, []);

  // Function to translate advice based on language
  const translateAdvice = (adviceArray) => {
    if (language === "hi") {
      return adviceArray.map((item) =>
        item
          .replace("Stop irrigation", "सिंचाई बंद करें")
          .replace("Irrigation recommended", "सिंचाई की सिफारिश की जाती है")
          .replace("Soil moisture optimal", "मिट्टी की नमी आदर्श है")
          .replace("Rain expected soon", "जल्द बारिश होने की संभावना")
          .replace("High temperature detected", "उच्च तापमान का पता चला")
          .replace("Low temperature detected", "कम तापमान का पता चला")
          .replace("Conditions suitable for water-loving crops", "जल पसंद फसलों के लिए अनुकूल परिस्थितियाँ")
          .replace("Consider drought-resistant crops", "सूखा प्रतिरोधी फसलों पर विचार करें")
          .replace("Current conditions suitable for seasonal vegetables", "मौजूदा परिस्थितियाँ मौसमी सब्जियों के लिए उपयुक्त हैं")
      );
    }
    return adviceArray; // default English
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">🌾 AGRINOVA Farmer Dashboard</h1>

        <div className="mb-4">
          <label className="mr-2">Select Language / भाषा:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mr-2">City / शहर:</label>
          <input
            type="text"
            placeholder="Enter city (override GPS)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        <Card className="mb-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">☁️ Weather Updates ({city || "Detecting..."})</h2>
          {weather ? (
            <div>
              <p>Temperature: {weather.temp}°C</p>
              <p>Rainfall: {weather.rainfall} mm</p>
              <p>Forecast: {weather.forecast}</p>
            </div>
          ) : (
            <p>{city ? "Loading live weather..." : "Detecting your city..."}</p>
          )}
        </Card>

        <Card className="mb-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">📡 Live IoT Data & Advice</h2>
          <p>Humidity: {iotData.humidity}%</p>
          <p>Soil Moisture: {iotData.moisture}%</p>
          <p>Temperature: {iotData.temperature}°C</p>
          <p>Soil Status: {iotData.soilStatus}</p>
          <p>Water Logging: {iotData.waterLogging ? "Yes" : "No"}</p>
          <p>Rain Expected: {iotData.rainExpected ? "Yes" : "No"}</p>
          <div className="mt-2">
            <h3 className="font-semibold">Advice:</h3>
            <ul className="list-disc list-inside">
              {translateAdvice(iotData.advice).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div>
        <Card className="shadow-lg">
          <h2 className="text-xl font-semibold mb-2">💰 Market Prices</h2>
          <ul>
            {marketPrices.length > 0 ? (
              marketPrices.map((item, idx) => (
                <li key={idx} className="p-2 border-b">
                  {item.crop}: ₹{item.price}/quintal (in {item.mandi})
                </li>
              ))
            ) : (
              <p>Fetching live prices...</p>
            )}
          </ul>
          <Button className="mt-4 w-full">
            {language === "en" ? "Sell Crop in Best Mandi" : "सबसे अच्छी मंडी में बेचें"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
