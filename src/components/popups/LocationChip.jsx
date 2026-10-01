import { useDispatch, useSelector } from "react-redux";
import { FiMapPin } from "react-icons/fi";
import { openLocationPopup } from "../../redux/slices/locationSlice";
import { hasCoords } from "../../utils/location";
import "./Popupps.css";

/**
 * Put this in the Navbar. Shows the saved place and opens the location popup,
 * so the user can change it any time (saving resets the 7-day timer).
 */
const LocationChip = () => {
  const dispatch = useDispatch();
  const loc = useSelector((s) => s.location.current);

  const label = !loc
    ? "Set location"
    : loc.cityName || (hasCoords(loc) ? "Near me" : "Set location");

  return (
    <button
      type="button"
      className="lc-chip"
      onClick={() => dispatch(openLocationPopup())}
      aria-label={`Location: ${label}. Change location`}
    >
      <FiMapPin size={15} />
      <span className="lc-chip-label">{label}</span>
      {loc && <span className="lc-chip-radius">{loc.radius} km</span>}
    </button>
  );
};

export default LocationChip;