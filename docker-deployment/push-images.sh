#!/bin/bash

docker tag frontend wsateststore.azurecr.io/frontend:0.0.1
docker push wsateststore.azurecr.io/frontend:0.0.1

docker tag backend_service wsateststore.azurecr.io/backend_service:0.9.8
docker push wsateststore.azurecr.io/backend_service:0.9.8

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi