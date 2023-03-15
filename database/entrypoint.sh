#!/bin/bash

# Start SQL Server and start the script to create the DB

/opt/mssql/bin/sqlservr | /usr/config/configure-db.sh 
