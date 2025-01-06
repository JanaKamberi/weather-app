# Weather App

Ky eshte nje aplikacion i parashikimit te motit i bazuar ne React qe shfaq parashikimin e motit per nje qytet te zgjedhur. Aplikacioni tregon ndyshimin e temperaturave, kushtet e motit (diell, me re, me shi) dhe te dhena te tjera.

## Karakteristikat

- **Parashikimi i motit**: Shfaq parashikimet ditore te motit (temperatura maksimale dhe minimale, shpejtesia e eres, reshjet, etj.).
- **Add a new city**: Perdoruesit mund te shtojne nje qytet te ri se bashku me gjeresine dhe gjatesine e tij per te pare parashikimin e motit per ate qytet.
- **UI Interactive**: Perdoruesit mund te zgjedhin nje qytet dhe aplikacioni merr dhe shfaq te dhenat perkatese te motit.

## Perdorimi i aplikacionit

Ne applikacion mund te shtohet nje qyet i ri. Shkruhet emrin e qytetit, Latitude dhe Longitude ne fushat perkatese te hyrjes.
Kliko "Add city" per te shfaqur parashikimin e motit per qytetin e ri.

Parashikimi i motit do te tregoje detajet e meposhtme per çdo dite:

- Dita (Sot, Neser, ose diten e javes per ditet e ardhshme)
- Gjendja e motit (p.sh., "Me diell", "Me re", "Me shi")
- Varia e temperatures (temperatura minimale dhe maksimale per diten)
- Ndjehet si temperatura (min dhe maksimale)
- Mundesia e reshjeve
- Shpejtesia maksimale e eres

## Struktura e kodit

Komponenti kryesor qe trajton shfaqjen e te dhenave te motit, shtimin e qyteteve.Te dhenat e motit merren nga te dhena reale nga nje API OpenWeatherMap. Me ane te nje linku ajo dorzon detajet e nevojshme per motin.
