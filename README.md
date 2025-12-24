# DogComponents (static PWA demo)

Small client-side demo using Web Components that fetches dog breeds + photos from the public Dog CEO API.

## Deploy (Cloudflare Pages)

- **Project type**: static site (no server, no database)
- **Build command**: *(none)*
- **Output directory**: `/` (repo root)

After deploy, visit your Pages URL. The app also registers a service worker to enable caching/offline behavior.

## Local run

Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

