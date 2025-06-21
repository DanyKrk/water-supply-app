#!/bin/bash

docker compose -p wsa_app -f ./compose.yml stop

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi