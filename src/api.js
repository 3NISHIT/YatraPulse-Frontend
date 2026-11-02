import axios from "axios";

const api = axios.create({
  baseURL: "https://yatrapulse-api.nivsee.com/api/",
  headers: { Accept: "application/json" },
});

export default api;
