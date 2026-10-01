import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";
import {
  readLocation,
  writeLocation,
  hasPlace,
  DEFAULT_RADIUS,
} from "../../utils/location";

const storedUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("lokal_user"))?.id ?? null;
  } catch {
    return null;
  }
};

const locationSlice = createSlice({
  name: "location",
  initialState: {
    ...readLocation(storedUserId()), // { current, stale }
    popupOpen: false, // lets any component (navbar chip) open the location popup
  },
  reducers: {
    locationSaved: (state, { payload }) => {
      state.current = payload;
      state.stale = null;
    },
    locationCleared: (state) => {
      state.current = null;
      state.stale = null;
    },
    openLocationPopup: (state) => {
      state.popupOpen = true;
    },
    closeLocationPopup: (state) => {
      state.popupOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // When someone logs in, load THEIR saved location
      .addCase(login.fulfilled, (state, action) => {
        const { current, stale } = readLocation(action.payload?.user?.id ?? null);
        state.current = current;
        state.stale = stale;
      })
      // Logout: the saved location is deleted from localStorage (see authSlice),
      // so clear it from the store too.
      .addCase(logout, (state) => {
        state.current = null;
        state.stale = null;
        state.popupOpen = false;
      });
  },
});

export const {
  locationSaved,
  locationCleared,
  openLocationPopup,
  closeLocationPopup,
} = locationSlice.actions;

/**
 * Save a location for the current user (or guest) and reset the 7-day timer.
 * Passing an empty location clears it.
 *   dispatch(saveLocation({ cityId, cityName, latitude, longitude, radius }))
 */
export const saveLocation = (loc) => (dispatch, getState) => {
  const uid = getState().auth.user?.id ?? null;

  if (!hasPlace(loc)) {
    writeLocation(uid, null);
    dispatch(locationCleared());
    return;
  }

  const value = {
    cityId: loc.cityId ?? null,
    cityName: loc.cityName ?? null,
    latitude: loc.latitude ?? null,
    longitude: loc.longitude ?? null,
    radius: loc.radius || DEFAULT_RADIUS,
    savedAt: Date.now(),
  };
  writeLocation(uid, value);
  dispatch(locationSaved(value));
};

export default locationSlice.reducer;