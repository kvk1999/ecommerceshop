# TODO

## Wishlist + Products crash: normalize /products response
- [ ] Inspect any other client pages/components that set `products` from `api.get('/products')` without guarding.
- [ ] Update `client/src/pages/Products.jsx` to normalize `res.data` into an array before calling `map/filter`.
- [ ] Update `client/src/pages/Wishlist.jsx` similarly.
- [ ] Ensure categories/filters compute safely when products is not ready or empty.
- [ ] Quick sanity check by running the dev server / reloading the affected routes.

