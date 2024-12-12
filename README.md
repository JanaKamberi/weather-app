# Weather APP
#### **Permbledhje**
Aplikacioni i motit eshte nje aplikacion i bazuar ne React qe ofron te dhena te motit ne kohe reale dhe nje parashikim 4-ditor te motit per nje sere qytetesh. Perdoruesit mund te zgjedhin nje qytet nga nje liste e paracaktuar, te shikojne kushtet aktuale te motit dhe te shtojne qytete te personalizuara duke specifikuar gjeresine dhe gjatesine e tyre. Aplikacioni merr te dhenat e motit nga Open-Meteo API dhe i shfaq ato ne nje format miqesor per perdoruesit, te kompletuar me ikona qe perfaqesojne kushte te ndryshme te motit.

 - Shfaq temperaturen aktuale, gjendjen e motit dhe shpejtesine e eres per qytetin e zgjedhur.
 - Tregon temperaturat maksimale dhe minimale ditore, temperaturat "Feels like", reshjet dhe shpejtesine e eres per 4 ditet e ardhshme.
 - Perfshin nje liste per te zgjedhur nje qytet.
 - Lejon perdoruesit te shtojne qytete te reja duke futur nje emer, dhe kordinatat e qyetit.
 - Ikonat dhe pershkrimet e lexueshme e bejne te lehte te kuptosh kushtet e motit.

#### **Si funksionon**
**Burimi i te dhenave**:
 - Te dhenat e motit merren duke perdorur [Open-Meteo API](https://open-meteo.com/).
 - API ofron te dhena aktuale te motit dhe parashikimeve ditore bazuar ne gjeresine dhe gjatesine gjeografike.

**Perberesit funksionale reagojne**:
 - **Menaxhimi i Shtetit**:
 - `useState` perdoret per te gjurmuar qytetin e zgjedhur, te dhenat e motit, mesazhet e gabimit dhe hyrjet e perdoruesve per shtimin e qyteteve te reja.
 - **Efekt Hook**:
 - "useEffect" aktivizohet kur qyteti i zgjedhur ndryshon, duke marre te dhena te perditesuara te motit.

**Perkthimi dinamik**:
 - Kushtet e motit dhe parashikimet jepen ne menyre dinamike duke perdorur JSX te React.
 - Ikonat dhe pershkrimet e kushteve hartohen bazuar ne kodet e motit te API-se.

---

#### **Pika kryesore te kodit**

- Te dhenat e motit merren duke perdorur "axios" me URL te ndertuara ne menyre dinamike:
 ```javascript
 const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=...&current_weather=true`;
 ```

- Perdoruesit mund te shtojne qytete te reja ne menyre dinamike:
 ```javascript
 const handleAddCity = () => {
 const newCityObj = {emri: NewCity, lat: parseFloat(newLat), lon: parseFloat(newLon) };
 setCities([...qytetet, newCityObj]);
 };
 ```

- Te dhenat e motit shfaqen vetem pasi te zgjidhet nje qytet:
 ```javascript
 {Moti aktual && Moti i perditshem ? (
 // Shfaq te dhenat e motit
 ) : (
 <p>Zgjidh nje qytet per te pare parashikimin e motit.</p>
 )}
 ```
