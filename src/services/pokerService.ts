import type {
	PlayerStat,
	PlayerYearInReview,
	PokerSession,
	YearFilter,
} from "../types/poker/types";
import { convertNameToSnakeCase } from "../utils/names";
import type { IPokerStore, PokerData } from "./store";

export type PokerServiceDeps = {
	pokerStore: IPokerStore;
};

/**
 * Poker reads and aggregations. Store owns I/O; this layer owns domain logic.
 */
export class PokerService {
	constructor(private readonly deps: PokerServiceDeps) {}

	getPokerData(): Promise<PokerData> {
		return this.deps.pokerStore.getPokerData();
	}

	getPlayerStats(sessions: PokerSession[]): PlayerStat[] {
		const playerMap = new Map<
			string,
			{
				totalProfit: number;
				sessions: number;
				totalBuyIn: number;
				highestSingleWinning: number;
			}
		>();

		sessions.forEach((session) => {
			const existing = playerMap.get(session.player) || {
				totalProfit: 0,
				sessions: 0,
				totalBuyIn: 0,
				highestSingleWinning: 0,
			};

			playerMap.set(session.player, {
				totalProfit: existing.totalProfit + session.profit,
				sessions: existing.sessions + 1,
				totalBuyIn: existing.totalBuyIn + session.buyIn,
				highestSingleWinning: Math.max(
					existing.highestSingleWinning,
					session.profit
				),
			});
		});

		return Array.from(playerMap.entries()).map(([player, stats]) => ({
			player,
			...stats,
			totalWinnings: stats.totalProfit,
			avgProfit: stats.totalProfit / stats.sessions,
			roi:
				stats.totalBuyIn > 0
					? (stats.totalProfit / stats.totalBuyIn) * 100
					: 0,
		}));
	}

	getAvailableYears(sessions: PokerSession[]): number[] {
		const years = new Set<number>();
		sessions.forEach((session) => {
			years.add(session.date.getFullYear());
		});
		return Array.from(years).sort((a, b) => b - a);
	}

	filterSessionsByYear(
		sessions: PokerSession[],
		year: YearFilter
	): PokerSession[] {
		if (year === "all") {
			return sessions;
		}
		return sessions.filter((session) => session.date.getFullYear() === year);
	}

	async getPlayerYearInReview(
		snakeCaseName: string
	): Promise<PlayerYearInReview | null> {
		const { sessions } = await this.getPokerData();
		const stats = this.getPlayerStats(sessions);
		const playerStat = stats.find(
			(stat) => convertNameToSnakeCase(stat.player) === snakeCaseName
		);

		if (!playerStat) {
			return null;
		}

		const userSessions = sessions.filter(
			(session) =>
				convertNameToSnakeCase(session.player) === snakeCaseName
		);
		const winningSessions = userSessions.filter(
			(session) => session.profit > 0
		);
		const winRate =
			userSessions.length > 0
				? (winningSessions.length / userSessions.length) * 100
				: 0;

		return {
			...playerStat,
			winRate,
		};
	}
}
