# Developer tips

Some useful commands:

```
# Use the local ng, if it's not globally installed
export PATH=$PATH:./node_modules/.bin
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build and deployment

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). On many deployments,
it requires pointing to Chrome binary:

```
export CHROME_BIN=`which chromium-browser`
npm test
```

Other potentially useful options are:

- `ng test --browsers ChromeHeadlessCI --watch false`
- `npm test --no-watch --no-progress --browsers=ChromeHeadlessCI`

`watch false` causes the tests to be run once, rather than sit in the background
and watch the files to be updated and run tests again.

## Running linter (eslint)

- `ng lint`
- `npm run lint`

## Dependency hell and some tips how to deal with it

- `npm update` (updates available dependencies in package-lock.json)
- `npm explain foo` (explains why foo is in the dependencies)
- `npm install --save core-js@^3` (upgrade corej-js to version 3.x)

## Angular upgrade

Upgrading one specific package: npm install @angular/material@^9.0.0

^ - means major version must much, minor and patch can be updated.

If dependencies are missing (e.g. after git clean -fxd), install them: `npm
install`. When trying to run ancient Angular 7, I had to upgrade to the latest
versions in 7 first: `npm install --force @angular/cdk@~7.3.7
@angular/material@7.3.7`.


- `npm list` - list installed packages

- `ng update` - tells what packages to upgrade

- `npm view @angular-devkit/build-angular versions` - list all available versions of @angular-devkit/build-angular

- `npm install --save-dev @angular-devkit/build-angular@0.11` - install specific version
Instead of doing the PATH export, one can use `npx ng ...` to run ng. `npx` is
smart enough to find `ng` locally.

You can also use @latest: `npm i typescript@latest --save-dev`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
This is currently not used in Hevelius.

## Obsolete tips

Experienced `error:03000086:digital envelope routines::initialization error`.
This was worked around with `export NODE_OPTIONS=--openssl-legacy-provider`.
This was fixed by migration to a more modern Angular.
