import { createServices } from "./createServices";

export { createServices, type AppServices, type CreateServicesDeps } from "./createServices";

/** App-wide service container (stable singleton). */
export const services = createServices();
