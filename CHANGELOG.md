# [2.0.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.5...v2.0.0) (2025-07-05)


### Features

* **deps:** update eventsource ([c34523c](https://github.com/pawcoding/astro-integration-pocketbase/commit/c34523c7f4d4de1871497c5cac07a8d5b7211195))


### BREAKING CHANGES

* **deps:** This updates the eventsource package to v4.0.0,
which dropped support for Node.js v18. Since this is a peer dependency,
this package is also bumped a major version.

## [1.4.5](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.4...v1.4.5) (2025-06-19)

## [1.4.4](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.3...v1.4.4) (2025-06-18)

## [1.4.3](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.2...v1.4.3) (2025-04-18)

## [1.4.2](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.1...v1.4.2) (2025-04-05)


### Bug Fixes

* **middleware:** check content-type before processing responses to prevent content corruption ([#17](https://github.com/pawcoding/astro-integration-pocketbase/issues/17)) ([960db0a](https://github.com/pawcoding/astro-integration-pocketbase/commit/960db0a200cbf6e980e730685151e1e5494cf051))

## [1.4.1](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.4.0...v1.4.1) (2025-02-16)

# [1.4.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.3.0...v1.4.0) (2025-02-15)


### Bug Fixes

* **toolbar:** use correct link for viewing entry in PocketBase ([808fb19](https://github.com/pawcoding/astro-integration-pocketbase/commit/808fb1964bb773f02104aa09a4e641364a574c71))


### Features

* **toolbar:** add right click to force refresh collections ([30274e6](https://github.com/pawcoding/astro-integration-pocketbase/commit/30274e6b56fd1160425413825c52a1564c734461))

# [1.3.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.2.0...v1.3.0) (2025-02-01)


### Bug Fixes

* **toolbar:** improve PocketBase entry prop detection ([be2efbb](https://github.com/pawcoding/astro-integration-pocketbase/commit/be2efbb1bd5aebe9c7dd4cefab4e37062f58ebd7))
* **setup:** prevent duplicate setup after changing astro config ([147c167](https://github.com/pawcoding/astro-integration-pocketbase/commit/147c167348e2f39135eacde4523ac0cb91f6c78c))


### Features

* **realtime:** provide changed entry for realtime events ([ad00829](https://github.com/pawcoding/astro-integration-pocketbase/commit/ad00829f8e8e2687a5b02380fd91a390b78defea)), closes [#9](https://github.com/pawcoding/astro-integration-pocketbase/issues/9)

# [1.2.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.1.0...v1.2.0) (2025-01-25)


### Features

* **realtime:** provide advanced settings for realtime subscriptions ([0cb3ee8](https://github.com/pawcoding/astro-integration-pocketbase/commit/0cb3ee811ad88c4973b020128bd301a72278e78e)), closes [pawcoding/astro-integration-pocketbase#10](https://github.com/pawcoding/astro-integration-pocketbase/issues/10)

# [1.1.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v1.0.0...v1.1.0) (2025-01-11)


### Features

* **realtime:** only reload collection with changes ([ba8c67e](https://github.com/pawcoding/astro-integration-pocketbase/commit/ba8c67e94eb03633e364205b75f7f3d85796e57b)), closes [#5](https://github.com/pawcoding/astro-integration-pocketbase/issues/5)

# [1.0.0](https://github.com/pawcoding/astro-integration-pocketbase/compare/v0.2.0...v1.0.0) (2025-01-11)


### Features

* **realtime:** add realtime refresh for collections ([17e8124](https://github.com/pawcoding/astro-integration-pocketbase/commit/17e81244c07747077226f8c673c63f4e6a8ea402))
* **toolbar:** add toggle to disable realtime updates ([4660002](https://github.com/pawcoding/astro-integration-pocketbase/commit/466000247d0a89dec0d80be7057a49ec1eab073b))
* **release:** release first stable version ([47020c6](https://github.com/pawcoding/astro-integration-pocketbase/commit/47020c69e6585a611e68ba3f1c60b2c203fc2e0f))
* **realtime:** use superuser credentials for realtime updates ([1be1ec7](https://github.com/pawcoding/astro-integration-pocketbase/commit/1be1ec7fc85c90a8ab20dc7851ffc3d76f7d7e60))


### BREAKING CHANGES

* **release:** This is the first stable release of this package.
