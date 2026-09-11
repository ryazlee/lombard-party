import type { IPokerStore, PokerData } from './IPokerStore'
import type { PokerSession } from '../../types/poker/types'

/**
 * In-memory poker data for local development without Google Sheets.
 * Enable with VITE_USE_MOCK=true.
 */
export class PokerStoreMock implements IPokerStore {
  async getPokerData(): Promise<PokerData> {
    const sessions: PokerSession[] = [
      session('2024-11-08', 'Alex Smith', 20, 45),
      session('2024-11-08', 'Jordan Lee', 20, -20),
      session('2024-11-08', 'Sam Patel', 20, -15),
      session('2024-11-08', 'Riley Chen', 20, -10),
      session('2024-12-13', 'Alex Smith', 20, -8),
      session('2024-12-13', 'Jordan Lee', 20, 32),
      session('2024-12-13', 'Sam Patel', 20, -12),
      session('2024-12-13', 'Morgan Diaz', 20, -12),
      session('2025-01-10', 'Alex Smith', 20, 28),
      session('2025-01-10', 'Jordan Lee', 20, -18),
      session('2025-01-10', 'Sam Patel', 20, 14),
      session('2025-01-10', 'Riley Chen', 20, -24),
      session('2025-02-14', 'Alex Smith', 20, 15),
      session('2025-02-14', 'Jordan Lee', 20, -20),
      session('2025-02-14', 'Morgan Diaz', 20, 22),
      session('2025-02-14', 'Casey Nguyen', 20, -17),
      session('2025-03-01', 'Alex Smith', 20, 25),
      session('2025-03-01', 'Sam Patel', 20, -5),
      session('2025-03-01', 'Riley Chen', 20, 18),
      session('2025-03-01', 'Casey Nguyen', 20, -38),
      session('2025-04-18', 'Jordan Lee', 20, 41),
      session('2025-04-18', 'Morgan Diaz', 20, -9),
      session('2025-04-18', 'Riley Chen', 20, -16),
      session('2025-04-18', 'Casey Nguyen', 20, -16),
      session('2025-06-06', 'Alex Smith', 20, -22),
      session('2025-06-06', 'Sam Patel', 20, 36),
      session('2025-06-06', 'Morgan Diaz', 20, 8),
      session('2025-06-06', 'Casey Nguyen', 20, -22),
    ]

    const names = [...new Set(sessions.map((item) => item.player))]
    const playerSummaries = names.map((player) => {
      const mine = sessions.filter((item) => item.player === player)
      return {
        player,
        totalWinnings: mine.reduce((sum, item) => sum + item.profit, 0),
        sessionCount: mine.length,
      }
    })

    return { playerSummaries, sessions }
  }
}

function session(iso: string, player: string, buyIn: number, profit: number): PokerSession {
  const date = new Date(iso)
  date.setHours(0, 0, 0, 0)
  return { date, player, buyIn, profit }
}
