import { PokerService } from "./PokerService";
import { pokerStore } from "./store";
import type { IPokerStore } from "./store";

export type AppServices = {
	pokerStore: IPokerStore;
	pokerService: PokerService;
};

export type CreateServicesDeps = {
	pokerStore?: IPokerStore;
};

export function createServices(deps: CreateServicesDeps = {}): AppServices {
	const store = deps.pokerStore ?? pokerStore;

	return {
		pokerStore: store,
		pokerService: new PokerService({ pokerStore: store }),
	};
}
