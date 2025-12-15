PETCARE – NAVODILA ZA ZAGON APLIKACIJE
=================================

Ta dokument opisuje, kako zagnati aplikacijo PetCare na lokalnem računalniku.

-------------------------------------------------
1. OPIS PROJEKTA
-------------------------------------------------
PetCare je spletna aplikacija za upravljanje:
- ljubljenčkov
- obrokov
- aktivnosti
- zdravil in zdravljenj
- pregledov pri veterinarju
- opomnikov

Projekt je razdeljen na:
- frontend (React)
- backend (Node.js + Express)
- bazo podatkov (MongoDB)

-------------------------------------------------
2. PREDPOGOJI
-------------------------------------------------
Pred zagonom morajo biti nameščeni:
- Node.js (verzija 18 ali novejša)
  https://nodejs.org
- npm (nameščen skupaj z Node.js)
- MongoDB (lokalno ali MongoDB Atlas)

-------------------------------------------------
3. ZAGON BACKENDA
-------------------------------------------------

1. Odpri terminal
2. Pojdi v mapo backend:
   cd petcare-backend

3. Namesti odvisnosti:
   npm install

4. Ustvari datoteko .env v backend mapi in vanjo vpiši:

   PORT=5000
   MONGO_URI=mongodb://localhost:27017/petcare
   JWT_SECRET=skrivno_geslo

5. Zaženi backend:
   npm start

Backend bo dostopen na:
http://localhost:5000

-------------------------------------------------
4. ZAGON FRONTENDA
-------------------------------------------------

1. Odpri nov terminal
2. Pojdi v mapo frontend:
   cd petcare-frontend

3. Namesti odvisnosti:
   npm install

4. Ustvari datoteko .env v frontend mapi in vanjo vpiši:

   REACT_APP_API_URL=http://localhost:5000

5. Zaženi frontend:
   npm start

Frontend bo dostopen na:
http://localhost:3000

-------------------------------------------------
5. UPORABA APLIKACIJE
-------------------------------------------------
1. Odpri brskalnik
2. Obišči http://localhost:3000
3. Registriraj novega uporabnika
4. Prijavi se v aplikacijo
5. Uporabljaj vse funkcionalnosti aplikacije

-------------------------------------------------
6. OPOMBE
-------------------------------------------------
- Aplikacija podpira temni način
- Projekt je namenjen izobraževalnim namenom
- Aplikacija je testirana lokalno

-------------------------------------------------
7. REŠEVANJE TEŽAV
-------------------------------------------------
- Če frontend ne dela, preveri ali backend teče
- Če pride do 404 napak, preveri API URL
- Če se podatki ne shranijo, preveri MongoDB povezavo
