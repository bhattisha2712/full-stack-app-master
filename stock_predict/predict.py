import sys
import csv
import os

def load_data(symbol, filename="stock_predict/data.csv"):
    # Load CSV data for the given stock symbol
    import os
    if not os.path.exists(filename):
        return []
    try:
        with open(filename, "r") as f:
            reader = csv.DictReader(f)
            return [row for row in reader if row.get("symbol") == symbol]
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def predict(stock_symbol):
    # Load historical data from CSV
    data = load_data(stock_symbol)
    if not data or len(data) < 2:
        return f"Not enough data for {stock_symbol} to predict."
    # Simple linear regression (date as x, price as y)
    import datetime
    x = []  # List of date ordinals
    y = []  # List of prices
    for row in data:
        try:
            dt = datetime.datetime.strptime(row["date"], "%Y-%m-%d")
            x.append(dt.toordinal())
            y.append(float(row["price"]))
        except Exception as e:
            # Skip rows with invalid data
            continue
    n = len(x)
    if n < 2:
        return f"Not enough valid data for {stock_symbol}."
    # Linear regression formula
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    num = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))
    den = sum((xi - x_mean) ** 2 for xi in x)
    if den == 0:
        return f"Cannot predict for {stock_symbol}."
    slope = num / den
    intercept = y_mean - slope * x_mean
    # Predict next day
    next_date = max(x) + 1
    pred_price = slope * next_date + intercept
    next_date_str = datetime.date.fromordinal(next_date).isoformat()
    return f"Prediction for {stock_symbol} on {next_date_str}: {pred_price:.2f}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <stock_symbol>")
        sys.exit(1)
    stock_symbol = sys.argv[1]
    result = predict(stock_symbol)
    print(result)
