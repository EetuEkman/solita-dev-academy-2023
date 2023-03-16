FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA Y

ENV MSSQL_SA_PASSWORD=E14DxqSMBq

ENV SA_PASSWORD=E14DxqSMBq

USER root

RUN mkdir -p /usr/init

COPY ./setup.sql /usr/init

RUN chmod +x /usr/init/setup.sql

RUN apt update -y && apt install curl -y