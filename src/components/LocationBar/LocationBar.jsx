import { useEffect, useState } from "react";
import { MapPin, Crosshair, CheckCircle2, Radar, Search } from "lucide-react";
import { fetchCities } from "../../api/lokalApi";
import "./LocationBar.css";

const STORAGE_KEY = "lokal_location";
const AUTO_EXPIRE_MS = 6 * 60 * 60 * 1000; // saved location auto-deletes after 6 hours
const RADIUS_OPTIONS = [5,10,15,20,25,30,35,40,45,50,55,60 ,100 ,200];
const DEFAULT_RADIUS = 25;

const loadSavedLocation = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { radius: DEFAULT_RADIUS };
        const saved = JSON.parse(raw);
        if (!saved.savedAt || Date.now() - saved.savedAt > AUTO_EXPIRE_MS) {
            localStorage.removeItem(STORAGE_KEY);
            return { radius: DEFAULT_RADIUS };
        }
        return saved;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return { radius: DEFAULT_RADIUS };
    }
};

// onSearch is optional — called when the person hits the Search button,
// useful for closing panels / scrolling to results / analytics, since the
// grid itself already re-fetches reactively whenever location changes.

const LocationBar = ({ onChange, onSearch }) => {
    const [cities, setCities] = useState([]);
    const [location, setLocation] = useState(() => loadSavedLocation());
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState(null);

    const hasCoords = location.latitude != null && location.longitude != null;

    useEffect(() => {
        fetchCities().then(setCities).catch(() => setCities([]));
    }, []);

    useEffect(() => {
        onChange?.(location);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const persist = (next) => {
        setLocation(next);
        if (next.cityId || next.latitude != null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, savedAt: Date.now() }));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    // Fully separate, standalone field #2 — the city select
    const handleCityChange = (e) => {
        const id = e.target.value;
        if (!id) {
            persist({ ...location, cityId: null, cityName: null });
            return;
        }
        const city = cities.find((c) => String(c.id) === id);
        persist({
            ...location,
            cityId: city ? city.id : id,
            cityName: city ? city.name : null,
            radius: location.radius || DEFAULT_RADIUS,
        });
    };

    // Fully separate, standalone field #1 — current location, with its own name/label
    const handleUseCurrentLocation = () => {
        if (hasCoords) {
            persist({ ...location, latitude: null, longitude: null });
            return;
        }
        if (!navigator.geolocation) {
            setError("Location isn't supported on this browser.");
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                persist({
                    ...location,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    radius: location.radius || DEFAULT_RADIUS,
                });
                setLocating(false);
            },
            () => {
                setError("Couldn't get your location. Check permissions.");
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleRadiusChange = (radius) => {
        persist({ ...location, radius });
    };

    const handleSearchClick = () => {
        onSearch?.(location);
    };

    return (
        <div className="location-search-wrap">
            <div className="location-search-card">
                {/* Field 1 — Current location, standalone with its own label */}
                <button
                    type="button"
                    className={`location-search-field location-current-field ${hasCoords ? "active" : ""}`}
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                >
                    <Crosshair size={16} />
                    <span className="location-search-field-label">
                        {locating ? "Locating..." : hasCoords ? "Current location" : "Use current location"}
                    </span>
                    {hasCoords && <CheckCircle2 size={14} className="location-current-check" />}
                </button>

                <div className="location-search-divider" />

                {/* Field 2 — City, its own standalone select */}
                <div className="location-search-field location-city-field">
                    <MapPin size={16} />
                    <select
                        value={location.cityId ?? ""}
                        onChange={handleCityChange}
                        className="location-city-select"
                    >
                        <option value="">Choose city</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="location-search-divider" />

                {/* Field 3 — Radius */}
                <div className="location-search-field location-search-radius">
                    <Radar size={16} />
                    <select
                        value={location.radius || DEFAULT_RADIUS}
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    >
                        {RADIUS_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                                Within {r} km
                            </option>
                        ))}
                    </select>
                </div>

                <button className="location-search-btn" onClick={handleSearchClick}>
                    <Search size={16} />
                    Search
                </button>
            </div>

            {error && <p className="location-bar-error">{error}</p>}
        </div>
    );
};

export default LocationBar;