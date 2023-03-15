docker pull mcr.microsoft.com/mssql/server:2022-latest | Out-Null;

docker stop dev-academy-db | Out-Null;

docker remove dev-academy-db | Out-Null;

docker volume rm dev-academy-db-volume | Out-Null;

docker volume create dev-academy-db-volume | Out-Null;

docker rmi dev-academy-db-image:1.0.0 | Out-Null;

Set-Location (Join-Path $PSScriptRoot .\database);

docker build -t dev-academy-db-image:1.0.0 . | Out-Null;

docker run -v dev-academy-db-volume:/flatfiles --name dev-academy-db --hostname dev-academy-db -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=E14DxqSMBq" -p 1433:1433 -d dev-academy-db-image:1.0.0 | Out-Null;