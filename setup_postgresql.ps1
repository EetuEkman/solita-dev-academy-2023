docker pull postgres

docker stop dev-academy-postgres | Out-Null

Start-Sleep 1;

docker rm dev-academy-postgres | Out-Null

Start-Sleep 1;

#docker network rm dev-academy-network | Out-Null

#docker volume rm dev-academy-db-volume | Out-Null

docker rmi dev-academy-postgres-image:1.0.0 | Out-Null

Start-Sleep 1;

#docker network create --driver bridge dev-academy-network

Set-Location (Join-Path $PSScriptRoot postgresql);

docker build -t dev-academy-postgres-image:1.0.0 .

docker run --name dev-academy-postgres -p 5432:5432 --detach --network dev-academy-network --volume dev-academy-db-volume:/flatfiles dev-academy-postgres-image:1.0.0

#Start-Sleep 10;

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv -P /flatfiles

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv -P /flatfiles

docker exec -t dev-academy-postgres wget -nc https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv -P /flatfiles

docker exec -t dev-academy-postgres curl https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv --output /flatfiles/stations.csv -L

Set-Location $PSScriptRoot