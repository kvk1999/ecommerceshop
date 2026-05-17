# ShopSphere Fullstack

Blueprint-inspired ecommerce application with:

- `client/`: React + Vite + Tailwind frontend
- `server/`: Express backend with JSON file persistence

## Run

Server:

```bash
cd server
npm install
npm run dev
```

Client:

```bash
cd client
npm install
npm run dev
```

## Notes

- The original blueprint asked for MongoDB + Mongoose and JWT authentication.
- This implementation uses guest sessions plus JSON persistence so it runs immediately without database setup.
- Product browsing, search, filter, wishlist, cart, checkout, and order history are fully wired end to end.
