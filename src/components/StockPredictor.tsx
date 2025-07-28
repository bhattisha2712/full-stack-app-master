
"use client";
import { useState } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type StockEntry = { symbol: string; date: string; price: number };
const SYMBOLS = [
  { value: "AMZN", label: "📦 Amazon (AMZN)" },
  { value: "GOOGL", label: "🔍 Google (GOOGL)" },
  { value: "CRM", label: "☁️ Salesforce (CRM)" },
  { value: "MSFT", label: "💻 Microsoft (MSFT)" },
  { value: "NVDA", label: "🎮 Nvidia (NVDA)" },
];

export default function StockPredictor() {
  const [stockSymbol, setStockSymbol] = useState(SYMBOLS[0].value);
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [data, setData] = useState<StockEntry[]>([]);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        let parsed: StockEntry[] = [];
        if (file.name.endsWith(".json")) {
          if (typeof text === "string") {
            parsed = JSON.parse(text);
          } else {
            setFileError("Error parsing file. Please check format.");
            return;
          }
        } else if (file.name.endsWith(".csv")) {
          if (typeof text === "string") {
            parsed = text.split("\n").slice(1).map((line: string) => {
              const [symbol, date, price] = line.split(",");
              return { symbol, date, price: Number(price) } as StockEntry;
            }).filter((row: StockEntry) => row.symbol && row.date && !isNaN(row.price));
          } else {
            setFileError("Error parsing file. Please check format.");
            return;
          }
        } else {
          setFileError("Unsupported file type. Please upload CSV or JSON.");
          return;
        }
        setData(parsed.sort((a: StockEntry, b: StockEntry) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (err) {
        setFileError("Error parsing file. Please check format.");
      }
    };
    reader.readAsText(file);
  };

  // Add entry
  const addEntry = () => {
    if (!stockSymbol || !date || !price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("⚠️ Please fill in all fields with valid data");
      return;
    }
    if (data.some(entry => entry.date === date)) {
      alert("⚠️ An entry for this date already exists");
      return;
    }
    setData(prev => [...prev, { symbol: stockSymbol, date, price: Number(price) }].sort((a: StockEntry, b: StockEntry) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setDate("");
    setPrice("");
  };

  // Remove entry
  const removeEntry = (idx: number) => {
    setData(prev => prev.filter((_, i) => i !== idx));
  };

  // Generate sample data
  const generateSampleData = () => {
    const base = { AMZN: 150, GOOGL: 140, CRM: 250, MSFT: 390, NVDA: 900 }[stockSymbol] ?? 100;
    const today = new Date();
    const sample = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - 60 + i);
      sample.push({
        symbol: stockSymbol,
        date: d.toISOString().split("T")[0],
        price: Math.round((base + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 20) * 100) / 100
      });
    }
    setData(sample);
  };

  // Predict using Brain.js
  const handlePredict = async () => {
    if (data.length < 2) {
      alert("Add at least 2 data points to train the AI model!");
      return;
    }
    setLoading(true);
    setPrediction("");
    try {
      // Dynamically import brain.js for Next.js compatibility
      const brain = (await import("brain.js")).default;
      // Prepare training data for Brain.js
      const trainingData = data.map((entry) => ({
        input: { date: new Date(entry.date).getTime() / 1e10 },
        output: { price: entry.price / 1000 },
      }));
      const net = new brain.NeuralNetwork({ hiddenLayers: [3] });
      net.train(trainingData, { log: false, iterations: 200 });
      // Predict next day
      const lastDate = new Date(data[data.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      const nextDateNum = lastDate.getTime() / 1e10;
      const output = net.run({ date: nextDateNum }) as { price: number };
      const predictedPrice = output.price * 1000;
      setPrediction(`Predicted price for ${stockSymbol} on ${lastDate.toISOString().split("T")[0]}: $${predictedPrice.toFixed(2)}`);
    } catch (err) {
      setPrediction("Error with AI prediction.");
    }
    setLoading(false);
  };

  // Prepare chart data
  const chartData = {
    labels: data.map(entry => entry.date),
    datasets: [
      {
        label: "Historical Prices",
        data: data.map(entry => entry.price),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#4CAF50",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: `📈 ${stockSymbol} Price Chart`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Price ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxTicksLimit: 15,
        },
      },
    },
  };

  return (
    <div className="container">
      <h1>📈 Stock Market Predictor</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 30, fontSize: "1.1em" }}>
        AI-powered stock price prediction
      </p>
      <div className="controls">
        <select value={stockSymbol} onChange={e => setStockSymbol(e.target.value)}>
          {SYMBOLS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price ($)" step="0.01" />
        <button type="button" onClick={addEntry}>➕ Add Entry</button>
        <button type="button" onClick={generateSampleData}>🎲 Generate Sample</button>
        <input type="file" accept=".csv,.json" onChange={handleFileUpload} style={{ marginLeft: 10 }} />
        {fileError && <span style={{ color: "red", marginLeft: 10 }}>{fileError}</span>}
      </div>
      <div className="data-list">
        {data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 20px", color: "#666", fontSize: 16, background: "rgba(255,255,255,0.7)", borderRadius: 8, border: "2px dashed #ddd" }}>
            📊 No data entries yet<br />
            <small style={{ color: "#999", fontSize: 14 }}>Add some data or generate sample data to get started!</small>
          </div>
        ) : (
          data.map((entry, i) => (
            <div key={i} className="data-item">
              <span><strong>{entry.symbol}</strong> | {entry.date} | <span style={{ color: "#4CAF50", fontWeight: "bold" }}>${entry.price.toFixed(2)}</span></span>
              <button type="button" onClick={() => removeEntry(i)} title="Remove entry">❌</button>
            </div>
          ))
        )}
      </div>
      <button type="button" className="train-button" onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "🧠 Train & Predict"}
      </button>
      <div className="prediction-results">
        {prediction ? (
          <div>
            <h3>🔮 Prediction Results</h3>
            <p>{prediction}</p>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 20px", color: "#666", fontSize: 16, background: "rgba(255,255,255,0.7)", borderRadius: 8, border: "2px dashed #ddd" }}>
            🔮 Prediction Results<br />
            <small style={{ color: "#999", fontSize: 14 }}>Add data and click "Train & Predict" to see AI predictions</small>
          </div>
        )}
      </div>
      <div className="chart-container">
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div id="chart-placeholder" style={{height: 350, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 16, background: "rgba(255,255,255,0.7)", borderRadius: 8, border: "2px dashed #ddd"}}>
            <div style={{fontSize: 48, marginBottom: 20, opacity: 0.5}}>📈</div>
            <div style={{fontWeight: "bold", marginBottom: 10}}>Stock Price Chart</div>
            <div style={{fontSize: 14, color: "#999"}}>Train the AI model to see historical data and predictions visualized here</div>
          </div>
        )}
      </div>
    </div>
  );
}
