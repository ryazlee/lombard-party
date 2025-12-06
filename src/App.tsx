import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokerStats from "./pages/PokerStats";
import ChristmasCard from "./pages/ChristmasCard";
import { PokerYearInReview } from "./pages/PokerYearInReview";
import WifiPage from "./pages/WifiPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/poker/stats" element={<PokerStats />} />
				<Route path="/christmas-card" element={<ChristmasCard />} />
				<Route
					path="/poker/review/:name"
					element={<PokerYearInReview />}
				/>
				<Route path="/wifi" element={<WifiPage />} />
			</Routes>
		</Router>
	);
}

export default App;
