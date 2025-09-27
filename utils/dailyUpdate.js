import fetch from "node-fetch";

async function dailyUpdate() {
  try {
    console.log("Starting daily update...");

    // Fetch market prices
    const marketRes = await fetch("http://localhost:3000/api/market/prices");
    const marketData = await marketRes.json();
    console.log("Market Data:", marketData);

    // Fetch IMD weather (example for Delhi, can be dynamic)
    const weatherRes = await fetch("http://localhost:3000/api/weather/imd?city=Delhi");
    const weatherData = await weatherRes.json();
    console.log("Weather Data:", weatherData);

    // Fetch IoT mock data
    const iotRes = await fetch("http://localhost:3000/api/iot/update");
    const iotData = await iotRes.json();
    console.log("IoT Data:", iotData);

    console.log("Daily update completed successfully.");
  } catch (err) {
    console.error("Error in daily update:", err);
  }
}

// Run daily at 6:00 AM using node-cron or similar (example)
import cron from "node-cron";
cron.schedule("0 6 * * *", dailyUpdate);

export default dailyUpdate;
