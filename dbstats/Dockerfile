ARG BUILD_FROM=ghcr.io/hassio-addons/base-nodejs:0.2.1
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on
RUN apk update \
    && apk add --no-cache --virtual .build-dependencies \
            build-base=0.5-r3 \
            linux-headers=6.5-r0 \
            py3-pip=23.3.1-r0 \
            python3-dev=3.11.9-r0 \
    && apk add sqlite \
    && apk add --no-cache \
        nginx=1.24.0-r15 \
    && rm -f -r /etc/nginx

# Copy root file system
COPY rootfs /

COPY --from=ghcr.io/jehy/hass-dbstats:0.3.8 /usr/src/app /usr/src/app
COPY --from=ghcr.io/jehy/hass-dbstats:0.3.8 /var/www/html /var/www/html
WORKDIR /usr/src/app
RUN npm ci --omit=dev ## need to reinstall deps because they can be binary incompatible

# Build arguments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Labels
LABEL \
    io.hass.name="${BUILD_NAME}" \
    io.hass.description="${BUILD_DESCRIPTION}" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Jehy" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="Jehy" \
    org.opencontainers.image.authors="Jehy" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://jehy.ru" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}


EXPOSE 3000
EXPOSE 6060
