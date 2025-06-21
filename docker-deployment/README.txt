Całą aplikację uruchamiamy poprzez uruchomienie run.sh
run.sh zbuduje obrazy frontendu i backendu lokalnie, przy czym dla backendu wymaga do tego wcześniejszego zbudowania JARa
JAR najłatwiej zbudować przez dodanie artefaktu w File > Project Structure > Artifacts, a następnie każdorazowo uruchomienie komendy gradle build w konsoli Gradle

Możliwe problemy:
nie przejdzie walidacja przy buildzie bo nie ma mongo - włączyć na czas budowania JARa mongo
problem z duplikatem manifestu - usunąć manifest w resources którego dotyczy powiadomienie

Obrazy backendu i frontendu zbudują się automatycznie przy uruchomieniu run.sh jeśli nie ma ich jeszcze w docker registry. Można je przebudować osobno używając skryptów build-image.sh w folderach backendu i frontendu.

Możliwe problemy przy budowaniu obrazu dla frontendu:
niezgodność wersji - przed budowaniem obrazu dla frontendu najlepiej usunąć folder node_modules oraz package-lock.json

Możliwe problemy z mongodb:
Jeśli istnieje już kontener korzystający z obrazu mongo np ten uruchomiony przy użyciu starych skryptów, trzeba go usunąć przed uruchomienie run.sh