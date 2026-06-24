// Import all category icons from assets
import iconBagsWallets from "../assets/icon-bags-wallets.svg";
import iconElectronics from "../assets/icon-electronics.svg";
import iconFootwear from "../assets/icon-footwear.svg";
import iconHeadphones from "../assets/icon-headphones.svg";
import iconPerfumes from "../assets/icon-perfumes.svg";
import iconSmartWatches from "../assets/icon-smartwatches.svg";

const defaultBackendUrl = "http://localhost:5000";

function getBackendUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === "string" && envUrl.length > 0) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    const origin = window.location.origin || "";

    if (host.includes("onrender.com")) {
      return "http://ecommerceshop-hgbi.onrender.com";
    }

    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return origin;
    }
  }

  return defaultBackendUrl;
}

const BACKEND_URL = getBackendUrl();

// Map icon names to imported assets
const ICON_MAP = {
  "icon-bags-wallets.svg": iconBagsWallets,
  "icon-electronics.svg": iconElectronics,
  "icon-footwear.svg": iconFootwear,
  "icon-headphones.svg": iconHeadphones,
  "icon-perfumes.svg": iconPerfumes,
  "icon-smartwatches.svg": iconSmartWatches,
  // Alias names for server responses and shorter variants
  "bags-wallets": iconBagsWallets,
  "electronics": iconElectronics,
  "electronic": iconElectronics,
  "phone": iconElectronics,
  "mobile": iconElectronics,
  "smartphone": iconElectronics,
  "device": iconElectronics,
  "footwear": iconFootwear,
  "headphones": iconHeadphones,
  "perfumes": iconPerfumes,
  "smartwatches": iconSmartWatches,
  "watch": iconSmartWatches,
  "smartwatch": iconSmartWatches,
  "bag": iconBagsWallets,
  "bags": iconBagsWallets,
  "wallet": iconBagsWallets,
  "wallets": iconBagsWallets,
  "smart-watch": iconSmartWatches,
  "smart watch": iconSmartWatches,
  "perfume": iconPerfumes,
  "shoe": iconFootwear,
  "shoes": iconFootwear,
  "earbuds": iconHeadphones,
  "speaker": iconElectronics,
};

export function normalizePublicPath(p) {
  if (!p) return p;

  if (/^https?:\/\//i.test(p)) {
    return p;
  }

  return p
    .replace(/^\/?public\//, "")
    .replace(/^\/?image\//, "")
    .replace(/^\/?images\//, "")
    .replace(/^\/?uploads\//, "");
}

export function getImageCandidates(image) {
  if (!image) return [];

  // Direct external URL
  if (/^https?:\/\//i.test(image)) {
    return [image];
  }

  const normalized = normalizePublicPath(image);
  const lower = normalized.toLowerCase();
  const candidates = [];

  const assetMatch =
    ICON_MAP[lower] || ICON_MAP[lower.replace(/\.svg$/, "")];

  if (assetMatch) {
    candidates.push(assetMatch);
  }

  const cleanPath = normalized.replace(/^\/+/, "");

  if (cleanPath) {
    const uploadName = cleanPath.replace(/^uploads\//, "");
    candidates.push(`${BACKEND_URL}/uploads/${uploadName}`);
    candidates.push(`${BACKEND_URL}/public/uploads/${uploadName}`);
    candidates.push(`${BACKEND_URL}/public/${cleanPath}`);
    candidates.push(`${BACKEND_URL}/image/${cleanPath}`);
    candidates.push(`${BACKEND_URL}/${cleanPath}`);
  }

  return [...new Set(candidates)];
}
