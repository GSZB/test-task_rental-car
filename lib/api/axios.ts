import axios from "axios";

// NEXT_PUBLIC_* values are inlined at build time and become an empty string
// when the variable is unset, so the fallback needs `||` rather than `??`.
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://car-rental-api.goit.study";

export const api = axios.create({ baseURL });
