docker start WSA-mongo-db

if [ "$1" != "-s" ]; then
	read -n1 -r -p "Press any key to exit..."
fi