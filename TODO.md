# TODO - Mobile dashboard layout overflow fix

- [ ] Identify the exact Tailwind classes that create fixed-size/overflow constraints in `client/src/pages/AdminDashboard.jsx`.
- [ ] Patch mobile table wrappers to prevent horizontal overflow and email/name strings from forcing layout width.
- [ ] Replace any restrictive container height behavior (if present) with content-driven sizing.
- [ ] Ensure long emails wrap or ellipsize using `break-all/ break-words / truncate` (no single-line overflow).
- [ ] Verify the admin dashboard tabs: Overview / Products / Orders / Customers do not create double scrollbars on mobile.
- [ ] Run the client build/lint (if available) to ensure no syntax issues.

