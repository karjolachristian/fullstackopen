```mermaid
sequenceDiagram
    participant Käyttäjä
    participant Selain
    participant Palvelin
    participant Tietokanta

    Käyttäjä->>Selain: Avaa sivun (https://studies.cs.helsinki.fi/exampleapp/spa)
    Selain->>Palvelin: Pyytää sivun HTML-tiedoston (HTTP GET)
    Palvelin-->>Selain: Lähettää HTML-tiedoston
    Selain->>Palvelin: Pyytää JavaScript- ja CSS-tiedostot
    Palvelin-->>Selain: Lähettää tarvittavat tiedostot
    Selain->>Palvelin: Pyytää muistiinpanot .JSON-muodossa
    Palvelin->>Tietokanta: Hakee muistiinpanot
    Tietokanta-->>Palvelin: Palauttaa muistiinpanot
    Palvelin-->>Selain: Lähettää muistiinpanot .JSON-muodossa
    Selain-->>Käyttäjä: Tuo muistiinpanot ruudulle ilman sivun uudelleenlatausta
