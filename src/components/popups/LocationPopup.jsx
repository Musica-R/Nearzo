import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCrosshair, FiMapPin, FiChevronDown, FiCheck, FiX } from "react-icons/fi";
import { fetchCities } from "../../api/lokalApi";
import { saveLocation } from "../../redux/slices/locationSlice";
import { DEFAULT_RADIUS, QUICK_RADII, hasCoords, hasPlace } from "../../utils/location";
import Modal from "./Modal";


const LocationPopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const current = useSelector((s) => s.location.current);
  const stale = useSelector((s) => s.location.stale);
  const previous = current || stale;

  const [cities, setCities] = useState([]);
  const [draft, setDraft] = useState({
    cityId: null,
    cityName: null,
    latitude: null,
    longitude: null,
    radius: DEFAULT_RADIUS,
  });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  // Load cities once when first opened
  useEffect(() => {
    if (!open || cities.length) return;
    fetchCities().then(setCities).catch(() => setCities([]));
  }, [open, cities.length]);

  // Pre-fill every time the popup opens
  useEffect(() => {
    if (!open) return;
    setError(null);
    setDraft({
      cityId: previous?.cityId ?? null,
      cityName: previous?.cityName ?? null,
      latitude: previous?.latitude ?? null,
      longitude: previous?.longitude ?? null,
      radius: previous?.radius || DEFAULT_RADIUS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("This browser can't share your location. Choose a city instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDraft((d) => ({
          ...d,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setLocating(false);
      },
      () => {
        setError("We couldn't get your location. Allow location access, or choose a city.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearCoords = () => setDraft((d) => ({ ...d, latitude: null, longitude: null }));

  const changeCity = (e) => {
    const id = e.target.value;
    if (!id) {
      setDraft((d) => ({ ...d, cityId: null, cityName: null }));
      return;
    }
    const city = cities.find((c) => String(c.id) === id);
    setDraft((d) => ({ ...d, cityId: city ? city.id : id, cityName: city ? city.name : null }));
  };

  const save = () => {
    if (!hasPlace(draft)) return;
    dispatch(saveLocation(draft));
    onClose({ saved: true });
  };

  const isStale = !current && !!stale;
  const title = isStale
    ? `Still in ${stale.cityName || "this area"}?`
    : "Where are you looking for services?";
  const sub = isStale
    ? "Your saved location is over a week old. Confirm it or update it."
    : "We'll show providers near you across the whole site.";

  return (
    <Modal open={open} onClose={() => onClose({ saved: false })} labelledBy="lc-title">
      <div className="pp-scroll">
        <h2 id="lc-title" className="pp-title">{title}</h2>
        <p className="pp-sub">{sub}</p>

        {/* Current location */}
        {hasCoords(draft) ? (
          <div className="pp-coords">
            <span className="pp-coords-icon"><FiCheck size={16} /></span>
            <span className="pp-coords-text">
              <strong>Current location</strong>
              <small>
                {draft.latitude.toFixed(5)}, {draft.longitude.toFixed(5)}
              </small>
            </span>
            <button type="button" className="pp-coords-clear" onClick={clearCoords} aria-label="Remove current location">
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <button type="button" className="pp-btn pp-btn-outline" onClick={useMyLocation} disabled={locating}>
            <FiCrosshair size={16} />
            {locating ? "Finding you..." : "Use my current location"}
          </button>
        )}

        <div className="pp-or"><span>or choose a city</span></div>

        <div className="pp-field pp-select">
          <FiMapPin size={16} />
          <select value={draft.cityId ?? ""} onChange={changeCity} aria-label="City">
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <FiChevronDown size={16} className="pp-select-caret" />
        </div>

        {/* Radius */}
        <div className="pp-radius-head">
          <span className="pp-label pp-label-flush">Search radius</span>
          <strong>{draft.radius} km</strong>
        </div>
        <div className="pp-radii" role="radiogroup" aria-label="Search radius in kilometres">
          {QUICK_RADII.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={draft.radius === r}
              className={`pp-radius ${draft.radius === r ? "is-active" : ""}`}
              onClick={() => setDraft((d) => ({ ...d, radius: r }))}
            >
              {r} km
            </button>
          ))}
        </div>

        {error && <p className="pp-error" role="alert">{error}</p>}
      </div>

      <div className="pp-footer">
        <button type="button" className="pp-btn pp-btn-primary" onClick={save} disabled={!hasPlace(draft)}>
          {isStale ? "Confirm location" : "Save location"}
        </button>
        <button type="button" className="pp-link pp-skip" onClick={() => onClose({ saved: false })}>
          Not now
        </button>
      </div>
    </Modal>
  );
};

export default LocationPopup;