# Developer tips

Some useful commands:

```
# Work around the old SSL problem (will be solved with Angular update)
export NODE_OPTIONS=--openssl-legacy-provider
# Use the local ng, if it's not globally installed
export PATH=$PATH:./node_modules/.bin
```

# Running tests

- `ng test --browsers ChromeHeadlessCI --watch false`
- `npm test --no-watch --no-progress --browsers=ChromeHeadlessCI`

`watch false` causes the tests to be run once, rather than sit in the background and watch the files to be updated and run
tests again.

# Running linter (eslint)

- `ng lint`
- `npm run lint`

# Upgrading angular versions

- `ng update` - tells what packages to upgrade

- `npm view @angular-devkit/build-angular versions` - list all available versions of @angular-devkit/build-angular

- `npm install --save-dev @angular-devkit/build-angular@0.11` - install specific version
Instead of doing the PATH export, one can use `npx ng ...` to run ng. `npx` is
smart enough to find `ng` locally.


# Running tests

```
export CHROME_BIN=chromium
npm test
```
