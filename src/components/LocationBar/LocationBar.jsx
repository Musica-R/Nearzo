import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Crosshair, CheckCircle2, Radar, Search } from "lucide-react";
import { fetchCities } from "../../api/lokalApi";
import { saveLocation } from "../../redux/slices/locationSlice";
import { DEFAULT_RADIUS, RADIUS_OPTIONS, hasCoords } from "../../utils/location";
import "./LocationBar.css";


const LocationBar = ({ onChange, onSearch }) => {
    const dispatch = useDispatch();
    const saved = useSelector((s) => s.location.current);
    const location = saved || { radius: DEFAULT_RADIUS };

    const [cities, setCities] = useState([]);
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState(null);

    const coordsOn = hasCoords(location);

    useEffect(() => {
        fetchCities().then(setCities).catch(() => setCities([]));
    }, []);

    useEffect(() => {
        onChange?.(location);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saved]);

    const persist = (next) => dispatch(saveLocation(next));

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

    const handleUseCurrentLocation = () => {
        if (coordsOn) {
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

    const handleRadiusChange = (radius) => persist({ ...location, radius });

    return (
        <div className="location-search-wrap">
            <div className="location-search-card">
                <button
                    type="button"
                    className={`location-search-field location-current-field ${coordsOn ? "active" : ""}`}
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                >
                    <Crosshair size={16} />
                    <span className="location-search-field-label">
                        {locating ? "Locating..." : coordsOn ? "Current location" : "Use current location"}
                    </span>
                    {coordsOn && <CheckCircle2 size={14} className="location-current-check" />}
                </button>

                <div className="location-search-divider" />

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

                <button type="button" className="location-search-btn" onClick={() => onSearch?.(location)}>
                    <Search size={16} />
                    Search
                </button>
            </div>

            {error && <p className="location-bar-error">{error}</p>}
        </div>
    );
};

export default LocationBar;