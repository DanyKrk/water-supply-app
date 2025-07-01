Całą aplikację uruchamiamy poprzez uruchomienie run.

1) Zbudowanie JAR-a backendu: 
    - ```./gradlew clean```, a potem ```./gradlew build``` w katalogu 'backend-service'
    - Wygenerowany JAR nalezy nazwac 'app.supply.water-0.0.1-SNAPSHOT.jar' i wstawić do katalogu 'backend-service/build/libs/', jezeli go tam jeszcze nie ma.

2)  Stworzenie pliku '.env' w katalogu 'docker-deployment' w którym nalezy zamieścić zmienną ```JWT_SECRET``` (ciąg znaków wygenerowany za pomocą komendy ```openssl rand -base64 32```). Zawartość tego pliku ma wyglądać tak: ```JWT_SECRET=<wygenerowany ciąg znaków>```.

3) Odpalenie skrytpu ```./run.sh```. Zbuduje on obrazy frontendu i backendu lokalnie, a następnie odpali wszystkie kontenery potrzebne do działania aplikacji. Po tej operacji aplikacja powinna działać na adresie http://localhost:5173/
 

Możliwe problemy:
nie przejdzie walidacja przy buildzie bo nie ma mongo - włączyć na czas budowania JARa mongo
problem z duplikatem manifestu - usunąć manifest w resources którego dotyczy powiadomienie

Obrazy backendu i frontendu zbudują się automatycznie przy uruchomieniu run.sh jeśli nie ma ich jeszcze w docker registry. Można je przebudować osobno używając skryptów build-image.sh w folderach backendu i frontendu.

Możliwe problemy przy budowaniu obrazu dla frontendu:
niezgodność wersji - przed budowaniem obrazu dla frontendu najlepiej usunąć folder node_modules oraz package-lock.json

Możliwe problemy z mongodb:
Jeśli istnieje już kontener korzystający z obrazu mongo np ten uruchomiony przy użyciu starych skryptów, trzeba go usunąć przed uruchomienie run.sh