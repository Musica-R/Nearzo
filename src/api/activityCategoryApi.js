import axios from "axios";

const BASE_URL = "https://booking.mpdatahub.com/api";

// axios encodes the `&` in "Learning & Training" automatically via params
export const fetchActivityCategories = (type) => {
  return axios.get(`${BASE_URL}/get_Categories_bytype`, {
    params: { type },
  });
};