#!/bin/bash

docker build -t frontend .

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi