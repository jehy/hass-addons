# Changelog

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
