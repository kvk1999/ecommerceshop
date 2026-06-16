import User from "../models/User.js";
import Order from "../models/Order.js";

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };
}

export async function listUsersWithOrderHistory(req, res) {
  try {
    const completeUsersMatrix = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $project: {
          // User identity
          _id: 1,
          name: 1,
          fullName: 1,
          email: 1,
          role: 1,
          profileImageUrl: 1,

          // CRITICAL: explicitly project timestamps so they survive aggregation
          createdAt: 1,
          updatedAt: 1,

          // Order metrics for dashboard usage
          orders: {
            $map: {
              input: "$orders",
              as: "o",
              in: {
                id: "$$o._id",
                createdAt: "$$o.createdAt",
                status: "$$o.status",
                total: "$$o.total",
                discountPercent: "$$o.discountPercent",
                discountAmount: "$$o.discountAmount",
                cancellationReason: "$$o.cancellationReason",
                items: {
                  $map: {
                    input: { $ifNull: ["$$o.items", []] },
                    as: "it",
                    in: {
                      productId: "$$it.productId",
                      title: "$$it.title",
                      quantity: "$$it.quantity",
                      lineTotal: "$$it.lineTotal",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        // newest signups first
        $sort: { createdAt: -1 },
      },
    ]);

    // Normalize output to match existing frontend expectations
    res.json(
      completeUsersMatrix.map((doc) => ({
        user: {
          id: doc._id?.toString?.() || doc._id,
          name: doc.name,
          fullName: doc.fullName,
          email: doc.email,
          role: doc.role,
          profileImageUrl: doc.profileImageUrl,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
        orders: (doc.orders || []).map((o) => ({
          id: o.id?.toString?.() || o.id,
          createdAt: o.createdAt,
          status: o.status,
          total: o.total,
          discountPercent: o.discountPercent,
          discountAmount: o.discountAmount,
          cancellationReason: o.cancellationReason,
          items: o.items || [],
        })),
      }))
    );
  } catch (error) {
    console.error("listUsersWithOrderHistory aggregate error:", error);
    res.status(500).json({ message: "Failed to compile administrative registry metrics" });
  }
}

export async function promoteToAdmin(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = "admin";
  await user.save();

  res.json({ user: sanitizeUser(user) });
}

// POST /api/admin/users/onboard
// Admin creates a user matching the User schema and returns createdAt/updatedAt for dashboard.
export async function onboardUser(req, res) {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    // Import bcrypt lazily to avoid changing top-of-file imports unless needed.
    const bcrypt = await import("bcryptjs");

    const emailClean = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: emailClean });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name: String(name).trim(),
      fullName: String(name).trim(),
      email: emailClean,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "customer",
      wishlist: [],
      cart: [],
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("onboardUser error:", error);
    res.status(500).json({ message: "Internal configuration failure: Could not write credentials to database container." });
  }
}

// PATCH /admin/users/:id/toggle-role
export async function toggleUserRole(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User account not found" });

    user.role = user.role === "admin" ? "customer" : "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: `Role successfully changed to ${user.role}`,
      role: user.role,
    });
  } catch (error) {
    console.error("Error toggling user role:", error);
    res.status(500).json({ message: "Failed to update user security clearance role" });
  }
}





