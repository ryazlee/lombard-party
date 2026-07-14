import { useQuery } from "@tanstack/react-query";
import { useServices } from "../context/ServicesContext";
import { queryKeys } from "./queryKeys";

export function usePokerStats() {
	const { pokerService } = useServices();

	return useQuery({
		queryKey: queryKeys.pokerStats,
		queryFn: () => pokerService.getPokerData(),
	});
}

export function usePokerYearInReview(name: string | undefined) {
	const { pokerService } = useServices();

	return useQuery({
		queryKey: queryKeys.pokerYearInReview(name ?? ""),
		queryFn: () => pokerService.getPlayerYearInReview(name!),
		enabled: Boolean(name),
	});
}
