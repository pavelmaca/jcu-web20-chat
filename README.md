# Zádání semestrální práce
### UAI/624 - Web 2.0 a webové služby

## Cíl práce
Cílem práce je vyzkoušet si v praxi technologie a postupy používané při vývoji webových
aplikací a implementaci webových služeb jako rozhraní pro komunikaci se serverem.

## Zadání
Vytvořte aplikaci typu klient-server, kde klientem bude aplikace běžící v prostředí webového
prohlížeče a serverová část poskytující RESTové rozhraní k datovému úložišti.

Klientskou část vytvořte jako webovou aplikaci za s použitím technologií HTML5 a CSS3 a
Javascript která bude komunikovat se serverem výhradně pomocí AJAXových volání.

Serverovou část implementujte v libovolném vhodném programovacím jazyce. Tato bude
poskytovat přístup k perzistentním datům pomocí RESTového rozhraní. Jako datové úložiště
použijte libovolnou databázi.

## Popis aplikace
Aplikace bude jednoduchý chat, který se bude skládat z klientské části (front-end) tvořící
prezentační vrstvu a serverové části (back-end) sloužící jako uložíště zpráv s RESTovým
rozhraní.

Uživatel bude identifikován uživatelským jménem které se bude zadávat pouze jednou a to při
přístupu uživatele na stránku s aplikací (není nutná žádná kontrola bezpečnosti). Pro uložení
uživatelského jména použijte libovolné datové úložiště na straně klienta (v prohlížeči). Jméno
bude odesíláno společně se zprávou na back-end.

Chat bude obsahovat několik „místností" mezi kterými si uživatel bude moci vybírat. Seznam
místností bude získáván ze samostatného resource na serveru, přičemž není nutné aby bylo
možné místnosti přidávat nebo odebírat a jejich seznam může být na back-endu hardcodován.

Při vstupu do místnosti se uživateli zobrazí okno s historií zpráv a jednoduchý formulář pro
odeslání zprávy. V okně zpráv bude při vstupu do místnosti načteno přiměřené množství zpráv
z historie (ne všechny).

Komunikace mezi uživateli musí probíhat (téměř) v reálném čase, tedy vždy když jeden z klientů
odešle zprávu, tak se tato vždy zobrazí okamžitě jak v okně zpráv uživatele tak i ve všech
ostatních klientech.

Lze použít periodické dotazování, nebo oddělený kanál "notifikaci”. V obou případech je nutné
zajistit aby zprávy při svém zobrazení vždy zachovávaly kauzalitu.
Vzhled aplikace navrhněte sami a implementujte čistě pomoci HTML5 a CSS3.

## Požadavky
- Validace uživatelských vstupů musí být jak na straně klienta, tak i na RESTovém
rozhraní. Nemělo by být možné:
  - Odeslat prázdnou zprávu.
  - Zprávu bez uživatelského jména.
  - Příliš dlouhou zprávu.
- RESTové slyžby musí vracet odpovídající návratové HTTP status kódy, minimálně tyto:
  - 200 - při úspěšném dotazů
  - 201 - při vytvoření zprávy
  - 400 - při validační chybě
- RESTové služby budou nastavovat potřebné HTTP hlavičy pro nastavení cache, content
type, ...
- Zpráva odeslána jedním klientem se (téměř) okamžitě projeví ve všech ostatních
klientech bez nutnosti obnovení stránky. (Určitá prodleva je z principu architektury
samozřejmost)
- Aplikace by měla umožňovat základní ovládání pomocí klávesnice (minimálně odeslání
formulářů klávesou "enter” by měla být samozřejmost).
- Komunikace mezi klientem a serverem bude probíhat asynchronně a přenášené zprávy
budou ve formátu JSON podle kontraktu níže.
- Aplikace pro svou funkci nebude vyžadovat obnovení stránky.
- Aplikace bude správně používat escapování a bude dostatečně robustní proti
jednoduchým útokům.
- Stav aplikace bude uchováván výhradně na klientovi (na serveru se nebude nic ukládat
na session)
- Formát přenosu chybových zpráv si navrhněte sami. Není nutné je klientem
zpracovávat.
- Aplikace nemusí umožňovat cross-domain komunikaci.

## Doporučené rozhraní

### GET /rooms
Příklad odpovědi
```json
[
 {
 "id": 1,
 "name": "Enterprise-E"
 },
 {
 "id": 2,
 "name": "Enterprise-A"
 }
]
```
### GET /messages
Query parametry
- roomId
- sentSince
- limit
Příklad odpovědi
```json
[
 {
 "id": 123123,
 "name": "Cpt. James T. Kirk",
 "message": "Captain's Log, Stardate 2713.5. In the distant reaches of our galaxy...",
 "sentOn": "2032-07-14T19:43:37+0100"
 },
 {
 "id": 123124,
 "name": "Cpt. Jean-Lic Picard",
 "message": "Captain's Log, Stardate 1513.8. Star maps reveal no indication of habitable planets nearby..."
 "sentOn": "2045-09-19T02:43:37+0500"
 }
]
```

### POST /messages
Příklad požadavku
```json
{
 "name": "Cpt. Jean-Lic Picard",
 "message": "Captain's Log, Stardate 1513.8. Star maps reveal no indication of habitable planets nearby..."
}
```
## Závěr
Práce musí být vypracována každým samostatně a její hodnocení bude probíhat na základě
výše uvedených požadavků. Je možné zvolit i jiné zadání pokud bude přiměřené složitosti a
bude odpovídat daným požadavkům. Každý odklon od zadání je ale nutné konzultovat předem.