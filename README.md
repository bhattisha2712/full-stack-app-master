# Full Stack Stock Market Predictor

## Overview
This project is a full-stack stock market prediction web application. It allows users to upload or enter historical stock data, visualize it, and generate predictions using both a Python backend (linear regression) and a React/Brain.js neural network frontend.

## Features
- Upload or manually enter stock data (CSV/JSON)
- Visualize historical prices with interactive charts
- Predict next day's price using:
  - Python backend (linear regression on historical data)
  - Brain.js neural network in the browser
- Modern, responsive UI with custom logo and navigation
- Supports multiple stock symbols (AMZN, GOOGL, CRM, MSFT, NVDA)

## Technologies Used
- Next.js (React, App Router)
- Python (for backend prediction)
- Brain.js (neural network in React)
- Chart.js (data visualization)
- MongoDB Atlas (optional, for user/auth data)

## How to Run Locally
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

## File Structure
- `src/components/StockPredictor.tsx` — Main React component (UI, Brain.js, file upload)
- `stock_predict/predict.py` — Python script for backend prediction
- `stock_predict/data.csv` — Sample stock data (edit or upload your own)
- `src/app/api/predict/route.ts` — Next.js API route to call Python script
- `public/` — Static assets and logo

## Data Format
CSV file should have columns:
```
symbol,date,price
AMZN,2025-07-25,180.50
AMZN,2025-07-26,182.10
...
```

## Assignment Compliance
- Uses both neural network (Brain.js) and traditional ML (Python linear regression)
- Supports file upload and manual data entry
- Clean, robust, and well-commented code
- Modern UI/UX and charting
- Ready for deployment (Vercel/Netlify)

## Credits
Developed by [Your Name].

---
For any issues or questions, please contact the maintainer.
