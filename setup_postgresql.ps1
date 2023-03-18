$env:DOCKER_SCAN_SUGGEST="false"

docker pull postgres | Out-Null

docker stop dev-academy-postgres | Out-Null

Start-Sleep 0.5;

docker rm dev-academy-postgres | Out-Null

Start-Sleep 0.5;

docker network rm dev-academy-network | Out-Null

docker volume rm dev-academy-volume | Out-Null

docker rmi dev-academy-postgres-image:1.0.0 | Out-Null

Start-Sleep 0.5;

docker network create --driver bridge dev-academy-network | Out-Null

docker volume create dev-academy-volume;

Start-Sleep 0.5;

Set-Location (Join-Path $PSScriptRoot postgresql);

docker build -t dev-academy-postgres-image:1.0.0 .

docker run --name dev-academy-postgres -p 5432:5432 --detach --network dev-academy-network --volume dev-academy-volume:/flatfiles dev-academy-postgres-image:1.0.0 | Out-Null

Start-Sleep 5;

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv -P /flatfiles

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv -P /flatfiles

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv -P /flatfiles

docker exec -t dev-academy-postgres curl https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv --output /flatfiles/stations.csv -L

docker exec -t dev-academy-postgres psql -c "CALL init_stations()" -h localhost -U dev-academy -d citybikes -w

docker exec -t dev-academy-postgres psql -c "CALL init_journeys()" -h localhost -U dev-academy -d citybikes -w

#Write-Host "Done. Open your browser at http://localhost:5000" -ForegroundColor DarkYellow

Set-Location $PSScriptRoot