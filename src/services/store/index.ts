import type { IPokerStore } from './IPokerStore'
import { PokerStore } from './PokerStore'
import { PokerStoreMock } from './PokerStoreMock'

const useMockStore = import.meta.env.VITE_USE_MOCK === 'true'

export const pokerStore: IPokerStore = useMockStore ? new PokerStoreMock() : new PokerStore()

export type { IPokerStore, PokerData } from './IPokerStore'
