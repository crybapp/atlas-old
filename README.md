
![Cryb OSS](.github/cryb.png "Cryb OSS Logo")

_**Atlas** <sup>Beta</sup> - Xen orchestration_

[![GitHub contributors](https://img.shields.io/github/contributors/crybapp/atlas)](https://github.com/crybapp/atlas/graphs/contributors) [![License](https://img.shields.io/github/license/crybapp/atlas)](https://github.com/crybapp/atlas/blob/master/LICENSE) [![Patreon Donate](https://img.shields.io/badge/donate-Patreon-red.svg)](https://patreon.com/cryb)

## Docs
* [Info](#info)
    * [Status](#status)
* [Codebase](#codebase)
    * [Folder Structure](#folder-structure)
    * [First time setup](#first-time-setup)
        * [Installation](#installation)
    * [Running the app locally](#running-the-app-locally)
        * [Background services](#background-services)
        * [Starting @cryb/atlas](#starting-@cryb/atlas)
* [Questions / Issues](#questions--issues)

## Info
`@cryb/atlas` is the service used to handle Xen instances.

`@cryb/xen` instances connected and configured through an `@cryb/atlas` instance will be assigned to rooms by `@cryb/portals`.

### Status
`@cryb/atlas` has been actively developed since December 2019.

## Codebase
The codebase for `@cryb/atlas` is written in JavaScript, utilising TypeScript and Node.js. Express.js is used for our REST API, while the WebSocket atlas uses the `ws` module.

MongoDB is used as the primary database, while Redis is used for cache and PUB/SUB.

### Folder Structure
```
cryb/atlas/
└──┐ src # The core source code
   ├── config # Config files for Redis, Passport, etc
   ├── controllers # Our REST route controller files
   ├── drivers # Methods used to talk to other microservices, such as @cryb/portals
   ├── models # Models for our a data types, such as users and rooms
   ├── schemas # Mongoose schema files
   ├── server # Our Express.js setup
   ├── services # Abstractions for Oauth2, etc
   └── utils # Helper methods
```

### First time setup
First, clone the `@cryb/atlas` repository locally:

```
git clone https://github.com/crybapp/atlas.git
```

#### Installation
The following services need to be installed for `@cryb/atlas` to function:

* MongoDB
* Redis

We recommend that you run the following services alongside `@cryb/atlas`, but it's not required.
* `@cryb/xen`
* `@cryb/portals`

You also need to install the required dependencies by running `yarn`.

Ensure that `.env.example` is either copied and renamed to `.env`, or is simply renamed to `.env`.

In this file, you'll need some values. Documentation is available in the `.env.example` file.

### Running the app locally

#### Background Services
Make sure that you have installed MongoDB and Redis, and they are both running locally on port 27017 and 6379 respectively.

The command to start MongoDB is `mongod`, and the command to start Redis is `redis-server`.
Most Linux distros will have those packaged, and will start automatically with your system.

If you're developing a feature that requires the VM infrastructure, then make sure `@cryb/xen` and `@cryb/portals` are running.

#### Starting @cryb/atlas
To run `@cryb/atlas` in development mode, run `yarn dev`.

It is recommended that in production you run `yarn build`, then `yarn start`.

## Questions / Issues
If you have an issues with `@cryb/atlas`, please either open a GitHub issue, contact a maintainer or join the [Cryb Discord Server](https://discord.gg/ShTATH4) and ask in #tech-support.