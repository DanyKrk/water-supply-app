#!/bin/bash

VOLUME_NAME="wsa-data"

if [[ "$(docker volume ls -f name=$VOLUME_NAME | grep $VOLUME_NAME 2> /dev/null)" == "" ]]; then
	cd mongodb
	docker volume create wsa-data
	cd ..
fi

if [[ "$(docker images -q backend_service 2> /dev/null)" == "" ]]; then
	cd ../backend-service
	./build-image.sh -s
	cd ../docker-deployment
fi

if [[ "$(docker images -q frontend 2> /dev/null)" == "" ]]; then
	cd ../frontend
	./build-image.sh -s
	cd ../docker-deployment
fi

docker network inspect wsa >/dev/null 2>&1 || docker network create --driver bridge wsa

docker compose -p wsa_app -f ./compose.yml up -d

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi