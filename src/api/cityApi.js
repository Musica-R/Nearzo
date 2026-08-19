import api from "./axios";

export const fetchCities = () => api.get("/cities");
