// Import all category icons from assets
import iconBagsWallets from "../assets/icon-bags-wallets.svg";
import iconElectronics from "../assets/icon-electronics.svg";
import iconFootwear from "../assets/icon-footwear.svg";
import iconHeadphones from "../assets/icon-headphones.svg";
import iconPerfumes from "../assets/icon-perfumes.svg";
import iconSmartWatches from "../assets/icon-smartwatches.svg";

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

  return p.replace(/^\/?public\//, "").replace(/^\/?image\//, "").replace(/^\/?images\//, "");
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

  let cleanPath = normalized.replace(/^\/+/, "");

  if (cleanPath) {
    candidates.push(`/public/${cleanPath}`);
    candidates.push(`/image/${cleanPath}`);
    candidates.push(`/${cleanPath}`);
  }

  return [...new Set(candidates)];
}
