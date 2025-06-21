export MONGODB_VERSION=6.0-ubi8

docker run --name WSA-mongo-db -d -p 27017:27017 -v $(pwd)/data:/data/db mongodb/mongodb-community-server:$MONGODB_VERSION

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi