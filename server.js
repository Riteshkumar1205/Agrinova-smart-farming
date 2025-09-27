const { Server } = require("socket.io");

// Start Socket.IO server on port 4000
const io = new Server(4000, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("IoT client connected");

  setInterval(() => {
    // Mock IoT data (replace with real device feed)
    const humidity = Math.floor(Math.random() * 30) + 50; // 50-80%
    const moisture = Math.floor(Math.random() * 40) + 30; // 30-70%
    const temperature = Math.floor(Math.random() * 15) + 25; // 25-40°C
    const waterLogging = Math.random() > 0.8; // 20% chance
    const rainExpected = Math.random() > 0.7; // 30% chance

    // Soil status determination
    let soilStatus = "Healthy";
    if (moisture < 35) soilStatus = "Dry";
    else if (moisture > 65) soilStatus = "Wet";

    // Generate actionable advice
    const advice = [];

    // Soil moisture & irrigation advice
    if (waterLogging) advice.push("Water logging detected! Stop irrigation.");
    else if (moisture < 40) advice.push("Soil is dry. Irrigation recommended.");
    else advice.push("Soil moisture optimal.");

    // Rain advice
    if (rainExpected) advice.push("Rain expected soon. Delay irrigation.");

    // Temperature advice
    if (temperature > 38) advice.push("High temperature detected. Protect crops.");
    else if (temperature < 20) advice.push("Low temperature detected. Protect crops.");

    // Seasonal crop suggestions
    if (moisture > 60 && temperature > 25) advice.push("Conditions suitable for water-loving crops.");
    if (moisture < 40 && temperature > 30) advice.push("Consider drought-resistant crops.");
    if (!rainExpected && moisture >= 40 && moisture <= 60) advice.push("Current conditions suitable for seasonal vegetables.");

    // Emit live IoT data with advice
    socket.emit("iotUpdate", {
      humidity,
      moisture,
      temperature,
      waterLogging,
      rainExpected,
      soilStatus,
      advice,
    });
  }, 2000); // updates every 2 seconds
});
