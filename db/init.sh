#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE IF NOT EXISTS template (
        id SERIAL PRIMARY KEY,
        title TEXT,
        overview TEXT,
        release_date DATE, 
        vote_average REAL,
        poster_path TEXT
    );
EOSQL

for arquivo in /arquivos_csv/*.csv
do
    nome_tabela=`basename $arquivo .csv`
    echo "Criando tabela $nome_tabela a partir do arquivo $arquivo"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE TABLE IF NOT EXISTS $nome_tabela (LIKE template);
        COPY $nome_tabela FROM '$arquivo' WITH CSV HEADER;
EOSQL
done
