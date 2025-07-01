[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Odpalenie lokalne: 
1) Odpalenie bazy 
    - odpalić docker desktop
    - wejść w katalog ```cd docker-deployment/mongodb```
    - stworzyć nową bazę ```./run-new-db.sh```
2) Odpalenie backendu
    - wejść w katalog ```cd backend-service```
    - wygenerować ```JWT_SECRET``` za pomocą ```openssl rand -base64 32```
    - wstawić ```JWT_SECRET``` do application.properties
    - odpalić backend (reszta zmiennych jest w application.properties)
3) Odpalanie frontendu
    - wejść w katalog ```cd frontend```
    - pobrać zaleznosci ```npm install```
    - odpalić aplikację ```npm run dev```

<b> Przykładowy plik excel do importu danych w aplikacji znajduje się w folderze:</b> backend-service/exampleDataInputFile<br>

Instrukcja odpalenia wersji dockerowej znajduj się w pliku ./docker-deployment/README.md