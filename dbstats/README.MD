# Home Assistant Add-on: DbStats

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports armhf Architecture][armhf-shield]
![Supports armv7 Architecture][armv7-shield]
![Supports i386 Architecture][i386-shield]

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
[i386-shield]: https://img.shields.io/badge/i386-yes-green.svg

This addon allows to check database usafe and find out what's eating up your space.

Web page with report will look like [this](screen.png).


## Installation on HAOS/supervised
1. Navigate to addons page on your HA instalaiton
2. Press three dots in the top right corner
3. Add repository `https://github.com/jehy/hass-addons` to addon repositories
4. Install addon from addons page
5. Start addon and visit it's page

## Using without supervisor or HAOS:

You can read about it [here](https://github.com/jehy/hass-dbstats).
