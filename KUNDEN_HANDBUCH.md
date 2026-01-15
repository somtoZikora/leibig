# Handbuch für die Website-Verwaltung
## Ihr Online-Weinshop – Bedienungsanleitung

---

**Version:** 1.0
**Datum:** Dezember 2024
**Zielgruppe:** Geschäftsführung und Mitarbeiter

---

## Inhaltsverzeichnis

1. [Überblick](#1-überblick)
2. [Tägliche Aufgaben](#2-tägliche-aufgaben)
3. [Produktverwaltung mit Winestro](#3-produktverwaltung-mit-winestro)
4. [Inhalte bearbeiten mit Sanity Studio](#4-inhalte-bearbeiten-mit-sanity-studio)
5. [Kunden- und Bestellverwaltung](#5-kunden--und-bestellverwaltung)
6. [Website-Einstellungen und Konfiguration](#6-website-einstellungen-und-konfiguration)
7. [Wartung und Best Practices](#7-wartung-und-best-practices)
8. [Technische Referenz](#8-technische-referenz)
9. [Glossar](#9-glossar)

---
<div style="page-break-after: always;"></div>

## 1. Überblick

### 1.1 Was ist Ihre Website?

Ihre Website ist ein vollständiger Online-Weinshop, der Kunden ermöglicht:
- Weine zu durchsuchen und zu kaufen
- Ein Kundenkonto zu erstellen
- Bestellungen aufzugeben und zu verfolgen
- Mit PayPal, auf Rechnung oder per Vorkasse zu bezahlen

### 1.2 Wie funktioniert das System?

Ihre Website besteht aus **drei verbundenen Systemen**, die zusammenarbeiten:

#### **Winestro (Ihre Warenwirtschaft)**
- **Was es tut:** Verwaltet Produkte, Lagerbestände und Bestellungen
- **Ihre Hauptarbeit:** Hier pflegen Sie Ihre Weine, Preise und Bestände
- **Was automatisch passiert:** Produktdaten werden zur Website übertragen

#### **Website (Der Online-Shop)**
- **Was es tut:** Zeigt Produkte an, nimmt Bestellungen entgegen
- **Ihre Interaktion:** Keine direkte Verwaltung nötig
- **Was automatisch passiert:** Bestellungen werden an Winestro gesendet

#### **Sanity Studio (Das Content-Management-System)**
- **Was es tut:** Verwaltet Produktbeschreibungen, Bundles und Blog-Inhalte
- **Ihre Arbeit:** Texte schreiben, Bundles erstellen, SEO optimieren
- **Zugriff:** Über Webbrowser

### 1.3 Der Datenfluss – So arbeiten die Systeme zusammen

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  SIE ARBEITEN IN WINESTRO                              │
│  - Produkte anlegen                                     │
│  - Preise festlegen                                     │
│  - Lagerbestände aktualisieren                         │
│                                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         Automatische Synchronisation
         (täglich oder manuell)
                 │
                 ▼
┌────────────────┴────────────────────────────────────────┐
│                                                         │
│  IHRE WEBSITE                                          │
│  - Zeigt Weine an                                      │
│  - Kunden bestellen                                    │
│  - Zahlung wird abgewickelt                            │
│                                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         Bestellung wird erstellt
                 │
                 ▼
┌────────────────┴────────────────────────────────────────┐
│                                                         │
│  ZURÜCK IN WINESTRO                                    │
│  - Bestellung erscheint automatisch                    │
│  - Sie bearbeiten die Lieferung                        │
│  - Rechnung erstellen / Versand organisieren           │
│                                                         │
└─────────────────────────────────────────────────────────┘

    Parallel: SANITY STUDIO für ergänzende Inhalte
    - Produktbeschreibungen (werden NICHT von Winestro übertragen)
    - Weinbundles / Geschenksets
    - Blog-Artikel
    - SEO-Optimierung
```

### 1.4 Warum ist das wichtig?

**Winestro bleibt Ihr Hauptsystem.** Sie arbeiten wie gewohnt. Die Website holt sich automatisch die Daten und sendet Bestellungen zurück. Sie müssen nichts doppelt pflegen.

**Sanity Studio ist für die "schönen Texte".** Winestro sendet technische Daten (Preis, Jahrgang, Alkoholgehalt). Sanity ist für Beschreibungen, Geschichten über den Winzer und Marketing-Inhalte.

---
<div style="page-break-after: always;"></div>

## 2. Tägliche Aufgaben

### 2.1 Morgenroutine (ca. 10 Minuten)

#### Schritt 1: Winestro-Dashboard öffnen
1. Melden Sie sich bei Winestro an
2. Gehen Sie zum Bereich "Bestellungen"
3. Filtern Sie nach "neue Bestellungen" (Status: neu/unbezahlt)

#### Schritt 2: Bestellungen prüfen
Für jede neue Bestellung:
- **Bestellnummer:** Beginnt mit "WS-" (z.B. WS-123456-ABC7DE)
- **Zahlungsart prüfen:**
  - PayPal: Bereits bezahlt, sofort bearbeiten
  - Rechnung: Für Stammkunden, nach Versand Rechnung stellen
  - Vorkasse: Warten auf Zahlungseingang, dann bearbeiten

#### Schritt 3: Zahlungsstatus aktualisieren
- Bei PayPal-Bestellungen: Automatisch als "bezahlt" markiert
- Bei Vorkasse: Manuell auf "bezahlt" setzen nach Bankprüfung
- Bei Rechnung: Status "offen" bis zur Zahlung

### 2.2 Bestellungen bearbeiten

**WICHTIG:** Alle Bestellungen erscheinen automatisch in Winestro. Sie bearbeiten sie wie gewohnt.

#### Was automatisch passiert:
- Bestellung wird von der Website in Winestro übertragen
- Kundendaten (Name, Adresse, E-Mail) sind bereits eingetragen
- Bestellte Produkte sind mit Artikelnummer verknüpft
- Lagerbestand wird reserviert

#### Was Sie manuell machen:
1. **Zahlung bestätigen** (bei Vorkasse/Rechnung)
2. **Ware kommissionieren**
3. **Versandetikett erstellen**
4. **Trackingnummer in Winestro eintragen**
5. **Status auf "versendet" setzen**

### 2.3 Zahlungsarten im Detail

#### PayPal (sofortige Zahlung)
- **Kunde zahlt:** Direkt beim Checkout
- **Geld kommt an:** Sofort auf Ihrem PayPal-Konto
- **Ihr Status:** "Bezahlt" → direkt versenden
- **PayPal-Gebühr:** Wird automatisch abgezogen

**HINWEIS:** Sie können sich täglich bei PayPal anmelden, um Umsätze zu prüfen.

#### Rechnung (Zahlung nach Lieferung)
- **Kunde zahlt:** Nach Erhalt der Ware (Zahlungsziel z.B. 14 Tage)
- **Ihre Aufgabe:** Rechnung mit der Lieferung beilegen
- **Verfügbar für:** Stammkunden (manuell freischalten)
- **Risiko:** Zahlungsausfall möglich

**TIPP:** Legen Sie fest, welche Kunden per Rechnung kaufen dürfen. Neue Kunden sollten zunächst PayPal oder Vorkasse nutzen.

#### Vorkasse / Überweisung
- **Kunde zahlt:** Vor dem Versand per Banküberweisung
- **Ihre Aufgabe:** Zahlungseingang prüfen (Online-Banking)
- **Dann:** Ware versenden
- **Bankdaten:** Werden dem Kunden nach Bestellung angezeigt

**WICHTIG:** Prüfen Sie täglich Ihr Bankkonto und gleichen Sie mit offenen Vorkasse-Bestellungen ab.

### 2.4 Checkliste: Was muss ich täglich tun?

**Jeden Morgen:**
- [ ] Winestro-Dashboard öffnen
- [ ] Neue Bestellungen prüfen
- [ ] PayPal-Bestellungen zur Kommissionierung freigeben
- [ ] Bankkonto prüfen (Vorkasse-Eingänge)
- [ ] Vorkasse-Bestellungen bei Zahlungseingang freigeben

**Täglich vor Versand:**
- [ ] Ware kommissionieren
- [ ] Versandetiketten drucken
- [ ] Rechnungen beilegen (bei Rechnung-Kunden)
- [ ] Trackingnummer in Winestro eintragen
- [ ] Status auf "versendet" ändern

**Bei Bedarf:**
- [ ] Kundenanfragen beantworten
- [ ] Retouren bearbeiten
- [ ] Gutschriften erstellen

---
<div style="page-break-after: always;"></div>

## 3. Produktverwaltung mit Winestro

### 3.1 Grundprinzip

**Sie arbeiten ausschließlich in Winestro.** Die Website holt sich automatisch die Produktdaten.

### 3.2 Was wird automatisch synchronisiert?

Wenn Sie in Winestro einen Wein bearbeiten, werden diese Daten zur Website übertragen:

#### Produktinformationen:
- Artikelnummer
- Preis (Verkaufspreis)
- Lagerbestand
- Flascheninhalt (z.B. 0,75 L)
- Jahrgang

#### Weintechnische Daten:
- Rebsorte (z.B. Riesling, Spätburgunder)
- Geschmack (trocken, halbtrocken, lieblich, süß)
- Qualitätsstufe (z.B. Qualitätswein, Kabinett, Spätlese)
- Alkoholgehalt
- Restzucker, Säure

#### Nährwertangaben (gesetzlich vorgeschrieben):
- Brennwert (kJ/kcal)
- Kohlenhydrate, Eiweiß, Fett, Salz
- Jeweils pro 100 ml

#### Erzeuger-Informationen:
- Name des Weinguts
- Adresse
- Land, Region, Anbaugebiet

#### Bilder:
- Hauptbild (artikel_bild_big)
- Zusätzliche Bilder (artikel_bild_big_2, _3, _4)

### 3.3 Was wird NICHT synchronisiert?

**Produktbeschreibungen** werden bewusst NICHT von Winestro übertragen.

**Warum?** Damit Sie auf der Website schöne, verkaufsfördernde Texte schreiben können, ohne dass technische Winestro-Daten diese überschreiben.

**Wo schreiben Sie Beschreibungen?** → In Sanity Studio (siehe Kapitel 4)

### 3.4 Wie funktioniert die Synchronisation?

#### Automatische Synchronisation:
- **Häufigkeit:** Täglich (nachts um 2:00 Uhr)
- **Dauer:** 5-15 Minuten (je nach Anzahl der Produkte)
- **Was passiert:** Alle Produktdaten werden aktualisiert

**WICHTIG:** Nach einer Preisänderung in Winestro erscheint der neue Preis spätestens am nächsten Tag auf der Website.

#### Manuelle Synchronisation (sofort):

Falls Sie eine Änderung sofort auf der Website sehen möchten:

1. Öffnen Sie in Ihrem Browser: `https://ihre-domain.de/admin/winestro-sync`
2. Klicken Sie auf "Synchronisation starten"
3. Warten Sie 5-15 Minuten
4. Fertig – Änderungen sind live

**HINWEIS:** Nutzen Sie die manuelle Synchronisation sparsam (nur bei dringenden Änderungen), da sie Server-Ressourcen beansprucht.

### 3.5 Neues Produkt in Winestro anlegen

**Schritt-für-Schritt:**

1. **In Winestro:** Produkt wie gewohnt anlegen
   - Artikelnummer vergeben
   - Preis festlegen
   - Lagerbestand eintragen
   - Weindaten eingeben
   - Bilder hochladen (mindestens ein Hauptbild)

2. **Synchronisation auslösen:**
   - Automatisch: Warten bis zur nächsten Nacht
   - Manuell: `/admin/winestro-sync` aufrufen

3. **In Sanity Studio:** Produktbeschreibung ergänzen (siehe Kapitel 4.3)

4. **Auf der Website:** Produkt ist jetzt sichtbar

### 3.6 Produktpreis ändern

1. **In Winestro:** Preis ändern
2. **Synchronisation:** Automatisch in der Nacht oder manuell starten
3. **Website:** Neuer Preis ist live

**WICHTIG:** Laufende Warenkörbe übernehmen den neuen Preis erst nach einem Neuladen der Seite.

### 3.7 Produkt aus dem Sortiment nehmen

**Option 1: Lagerbestand auf 0 setzen**
- Produkt erscheint als "Ausverkauft" auf der Website
- Kunden können es nicht mehr kaufen
- Produktseite bleibt sichtbar

**Option 2: In Winestro deaktivieren**
- Falls Winestro ein "Inaktiv"-Feld hat
- Produkt wird bei nächster Synchronisation von der Website entfernt

**TIPP:** Setzen Sie lieber den Lagerbestand auf 0, falls das Produkt später wieder verfügbar sein könnte.

### 3.8 Lagerbestand aktualisieren

- **In Winestro:** Lagerbestand wie gewohnt pflegen
- **Synchronisation:** Täglich automatisch
- **Website:** Zeigt aktuellen Bestand (bei Bestellung wird reserviert)

**WICHTIG:** Bei sehr niedrigem Lagerbestand (z.B. 1-2 Flaschen) sollten Sie häufiger manuell synchronisieren, um Überverkäufe zu vermeiden.

### 3.9 Häufige Fragen

**F: Warum erscheint mein neues Produkt nicht auf der Website?**
- Haben Sie in Winestro ein Bild hochgeladen? (Pflichtfeld)
- Ist der Lagerbestand größer als 0?
- Wurde die Synchronisation durchgeführt?
- Ist das Produkt in Winestro als "aktiv" markiert?

**F: Kann ich Preise direkt auf der Website ändern?**
- Nein. Alle Preise werden aus Winestro übernommen.

**F: Was passiert, wenn ich in Winestro ein Produkt lösche?**
- Es wird bei der nächsten Synchronisation auch von der Website entfernt.
- Alte Bestellungen behalten die Produktinformation (Snapshot).

---
<div style="page-break-after: always;"></div>

## 4. Inhalte bearbeiten mit Sanity Studio

### 4.1 Was ist Sanity Studio?

Sanity Studio ist Ihr **Content-Management-System (CMS)** – eine Benutzeroberfläche zum Bearbeiten von Website-Inhalten.

**Was Sie hier machen:**
- Produktbeschreibungen schreiben
- Weinbundles (Geschenksets) erstellen
- Blog-Artikel verfassen
- Kategorien verwalten
- SEO-Texte optimieren

**Was Sie hier NICHT machen:**
- Preise ändern → das machen Sie in Winestro
- Lagerbestände pflegen → das machen Sie in Winestro
- Bestellungen bearbeiten → das machen Sie in Winestro

### 4.2 Anmeldung bei Sanity Studio

1. Öffnen Sie Ihren Webbrowser (Chrome, Firefox oder Safari)
2. Rufen Sie auf: `https://ihre-domain.de/studio`
3. Klicken Sie auf "Anmelden"
4. Geben Sie Ihre Sanity-Zugangsdaten ein:
   - **E-Mail:** [Ihre E-Mail-Adresse]
   - **Passwort:** [Ihr Passwort]

**HINWEIS:** Die Zugangsdaten haben Sie separat von Ihrem Entwickler erhalten. Bewahren Sie sie sicher auf.

### 4.3 Produktbeschreibungen bearbeiten

**Warum ist das wichtig?**
Gute Produktbeschreibungen verkaufen. Winestro liefert nur technische Daten – hier erzählen Sie die Geschichte des Weins.

#### Schritt-für-Schritt Anleitung:

**Schritt 1: Produkt finden**
1. Melden Sie sich in Sanity Studio an
2. Klicken Sie links auf "Produkte" (oder "Products")
3. Nutzen Sie die Suchfunktion oben (z.B. nach Weinnamen oder Artikelnummer)
4. Klicken Sie auf das Produkt, das Sie bearbeiten möchten

**Schritt 2: Felder verstehen**

Wenn Sie ein Produkt öffnen, sehen Sie viele Felder. Die wichtigsten:

**Felder, die Sie BEARBEITEN sollten:**
- **Titel (Title):** Kann angepasst werden (z.B. Marketing-Name statt Winestro-Bezeichnung)
- **Untertitel (Subtitle):** Kurze Beschreibung (z.B. "Eleganter Rotwein vom Bioweingut Müller")
- **Beschreibung (Description):** Ausführlicher Text über den Wein
- **Bild (Image):** Hauptbild (kann ersetzt werden, falls Winestro-Bild nicht gefällt)
- **Galerie (Gallery):** Zusätzliche Bilder (Etikett, Weinberg, Winzer)
- **Tags:** Schlagworte für Filter (z.B. "Bio", "Vegan", "Trocken")
- **SEO-Titel (Meta Title):** Titel für Google-Suchergebnisse
- **SEO-Beschreibung (Meta Description):** Beschreibung für Google

**Felder, die Sie NICHT bearbeiten sollten (werden von Winestro überschrieben):**
- Preis
- Lagerbestand
- Artikelnummer
- Jahrgang, Rebsorte, Alkoholgehalt
- Nährwerte
- Erzeuger-Informationen

**Schritt 3: Produktbeschreibung schreiben**

Klicken Sie in das Feld "Beschreibung" (Description).

Sie haben einen **Rich-Text-Editor** mit Formatierungsoptionen:

**Toolbar-Funktionen:**
- **Fett / Kursiv:** Text hervorheben
- **Überschriften:** Abschnitte strukturieren
- **Listen:** Aufzählungen erstellen
- **Links:** Zu anderen Seiten verlinken

**Beispiel für eine gute Produktbeschreibung:**

```
Dieser elegante Riesling stammt aus den steilen Weinbergen des
Moseltals. Die kühlen Nächte und mineralischen Böden verleihen
ihm seine charakteristische Frische und feine Säurestruktur.

Geschmack und Aroma:
- Zitrusfrüchte und grüner Apfel
- Mineralische Noten
- Lebendige Säure mit langem Abgang

Ideal zu:
Leichten Fischgerichten, Salaten oder als Aperitif.

Das Weingut:
Die Familie Müller bewirtschaftet seit vier Generationen ihre
Weinberge nach biologischen Grundsätzen. Handarbeit und
nachhaltiger Anbau stehen im Mittelpunkt.
```

**TIPP:** Schreiben Sie so, wie Sie einem Kunden im Laden den Wein empfehlen würden. Persönlich, authentisch, nicht zu technisch.

**Schritt 4: SEO optimieren**

Scrollen Sie nach unten zum Bereich "SEO".

**SEO-Titel (Meta Title):**
- Maximal 60 Zeichen
- Sollte Produktname und wichtigstes Merkmal enthalten
- Beispiel: "Mosel Riesling 2022 trocken – Bio-Weingut Müller"

**SEO-Beschreibung (Meta Description):**
- Maximal 160 Zeichen
- Kurze Zusammenfassung, die zum Klicken animiert
- Beispiel: "Eleganter Bio-Riesling von der Mosel. Frische Zitrusnoten, mineralisch, perfekt zu Fisch und Meeresfrüchten. Jetzt bestellen!"

**Warum ist das wichtig?**
Diese Texte erscheinen in Google-Suchergebnissen und entscheiden, ob Kunden auf Ihre Website klicken.

**Schritt 5: Speichern**

- Klicken Sie rechts oben auf "Veröffentlichen" (Publish)
- Änderungen sind sofort live auf der Website

**HINWEIS:** Sie können auch "Entwurf speichern" wählen, wenn Sie später weiterarbeiten möchten.

### 4.4 Weinbundles / Geschenksets erstellen

Bundles sind **Produktpakete** (z.B. "Probierpaket Rotweine" oder "Geschenkset Weißwein").

**Warum Bundles?**
- Höherer Warenkorb-Wert
- Perfekt für Geschenke
- Sie legen einen Paketpreis fest (oft günstiger als Einzelkauf)

#### Schritt-für-Schritt Anleitung:

**Schritt 1: Neues Bundle anlegen**
1. Klicken Sie links auf "Bundles"
2. Klicken Sie rechts oben auf "+ Erstellen" oder "Create"

**Schritt 2: Bundle-Informationen eingeben**

**Titel (Title):**
- Beispiel: "Probierpaket Deutsche Rotweine"

**Slug:**
- Wird automatisch generiert (z.B. probierpaket-deutsche-rotweine)
- URL: ihre-domain.de/product/probierpaket-deutsche-rotweine

**Untertitel (Subtitle):**
- Kurze Beschreibung (z.B. "3 ausgewählte Rotweine für Entdecker")

**Beschreibung (Description):**
- Was ist im Paket enthalten?
- Warum ist es ein gutes Angebot?
- Für wen ist es geeignet?

Beispiel:
```
Entdecken Sie die Vielfalt deutscher Rotweine mit unserem Probierpaket.
Sorgfältig zusammengestellt für alle, die neue Geschmackserlebnisse suchen.

Inhalt:
• 1x Spätburgunder trocken vom Weingut Müller
• 1x Dornfelder halbtrocken vom Weingut Schmidt
• 1x Lemberger trocken vom Weingut Weber

Perfekt als Geschenk oder zum Selbstgenießen!
```

**Schritt 3: Produkte hinzufügen**

Scrollen Sie zum Bereich "Produkte im Bundle".

1. Klicken Sie auf "+ Produkt hinzufügen"
2. Wählen Sie ein Produkt aus der Liste (Suchfunktion nutzen)
3. Geben Sie die Menge ein (z.B. 1, 2, 3 Flaschen)
4. Wiederholen Sie für alle Produkte im Bundle

**TIPP:** Wählen Sie Produkte, die geschmacklich harmonieren oder ein Thema haben (z.B. "Bio-Weine", "Regionale Spezialitäten", "Sommerweine").

**Schritt 4: Preis festlegen**

**Bundle-Preis (Bundle Price):**
- Legen Sie einen Gesamtpreis fest
- Meist günstiger als die Summe der Einzelpreise (z.B. 10-15% Rabatt)

**Beispiel:**
- Einzelpreis: 3 Flaschen à 12€ = 36€
- Bundle-Preis: 32€ (Ersparnis: 4€)

**WICHTIG:** Der Bundle-Preis wird NICHT automatisch berechnet. Sie müssen ihn manuell eingeben.

**Schritt 5: Bilder hinzufügen**

**Hauptbild (Image):**
- Laden Sie ein Bild hoch, das das Bundle zeigt
- Ideal: Alle Flaschen zusammen arrangiert
- Oder: Nutzen Sie ein symbolisches Geschenkpaket-Bild

**Galerie (Gallery):**
- Optional: Zusätzliche Bilder der enthaltenen Weine

**Schritt 6: Lagerbestand**

Das System berechnet automatisch den verfügbaren Bundle-Bestand basierend auf den Einzelprodukten.

**Beispiel:**
- Produkt A: 10 auf Lager
- Produkt B: 5 auf Lager
- Produkt C: 8 auf Lager
- **Bundle-Bestand:** 5 (begrenzt durch Produkt B)

**HINWEIS:** Sie müssen den Bundle-Bestand nicht manuell pflegen. Aktualisieren Sie die Bestände in Winestro.

**Schritt 7: Veröffentlichen**

- Klicken Sie rechts oben auf "Veröffentlichen"
- Das Bundle erscheint sofort im Shop

### 4.5 Kategorien verwalten

Kategorien helfen Kunden, Weine zu finden (z.B. "Rotwein", "Weißwein", "Rosé", "Schaumwein").

#### Neue Kategorie anlegen:

1. Klicken Sie links auf "Kategorien" (Categories)
2. Klicken Sie auf "+ Erstellen"
3. **Name:** z.B. "Bioweine"
4. **Slug:** z.B. bioweine (für URL)
5. **Beschreibung:** Optional (erscheint auf der Kategorieseite)
6. **Veröffentlichen**

#### Produkt einer Kategorie zuordnen:

1. Öffnen Sie das Produkt in Sanity Studio
2. Scrollen Sie zum Feld "Kategorie" (Category)
3. Wählen Sie eine Kategorie aus der Dropdown-Liste
4. Speichern

### 4.6 Blog-Artikel erstellen

Der Blog ist ideal für:
- Weinwissen vermitteln
- Neue Produkte vorstellen
- Saisonale Angebote bewerben
- Suchmaschinen-Optimierung (SEO)

#### Schritt-für-Schritt:

**Schritt 1: Neuen Artikel anlegen**
1. Klicken Sie links auf "Blog" oder "Posts"
2. Klicken Sie auf "+ Erstellen"

**Schritt 2: Artikel schreiben**

**Titel (Title):**
- Klar und ansprechend
- Beispiel: "5 Tipps für die perfekte Weinlagerung"

**Slug:**
- Wird automatisch generiert
- URL: ihre-domain.de/blog/5-tipps-fuer-die-perfekte-weinlagerung

**Hauptbild (Main Image):**
- Ansprechendes Bild zum Thema
- Wird als Vorschaubild verwendet

**Inhalt (Body):**
- Schreiben Sie Ihren Artikel
- Nutzen Sie Überschriften zur Strukturierung
- Fügen Sie Bilder ein (Toolbar: "Bild einfügen")
- Erstellen Sie Listen und Absätze

**Autor (Author):**
- Wählen Sie einen Autor aus (z.B. Ihr Name oder "Weingut-Team")
- Falls noch kein Autor existiert: Zuerst unter "Autoren" anlegen

**Kategorien / Tags:**
- Optional: Ordnen Sie den Artikel Kategorien zu
- Hilft Lesern, verwandte Artikel zu finden

**SEO:**
- Meta-Titel und Beschreibung wie bei Produkten

**Schritt 3: Veröffentlichen**
- Klicken Sie auf "Veröffentlichen"
- Artikel erscheint im Blog-Bereich der Website

**TIPP:** Veröffentlichen Sie regelmäßig Artikel (z.B. einmal im Monat), um die Website lebendig zu halten und Google-Rankings zu verbessern.

### 4.7 Häufige Fragen zu Sanity Studio

**F: Ich habe einen Fehler gemacht. Kann ich Änderungen rückgängig machen?**
- Ja, Sanity speichert Versionshistorie.
- Fragen Sie Ihren Entwickler nach Anleitung zum Wiederherstellen.

**F: Kann ich Bilder direkt hochladen?**
- Ja, klicken Sie auf "Bild hochladen" und wählen Sie Dateien von Ihrem Computer.
- Empfohlene Größe: Mindestens 1200x800 Pixel, Format: JPG oder PNG.

**F: Wie lange dauert es, bis Änderungen live sind?**
- Sofort nach dem Veröffentlichen (innerhalb von Sekunden).

**F: Kann ich mit mehreren Personen gleichzeitig arbeiten?**
- Ja, Sanity unterstützt mehrere Nutzer.
- Sie sehen, wenn jemand anderes gerade ein Dokument bearbeitet.

**F: Was ist der Unterschied zwischen "Entwurf speichern" und "Veröffentlichen"?**
- **Entwurf:** Änderungen sind gespeichert, aber nicht öffentlich.
- **Veröffentlichen:** Änderungen sind sofort auf der Website sichtbar.

---
<div style="page-break-after: always;"></div>

## 5. Kunden- und Bestellverwaltung

### 5.1 Wie Kunden sich registrieren

Kunden können sich auf Ihrer Website registrieren, um:
- Bestellungen aufzugeben
- Bestellhistorie einzusehen
- Adressen zu speichern (werden beim nächsten Kauf vorausgefüllt)

**Der Registrierungsprozess:**
1. Kunde klickt auf "Anmelden" oder geht zur Kasse
2. Wählt "Konto erstellen"
3. Gibt E-Mail und Passwort ein
4. Bestätigt E-Mail-Adresse (Bestätigungslink per E-Mail)
5. Fertig – kann jetzt bestellen

**Was verwaltet Clerk (das Login-System)?**
- Benutzerkonten
- E-Mail-Adressen
- Passwörter (verschlüsselt gespeichert)
- Anmeldungen / Abmeldungen

### 5.2 Kundendaten einsehen

**Option 1: In Sanity Studio**
- Öffnen Sie Sanity Studio
- Klicken Sie auf "Bestellungen" (Orders)
- Wählen Sie eine Bestellung aus
- Dort sehen Sie: Name, E-Mail, Adressen

**Option 2: In Winestro**
- Bestellungen enthalten automatisch Kundendaten
- Sie sehen alle Informationen, die zur Abwicklung nötig sind

**Option 3: Im Clerk Dashboard (optional)**
- Falls Sie Zugriff haben: clerk.com
- Melden Sie sich an
- Gehen Sie zu "Users"
- Dort sehen Sie alle registrierten Kunden

**WICHTIG: Datenschutz**
Kundendaten sind vertraulich. Geben Sie sie nicht an Dritte weiter. Sie unterliegen der DSGVO (Datenschutz-Grundverordnung).

### 5.3 Bestellhistorie für Kunden

Kunden können ihre Bestellungen selbst einsehen:
1. Anmelden auf der Website
2. Zu "Meine Bestellungen" navigieren
3. Liste aller Bestellungen mit Status

**Bestellstatus, die Kunden sehen:**
- **Ausstehend (Pending):** Bestellung eingegangen, Zahlung ausstehend
- **Bezahlt (Paid):** Zahlung bestätigt
- **In Bearbeitung (Processing):** Ware wird kommissioniert
- **Versendet (Shipped):** Paket ist unterwegs
- **Zugestellt (Delivered):** Paket angekommen

**Sie aktualisieren den Status in Winestro**, die Website zeigt ihn dem Kunden an.

### 5.4 Bestellstatus verstehen

Die Website vergibt automatisch Status während des Bestellprozesses:

| Status | Bedeutung | Was passiert? |
|--------|-----------|---------------|
| **pending** | Ausstehend | Bestellung erstellt, Zahlung noch offen (Vorkasse/Rechnung) |
| **paid** | Bezahlt | Zahlung eingegangen (PayPal: sofort; Vorkasse: nach Überweisung) |
| **processing** | In Bearbeitung | Sie kommissionieren die Ware |
| **shipped** | Versendet | Paket ist unterwegs, Trackingnummer vergeben |
| **delivered** | Zugestellt | Paket wurde zugestellt |
| **cancelled** | Storniert | Bestellung wurde abgebrochen |
| **refunded** | Erstattet | Geld wurde zurückerstattet |

**Wo ändern Sie den Status?**
→ In Winestro. Die Website synchronisiert diese Information (falls Sie Winestro-Webhooks eingerichtet haben).

**HINWEIS:** Derzeit müssen Sie Status möglicherweise manuell abgleichen. Sprechen Sie mit Ihrem Entwickler über automatische Status-Updates.

### 5.5 Häufige Kundenanfragen

**"Ich habe mein Passwort vergessen"**
- Kunde klickt auf "Passwort vergessen" auf der Login-Seite
- Erhält E-Mail mit Zurücksetzen-Link
- Kein Eingriff nötig

Falls es doch Probleme gibt:
- Im Clerk Dashboard: Passwort manuell zurücksetzen

**"Ich kann mich nicht anmelden"**
- Prüfen Sie im Clerk Dashboard, ob das Konto existiert
- Eventuell E-Mail-Adresse noch nicht bestätigt
- Sie können manuell als "verifiziert" markieren

**"Wo ist meine Bestellung?"**
1. Suchen Sie die Bestellnummer in Winestro
2. Prüfen Sie den Status
3. Wenn versendet: Geben Sie die Trackingnummer durch
4. Falls nicht versendet: Erklären Sie den Grund (z.B. "Zahlung noch nicht eingegangen")

**"Ich möchte stornieren"**
- Falls noch nicht versendet: Stornierung in Winestro
- Falls bereits versendet: Rücksendeprozess erklären
- Rückerstattung über PayPal bzw. Banküberweisung

**"Rechnung verloren"**
- Rechnung erneut aus Winestro generieren und per E-Mail senden

### 5.6 Gespeicherte Adressen

Seit dem letzten Update speichert die Website automatisch die Liefer- und Rechnungsadresse von Kunden nach der ersten Bestellung.

**Was bedeutet das?**
- Beim nächsten Einkauf werden Adressfelder automatisch vorausgefüllt
- Kunde kann Adressen vor dem Absenden ändern
- Spart Zeit und reduziert Tippfehler

**Wo werden Adressen gespeichert?**
- In Clerk (verschlüsselt im Benutzerprofil)
- Nicht in Sanity oder Winestro (nur bei konkreten Bestellungen)

**Kann ich als Admin Adressen ändern?**
- Nicht direkt über die Website
- Im Clerk Dashboard: Ja (technischer Zugriff)

---
<div style="page-break-after: always;"></div>

## 6. Website-Einstellungen und Konfiguration

### 6.1 Übersicht der Systeme

Ihre Website verwendet verschiedene Dienste, die zusammenarbeiten. Jeder Dienst hat ein **Dashboard** zur Verwaltung.

| Dienst | Funktion | Dashboard-URL | Zugangsdaten |
|--------|----------|---------------|--------------|
| **Winestro** | Warenwirtschaft | `https://winestro.de/login` | [Von Winestro erhalten] |
| **Sanity** | Content-Management | `https://sanity.io` | [Separat erhalten] |
| **Clerk** | Benutzer-Anmeldung | `https://dashboard.clerk.com` | [Separat erhalten] |
| **PayPal** | Zahlungsabwicklung | `https://paypal.com` | [Ihr PayPal-Konto] |
| **Hosting (Vercel)** | Website-Hosting | `https://vercel.com` | [Separat erhalten] |

**WICHTIG:** Bewahren Sie alle Zugangsdaten sicher auf (z.B. in einem Passwort-Manager).

### 6.2 Umgebungsvariablen (Environment Variables)

**Was sind Umgebungsvariablen?**
Das sind geheime Konfigurationsdaten (z.B. API-Schlüssel), die Ihre Website benötigt, um mit anderen Diensten zu kommunizieren.

**Wo werden sie gespeichert?**
Im Hosting-Dashboard (z.B. Vercel).

**Müssen Sie etwas tun?**
Normalerweise nicht – sie wurden beim Setup konfiguriert.

**Wann müssen sie geändert werden?**
- Neues PayPal-Konto
- Neue Winestro-API-Zugangsdaten
- Wechsel zu einem anderen Hosting-Anbieter
- Nach einem Sicherheitsvorfall (Passwörter/Keys neu generieren)

### 6.3 Erforderliche Konfigurationen

#### Winestro-API (Produktsynchronisation)

**Benötigte Werte:**
- **WINESTRO_BASE_URL:** `https://weinstore.net/xml/v21.0/wbo-API.php`
- **WINESTRO_UID:** [Ihre Winestro-Benutzer-ID]
- **WINESTRO_API_USER:** [Ihr API-Benutzername]
- **WINESTRO_API_CODE:** [Ihr API-Schlüssel]
- **WINESTRO_SHOP_ID:** [Ihre Shop-ID, meist `1`]

**Wo bekommen Sie diese Werte?**
- In Ihrem Winestro-Konto unter "Einstellungen" → "XML-Schnittstelle"

**Hinweis:** Diese Werte sind bereits konfiguriert. Notieren Sie sie für den Fall, dass Sie sie neu eingeben müssen.

#### Sanity (Content-Management)

**Benötigte Werte:**
- **NEXT_PUBLIC_SANITY_PROJECT_ID:** [Ihre Projekt-ID, z.B. `3y5r987r`]
- **NEXT_PUBLIC_SANITY_DATASET:** `production`
- **SANITY_API_TOKEN:** [Ihr API-Token mit Schreibrechten]

**Wo bekommen Sie diese Werte?**
- Sanity.io → Ihr Projekt → "API" → "Tokens"

#### Clerk (Benutzer-Authentifizierung)

**Benötigte Werte:**
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:** [Öffentlicher Schlüssel]
- **CLERK_SECRET_KEY:** [Geheimer Schlüssel]

**Wo bekommen Sie diese Werte?**
- Clerk Dashboard → Ihr Projekt → "API Keys"

#### PayPal (Zahlungsabwicklung)

**Benötigte Werte:**
- **NEXT_PUBLIC_PAYPAL_CLIENT_ID:** [Ihre PayPal-Client-ID]
- **PAYPAL_CLIENT_SECRET:** [Ihr PayPal-Geheimschlüssel]
- **PAYPAL_ENVIRONMENT:** `live` (für Produktion)

**Wo bekommen Sie diese Werte?**
- PayPal Developer Portal: `https://developer.paypal.com`
- Gehen Sie zu "My Apps & Credentials"
- Wählen Sie "Live" (nicht Sandbox)

**WICHTIG:** Verwenden Sie LIVE-Credentials, nicht Sandbox-Credentials.

### 6.4 Domain-Setup

**Aktuell:** Ihre Website läuft wahrscheinlich auf einer temporären Domain (z.B. `ihreprojekt.vercel.app`).

**Ziel:** Ihre eigene Domain (z.B. `www.ihr-weingut.de`).

#### Schritte zum Domain-Wechsel:

**Schritt 1: Domain registrieren**
- Falls noch nicht geschehen: Domain bei einem Registrar kaufen (z.B. IONOS, Strato, GoDaddy)

**Schritt 2: Domain zum Hosting hinzufügen**
- Im Hosting-Dashboard (z.B. Vercel):
  - Gehen Sie zu "Domains"
  - Klicken Sie auf "Add Domain"
  - Geben Sie Ihre Domain ein (z.B. `www.ihr-weingut.de`)

**Schritt 3: DNS-Einträge konfigurieren**
- Beim Domain-Registrar:
  - Fügen Sie einen **CNAME-Eintrag** hinzu:
    - Name: `www`
    - Ziel: `cname.vercel-dns.com` (oder wie vom Hosting-Anbieter angegeben)

**Schritt 4: SSL-Zertifikat**
- Wird automatisch vom Hosting-Anbieter ausgestellt (kostenlos via Let's Encrypt)
- Dauert ca. 10-30 Minuten

**Schritt 5: Dienste aktualisieren**
Nach dem Domain-Wechsel müssen Sie folgende Dienste benachrichtigen:

**Clerk:**
- Dashboard → Settings → Domains
- Fügen Sie neue Domain hinzu

**PayPal:**
- Eventuell neue Domain in PayPal-App-Einstellungen registrieren (meist nicht nötig)

**Sanity:**
- CORS-Einstellungen prüfen (sollte bereits `*` erlauben, funktioniert also automatisch)

**TIPP:** Lassen Sie den Domain-Wechsel von Ihrem Entwickler oder Hosting-Support begleiten.

### 6.5 Backup und Sicherheit

**Werden Backups erstellt?**
- **Sanity:** Automatische Backups täglich
- **Winestro:** Backups gemäß Winestro-Service
- **Clerk:** Automatische Backups täglich
- **Code/Website:** Versionskontrolle via Git (alle Änderungen gespeichert)

**Was sollten Sie regelmäßig sichern?**
- Ihre Zugangsdaten (Passwort-Manager nutzen)
- Winestro-Backups (falls lokal)

**Sicherheitstipps:**
- Verwenden Sie starke Passwörter (mind. 12 Zeichen, Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen)
- Aktivieren Sie Zwei-Faktor-Authentifizierung (2FA) wo möglich
- Teilen Sie API-Schlüssel niemals öffentlich
- Prüfen Sie regelmäßig, wer Zugriff auf Dashboards hat

### 6.6 Wann brauchen Sie Entwickler-Unterstützung?

**Sie können selbst erledigen:**
- Produktdaten in Winestro pflegen
- Inhalte in Sanity Studio bearbeiten
- Bestellungen bearbeiten
- Kunden-Support

**Sie brauchen Entwickler-Hilfe bei:**
- Änderungen am Website-Design
- Neue Funktionen (z.B. Gutschein-Codes, Bewertungen)
- Technische Fehler (z.B. Synchronisation funktioniert nicht)
- Domain-Wechsel
- Integration weiterer Zahlungsmethoden
- Performance-Optimierung
- Sicherheitsupdates

---
<div style="page-break-after: always;"></div>

## 7. Wartung und Best Practices

### 7.1 Tägliche Checkliste

**Morgens (5-10 Minuten):**
- [ ] Winestro-Dashboard öffnen
- [ ] Neue Bestellungen prüfen
- [ ] PayPal-Konto prüfen (Zahlungseingänge)
- [ ] Bankkonto prüfen (Vorkasse-Eingänge)
- [ ] Bestellungen zur Kommissionierung freigeben

**Nach Versand:**
- [ ] Status in Winestro auf "versendet" setzen
- [ ] Trackingnummer eintragen (falls vorhanden)

**Abends (optional):**
- [ ] Nochmals Bestellungen prüfen (falls nachmittags Bestellungen eingegangen)

### 7.2 Wöchentliche Checkliste

**Einmal pro Woche (ca. 30 Minuten):**
- [ ] Lagerbestände in Winestro prüfen (Produkte mit niedrigem Bestand nachbestellen)
- [ ] Offene Rechnungen prüfen (Mahnungen versenden?)
- [ ] Produktbeschreibungen in Sanity stichprobenartig prüfen
- [ ] Website auf Funktionsfähigkeit testen:
  - [ ] Ein Produkt in den Warenkorb legen
  - [ ] Checkout-Prozess ansehen (nicht abschließen)
  - [ ] Prüfen, ob Bilder laden
- [ ] Winestro-Synchronisation manuell starten (falls automatische Sync nicht läuft)

### 7.3 Monatliche Checkliste

**Einmal pro Monat (ca. 1-2 Stunden):**
- [ ] PayPal-Transaktionen mit Winestro abgleichen
- [ ] Umsatzstatistiken auswerten (Winestro und/oder PayPal)
- [ ] Bestseller identifizieren → ggf. nachbestellen / bewerben
- [ ] Saisonale Bundles erstellen (z.B. Sommerweine, Weihnachtsgeschenke)
- [ ] Blog-Artikel schreiben (1-2 pro Monat empfohlen)
- [ ] SEO-Optimierung: Produktbeschreibungen überarbeiten
- [ ] Kundenbewertungen prüfen (falls implementiert)
- [ ] Backup-Status prüfen (Sanity, Winestro)

### 7.4 Jährliche Aufgaben

**Einmal pro Jahr:**
- [ ] Alle Zugangsdaten ändern (Passwörter, API-Keys)
- [ ] Datenschutzerklärung aktualisieren (falls Änderungen)
- [ ] AGB prüfen und ggf. aktualisieren
- [ ] Impressum prüfen
- [ ] Domain-Verlängerung prüfen
- [ ] Hosting-Vertrag verlängern
- [ ] Entwickler beauftragen für: Sicherheitsupdates, neue Features

### 7.5 Häufige Probleme und Lösungen

#### Problem: Produkt erscheint nicht auf der Website

**Mögliche Ursachen und Lösungen:**
1. **Lagerbestand ist 0**
   - Lösung: Bestand in Winestro erhöhen
2. **Produkt hat kein Bild**
   - Lösung: Bild in Winestro hochladen
3. **Synchronisation noch nicht durchgeführt**
   - Lösung: Manuelle Synchronisation starten (`/admin/winestro-sync`)
4. **Produkt in Winestro deaktiviert**
   - Lösung: Produkt in Winestro aktivieren

#### Problem: Bestellung erscheint nicht in Winestro

**Mögliche Ursachen und Lösungen:**
1. **API-Verbindung unterbrochen**
   - Lösung: Testen Sie die Verbindung unter `/admin/winestro-sync` → "Verbindung testen"
   - Falls Fehler: Entwickler kontaktieren
2. **Artikelnummer fehlt im Winestro-System**
   - Lösung: Stellen Sie sicher, dass alle bestellten Produkte in Winestro existieren
3. **Bestellung wurde manuell storniert**
   - Lösung: Prüfen Sie Sanity Studio → "Bestellungen"

#### Problem: Kunde kann nicht bezahlen (PayPal)

**Mögliche Ursachen und Lösungen:**
1. **PayPal-Konto des Kunden hat Probleme**
   - Lösung: Kunde soll PayPal-Support kontaktieren
2. **PayPal-API-Schlüssel abgelaufen**
   - Lösung: Entwickler kontaktieren zum Erneuern
3. **PayPal-Konto nicht verifiziert**
   - Lösung: Kunde muss PayPal-Konto verifizieren

#### Problem: Synchronisation schlägt fehl

**Fehlermeldung prüfen:**
- Gehen Sie zu `/admin/winestro-sync`
- Klicken Sie auf "Verbindung testen"
- Lesen Sie die Fehlermeldung

**Häufige Fehler:**
- **"Authentication failed"** → API-Zugangsdaten falsch
- **"No products found"** → Winestro liefert keine Daten (evtl. Filter aktiv?)
- **"Timeout"** → Winestro-Server antwortet nicht (später erneut versuchen)

**Lösung:**
- Bei API-Fehlern: Entwickler kontaktieren
- Bei Timeout: 30 Minuten warten und erneut versuchen

#### Problem: Website lädt langsam

**Mögliche Ursachen:**
1. **Viele große Bilder**
   - Lösung: Bilder vor dem Upload komprimieren (max. 500 KB pro Bild)
2. **Viele Besucher gleichzeitig**
   - Normal bei Aktionen – sollte sich von selbst lösen
3. **Server-Problem**
   - Lösung: Hosting-Support kontaktieren

#### Problem: Kunde erhält keine Bestätigungs-E-Mail

**Mögliche Ursachen:**
1. **E-Mail im Spam-Ordner**
   - Lösung: Kunde soll Spam-Ordner prüfen
2. **E-Mail-Adresse falsch eingegeben**
   - Lösung: Prüfen Sie in Sanity Studio die Bestellung → Korrigieren und manuell E-Mail senden
3. **E-Mail-Versand funktioniert nicht**
   - Lösung: Entwickler kontaktieren

### 7.6 Best Practices für erfolgreichen Verkauf

**Produktbeschreibungen:**
- Schreiben Sie persönlich und authentisch
- Erzählen Sie Geschichten (Winzer, Region, Herstellung)
- Nutzen Sie Sinneseindrücke (Geschmack, Duft, Farbe)
- Geben Sie Speiseempfehlungen

**Produktbilder:**
- Hochwertige Fotos (mindestens 1200px Breite)
- Zeigen Sie Flasche, Etikett, eventuell Weinberg
- Nutzen Sie natürliches Licht
- Einheitlicher Stil für professionelles Erscheinungsbild

**Preise und Angebote:**
- Markieren Sie reduzierte Preise deutlich
- Erstellen Sie saisonale Bundles (Weihnachten, Valentinstag, Sommer)
- Bieten Sie Probierpakete an
- Versandkostenfreie Lieferung ab 70€ bewerben

**SEO (Suchmaschinenoptimierung):**
- Füllen Sie ALLE SEO-Felder in Sanity aus
- Verwenden Sie relevante Keywords (z.B. "Riesling trocken Mosel")
- Schreiben Sie einzigartige Beschreibungen (kein Copy-Paste)
- Veröffentlichen Sie regelmäßig Blog-Artikel

**Kundenbindung:**
- Antworten Sie schnell auf Anfragen
- Versenden Sie Bestellungen zügig
- Legen Sie eventuell eine Visitenkarte oder Flyer bei
- Bieten Sie Newsletter an (erfordert zusätzliche Implementierung)

**Social Media:**
- Teilen Sie neue Produkte auf Instagram/Facebook
- Verlinken Sie zur Website
- Nutzen Sie Hashtags (#Wein #Rotwein #RegionaleName)

---
<div style="page-break-after: always;"></div>

## 8. Technische Referenz

### 8.1 Wichtige URLs

| Zweck | URL | Beschreibung |
|-------|-----|--------------|
| **Ihre Website** | `https://ihre-domain.de` | Öffentlicher Shop |
| **Sanity Studio** | `https://ihre-domain.de/studio` | Content-Management |
| **Winestro-Sync** | `https://ihre-domain.de/admin/winestro-sync` | Manuelle Produktsynchronisation |
| **Sanity Dashboard** | `https://sanity.io` | Projekt-Verwaltung |
| **Clerk Dashboard** | `https://dashboard.clerk.com` | Benutzer-Verwaltung |
| **PayPal Dashboard** | `https://paypal.com` | Zahlungsübersicht |
| **Hosting Dashboard** | `https://vercel.com` | Website-Hosting (oder Ihre Hosting-Plattform) |

### 8.2 API-Credentials (Platzhalter)

**WICHTIG:** Ersetzen Sie diese Platzhalter mit Ihren tatsächlichen Werten. Bewahren Sie sie sicher auf.

#### Winestro API:
```
WINESTRO_BASE_URL=https://weinstore.net/xml/v21.0/wbo-API.php
WINESTRO_UID=[Ihre Winestro-Benutzer-ID]
WINESTRO_API_USER=[Ihr API-Benutzername]
WINESTRO_API_CODE=[Ihr API-Schlüssel]
WINESTRO_SHOP_ID=1
```

#### Sanity:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=[Ihre Projekt-ID]
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=[Ihr API-Token]
```

#### Clerk:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[Öffentlicher Schlüssel]
CLERK_SECRET_KEY=[Geheimer Schlüssel]
```

#### PayPal:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=[Ihre Client-ID]
PAYPAL_CLIENT_SECRET=[Ihr Geheimschlüssel]
PAYPAL_ENVIRONMENT=live
```

### 8.3 Support-Kontakte

**Entwickler / Technischer Support:**
- **Name:** [Name des Entwicklers/Agentur]
- **E-Mail:** [support@ihre-agentur.de]
- **Telefon:** [+49 XXX XXXXXXXX]
- **Verfügbarkeit:** [Montag-Freitag, 9-17 Uhr]

**Winestro Support:**
- **E-Mail:** support@winestro.de
- **Telefon:** [Winestro-Hotline]
- **Website:** https://winestro.de/support

**Sanity Support:**
- **E-Mail:** support@sanity.io
- **Dokumentation:** https://sanity.io/docs
- **Slack Community:** https://slack.sanity.io

**Clerk Support:**
- **E-Mail:** support@clerk.com
- **Dokumentation:** https://clerk.com/docs
- **Discord Community:** https://discord.com/invite/clerk

**PayPal Support:**
- **Telefon:** 0800 723 4500 (kostenlos aus Deutschland)
- **Website:** https://paypal.com/de/help

**Hosting Support (Vercel):**
- **E-Mail:** support@vercel.com
- **Dokumentation:** https://vercel.com/docs
- **Status-Seite:** https://vercel-status.com

### 8.4 Versionsinformationen

**Technologie-Stack:**
- **Framework:** Next.js 15.5.2
- **Frontend-Bibliothek:** React 19.1.0
- **CMS:** Sanity 4.10.2
- **Authentifizierung:** Clerk 6.33.3
- **Zahlungen:** PayPal React SDK 8.9.1
- **State-Management:** Zustand 5.0.8
- **Styling:** Tailwind CSS 4.1.13

**Winestro API:**
- **Version:** XML API v21.0 (kompatibel mit v22.0)

**Node.js:**
- **Empfohlene Version:** v20 oder höher

### 8.5 Wichtige Dateien und Ordner

Falls Sie mit einem Entwickler sprechen, sind diese Dateien relevant:

| Datei/Ordner | Beschreibung |
|--------------|--------------|
| `/app/(client)/checkout/page.tsx` | Checkout-Seite (Bestellprozess) |
| `/app/api/orders/route.ts` | API-Endpunkt für Bestellungen |
| `/lib/winestro-sync.ts` | Produktsynchronisation mit Winestro |
| `/lib/winestro-order.ts` | Bestellübertragung an Winestro |
| `/sanity/schemaTypes/productType.ts` | Produktdaten-Schema |
| `/sanity/schemaTypes/orderType.ts` | Bestelldaten-Schema |
| `/sanity/schemaTypes/bundleType.ts` | Bundle-Schema |
| `.env` | Umgebungsvariablen (API-Keys) |

---
<div style="page-break-after: always;"></div>

## 9. Glossar

**API (Application Programming Interface):**
Schnittstelle, über die verschiedene Systeme miteinander kommunizieren (z.B. Website ↔ Winestro).

**Backend:**
Der "unsichtbare" Teil der Website, der im Hintergrund läuft (Server, Datenbanken).

**Bundle:**
Ein Produktpaket aus mehreren Weinen zu einem Gesamtpreis (z.B. Probierpaket).

**CMS (Content Management System):**
Software zur Verwaltung von Inhalten (bei Ihnen: Sanity Studio).

**CORS (Cross-Origin Resource Sharing):**
Sicherheitsmechanismus, der regelt, welche Websites auf Ihre Daten zugreifen dürfen.

**Dashboard:**
Übersichtsseite zur Verwaltung eines Systems.

**DNS (Domain Name System):**
System, das Domain-Namen (z.B. ihre-domain.de) in IP-Adressen übersetzt.

**DSGVO (Datenschutz-Grundverordnung):**
EU-Gesetz zum Schutz personenbezogener Daten.

**Hosting:**
Bereitstellung von Speicherplatz und Server für Ihre Website.

**Metadata:**
Zusätzliche Daten über Daten (z.B. SEO-Beschreibungen).

**PayPal Sandbox:**
Test-Umgebung für PayPal (simuliert Zahlungen, ohne echtes Geld).

**PayPal Live:**
Echte Produktionsumgebung von PayPal (echte Zahlungen).

**Rich Text Editor:**
Textfeld mit Formatierungsoptionen (fett, kursiv, Listen, etc.).

**SEO (Search Engine Optimization):**
Suchmaschinenoptimierung – Maßnahmen, damit Ihre Website bei Google besser gefunden wird.

**Slug:**
URL-freundliche Version eines Titels (z.B. "probierpaket-rotweine" für URL).

**SSL/TLS:**
Verschlüsselung für sichere Datenübertragung (HTTPS).

**Synchronisation (Sync):**
Abgleich von Daten zwischen Winestro und Website.

**Token:**
Digitaler Schlüssel für den Zugriff auf eine API.

**URL (Uniform Resource Locator):**
Webadresse (z.B. https://ihre-domain.de/shop).

**Vorkasse:**
Zahlung per Überweisung vor dem Versand.

**Webhook:**
Automatische Benachrichtigung zwischen Systemen (z.B. Winestro informiert Website über Status-Änderung).

---

## Anhang: Kontakt und nächste Schritte

### Ihre Zugangsdaten

**Bitte tragen Sie hier Ihre Zugangsdaten ein (sicher aufbewahren!):**

**Sanity Studio:**
- E-Mail: _______________________
- Passwort: _____________________ (nicht aufschreiben, in Passwort-Manager speichern)
- Projekt-ID: _______________________

**Clerk Dashboard (optional):**
- E-Mail: _______________________
- Passwort: _____________________ (nicht aufschreiben, in Passwort-Manager speichern)

**Winestro:**
- Benutzername: _______________________
- Passwort: _____________________ (nicht aufschreiben, in Passwort-Manager speichern)

**PayPal:**
- E-Mail: _______________________
- Passwort: _____________________ (nicht aufschreiben, in Passwort-Manager speichern)

**Hosting (Vercel / anderer Anbieter):**
- E-Mail: _______________________
- Passwort: _____________________ (nicht aufschreiben, in Passwort-Manager speichern)

### Nächste Schritte nach Übergabe

1. **Zugangsdaten testen:**
   - Melden Sie sich bei allen Systemen an
   - Prüfen Sie, ob Sie Zugriff haben

2. **Erste Produktbeschreibung schreiben:**
   - Wählen Sie einen Ihrer Bestseller
   - Schreiben Sie eine ausführliche Beschreibung in Sanity Studio
   - Veröffentlichen Sie die Änderung

3. **Erstes Bundle erstellen:**
   - Erstellen Sie ein Probierpaket mit 3 Weinen
   - Laden Sie ein ansprechendes Bild hoch
   - Veröffentlichen Sie das Bundle

4. **Test-Bestellung durchführen:**
   - Legen Sie einen Artikel in den Warenkorb
   - Gehen Sie bis zur Zahlungsseite (NICHT abschließen, falls PayPal live ist)
   - Prüfen Sie, ob alles funktioniert

5. **Regelmäßige Routine etablieren:**
   - Richten Sie sich einen täglichen Alarm für Bestellprüfungen ein
   - Planen Sie wöchentliche Zeit für Sanity Studio ein
   - Notieren Sie sich Fragen für Ihren Entwickler

### Schulungsmöglichkeiten

Falls Sie weitere Schulung wünschen:
- **Video-Tutorials:** Können aufgezeichnet werden
- **Live-Schulung:** Termin mit Entwickler vereinbaren
- **Dokumentation:** Sanity und Clerk haben ausführliche englische Dokumentation

---

**Ende des Handbuchs**

Bei Fragen wenden Sie sich jederzeit an Ihren technischen Support. Viel Erfolg mit Ihrem Online-Weinshop!
