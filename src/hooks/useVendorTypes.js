import { useEffect, useState } from "react";
import { fetchVendorTypes } from "../api/categoryApi";

const useVendorTypes = (enabled = true) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    let ignore = false;
    setLoading(true);
    setError(null);
    fetchVendorTypes()
      .then((data) => !ignore && setTypes(data))
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [enabled]);

  return { types, loading, error };
};

export default useVendorTypes;