// A vendor can tick MORE THAN ONE type in the role popup (e.g. Home Services
// and Sports & Fitness). The choice travels as ONE string, so it fits the
// existing { role: "vendor", type: "..." } shape and the ?type= URL param:
//
//   ["Home Services", "Sports & Fitness"]  <->  "Home Services|Sports & Fitness"
//
// A logged-in vendor account still has a single type, e.g. "Home Services";
// splitTypes() handles both.

export const TYPE_SEPARATOR = "|";

export const joinTypes = (types = []) => types.join(TYPE_SEPARATOR);

export const splitTypes = (value) =>
  value
    ? String(value)
        .split(TYPE_SEPARATOR)
        .map((t) => t.trim())
        .filter(Boolean)
    : [];