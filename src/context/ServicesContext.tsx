import React, { createContext, useContext } from "react";
import { services, type AppServices } from "../services";

const ServicesContext = createContext<AppServices>(services);

type Props = {
	children: React.ReactNode;
	value?: AppServices;
};

export function ServicesProvider({ children, value = services }: Props) {
	return (
		<ServicesContext.Provider value={value}>
			{children}
		</ServicesContext.Provider>
	);
}

export function useServices(): AppServices {
	return useContext(ServicesContext);
}
