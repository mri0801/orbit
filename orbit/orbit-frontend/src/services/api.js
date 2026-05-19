import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

export const getSatellites = () => API.get("/satellites");
export const getSatelliteById = (id) => API.get(`/satellites/${id}`);