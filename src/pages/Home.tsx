import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-gray-900 mb-4">
					Welcome to Lombard
				</h1>
				<p className="text-xl text-gray-600 mb-8">
					Your apartment hub for all things fun
				</p>
				<nav className="space-x-4">
					<Link
						to="/poker-stats"
						className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Poker Stats
					</Link>
				</nav>
			</div>
		</div>
	);
};

export default Home;
