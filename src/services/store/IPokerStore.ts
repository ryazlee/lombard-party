import type { PlayerSummary, PokerSession } from "../../types/poker/types";

export type PokerData = {
	sessions: PokerSession[];
	playerSummaries: PlayerSummary[];
};

/**
 * IPokerStore — data backend for poker sessions.
 * Swap between PokerStore (Google Sheets) and PokerStoreMock via store/index.ts.
 *
 * Convention: store owns I/O and raw → domain mapping.
 * The service layer owns aggregation and orchestration.
 */
export interface IPokerStore {
	getPokerData(): Promise<PokerData>;
}
