import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./pages/HomePage";
import { PokerStatsPage } from "./pages/poker/PokerStatsPage";
import { ChristmasCardPage } from "./pages/ChristmasCardPage";
import { WifiPage } from "./pages/WifiPage";
import { PokerYearInReviewPage } from "./pages/poker/PokerYearInReviewPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}

export default App;
