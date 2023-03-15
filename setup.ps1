docker pull mcr.microsoft.com/mssql/server:2022-latest | Out-Null;

docker stop dev-academy-db | Out-Null;

Start-Sleep 1;

docker rm dev-academy-db | Out-Null;

Start-Sleep 1;

docker rmi dev-academy-db-image:1.0.0 | Out-Null;

Start-Sleep 1;

docker volume rm dev-academy-db-volume | Out-Null;

Start-Sleep 1;

docker volume create dev-academy-db-volume | Out-Null;

Start-Sleep 1;

Set-Location (Join-Path $PSScriptRoot .\database);

docker build -t dev-academy-db-image:1.0.0 . | Out-Null;

docker run -v dev-academy-db-volume:/flatfiles --name dev-academy-db --hostname dev-academy-db -p 1433:1433 -d dev-academy-db-image:1.0.0 | Out-Null;

Start-Sleep 10;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -i /usr/init/setup.sql

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv -P /flatfiles | Out-Null

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv -P /flatfiles | Out-Null

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv -P /flatfiles | Out-Null

docker exec -t dev-academy-db curl https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv --output /flatfiles/stations.csv -L | Out-Null

Start-Sleep 1;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/stations.csv'" -Q 'EXEC BulkInsertStations @FilePath=$(CsvPath)' | Out-Null;

Start-Sleep 1;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-05.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)' | Out-Null;

Start-Sleep 1;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-06.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)' | Out-Null;

Start-Sleep 1;

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-07.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)' | Out-Null;

Start-Sleep 1;

Set-Location $PSScriptRoot
