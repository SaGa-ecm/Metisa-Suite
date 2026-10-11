# 📖 SAGA LABS METISA & APC: Das verständliche Einsteiger-Handbuch (Wiki & FAQ)

> **Für wen ist diese Anleitung gedacht?**  
> Für absolut jeden! Du musst weder Informatik studiert haben, noch wissen, was ein Bit oder Byte ist. Wenn du weißt, wie man einen Stecker einsteckt und ein Fahrrad fährt, bist du hier genau richtig.

---

## Inhaltsverzeichnis
1. [Teil 1: Was habe ich hier vor mir? (Einfach erklärt)](#teil-1-was-habe-ich-hier-vor-mir-einfach-erklärt)
2. [Teil 2: Welches Kabel gehört wohin? (Schritt-für-Schritt)](#teil-2-welches-kabel-gehört-wohin-schritt-für-schritt)
3. [Teil 3: Der Web-Konfigurator für Jedermann](#teil-3-der-web-konfigurator-für-jedermann)
4. [Teil 4: Gesetz (StVZO) vs. Race – Das PIN-System (210286)](#teil-4-gesetz-stvzo-vs-race--das-pin-system-210286)
5. [Teil 5: Handy-Verbindung & Funk (Bluetooth & WLAN)](#teil-5-handy-verbindung--funk-bluetooth--wlan)
6. [Teil 6: Die 25 häufigsten Fragen & Pannen (FAQ & Pannenhilfe)](#teil-6-die-25-häufigsten-fragen--pannen-faq--pannenhilfe)
7. [Teil 7: Das kleine E-Bike-Wörterbuch (Glossar)](#teil-7-das-kleine-e-bike-wörterbuch-glossar)

---

## Teil 1: Was habe ich hier vor mir? (Einfach erklärt)

Stell dir dein E-Bike wie einen menschlichen Körper vor:
* 🔋 **Der Akku** ist der *Magen*: Er liefert die Energie (Volt & Amperestunden).
* ⚙️ **Der Motor** sind die *Beine*: Er treibt das Rad an.
* 🧠 **METISA / APC** ist das **Gehirn**: Es spürt, wie schnell du trittst, entscheidet, wie viel Kraft der Motor geben darf, steuert dein Licht und sorgt dafür, dass alles sicher und legal bleibt.
* 🖥️ **Das Display / Smartphone** sind die *Augen & Ohren*: Hier siehst du Tempo, Akkuanzeige und Reichweite.

### Die goldene Regel vor dem Start:
> ⚠️ **ACHTUNG:** Bevor du an irgendwelchen Kabeln arbeitest: **Schalte IMMER zuerst den Akku aus oder ziehe den Hauptstecker ab!** Ein Kurzschluss am Akku funkt gewaltig und zerstört empfindliche Elektronik in einer Millisekunde.

---

## Teil 2: Welches Kabel gehört wohin? (Schritt-für-Schritt)

Jedes Kabel hat eine bestimmte Aufgabe und Farbe. Hier ist deine Checkliste:

```
                  +-----------------------------------+
                  |         METISA GEHIRN             |
                  |     (Universal-Controller)        |
                  +-----------------------------------+
                     |         |         |         |
    +----------------+         |         |         +----------------+
    |                          |         |                          |
 [AKKU]                     [MOTOR]    [PAS-TRETSENSOR]         [LENKER]
 + / - (Rot/Schwarz)        3 Phasen   Magnetscheibe            Gasgriff, Bremsen,
 36V / 48V                  zum ESC    am Tretlager             Display & Blinker
```

### 1. Stromversorgung (Akku)
* **Rot = Plus (+)**
* **Schwarz = Minus / Masse (-)**
* 🔴 **WICHTIG:** Niemals vertauschen (Verpolungsschutz)! Rot gehört an Akku-Plus, Schwarz an Akku-Minus.

### 2. Der Tretlagersensor (PAS-Sensor)
* Das ist der kleine schwarze Ring mit Magneten, der sich an deinen Tretkurbeln mitdreht.
* **Warum ist der da?** In Deutschland und der EU darf der Motor *nur dann* helfen, wenn du auch wirklich selbst in die Pedale trittst. Hören deine Beine auf, muss der Motor sofort stoppen.
* **Der richtige Abstand:** Der Sensor muss ca. 1 bis 2 mm nah an der Magnetscheibe sitzen. Ist der Abstand zu groß (z. B. 5 mm), "sieht" der Sensor deine Tritte nicht.

### 3. Der Radsensor (Tacho)
* Ein kleiner Speichenmagnet am Vorderrad oder Hinterrad.
* Bei jeder Radumdrehung macht es *klick*. Dadurch weiß der Controller haargenau, wie schnell du fährst (z. B. 24,8 km/h).

### 4. Der Gasgriff (Daumengas / Drehgriff)
* Hat meist 3 feine Adern:
  * **Rot:** 5 Volt Versorgung
  * **Schwarz:** Masse (GND)
  * **Blau oder Grün oder Weiß:** Das Steuersignal (0 bis 5 Volt je nachdem, wie stark du drückst).
* **Hinweis:** Laut Gesetz darf der Gasgriff ohne Treten nur bis maximal **6 km/h** als Schiebehilfe beschleunigen.

### 5. Die Bremshebel (Bremskontakte)
* Sobald du auch nur leicht am Bremshebel ziehst, schaltet der Controller den Motor **sofort und ohne jede Verzögerung** ab.
* Gleichzeitig leuchtet hinten dein Bremslicht auf!

---

## Teil 3: Der Web-Konfigurator für Jedermann

Du musst **kein Programm installieren** und nichts programmieren!

### So startest du:
1. Nimm deinen Laptop, dein Tablet oder dein Smartphone.
2. Doppelklicke auf die Datei `configurator/index.html` oder öffne sie in Chrome, Edge, Safari oder Firefox.
3. Schon siehst du die moderne **SAGA LABS METISA** Steuerzentrale im Cyber-Orange Design.

### E-Bike per USB-Kabel verbinden (Live-Werte sehen):
1. Verbinde den Controller per USB-Kabel mit deinem Computer.
2. Klicke oben rechts auf den orangefarbenen Button **[ 🔌 USB Verbinden ]**.
3. Dein Browser fragt dich, welchen USB-Anschluss du verbinden willst (z. B. "USB-Serial" oder "CP2102"). Klicke auf "Verbinden".
4. **Fertig!** Jetzt siehst du unter dem Reiter **Live-Messung** live auf dem Bildschirm, wie sich die Balken bewegen, wenn du am Gasgriff drehst oder die Bremse ziehst!

### Eigene Einstellungen speichern und anwenden:
1. Stelle deine Werte ein (z. B. Akku auf 36 V oder 48 V, Reifenumfang auf 2200 mm).
2. Klicke auf **[ 💾 .APC Export ]** oder **[ 📄 JSON Export ]**, um deine Einstellungen als Sicherungsdatei auf deinem PC abzuspeichern.
3. Klicke auf **[ ⚡ Generiere config.h ]** und danach auf **[ 💾 Datei herunterladen ]** – schon hast du deine fertige Konfigurationsdatei!

---

## Teil 4: Gesetz (StVZO) vs. Race – Das PIN-System (`210286`)

Damit du im Straßenverkehr rechtlich auf der sicheren Seite bist, besitzt METISA ein intelligentes **3-Stufen-Sicherheitssystem**:

| Stufe | Name | Höchsttempo | Motorleistung | Treten Pflicht? | Gasgriff erlaubt? |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | **StVZO Legal (Standard)** | **25 km/h** | **250 Watt** | **JA (strikte Pflicht)** | Nur bis 6 km/h (Schiebehilfe) |
| **1** | **Sport** | **32 km/h** | **500 Watt** | JA | Nur bis 6 km/h |
| **2** | **Race (Nur Privatgelände)** | **99 km/h** | **1000 Watt** | **NEIN** | **JA (Reines Vollgas)** |

### Wie funktioniert der Schutz?
* **Automatischer Schutz bei jedem Start:** Jedes Mal, wenn du den Akku einschaltest oder das Bike neu startest, startet der Controller **ausnahmslos auf Stufe 0 (StVZO-Konform)**.
* **Wie schalte ich Stufe 2 frei?** Stufe 2 lässt sich nur durch Eingabe der Master-PIN **`210286`** im Menü oder in der App aktivieren.
* **Polizeikontrolle?** Sobald das E-Bike ausgeschaltet wird, ist Stufe 2 wieder gesperrt. Bei einer Überprüfung hält das Rad exakt 25 km/h und 250 Watt ein.

---

## Teil 5: Handy-Verbindung & Funk (Bluetooth & WLAN)

Wenn dein Controller einen ESP32-Chip besitzt, hat er Bluetooth und WLAN schon fest an Bord – ohne externe Module!

### Verbindung mit Android-Smartphones (Bluetooth):
1. Schalte Bluetooth am Handy ein und suche nach neuen Geräten.
2. Wähle **"APC-Pedelec"** aus.
3. Kopplungscode (falls gefragt): `1234` oder `0000`.
4. Öffne die HMI-App – sie verbindet sich automatisch und zeigt dein digitales Tacho-Cockpit an.

### Verbindung mit iPhone oder beliebigem Smartphone (WLAN / WiFi):
1. Öffne die WLAN-Einstellungen deines Handys.
2. Verbinde dich mit dem WLAN-Netzwerk: **`APC-Pedelec-WiFi`**.
3. Gib das Passwort ein: **`21028600`**.
4. Öffne den Safari- oder Chrome-Browser und tippe oben als Adresse ein:  
   👉 **`http://192.168.4.1`**
5. **Ergebnis:** Auf deinem Handy-Display erscheint sofort das dunkle SAGA LABS Live-Cockpit mit Tempo, Akku, Scheinwerfer-Schalter und Leistungsanzeige – ganz ohne App-Store-Download!

---

## Teil 6: Die 25 häufigsten Fragen & Pannen (FAQ & Pannenhilfe)

### ❓ F01: Mein Motor macht überhaupt keinen Mucks – was ist kaputt?
> **Antwort:** Prüfe diese 3 Dinge:
> 1. *Akku:* Schaltet der Akku überhaupt Strom frei (LED-Anzeige am Akku an)?
> 2. *Bremse:* Klemmt der Bremskontakt? Wenn die Steuerung denkt, dass du bremst, wird der Motor komplett totgeschaltet. Ziehe den Bremsstecker testweise ab.
> 3. *PAS-Sensor:* Im Standard-Modus dreht der Motor **erst**, wenn du kräftig in die Pedale trittst. Drehe die Kurbel vorwärts – blinkt die kleine rote Diode am PAS-Sensor bei jedem Magneten?

### ❓ F02: Der Motor ruckelt nur oder brummt komisch.
> **Antwort:** Bei bürstenlosen Motoren (BLDC) sind meist zwei der drei dicken Motorphasenkabel (Blau, Grün, Gelb) vertauscht oder haben schlechten Kontakt. Tausche zwei Phasen untereinander, um die Drehrichtung zu korrigieren.

### ❓ F03: Mein Tacho zeigt immer 0,0 km/h an, obwohl ich fahre!
> **Antwort:** Der Speichenmagnet ist verrutscht! Er muss mit maximal 2–3 mm Abstand am Sensor vorbeilaufen. Drehe das Rad mit der Hand und schau, ob der Magnet genau auf Höhe des Sensor-Strichs vorbeiläuft.

### ❓ F04: Wenn ich aufhöre zu treten, schiebt der Motor noch 1 Sekunde weiter!
> **Antwort:** Das liegt am `pas_timeout`. Im Konfigurator steht er standardmäßig auf 500 ms (eine halbe Sekunde). Wenn du eine Magnetscheibe mit 12 Magneten hast, kannst du den Wert im Konfigurator auf `250` oder `300 ms` verkürzen – dann stoppt der Motor blitzschnell!

### ❓ F05: Mein Gasgriff reagiert gar nicht.
> **Antwort:** Im Standard-StVZO-Modus (Stufe 0) darf der Gasgriff laut Gesetz **nur bis 6 km/h** als Schiebehilfe arbeiten oder nur dann, wenn du gleichzeitig pedalisierst. Wenn du vollen Daumengas-Betrieb ohne Treten willst, musst du auf Privatgelände Stufe 2 mit PIN `210286` entsperren.

### ❓ F06: Die Akkuanzeige springt beim Beschleunigen stark nach unten!
> **Antwort:** Das ist völlig normal und nennt sich "Spannungseinbruch unter Last" (Voltage Sag). Wenn der Motor viel Strom zieht, sinkt die Akkuspannung kurzfristig ab. Sobald du rollst, erholt sie sich wieder.

### ❓ F07: Das Display bleibt komplett dunkel.
> **Antwort:** Überprüfe, ob die Display-Versorgungsspannung (5 V oder Akkuspannung je nach Displaytyp) am Stecker anliegt. Bei Nokia-5110-Displays muss im Konfigurator der richtige Kontrastwert (`nud_display_contrast`, ca. 190) eingestellt sein.

### ❓ F08: Mein Handy findet das WLAN "APC-Pedelec-WiFi" nicht.
> **Antwort:** Hast du einen Controller mit ESP32-Chip? Ältere AVR-Arduino-Nanos haben kein WLAN. Falls du einen ESP32 hast: Prüfe im Konfigurator unter "Display & Funk", ob das Häkchen bei `wireless_wifi_softap` gesetzt ist.

### ❓ F09: Brauche ich am iPhone eine spezielle App aus dem App Store?
> **Antwort:** Nein! Apple erlaubt Bluetooth-Serial (SPP) nicht ohne teure Zusatzlizenzen. Deshalb hat METISA den eingebauten WLAN-Webserver: Verbinde dich einfach per WLAN und öffne `192.168.4.1` im Safari-Browser!

### ❓ F10: Was bedeutet „Reifenumfang in mm“ und wie messe ich ihn?
> **Antwort:** Das ist der Weg, den dein Reifen bei genau einer vollen Umdrehung auf der Straße abrollt.
> *Tipp:* Mache mit Kreide einen Strich auf den Boden und auf deinen Reifen. Schiebe das Rad geradeaus, bis der Reifen genau eine Umdrehung gemacht hat, und mache wieder einen Strich. Miss den Abstand mit dem Zollstock (meist zwischen 2050 mm bei 26-Zoll und 2280 mm bei 29-Zoll).

### ❓ F11: Was ist ein „Shunt“?
> **Antwort:** Ein Shunt ist ein winziger, hochpräziser Messwiderstand auf der Platine. Durch ihn fließt der gesamte Strom deines Motors. Der Controller misst den winzigen Spannungsabfall daran und weiß dadurch auf das Milliampere genau, wie viel Kraft und Watt dein Motor gerade verbraucht.

### ❓ F12: Was bedeutet „ECE-R 50 Blinker“?
> **Antwort:** Das ist die offizielle europäische Fahrzeugnorm für Fahrtrichtungsanzeiger. Sie schreibt vor, dass Blinker gleichmäßig mit **1,5 Hertz (genau 90 Mal pro Minute)** blinken müssen. METISA hält diese Frequenz millimetergenau ein und schaltet den Blinker nach 20 Sekunden automatisch ab, falls du vergisst, ihn auszumachen.

### ❓ F13: Was ist das „ESS Notbremsblinken“?
> **Antwort:** ESS steht für *Emergency Stop Signal*. Wenn du schneller als 15 km/h fährst und voll in die Eisen gehst, leuchtet das Bremslicht nicht nur normal rot, sondern blinkt rasend schnell mit **3,5 Hertz (ca. 4 Mal pro Sekunde)**. Das warnt Autofahrer hinter dir vor einem Auffahrunfall – genau wie bei modernen Sportwagen!

### ❓ F14: Warum geht meine Hupe nach 3 Sekunden plötzlich aus?
> **Antwort:** Das ist der integrierte **Überhitzungsschutz**. Wenn dein Hupentaster klemmt oder jemand dauerhaft draufdrückt, würde die Spule der Hupe durchbrennen. Nach 3,0 Sekunden trennt METISA den Strom automatisch, bis du den Taster loslässt.

### ❓ F15: Kann mein Akku tiefentladen und zerstört werden?
> **Antwort:** Nein! METISA hat zwei Schutzschilde:
> 1. Ab `vcutoff` (z. B. 33,0 V bei einem 36V-Akku) drosselt das System sanft die Motorleistung, um den Akku zu schonen.
> 2. Erreicht der Akku `vemergency_shutdown` (z. B. 28,0 V), schaltet der Controller die Stromzufuhr zum Motor **vollständig ab**, um die Akkuzellen vor dem Tod zu retten.

### ❓ F16: Welchen Kabelquerschnitt brauche ich bei 1000 Watt?
> **Antwort:** Bei 1000 Watt fließen bei einem 36V-Akku knapp 28 Ampere! Verwende für Akku- und Motorphasen immer mindestens **2,5 mm²** (besser **4,0 mm²** Silikonkabel) und hochwertige XT60- oder XT90-Goldkontaktstecker. Dünne Klingeldrähte werden heiß und können schmelzen!

### ❓ F17: Was passiert bei Regen und Nässe?
> **Antwort:** Das Original METISA-Gehäuse ist nach Industriestandard IP67 geschützt. Achte beim Selberbauen darauf, dass alle Kabeldurchführungen nach unten zeigen (damit Tropfwasser ablaufen kann) und dichte Steckverbindungen mit Schrumpfschlauch oder Dichtmasse ab.

### ❓ F18: Ich habe meine PIN für Stufe 2 vergessen!
> **Antwort:** Die werkseitige Master-PIN lautet immer **`210286`**. Sie kann im Web-Konfigurator jederzeit eingesehen oder neu eingestellt werden.

### ❓ F19: Warum geht das E-Bike nach 30 Minuten Nichtbenutzung von selbst aus?
> **Antwort:** Das ist der `idle_shutdown_secs` (automatische Stromspar-Abschaltung). Wenn du dein Rad vor dem Supermarkt abstellst und vergisst auszuschalten, trennt METISA nach 30 Minuten das System, damit der Akku nicht leergesaugt wird.

### ❓ F20: Kann ich einen 48V-Akku an einem 36V-Motor betreiben?
> **Antwort:** Viele E-Bike-Motoren vertragen 48V problemlos und drehen dadurch etwas schneller. **Aber:** Du musst im Konfigurator zwingend die Akkuspannung auf 48V (Ladeschluss `54.6 V`, Cutoff `42.0 V`) anpassen! Tust du das nicht, denkt der Controller, ein voller 48V-Akku sei ein überladener 36V-Akku und verweigert den Dienst.

### ❓ F21: Brauche ich zwingend Bremshebel mit elektrischem Kontakt?
> **Antwort:** Es wird dringend empfohlen! Moderne Scheibenbremsen bringen das Rad zwar auch so zum Stehen, aber wenn der Motor bei einer Schreckbremsung noch für den Bruchteil einer Sekunde gegendrückt, verlängert sich dein Bremsweg unnötig.

### ❓ F22: Wie stelle ich den Gasgriff ein, wenn er erst ab halbem Weg Gas gibt?
> **Antwort:** Gehe im Konfigurator auf den Reiter "Live-Messung". Lies ab, welcher ADC-Wert angezeigt wird, wenn du den Gasgriff gar nicht berührst (z. B. 185) und welcher, wenn du voll durchdrückst (z. B. 860). Trage diese beiden Werte unter "Gasgriff & Taster" bei `Min ADC` und `Max ADC` ein – ab sofort reagiert dein Gasgriff butterweich von der ersten Millimeter-Bewegung an!

### ❓ F23: Kann ich die Einstellungen auf die Werkseinstellungen zurücksetzen?
> **Antwort:** Ja, lade im Konfigurator einfach das Profil `Default-metisa` oder lösche den Browser-Cache. Im Controller kannst du auch das EEPROM löschen (Befehl `clean_eeprom` im seriellen Monitor).

### ❓ F24: Warum schaltet mein Scheinwerfer nicht ein?
> **Antwort:** Prüfe, ob dein Scheinwerfer an den Lichtausgang des Controllers angeschlossen ist und ob der Schalter im Menü oder am Lenkertaster auf "EIN" steht. Bei vielen Displays schaltet ein langer Druck auf die "Pfeil-Nach-Oben"-Taste das Licht ein.

### ❓ F25: Wo finde ich Hilfe, wenn ich gar nicht mehr weiterkomme?
> **Antwort:** 
> 1. Konsultiere das Pedelecforum (Deutschlands größte DIY-Community für den Arduino Pedelec Controller).
> 2. Besuche die offizielle Support-Seite unter [sagalabs.de/metisa](https://sagalabs.de/metisa).
> 3. Überprüfe die Protokolldateien im `docs/`-Ordner dieses Projekts.

---

## Teil 7: Das kleine E-Bike-Wörterbuch (Glossar)

* **Ampere (A):** Die Stromstärke. Wie viel "Saft" fließt gerade durch die Leitung?
* **Volt (V):** Die elektrische Spannung. Wie viel "Druck" hat der Akku (typisch 36 V oder 48 V)?
* **Watt (W):** Die Leistung. Rechnet sich ganz einfach: $\text{Volt} \times \text{Ampere} = \text{Watt}$. Bei $36\text{ V} \times 10\text{ A}$ leistet dein Motor 360 Watt.
* **Wattstunden (Wh):** Die "Tankgröße" deines Akkus. Ein 500 Wh Akku kann 1 Stunde lang 500 Watt abgeben oder 2 Stunden lang 250 Watt.
* **BLDC:** *Brushless Direct Current* (Bürstenloser Gleichstrommotor). Nahezu alle modernen E-Bike-Motoren sind bürstenlos und halten viele Jahre ohne Verschleiß.
* **Kadenz:** Deine Trittfrequenz. Wie viele Kurbelumdrehungen machst du pro Minute (z. B. 70 U/min)?
* **KERS / Rekuperation:** Energierückgewinnung beim Bremsen oder Bergabfahren. Der Motor wird zum Dynamo und lädt den Akku wieder etwas auf.
* **PID-Regler:** Eine clevere mathematische Formel im Controller, die dafür sorgt, dass dein Motor sanft anfährt und nicht ruckartig nach vorne springt.
* **StVZO:** Straßenverkehrs-Zulassungs-Ordnung in Deutschland (regelt die 25 km/h und 250 W Pedelec-Grenzen).
