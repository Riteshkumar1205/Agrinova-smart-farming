const { Server } = require("socket.io");
const io = new Server(4000, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("IoT client connected");

  setInterval(() => {
    const humidity = Math.floor(Math.random() * 30) + 50;
    const moisture = Math.floor(Math.random() * 40) + 30;
    const temperature = Math.floor(Math.random() * 15) + 25;
    const waterLogging = Math.random() > 0.8;
    const rainExpected = Math.random() > 0.7;

    let soilStatus = "Healthy";
    if (moisture < 35) soilStatus = "Dry";
    else if (moisture > 65) soilStatus = "Wet";

    // Generate actionable advice
    const advice = [];
    if (waterLogging) advice.push("Water logging detected! Stop irrigation.");
    else if (moisture < 40) advice.push("Soil is dry. Irrigation recommended.");
    else advice.push("Soil moisture optimal.");

    if (rainExpected) advice.push("Rain expected soon. Delay irrigation.");
    if (temperature > 38) advice.push("High temperature detected. Protect crops.");
    else if (temperature < 20) advice.push("Low temperature detected. Protect crops.");

    socket.emit("iotUpdate", { humidity, moisture, temperature, waterLogging, rainExpected, soilStatus, advice });
  }, 2000); // updates every 2 seconds
});
