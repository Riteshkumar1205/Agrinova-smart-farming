import React, { useEffect, useState } from "react";
socket.on("iotUpdate", data => setIotData(data));
return () => socket.disconnect();
}, []);


return (
<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<h1 className="text-2xl font-bold mb-4">🌾 AGRINOVA Farmer Dashboard</h1>
<div className="mb-4">
<label className="mr-2">Select Language:</label>
<select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded-lg">
<option value="en">English</option>
<option value="hi">हिंदी</option>
<option value="pa">ਪੰਜਾਬੀ</option>
<option value="mr">मराठी</option>
<option value="ta">தமிழ்</option>
</select>
</div>


<Card className="mb-4 shadow-lg">
<h2 className="text-xl font-semibold mb-2">☁️ Weather Updates</h2>
{weather ? (
<div>
<p>Temperature: {weather.temp}°C</p>
<p>Rainfall: {weather.rainfall} mm</p>
<p>Forecast: {weather.forecast}</p>
</div>
) : <p>Loading weather...</p>}
</Card>


<Card className="mb-4 shadow-lg">
<h2 className="text-xl font-semibold mb-2">📡 Live IoT Data</h2>
<p>Humidity: {iotData.humidity}%</p>
<p>Soil Moisture: {iotData.moisture}%</p>
<p>Soil Status: {iotData.soil}</p>
</Card>
</div>


<div>
<Card className="shadow-lg">
<h2 className="text-xl font-semibold mb-2">💰 Market Prices</h2>
<ul>
{marketPrices.length > 0 ? marketPrices.map((item, idx) => (
<li key={idx} className="p-2 border-b">{item.crop}: ₹{item.price}/quintal (in {item.mandi})</li>
)) : <p>Fetching live prices...</p>}
</ul>
<Button className="mt-4 w-full">Sell Crop in Best Mandi</Button>
</Card>
</div>
</div>
);
}
