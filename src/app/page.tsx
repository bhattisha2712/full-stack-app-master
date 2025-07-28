import StockPredictor from "../components/StockPredictor";
import styles from "./Home.module.css";
export default function HomePage() {
  return (
	<main>
	  <div className={styles.homeBg}>
		<div className={styles.centerContent}>
		  <header className={styles.header}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "10px" }}>
			  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="4" y="4" width="40" height="40" rx="12" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
				<polyline points="12,32 20,24 28,36 36,16" fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
				<circle cx="12" cy="32" r="2" fill="#06b6d4" />
				<circle cx="20" cy="24" r="2" fill="#06b6d4" />
				<circle cx="28" cy="36" r="2" fill="#06b6d4" />
				<circle cx="36" cy="16" r="2" fill="#06b6d4" />
	  </svg>
	  <span style={{ fontSize: "2em", fontWeight: 700, background: "linear-gradient(90deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Stock Market Predictor</span>
  </div>
  <p className={styles.subtitle}>AI-powered stock price prediction for smarter investing</p>
		  </header>
		  <div className={styles.predictorWrap}>
			<StockPredictor />
		  </div>
		  <footer className={styles.footer}>
			&copy; {new Date().getFullYear()} Stock Market Predictor. All rights reserved.
		  </footer>
		</div>
	  </div>
	</main>
	);
}
