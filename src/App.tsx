import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PokerStatsPage } from "./pages/poker/PokerStatsPage";
import { ChristmasCardPage } from "./pages/ChristmasCardPage";
import { WifiPage } from "./pages/WifiPage";
import { PokerYearInReviewPage } from "./pages/poker/PokerYearInReviewPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/poker/stats" element={<PokerStatsPage />} />
				<Route path="/christmas-card" element={<ChristmasCardPage />} />
				<Route
					path="/poker/review/:name"
					element={<PokerYearInReviewPage />}
				/>
				<Route path="/wifi" element={<WifiPage />} />
			</Routes>
		</Router>
	);
}

export default App;
