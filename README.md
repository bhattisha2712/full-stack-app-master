
# 📈 Stock Market Predictor

AI-powered stock price prediction app using Brain.js and Python

---

## 🚀 Overview
This is a full-stack web application for predicting stock prices. Users can upload or enter historical stock data, visualize it with interactive charts, and generate predictions using:
- 🧠 Brain.js neural network (in-browser, React)
- 📊 Python linear regression (backend)

## ✨ Features
- Upload or manually enter stock data (CSV/JSON)
- Visualize historical and predicted prices with Chart.js
- Predict next day's price using both Brain.js and Python
- Responsive, modern UI/UX
- Supports multiple stock symbols (AMZN, GOOGL, CRM, MSFT, NVDA)
- Clean, well-commented code

## 🛠️ Technologies
- **Frontend:** Next.js (React), Brain.js, Chart.js
- **Backend:** Python (linear regression), Next.js API routes
- **Other:** MongoDB Atlas (optional, for user/auth data)

## 📂 File Structure
- `src/components/StockPredictor.tsx` — Main React component (UI, Brain.js, file upload)
- `stock_predict/predict.py` — Python script for backend prediction
- `stock_predict/data.csv` — Sample stock data (edit or upload your own)
- `src/app/api/predict/route.ts` — Next.js API route to call Python script
- `public/` — Static assets and logo

## 📥 How to Run Locally
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **(Optional) Test Python prediction:**
   ```sh
   python stock_predict/predict.py AMZN
   ```
   - Edit or add data in `stock_predict/data.csv` as needed.

## 📊 Data Format
CSV file should have columns:
```csv
symbol,date,price
AMZN,2025-07-25,180.50
AMZN,2025-07-26,182.10
...
```

## ✅ Assignment Compliance
- [x] Uses both neural network (Brain.js) and traditional ML (Python linear regression)
- [x] Supports file upload and manual data entry
- [x] Clean, robust, and well-commented code
- [x] Modern UI/UX and charting
- [x] Ready for deployment (Vercel/Netlify)



## 👩‍💻 Credits
Developed by ishaben Bhatt.

---
For any issues or questions, please contact the maintainer.
