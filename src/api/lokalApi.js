import api from "./axios";
import image1 from "../assets/Home.jpg";
import image2 from "../assets/learning.jpg";
import image3 from "../assets/sports.jpg";
import image4 from "../assets/shop.jpg";

const BASE_URL = "https://booking.mpdatahub.com/api";

async function getJSON(path, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });
    const qs = query.toString();
    const url = `${BASE_URL}/${path}${qs ? `?${qs}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${path}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Request failed");

    const data = json.data || [];
    data.meta = {
        total: json.total,
        currentPage: json.current_page,
        perPage: json.per_page,
        lastPage: json.last_page,
    };
    return data;
}

function buildLocationParams({ cityId, latitude, longitude, radius, page = 1, perPage = 20 } = {}) {
    const params = { page, per_page: perPage };
    if (cityId) params.city_id = cityId;
    if (latitude != null && longitude != null) {
        params.latitude = latitude;
        params.longitude = longitude;
        if (radius) params.radius = radius;
    }
    return params;
}

export function hasLocationFilter(location) {
    return Boolean(location && (location.cityId || (location.latitude != null && location.longitude != null)));
}

// ---- Default, unfiltered listing endpoints ----
export const fetchActivities = (opts) => getJSON("activities-all", buildLocationParams(opts));
export const fetchVendors = (opts) => getJSON("all-vendors", buildLocationParams(opts));
export const fetchNearStalls = (opts) => getJSON("near-stalls-all", buildLocationParams(opts));

// ---- Location-scoped search endpoints (city_id / lat / lng / radius) ----
export const searchActivities = (opts) => getJSON("activityList", buildLocationParams(opts));
export const searchVendors = (opts) => getJSON("vendor-list", buildLocationParams(opts));
export const searchNearStalls = (opts) => getJSON("near-stalls", buildLocationParams(opts));

export const fetchCategories = () => getJSON("categories");

// type: "Home Services" | "Learning & Training" | "Sports & Fitness"
export const fetchCategoriesByType = (type) => getJSON("get_Categories_bytype", { type });

// Maps the API's "type" field to the group ids used across the app
// (Home.jsx top tiles / section links).
export const CATEGORY_TYPE_TO_GROUP = {
    "Home Services": "home-services",
    "Learning & Training": "learning-training",
    "Sports & Fitness": "sports-fitness",
};

export const GROUP_ICONS = {
    "home-services": "Home",
    "learning-training": "GraduationCap",
    "sports-fitness": "Dumbbell",
    "nearby-shop": "Store",
};

// Fetches categories for every known type from get_Categories_bytype and
// concatenates them in the order the API returns them (no client-side
// re-sorting). This is now the ONLY source of category data — there is no
// static fallback list.
export async function fetchAllCategories() {
    const types = Object.keys(CATEGORY_TYPE_TO_GROUP);
    const lists = await Promise.all(types.map((type) => fetchCategoriesByType(type)));
    return types.flatMap((type, i) =>
        (lists[i] || []).map((cat) => ({
            ...cat,
            groupId: CATEGORY_TYPE_TO_GROUP[type],
        }))
    );
}

