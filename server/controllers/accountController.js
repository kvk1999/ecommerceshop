import bcrypt from "bcryptjs";
import User from "../models/User.js";

function sanitizeUserForResponse(user) {
  return {
    id: user.id,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    addresses: user.addresses,
  };
}

export async function getAccount(req, res) {
  const user = await User.findById(req.user._id);
  res.json({ user: sanitizeUserForResponse(user) });
}

export async function updateProfile(req, res) {
  const { name, fullName, email } = req.body;

  const user = await User.findById(req.user._id);

  if (email && email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(409).json({ message: "Email already in use" });
    }
    user.email = email.toLowerCase();
  }

  if (typeof name === "string" && name.trim()) user.name = name.trim();
  if (typeof fullName === "string") user.fullName = fullName.trim();

  await user.save();
  res.json({ user: sanitizeUserForResponse(user) });
}

export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  const user = await User.findById(req.user._id);
  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
}

// No file upload (multer) wired in this repo yet.
// Accept a profile image URL and persist it.
export async function updateProfileImage(req, res) {
  const { profileImageUrl } = req.body;
  if (!profileImageUrl || typeof profileImageUrl !== "string") {
    return res.status(400).json({ message: "profileImageUrl is required" });
  }

  const user = await User.findById(req.user._id);
  user.profileImageUrl = profileImageUrl;
  await user.save();

  res.json({ user: sanitizeUserForResponse(user) });
}

export async function addAddress(req, res) {
  const {
    label,
    fullName,
    line1,
    line2,
    city,
    postalCode,
    country,
    phone,
    isDefault,
  } = req.body;

  if (!line1 || !city || !postalCode) {
    return res.status(400).json({ message: "line1, city and postalCode are required" });
  }

  const user = await User.findById(req.user._id);

  const address = {
    label: label || "Home",
    fullName: fullName || "",
    line1,
    line2: line2 || "",
    city,
    postalCode,
    country: country || "IN",
    phone: phone || "",
    isDefault: Boolean(isDefault),
  };

  if (address.isDefault) {
    user.addresses = user.addresses.map((a) => ({ ...a.toObject(), isDefault: false }));
  }

  user.addresses.push(address);
  await user.save();

  res.json({ user: sanitizeUserForResponse(user) });
}

export async function updateAddress(req, res) {
  const { addressId } = req.params;
  const {
    label,
    fullName,
    line1,
    line2,
    city,
    postalCode,
    country,
    phone,
    isDefault,
  } = req.body;

  const user = await User.findById(req.user._id);
  const idx = user.addresses.findIndex((a) => a._id.toString() === addressId);
  if (idx === -1) return res.status(404).json({ message: "Address not found" });

  if (typeof line1 === "string") user.addresses[idx].line1 = line1;
  if (typeof line2 === "string") user.addresses[idx].line2 = line2;
  if (typeof city === "string") user.addresses[idx].city = city;
  if (typeof postalCode === "string") user.addresses[idx].postalCode = postalCode;
  if (typeof label === "string") user.addresses[idx].label = label;
  if (typeof fullName === "string") user.addresses[idx].fullName = fullName;
  if (typeof country === "string") user.addresses[idx].country = country;
  if (typeof phone === "string") user.addresses[idx].phone = phone;
  if (typeof isDefault === "boolean") {
    if (isDefault) {
      user.addresses = user.addresses.map((a) => {
        const obj = a.toObject();
        return { ...obj, isDefault: obj._id.toString() === addressId };
      });
    } else {
      user.addresses[idx].isDefault = false;
    }
  }

  await user.save();
  res.json({ user: sanitizeUserForResponse(user) });
}

export async function deleteAddress(req, res) {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);

  const before = user.addresses.length;
  user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);
  if (user.addresses.length === before) {
    return res.status(404).json({ message: "Address not found" });
  }

  // If default was deleted, ensure the first address becomes default.
  if (!user.addresses.some((a) => a.isDefault) && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json({ user: sanitizeUserForResponse(user) });
}

export async function setDefaultAddress(req, res) {
  const { addressId } = req.params;
  const user = await User.findById(req.user._id);

  const exists = user.addresses.some((a) => a._id.toString() === addressId);
  if (!exists) return res.status(404).json({ message: "Address not found" });

  user.addresses = user.addresses.map((a) => {
    const obj = a.toObject();
    return { ...obj, isDefault: obj._id.toString() === addressId };
  });

  await user.save();
  res.json({ user: sanitizeUserForResponse(user) });
}

export async function deleteAccount(req, res) {
  const { currentPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: "Password confirmation is required" });
  }

  const user = await User.findById(req.user._id);
  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    return res.status(401).json({ message: "Password confirmation failed" });
  }

  await user.deleteOne();

  // Client will clear token and redirect.
  res.json({ message: "Account deleted" });
}

