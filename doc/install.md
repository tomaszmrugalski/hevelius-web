# Installation

You need nodejs. The code is using Angular 16, so the oldest nodejs supported is 16.x. You can install it
whatever way works for you. A simple installation is:

```curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -```

After getting the sources, you need to install all dependencies: `npm install`. Once installed, the code can be
run with `ng serve`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any
of the source files. `ng` is a command line tool from angular. If it's missing, use the following
trick: `export PATH=$PATH:./node_modules/.bin`.

# Troubleshooting

Experienced `error:03000086:digital envelope routines::initialization error`.
This was worked around with `export NODE_OPTIONS=--openssl-legacy-provider`.
This was fixed by migration to a more modern Angular.

## Angular upgrade

Upgrading one specific package: npm install @angular/material@^9.0.0

^ - means major version must much, minor and patch can be updated.

If dependencies are missing (e.g. after git clean -fxd), install them: `npm
install`. When trying to run ancient Angular 7, I had to upgrade to the latest
versions in 7 first: `npm install --force @angular/cdk@~7.3.7
@angular/material@7.3.7`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## TODO

- remove unused modules from material.modules.ts (see
  https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module
  for context)
