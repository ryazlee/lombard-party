import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokerStats from "./pages/PokerStats";
import ChristmasCard from "./pages/ChristmasCard";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/poker-stats" element={<PokerStats />} />
				<Route path="/christmas-card" element={<ChristmasCard />} />
			</Routes>
		</Router>
	);
}

export default App;
