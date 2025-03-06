```mermaid
sequenceDiagram
    participant Käyttäjä
    participant Selain
    participant Palvelin
    participant Tietokanta

    Käyttäjä->>Selain: Kirjoittaa muistiinpanon ja painaa "Tallenna" näppäintä
    Selain->>Selain: Lisää uusi muistiinpano näkymään ilman sivun uudelleenlatausta
    Selain->>Palvelin: Lähettää muistiinpanon (HTTP POST) avulla
    Palvelin->>Tietokanta: Tallentaa muistiinpanon tietokantaan
    Tietokanta-->>Palvelin: Vahvistaa tallennuksen palvelimella
    Palvelin-->>Selain: Vahvistaa muistiinpanon lisäyksen selaimeen
