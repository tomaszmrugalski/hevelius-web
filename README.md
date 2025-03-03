![CodeQL](https://github.com/tomaszmrugalski/hevelius-web/actions/workflows/github-code-scanning/codeql/badge.svg)
![NodeJS](https://github.com/tomaszmrugalski/hevelius-web/actions/workflows/node.js.yml/badge.svg)

# Hevelius

![Hevelius](src/assets/images/hevelius.jpg)

This is a web interface (web app) for Hevelius, an astronomy processing software and observatory management system.
It's in the very early stages of development. It requires [hevelius backend](https://github.com/tomaszmrugalski/hevelius-backend)
to be running. There's also the [the runner component](https://github.com/tomaszmrugalski/hevelius-runner) that should be
running on a machine that is controlling the telescope. The hevelius-web is not interacting with the runner directly.

The software is implemented in Angular and Typescript.

## Status

As of March 2025, the following features are available:

- Login
- List of tasks
- Adding new tasks

The interface is responsive and should work on any device. It was tested on desktop (Ubuntu 24, Windows), and mobile (iPhone 14 Pro).

## Documentation

- [Installation](doc/install.md)
- [Developer's Guide](doc/devel.md)
