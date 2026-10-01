import { useMemo } from "react";
import { useSelector } from "react-redux";
import { hasPlace, toQueryParams } from "../utils/location";

/**
 * Use this in every page / list that depends on location.
 *
 *   const { params, hasLocation } = useUserLocation();
 *
 *   useEffect(() => {
 *     fetchProviders(params);      // e.g. GET /providers?city_id=..&latitude=..&radius=..
 *   }, [params]);                  // re-runs automatically when the user changes location
 *
 * `params` is memoized, so it only changes when the saved location changes.
 */
const useUserLocation = () => {
  const location = useSelector((s) => s.location.current);
  const params = useMemo(() => toQueryParams(location), [location]);

  return { location, params, hasLocation: hasPlace(location) };
};

export default useUserLocation;