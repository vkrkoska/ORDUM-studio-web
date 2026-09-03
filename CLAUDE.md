# ORDUM studio — kontext projektu

## O štúdiu
ORDUM studio, s.r.o. — architektonické štúdio so sídlom v Bratislave, zakladateľ Ing. arch. Viktor.
Názov spája latinské "ordo" (poriadok/usporiadanie) a "stratum" (vrstva/čítanie priestoru v čase) —
kontextuálny, vrstvený prístup k architektúre. Toto by sa malo odrážať aj vo vizuálnom jazyku stránky.

## Dizajnové referencie
bplus.xyz (brandlhuber+), Šépka architekti, Divisare, hic arquitectura, Chybik+Kristof,
Miller & Maranta, Christ & Gantenbein, fala atelier, caminada-architekten, studio muoto, raumlabor.

## Aktuálny stav dizajnu (finálne rozhodnutia — nemeniť bez výslovnej žiadosti)
- **Layout:** galéria grid na homepage + samostatné stránky pre jednotlivé projekty (multi-page, nie single-page)
- **Farby:** fixná svetlá/biela schéma. **Dark mode je zámerne zamietnutý — nikdy ho nepridávaj.**
  Akcentová farba `#0011ff` sa používa ako výplň polí/prvkov, nie ako farebný text.
- **Typografia:** iba Inter 400/700 + IBM Plex Mono 400. Žiadne ďalšie rezy ani písma.
  Veľkostná škála je fixná cez CSS premenné.
- **Detaily:**
  - Ľavý scroll progress indikátor: 10px od okraja, bez pozadia/tracku, iba výplň akcentovou farbou
  - Hairline rules (tenké deliace čiary)
  - Číslovaný index projektov
- **Obsah:** 8 vizualizácií naprieč 2 projektmi (kultúrne centrum, vínna pivnica/degustačka) — reálne thumbnaily

## Štruktúra súborov
```
index.html
atelier.html
kontakt.html
project-0001.html ... project-0005.html
styles.css
script.js
images/
```

## Princípy (drž sa ich)
- Žiadne dekoratívne prvky, ak nemajú funkčné opodstatnenie
- Konzistentné zarovnanie stĺpcov naprieč všetkými stránkami
- Žiadny duplicitný obsah medzi stránkami

## Technické riešenia (nerieš znova od nuly — toto už bolo vyriešené)
- **Dark mode rendering na iPade:** opravené cez `color-scheme` meta tag + explicitné `background-color`
  na všetkých elementoch
- **Zmenšovanie social buttonov pri hoveri:** spôsobené zmenou border farby (ovplyvňuje box model) →
  riešenie: `box-shadow: inset` namiesto `border`
- **Zarovnanie rovnice ORDO + STRATUM = ORDUM:** operátory (+, =) musia byť sibling elementy,
  nie vnorené v term blokoch, inak sa rozíde baseline zarovnanie

## Nástroje
CMS: Decap CMS (zvolené namiesto WordPressu — zachováva custom dizajn, umožňuje login-based
správu obsahu). Návrhy/vizualizácie vznikajú v ArchiCAD + Twinmotion.

## Ako pracovať
- Pred väčšou zmenou krátko zhrň plán a rozdiely oproti súčasnému stavu
- Rešpektuj už padnuté a zamietnuté rozhodnutia vyššie (dark mode, WordPress, single-page — to je zavreté)
- Pri neistote radšej over konzistenciu naprieč stránkami než dokončiť len jednu

---
*Tento súbor je návrh na základe doterajšej histórie projektu. Priebežne ho aktualizuj —
najmä ak sa odvtedy niečo zmenilo, čo tu ešte nie je zachytené.*
