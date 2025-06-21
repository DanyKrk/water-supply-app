https://wsa-test-frontend.azurewebsites.net/

services:
  frontend:
    container_name: frontend
    image: wsateststore.azurecr.io/frontend:0.0.1
    ports:
      - '5173:5173'

docker tag frontend wsateststore.azurecr.io/frontend:0.0.1



https://wsa-test-api.azurewebsites.net/

services:
  mongo-db:
    container_name: WSA-mongo-db
    networks: [ wsa ]
    image: mongodb/mongodb-community-server:6.0-ubi8
    ports:
      - '27017:27017'
    volumes:
        - wsa-data:/data/mongodb
  backend-service:
    container_name: backend-service
    networks: [ wsa ]
    image: wsateststore.azurecr.io/backend_service:0.0.1
    expose:
      - '8080'
    ports:
      - '8080:8080'
    environment:
      spring.data.mongodb.database: mongo-db
      spring.data.mongodb.host: mongo-db
      spring.data.mongodb.port: 27017
    depends_on:
      mongo-db:
        condition: service_started

networks:
  wsa:
    name: wsa
    driver: bridge
    external: true

volumes:
  wsa-data:
    external: true