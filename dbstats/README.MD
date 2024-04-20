# Home Assistant Add-on: DbStats

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armv7 Architecture][armv7-shield]

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg

This addon allows to check database usage and find out what's eating up your space.

Web page with report will look like [this](screen.png).

Addon will try to autodetect your database options, but if it fails, you can use configuration page and add `connectionString` manually.


## Installation on HAOS/supervised

Navigate to the [main repository page](https://github.com/jehy/hass-addons/tree/master)
and push the button to add it to HA, or add it manually:

1. Navigate to addons page on your HA installation
2. Press three dots in the top right corner
3. Add repository `https://github.com/jehy/hass-addons` to addon repositories
4. Install addon from addons page
5. Start addon and visit it's page

## Using without supervisor or HAOS:

You can read about it [here](https://github.com/jehy/hass-dbstats).
