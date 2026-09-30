import { useEffect, useState } from "react";

const KEY = "thozhaa_role_choice";
const EVENT = "thozhaa-role-change";

/* ---------- Guest's choice from the popup: { role: "user" | "vendor", type } ---------- */
export const getRoleChoice = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const saveRoleChoice = (choice) => {
  localStorage.setItem(KEY, JSON.stringify(choice));
  window.dispatchEvent(new Event(EVENT));
};

export const clearRoleChoice = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
};

/* ---------- Role of the logged-in user (from the login response in localStorage) ---------- */
export const getUserRole = (user) => {
  if (!user) return null;
  const role = String(user.role || "").toLowerCase();
  if (role === "vendor") return "vendor";
  if (role === "user" || role === "customer") return "user";
  const type = String(user.type || "").toLowerCase();
  return type && type !== "user" ? "vendor" : "user";
};

export const getUserType = (user) => {
  const t = user?.type;
  return t && String(t).toLowerCase() !== "user" ? t : null;
};

/**
 * Logged-in user wins. Otherwise fall back to what the guest picked in the popup.
 * Returns { role: "user" | "vendor" | null, type: string | null }
 */
export const useEffectiveRole = (user) => {
  const [choice, setChoice] = useState(getRoleChoice);

  useEffect(() => {
    const sync = () => setChoice(getRoleChoice());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (user) return { role: getUserRole(user), type: getUserType(user) };
  if (choice) return { role: choice.role, type: choice.role === "vendor" ? choice.type : null };
  return { role: null, type: null };
};