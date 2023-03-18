FROM postgres
ENV POSTGRES_USER dev-academy
ENV POSTGRES_PASSWORD Q62gmPqUiUHLn9lqdH3q
ENV POSTGRES_DB citybikes
COPY init.sql /docker-entrypoint-initdb.d/
RUN apt-get update -y
RUN apt-get install -y wget
RUN apt-get install -y curl