import { adapt } from "../lib/adapter.mjs";
import handler from "../lib/health.cjs";

export default adapt(handler);
export const config = { path: "/api/health" };
