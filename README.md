# oculus_3dr

Chrome Plugins zufuegen:

-   WebXR API Emulator
    Develop-Tools, ober WebXR-Reiter aufmachen

Chrome muss auf Grafikkarte laufen:

-   NVIDIA Tool, Chrome.exe auf Hardwarebschleunigung
-   Check mit chrome://gpu

SSL notwendig

-   Holen: https://github.com/suyashkumar/ssl-proxy/releases/
-   Ausführen:
    ssl-proxy-windows-amd64.exe --from 0.0.0.0:3001 --to 127.0.0.1:3000
    -   Keine Firewallregeln zufuegen!

Firewallregel zufügen:

-   Windows start suchen: Defender
-   "Windows Defender Firewall" oeffnen
-   "Erweiterte Einstellungen"
-   "Eingehende Regeln"
-   "Neue Regel"
-   Name: "!Node 3000-3001", Ports 3000-3001 für Privat freigeben
-   Regeln für node löschen
-   Regeln für ssl-proxy-windows-amd64.exe löschen
