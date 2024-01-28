Passing connect string manually:
```yaml
  hass-dbstats:
    container_name: dbstats
    image: "ghcr.io/jehy/hass-dbstats:latest"
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - TZ=Europe/Moscow
      - DB_TYPE=postgres
      - DB_CONNECT_STRING=postgres://LOGIN:PASSWORD@172.17.0.1:5432/DATABASE
    volumes:
      - hass_config:/config:ro
      - /etc/localtime:/etc/localtime:ro
```
