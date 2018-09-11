# kvv
LiveHaltestellenMonitor

Haltestelle, Linie und Fahrtrichtung kann entweder direkt auf der Seite ausgewählt werden oder

per URL in folgender Form übergeben werden url/#?stopName=xxxxx&route=xxxxx&dir=x,
wobei stopname der Code der Haltestelle (z.B. de:8212:60) ist, 
route die Bezeichnung der Bahn (oder Bahnen, durch Komma getrennt), z.b. 5,S4
dir die Richtung, dies kann 1 oder 2 sein, oder leer bleiben für beide Richtungen.

Wählt man die Einstellungen auf der Seite, so wird ein Cookie gesetzt, der beim
nächsten Besuch die Einstellungen wiederherstellt.

Der Aufruf per URL Parameter ändert den Cookie und die gespeicherten Einstellungen nicht.