function slugify(str = "") {
    return str
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// Maps a raw { id, name, type, image, groupId } category (as produced by
// fetchAllCategories) into the shape CategoryCard / ServiceCard consume.
export function mapApiCategory(cat) {
    return {
        id: cat.id,
        slug: slugify(cat.name),
        name: cat.name,
        image: cat.image,
        groupId: cat.groupId,
        groupTitle: cat.type,
        icon: GROUP_ICONS[cat.groupId] || "Sparkles",
    };
}

// Buckets mapped categories by groupId:
// { "home-services": [...], "learning-training": [...], ... }
export function groupCategoriesByGroup(categories) {
    return categories.reduce((acc, cat) => {
        (acc[cat.groupId] = acc[cat.groupId] || []).push(cat);
        return acc;
    }, {});
}

// Round-robins categories across groups so a capped list (e.g. the
// homepage "Explore Popular Categories" grid) mixes every group instead of
// being dominated by whichever type the API happens to return first.
export function interleaveCategories(byGroup, order, limit) {
    const lists = order.map((g) => byGroup[g] || []);
    const result = [];
    let row = 0;
    while (result.length < limit && lists.some((list) => list[row])) {
        for (let idx = 0; idx < order.length && result.length < limit; idx++) {
            if (lists[idx][row]) result.push(lists[idx][row]);
        }
        row++;
    }
    return result;
}

export const fetchCities = async () => {
    const { data } = await api.get("/cities");
    return data?.data || [];
};

export function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${m} ${ampm}`;
}

export function formatAvailability(type) {
    if (type === "all_days") return "All days";
    if (type === "weekdays") return "Weekdays";
    if (type === "weekends") return "Weekends";
    return type || "";
}

export function formatPrice(price) {
    if (price == null || price === "") return null;
    const num = Number(price);
    if (Number.isNaN(num)) return null;
    const rounded = Number.isInteger(num) ? num : num.toFixed(2);
    return `₹${rounded} onwards`;
}

export function toWhatsAppLink(number) {
    if (!number) return null;
    const digits = number.replace(/\D/g, "");
    const withCountry = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${withCountry}`;
}

export function toDirectionsLink(provider) {
    if (provider.mapLink) return provider.mapLink;
    if (provider.lat && provider.lng) {
        return `https://www.google.com/maps?q=${provider.lat},${provider.lng}`;
    }
    return null;
}

// Category-based placeholders for listings with no uploaded photo.
const FALLBACK_IMAGES = {
    vendor: image1,
    learning: image2,
    sport: image3,
    stall: image4,
};

const SPORT_KEYWORDS = ["gym", "yoga", "dance", "fitness", "karate", "sport", "workout"];
const LEARNING_KEYWORDS = ["music", "drawing", "art", "class", "training", "tuition", "coaching", "learn"];

function classifyActivity(label = "") {
    const value = label.toLowerCase();
    if (SPORT_KEYWORDS.some((k) => value.includes(k))) return "sport";
    if (LEARNING_KEYWORDS.some((k) => value.includes(k))) return "learning";
    return "learning";
}

function fallbackImage(type, categoryLabel) {
    if (type === "vendor") return FALLBACK_IMAGES.vendor;
    if (type === "stall") return FALLBACK_IMAGES.stall;
    if (type === "activity") return FALLBACK_IMAGES[classifyActivity(categoryLabel)];
    return FALLBACK_IMAGES.vendor;
}

// Normalizes the 3 different API shapes into one common provider shape
// Normalizes the 3 different API shapes into one common provider shape
export function normalizeProvider(raw, type) {
    const base = {
        id: String(raw.id),
        type,
        categoryId: raw.category_id ?? raw.category?.id ?? null, // NEW — needed for VendorProfile route
        phone: raw.phone_number || "",
        whatsapp: raw.whatsapp_number || "",
        experience: raw.experience || "",
        price: raw.price ?? null,
        rating: raw.rating ?? raw.avg_rating ?? null,
        availabilityType: raw.availability_type || "",
        workingFrom: raw.working_from,
        workingTo: raw.working_to,
        addressLine1: raw.address_line1 || "",
        addressLine2: raw.address_line2 || "",
        pincode: raw.pincode || "",
        mapLink: raw.google_map_link || null,
        lat: raw.latitude || null,
        lng: raw.longitude || null,
        category: "",
        subcategories: [],
    };

    if (type === "activity") {
        const photo = raw.profile_photo || fallbackImage("activity", raw.activity);
        return {
            ...base,
            name: raw.full_name || "",
            subtitle: raw.activity || "",
            shopName: raw.shop_center_name || "",
            city: raw.city?.name || "",
            photo,
            photos: [photo].filter(Boolean),
            category: raw.activity || "",
        };
    }

    if (type === "vendor") {
        const photo = raw.profile_photo || fallbackImage("vendor");
        return {
            ...base,
            name: raw.full_name || "",
            subtitle: raw.subcategory_name || raw.category_name || "",
            shopName: raw.business_name || "",
            city: raw.city_name || "",
            photo,
            photos: [photo].filter(Boolean),
            category: raw.category_name || "",
            subcategories: raw.subcategory_names || [],
        };
    }

    const photo = raw.shop_photo || fallbackImage("stall");
    return {
        ...base,
        name: raw.shop_name || "",
        subtitle: raw.badge || "",
        shopName: raw.shop_name || "",
        city: raw.city?.name || "",
        photo,
        photos: [raw.shop_photo, raw.shop_photo2, raw.shop_photo3, photo].filter(Boolean),
        category: raw.badge || "Nearby",
    };
}

