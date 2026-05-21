# Admin dashboard + secure auth — TODO

## Backend
- [ ] Add RBAC: `role` field to `server/models/User.js`
- [ ] Ensure `/api/auth/me` returns `role` to frontend
- [ ] Add `requireAdmin` middleware (admin-only guard)
- [x] Lock existing product write endpoints to admin-only (per user decision:

  - [ ] `POST /api/products`
  - [ ] `PUT /api/products/:id`
  - [ ] `DELETE /api/products/:id`
- [ ] Add admin overview endpoint: `GET /api/admin/overview`
  - [ ] totalUsers, totalOrders, totalRevenue, totalProducts
- [ ] Add admin analytics endpoint: `GET /api/admin/analytics`
  - [ ] datasets for charts
- [ ] Add admin order management endpoints
  - [ ] `GET /api/admin/orders` (filter by status + search)
  - [ ] `PATCH /api/admin/orders/:orderId/status`
- [ ] Add admin customer management endpoint
  - [ ] `GET /api/admin/customers`
- [ ] Add inventory/category support endpoints
  - [ ] stock updates (if not covered by product updates)
  - [ ] categories CRUD or derived categories
- [ ] Add image upload endpoint (multer) and product image URL persistence

## Frontend
- [ ] Add protected `/admin` route + role-based gating using `AuthContext`
- [ ] Create admin layout with responsive sidebar navigation
- [ ] Implement dashboard overview cards
- [ ] Implement analytics charts
- [ ] Implement inventory management UI (stock edit)
- [ ] Implement category management UI
- [ ] Implement product add/edit/delete UI + image upload
- [ ] Implement customer management UI (search/filter)
- [ ] Implement order management UI with status tabs:
  - [ ] Pending
  - [ ] Cancelled
  - [ ] Shipped
  - [ ] Delivered
  - [ ] search/filter + recent tracking
- [ ] Add notifications section
- [ ] Ensure complete dark/light mode support in admin UI (reuse existing Tailwind dark mode)

## Verification
- [ ] Run server + client
- [ ] Seed/create an admin user for testing
- [ ] Verify non-admin cannot access admin endpoints or write product APIs
- [ ] Validate all filters/search and charts render

## User account dropdown + My Account (requested)
- [ ] Replace Navbar logged-in icon/button with dropdown: My Account, Orders, Wishlist, Logout
- [ ] Add protected route/page: `/account` (MyAccount)
- [ ] Backend: extend `User` model with profile image + address book + default address marker
- [ ] Backend: implement account APIs (get/update profile, change password, upload profile image OR accept image URL, address CRUD + default)
- [ ] Backend: implement secure `DELETE /api/account` requiring password confirmation
- [ ] Frontend: implement MyAccount page UI
- [ ] Frontend: implement address add/edit/delete + set default
- [ ] Frontend: implement password change UI + profile image upload/change
- [ ] Frontend: implement delete account confirmation modal (must confirm before deletion)
- [ ] Wire logout and post-delete redirect (to /)
- [ ] Test end-to-end: dropdown navigation + CRUD + deletion confirmation
