# Installation

You need nodejs. The code is using Angular 18, so the oldest nodejs supported is 16.x. You can install it
whatever way works for you. A simple installation is:

```curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -```

After getting the sources, you need to install all dependencies: `npm install`. Once installed, the code can be
run with `ng serve`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any
of the source files. `ng` is a command line tool from angular. If it's missing, use the following
trick: `export PATH=$PATH:./node_modules/.bin`.

# Deployment

You need to have hevelius backend running. See https://github.com/tomaszmrugalski/hevelius-backend for details.

Edit `src/hevelius.ts` to point to your running backend, e.g.

```typescript
    // Make sure there is no trailing slash
    static apiUrl = 'https://hevelius.borowka.space:5001/api';
```

Then make `ng build`.

The copy over `dist/hevelius/browser/*` to your running server. You might want to
see [example NGINX config](nginx-deploy.md) for some tips how to deploy on NGINX.
This is just an example. The app should work on any other web server.
