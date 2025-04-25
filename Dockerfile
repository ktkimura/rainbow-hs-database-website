FROM mysql:8

COPY ./database /docker-entrypoint-initdb.d/

# Expose default MySQL port
EXPOSE 3306