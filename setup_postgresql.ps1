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

Set-Location $PSScriptRoot