import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";

// Daily motivational quotes
const quotes = [
  "Sow today, reap tomorrow! 🌱",
  "Patience is key to growth. 🌾",
  "Healthy soil, healthy crop. 🌿",
  "Farm smart, earn smart. 💰",
  "Nature always rewards diligence. 🌤️",
];

let socket;

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
  const [dailyQuote, setDailyQuote] = useState("");

  // Random daily quote
  useEffect(() => {
    const index = Math.floor(Math.random() * quotes.length);
    setDailyQuote(quotes[index]);
  }, []);

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
          setCity(
            geoData.address.city ||
              geoData.address.town ||
              geoData.address.village ||
              "Delhi"
          );
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
      const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
      return () => clearInterval(weatherInterval);
    }
  }, [city]);

  // Connect to Socket.IO server for live IoT
  useEffect(() => {
    socket = io("http://localhost:4000"); // adjust your IoT server URL
    socket.on("connect", () => console.log("Connected to IoT server"));
    socket.on("iotUpdate", (data) => setIotData(data));
    return () => socket.disconnect();
  }, []);

  // Translate advice based on language
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
          .replace(
            "Conditions suitable for water-loving crops",
            "जल पसंद फसलों के लिए अनुकूल परिस्थितियाँ"
          )
          .replace(
            "Consider drought-resistant crops",
            "सूखा प्रतिरोधी फसलों पर विचार करें"
          )
          .replace(
            "Current conditions suitable for seasonal vegetables",
            "मौजूदा परिस्थितियाँ मौसमी सब्जियों के लिए उपयुक्त हैं"
          )
      );
    }
    return adviceArray;
  };

  return (
    <div
      className="min-h-screen p-6 bg-green-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/happy-farmer-bg.jpg')" }}
    >
      <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/70 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {language === "en" ? "Welcome to AGRINOVA 🌾" : "AGRINOVA में आपका स्वागत है 🌾"}
        </h1>
        <p className="text-center italic mb-6">{dailyQuote}</p>

        {/* Language & City */}
        <div className="flex justify-center gap-4 mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          <input
            type="text"
            placeholder={language === "en" ? "Enter city" : "शहर दर्ज करें"}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <Card className="shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-2">
              {language === "en" ? "☁️ Weather Updates" : "☁️ मौसम अपडेट"} ({city || "Detecting..."})
            </h2>
            {weather ? (
              <div>
                <p>{language === "en" ? "Temperature" : "तापमान"}: {weather.temp}°C</p>
                <p>{language === "en" ? "Rainfall" : "वर्षा"}: {weather.rainfall} mm</p>
                <p>{language === "en" ? "Forecast" : "पूर्वानुमान"}: {weather.forecast}</p>
              </div>
            ) : (
              <p>{city ? (language === "en" ? "Loading live weather..." : "लाइव मौसम लोड हो रहा है...") : (language === "en" ? "Detecting your city..." : "आपका शहर पता किया जा रहा है...")}</p>
            )}
          </Card>

          {/* IoT Card */}
          <Card className="shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-2">
              {language === "en" ? "📡 Live IoT Data & Advice" : "📡 लाइव IoT डेटा और सुझाव"}
            </h2>
            <p>{language === "en" ? "Humidity" : "नमी"}: {iotData.humidity}%</p>
            <p>{language === "en" ? "Soil Moisture" : "मिट्टी की नमी"}: {iotData.moisture}%</p>
            <p>{language === "en" ? "Temperature" : "तापमान"}: {iotData.temperature}°C</p>
            <p>{language === "en" ? "Soil Status" : "मिट्टी की स्थिति"}: {iotData.soilStatus}</p>
            <p>{language === "en" ? "Water Logging" : "पानी जमा"}: {iotData.waterLogging ? "Yes" : "No"}</p>
            <p>{language === "en" ? "Rain Expected" : "बारिश की संभावना"}: {iotData.rainExpected ? "Yes" : "No"}</p>

            <div className="mt-2">
              <h3 className="font-semibold">{language === "en" ? "Advice:" : "सुझाव:"}</h3>
              <ul className="list-disc list-inside">
                {translateAdvice(iotData.advice).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Market Prices */}
          <Card className="shadow-lg p-4 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">
              {language === "en" ? "💰 Market Prices" : "💰 बाजार की कीमतें"}
            </h2>
            <ul>
              {marketPrices.length > 0 ? (
                marketPrices.map((item, idx) => (
                  <li key={idx} className="p-2 border-b">
                    {item.crop}: ₹{item.price}/quintal ({item.mandi})
                  </li>
                ))
              ) : (
                <p>{language === "en" ? "Fetching live prices..." : "लाइव कीमतें लोड हो रही हैं..."}</p>
              )}
            </ul>
            <Button className="mt-4 w-full">
              {language === "en" ? "Sell Crop in Best Mandi" : "सबसे अच्छी मंडी में बेचें"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
