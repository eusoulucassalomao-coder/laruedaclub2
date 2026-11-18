import { adapt } from "../lib/adapter.mjs";
import handler from "../lib/fid.cjs";

export default adapt(handler);
export const config = { path: "/api/fid" };
