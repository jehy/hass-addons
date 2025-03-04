# Changelog

## 0.5.12
 - Bump base image to 0.3.23 (bumps driver versions)
 - Bump base nodejs image to 0.2.5
 - Allow using database from `share` folder

## 0.5.11

- Bump base image to 0.3.22 to fix https://github.com/jehy/hass-addons/issues/8 (mysql table size)

## 0.5.10

- Bump base image to 0.3.21 to fix https://github.com/jehy/hass-addons/issues/8 (mysql table rows)
- Bump HA node container version to 0.2.4

## 0.5.8

- Small chart fixes

## 0.5.7

- Replace chart library. It looks nicer now!

## 0.5.6

- Fix misleading header name

## 0.5.5

- Bump base image to 0.3.11 to speed up attributes count

## 0.5.4

- Bump base image to 0.3.10 to set max execution time to ovoid eternal background tasks in database

## 0.5.3

- Bump base image to 0.3.9 to consume less RAM

## 0.5.2

- Update nodejs binary name to fix bug in aarch64 build

## 0.5.1

- Update base node image to fix bug in aarch64 build

## 0.5.0

- Add support for multiple platforms (aarch64, armv7)

## 0.4.6

- Fix loading named config

## 0.4.5

- UI improvements

## 0.4.3

- Add sorting and fix MB calculation for sqlite

## 0.4.1

- Add options schema

## 0.4.0

- Ignore non valid YAML
- Use connection string from options if provided

## 0.3.7

- Fix handling multiple secrets

## 0.3.6

- Fix failure when folder or file from config does not exist

## 0.3.5

- Change config loader, support `!include`

## 0.3.4

- First stable public release
