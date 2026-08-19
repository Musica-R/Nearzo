import axios from "axios";

const BASE_URL = "https://booking.mpdatahub.com/api";

const ENDPOINTS = {
  service: `${BASE_URL}/vendor/services`,
  activity: `${BASE_URL}/activities-register`,
  stall: `${BASE_URL}/near-stalls`,
};

export const registerVendor = (type, formData) => {
  return axios.post(ENDPOINTS[type], formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};