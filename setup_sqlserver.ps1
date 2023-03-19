docker pull mcr.microsoft.com/mssql/server:2022-latest

docker stop dev-academy-db | Out-Null

docker stop dev-academy-server | Out-Null

docker stop dev-academy-client | Out-Null

Start-Sleep 1

docker rm dev-academy-db | Out-Null

docker rm dev-academy-server | Out-Null

docker rm dev-academy-client | Out-Null

Start-Sleep 1

docker network rm dev-academy-network | Out-Null

#docker volume rm dev-academy-db-volume | Out-Null

docker rmi dev-academy-db-image:1.0.0 | Out-Null

docker rmi dev-academy-server-image:1.0.0 | Out-Null

docker rmi dev-academy-server-client-image:1.0.0 | Out-Null

Start-Sleep 1

docker network create --driver bridge dev-academy-network | Out-Null

#docker volume create dev-academy-db-volume

Set-Location (Join-Path $PSScriptRoot database)

docker build -t dev-academy-db-image:1.0.0 .

docker run --name dev-academy-db -p 1433:1433 --detach --network dev-academy-network -v dev-academy-db-volume:/flatfiles dev-academy-db-image:1.0.0 | Out-Null

Start-Sleep 15

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -i /usr/init/setup.sql

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv -P /flatfiles

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv -P /flatfiles

docker exec -t dev-academy-db wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv -P /flatfiles

docker exec -t dev-academy-db curl https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv --output /flatfiles/stations.csv -L

Start-Sleep 1

# .CSV-files contain ä's and ö's.

# Bulk insert with UTF-8 codepage 65001 is not supported on Linux.

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/stations.csv'" -Q 'EXEC BulkInsertStations @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-05.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-06.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -P E14DxqSMBq -U sa -d citybikes -v CsvPath="'/flatfiles/2021-07.csv'" -Q 'EXEC BulkInsertJourneys @FilePath=$(CsvPath)'

<#

bcp bulk copy program doesn't understand field quotes, e.g.

Id = 5, Name = "Aalto university, tietotie", Address = Tietotie 4

becomes

Id, Name, address
Id = 5, Name = "Aalto university, Address = tietotie", extra column causing the error: Tietotie 4

#docker exec -t dev-academy-db /opt/mssql-tools/bin/bcp stations in '/flatfiles/stations.csv' -S . -U sa -P E14DxqSMBq -d citybikes -c -C '"65001"' -F 2 -r '"0x0a"' -t `,

#docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -S . -P E14DxqSMBq -U sa -d citybikes -Q 'EXEC BulkInsertStationsFromTempTable'

#docker exec -t dev-academy-db /opt/mssql-tools/bin/bcp stations in '/flatfiles/2021-05.csv' -S . -U sa -P E14DxqSMBq -d citybikes -c -C '"65001"' -F 2 -r '"0x0a"' -t '","'

#docker exec -t dev-academy-db /opt/mssql-tools/bin/bcp stations in '/flatfiles/2021-06.csv' -S . -U sa -P E14DxqSMBq -d citybikes -c -C '"65001"' -F 2 -r '"0x0a"' -t '","'

#docker exec -t dev-academy-db /opt/mssql-tools/bin/bcp stations in '/flatfiles/2021-07.csv' -S . -U sa -P E14DxqSMBq -d citybikes -c -C '"65001"' -F 2 -r '"0x0a"' -t '","'

#docker exec -t dev-academy-db /opt/mssql-tools/bin/sqlcmd -S . -P E14DxqSMBq -U sa -d citybikes -Q 'EXEC BulkInsertJourneysFromTempTable'

#>

Set-Location (Join-Path $PSScriptRoot solita-dev-academy-2023-server)

docker build -t dev-academy-server-image:1.0.0 .

docker run --name dev-academy-server -p 5222:80 --detach --network dev-academy-network dev-academy-server-image:1.0.0 | Out-Null;

Set-Location (Join-Path $PSScriptRoot solita-dev-academy-2023-client)

docker build -t dev-academy-client-image:1.0.0 .

docker run --name dev-academy-client -p 5000:80 --detach dev-academy-client-image:1.0.0 | Out-Null;

Write-Host "Done. Open your browser at http://localhost:5000" -ForegroundColor DarkYellow

Set-Location $PSScriptRoot
