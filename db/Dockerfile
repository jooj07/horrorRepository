FROM postgres:13.0


COPY ./init.sh /docker-entrypoint-initdb.d/
COPY ./arquivos_csv/ /arquivos_csv/

EXPOSE 5432

RUN chmod 755 /docker-entrypoint-initdb.d/init.sh

# docker run --name meudbmovies -p 5433:5432 -e POSTGRES_PASSWORD=123456 -it moviesdb/moviesdb