const fetchersByType = {
    activity: fetchActivities,
    vendor: fetchVendors,
    stall: fetchNearStalls,
};

export async function fetchProviderById(type, id, locationOpts) {
    const fetcher = fetchersByType[type];
    if (!fetcher) throw new Error(`Unknown provider type: ${type}`);
    const list = await fetcher(locationOpts);
    const normalized = list.map((raw) => normalizeProvider(raw, type));
    const provider = normalized.find((p) => p.id === String(id));
    const similar = normalized.filter((p) => p.id !== String(id));
    return { provider, similar };
}

// ...keep everything already in the file, then add:

// ---- Category-detail endpoints (used when a category card is clicked) ----
export const fetchVendorsByCategory = (categoryId) =>
    getJSON("vendors-category", { category_id: categoryId });

export const fetchActivitiesByCategory = (categoryId) =>
    getJSON("activity-category", { category_id: categoryId });

// Maps a groupId (from mapApiCategory) to which detail endpoint/route to use.
export const GROUP_TO_PROVIDER_TYPE = {
    "home-services": "vendor",
    "learning-training": "activity",
    "sports-fitness": "activity",
};

const fetchersByCategoryType = {
    vendor: fetchVendorsByCategory,
    activity: fetchActivitiesByCategory,
};

// Fetches the full list for a category-detail page (CategoryListing.jsx).
export function fetchProvidersByCategory(type, categoryId) {
    const fetcher = fetchersByCategoryType[type];
    if (!fetcher) throw new Error(`Unknown provider type: ${type}`);
    return fetcher(categoryId);
}

// ---- Shared display helpers (category-detail API shape) ----
// These read the richer objects returned by vendors-category / activity-category,
// not the flatter list-endpoint shape normalizeProvider() handles above.

export const AVAILABILITY_LABELS = {
    weekdays: "Monday – Friday",
    weekends: "Saturday – Sunday",
    all_days: "All Days",
    everyday: "All Days",
};

export const getProviderName = (v) => v.business_name || v.shop_center_name || v.full_name || "Unnamed";

export const getContactPerson = (v) => v.full_name;

export const getProviderCity = (v) => v.city?.name || v.city_name || "";

export const getProviderCategoryName = (v) => v.category?.name || v.category_name || "";

export const getProviderSubcategories = (v) =>
    v.subcategory_names || (v.subcategories ? v.subcategories.map((s) => s.name) : []);

export const getProviderAddress = (v) =>
    [v.address_line1, v.address_line2, getProviderCity(v), v.pincode].filter(Boolean).join(", ");

export const formatAvailabilityLabel = (type) =>
    AVAILABILITY_LABELS[type] || (type ? type.replace(/_/g, " ") : "Contact for availability");

export const formatCurrency = (p) => {
    const n = Number(p);
    if (Number.isNaN(n)) return p;
    return `₹${n.toLocaleString("en-IN")}`;
};

export const getInitials = (name) =>
    (name || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();


