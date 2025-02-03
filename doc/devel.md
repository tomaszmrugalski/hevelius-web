# Developer tips

Some useful commands:

```
# Use the local ng, if it's not globally installed
export PATH=$PATH:./node_modules/.bin
```


# Running tests

- `ng test --browsers ChromeHeadlessCI --watch false`
- `npm test --no-watch --no-progress --browsers=ChromeHeadlessCI`

`watch false` causes the tests to be run once, rather than sit in the background
and watch the files to be updated and run tests again.

If there are errors about chrome-headless not being found, this can help:
export CHROME_BIN=/snap/bin/chromium

# Running linter (eslint)

- `ng lint`
- `npm run lint`

# Dependency hell and some tips how to deal with it

- `npm update` (updates available dependencies in package-lock.json)
- `npm explain foo` (explains why foo is in the dependencies)
- `npm install --save core-js@^3` (upgrade corej-js to version 3.x)

# Upgrading angular versions

- `npm list` - list installed packages

- `ng update` - tells what packages to upgrade

- `npm view @angular-devkit/build-angular versions` - list all available versions of @angular-devkit/build-angular

- `npm install --save-dev @angular-devkit/build-angular@0.11` - install specific version
Instead of doing the PATH export, one can use `npx ng ...` to run ng. `npx` is
smart enough to find `ng` locally.

You can also use @latest: `npm i typescript@latest --save-dev`


# Running tests

```
export CHROME_BIN=chromium
npm test
```
