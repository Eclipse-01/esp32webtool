import { NextResponse } from 'next/server';

// Simulate a data store
let lastData = {
  temperature: 23.5,
  humidity: 45.2,
  cpuTemp: 40.0,
  lm75Temp: 0, // Add lm75Temp to lastData
  memoryUse: "0KB",
  cpuUse: 0,
  wifiRssi: 0,
};
// Store up to 14400 historical records (e.g., 1 per second for 4 hours)
const HISTORY_LIMIT = 14400;
let historyData: Array<{
  timestamp: number;
  temperature: number;
  humidity: number;
}> = [];

function addToHistory() {
  // 只有在收到有效数据包时才添加历史记录
  if (typeof lastData.temperature === 'number' && typeof lastData.humidity === 'number') {
    const now = Date.now();
    historyData.push({
      timestamp: now,
      temperature: parseFloat(lastData.temperature.toFixed(1)),
      humidity: parseFloat(lastData.humidity.toFixed(1)),
    });
    if (historyData.length > HISTORY_LIMIT) {
      historyData = historyData.slice(-HISTORY_LIMIT);
    }
  }
}

// Call addToHistory every time data is updated via POST
function generateHistoricalData() {
  // Return all history, formatted for frontend
  return historyData.map(item => ({
    name: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    temperature: item.temperature,
    humidity: item.humidity,
  }));
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  // 只返回当前 lastData，不做任何随机变动
  const temperature = parseFloat(lastData.temperature.toFixed(1));
  const humidity = parseFloat(lastData.humidity.toFixed(1));

  let alert = null;
  if (temperature > 26) {
    alert = { type: 'warning', message: 'High temperature detected!' };
  } else if (temperature < 21) {
    alert = { type: 'info', message: 'Temperature is a bit low.' };
  } 

  const response = {
    current: {
      temperature,
      humidity,
      cpuTemp: lastData.cpuTemp,
      lm75Temp: lastData.lm75Temp, // Include lm75Temp in the response
      memoryUse: lastData.memoryUse,
      cpuUse: lastData.cpuUse,
      wifiRssi: lastData.wifiRssi,
      lastUpdated: new Date().toISOString(),
    },
    history: generateHistoricalData(),
    alert,
  };

  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received data from ESP32:", body);

    // Update lastData with received values
    if (body.lm75_temp !== undefined) {
      lastData.lm75Temp = body.lm75_temp;
    }
    if (body.sht20_temp !== undefined) {
      lastData.temperature = body.sht20_temp;
    }
    if (body.sht20_humi !== undefined) {
      lastData.humidity = body.sht20_humi;
    }
    if (body.esp32_temp !== undefined) {
      lastData.cpuTemp = body.esp32_temp;
    }
    if (body.ram_free !== undefined) {
      lastData.memoryUse = `${(body.ram_free / 1024).toFixed(2)}KB`; // Convert bytes to KB
    }
    if (body.cpu_usage !== undefined) {
      lastData.cpuUse = body.cpu_usage;
    }
    if (body.wifi_rssi !== undefined) {
      lastData.wifiRssi = body.wifi_rssi;
    }

    // 新增：数据更新后添加到历史记录
    addToHistory();

    return new NextResponse(JSON.stringify({ message: "Data received successfully!" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new NextResponse(JSON.stringify({ message: "Error processing data." }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
