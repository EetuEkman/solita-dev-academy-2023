docker pull mcr.microsoft.com/mssql/server:2022-latest

docker stop dev-academy-db

docker stop dev-academy-server

Start-Sleep 1;

docker rm dev-academy-db

docker rm dev-academy-server

Start-Sleep 1;

docker network rm dev-academy-network

docker volume rm dev-academy-db-volume

docker rmi dev-academy-db-image:1.0.0

docker rmi dev-academy-server-image:1.0.0

Start-Sleep 1;

docker network create --driver bridge dev-academy-network

docker volume create dev-academy-db-volume

Start-Sleep 1;

Set-Location (Join-Path $PSScriptRoot .\database);

docker build -t dev-academy-db-image:1.0.0 .

docker run --name dev-academy-db -p 1433:1433 --detach --network dev-academy-network -v dev-academy-db-volume:/flatfiles dev-academy-db-image:1.0.0

Start-Sleep 10;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -i /usr/init/setup.sql

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv -P /flatfiles

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv -P /flatfiles

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv -P /flatfiles

docker exec -t dev-academy-db curl https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv --output /flatfiles/stations.csv -L

Start-Sleep 1;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/stations.csv'" -Q 'EXEC BulkInsertStations @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-05.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-06.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-07.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

Set-Location (Join-Path $PSScriptRoot solita-dev-academy-2023-server);

docker build -t dev-academy-server-image:1.0.0 .

docker run --name dev-academy-server -p 5222:80 --detach --network dev-academy-network dev-academy-server-image:1.0.0

Set-Location $PSScriptRoot;
