import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation as useRoute } from "react-router-dom";
import RolePopup from "./Rolepopup";
import LocationPopup from "./LocationPopup";

// ---- timings ----
// Not logged in (no lokal_token / lokal_user): Customer / Vendor popup
const ROLE_FIRST_MS = 40 * 1000;       // 1st time  -> 1 minute after opening the site (or after logout)
const ROLE_REPEAT_MS = 3 * 60 * 1000;  // then      -> every 3 minutes (as long as they stay and don't log in)
// Logged in: location popup
const LOCATION_FIRST_MS = 60 * 1000;   // 1st time  -> 10 seconds after login
const LOCATION_REPEAT_MS = 8 * 60 * 1000; // cancelled -> again every 1 minute until a location is saved

const TOKEN_KEY = "lokal_token";
const USER_KEY = "lokal_user";
const AUTH_ROUTES = ["/login", "/register", "/verify-otp"];

// Real login state = what is in localStorage
const hasStoredSession = () => {
  try {
    return !!localStorage.getItem(TOKEN_KEY) || !!localStorage.getItem(USER_KEY);
  } catch {
    return false;
  }
};

/**
 * Mounted ONCE in the Navbar.
 *
 *  Not logged in (lokal_token + lokal_user missing from localStorage):
 *    Customer / Vendor popup -> 1st after 1 minute, then every 3 minutes,
 *    to push the visitor to register first.
 *
 *  Logged in:
 *    Location popup -> 10s after login; if cancelled, again every 1 minute
 *    while the user stays on the website, until a location is saved.
 *    (The saved location is deleted on logout, so it asks again next login.)
 */
const PopupManager = () => {
  const { pathname } = useRoute();
  const user = useSelector((s) => s.auth.user);
  const savedLocation = useSelector((s) => s.location.current);

  const [queue, setQueue] = useState([]);
  const [roleDue, setRoleDue] = useState(false);
  const [roleRound, setRoleRound] = useState(0); // 0 = first popup, 1+ = repeats
  const [locRound, setLocRound] = useState(0);
  const active = queue[0] || null;

  const onAuthPage = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  const enqueue = useCallback((name) => {
    setQueue((q) => (q.includes(name) ? q : [...q, name]));
  }, []);
  const finish = useCallback((name) => {
    setQueue((q) => q.filter((n) => n !== name));
  }, []);

  // 0) Login / logout: restart both schedules from the beginning
  const prevUser = useRef(user);
  useEffect(() => {
    if (prevUser.current !== user) {
      setQueue([]);
      setRoleDue(false);
      setRoleRound(0);
      setLocRound(0);
    }
    prevUser.current = user;
  }, [user]);

  // 1) Not logged in: wait (1 min first, then 3 min) and mark the role popup "due"
  useEffect(() => {
    if (user || hasStoredSession()) return;

    const timer = setTimeout(
      () => setRoleDue(true),
      roleRound === 0 ? ROLE_FIRST_MS : ROLE_REPEAT_MS
    );
    return () => clearTimeout(timer);
  }, [user, roleRound]);

  // 2) Show it when due, but never on login / register / verify pages
  //    (if it became due there, it shows as soon as the visitor leaves them)
  useEffect(() => {
    if (user || onAuthPage || !roleDue || hasStoredSession()) return;
    setRoleDue(false);
    enqueue("role");
  }, [user, onAuthPage, roleDue, enqueue]);

  // 3) Logged in without a saved location: 10s after login, then every 1 minute
  useEffect(() => {
    if (!user || savedLocation) return;

    const timer = setTimeout(
      () => enqueue("location"),
      locRound === 0 ? LOCATION_FIRST_MS : LOCATION_REPEAT_MS
    );
    return () => clearTimeout(timer);
  }, [user, savedLocation, locRound, enqueue]);

  // Role popup closed (dismissed, or a choice was made) -> schedule the next one
  const closeRole = () => {
    finish("role");
    setRoleRound((r) => r + 1);
  };

  // Location popup closed -> if nothing was saved, ask again in 1 minute
  const closeLocation = () => {
    finish("location");
    setLocRound((r) => r + 1);
  };

  return (
    <>
      <RolePopup
        open={active === "role" && !user}
        onClose={closeRole}
        onDone={closeRole}
      />
      <LocationPopup
        open={active === "location" && !!user}
        onClose={closeLocation}
      />
    </>
  );
};

export default PopupManager;