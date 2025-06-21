#!/bin/bash

VERSION="0.0.1-SNAPSHOT.jar"

docker build --build-arg JAR_FILE=build/libs/app.supply.water-$VERSION -t backend_service .

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi