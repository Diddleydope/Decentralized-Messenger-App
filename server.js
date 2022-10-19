// Relay server für Gun. Der sollte irgendwo auf dem Netzwerk laufen, wo er für
// alle erreichbar ist.
//
// *Daten löschen*: Wenn man Daten auf dem Server löschen möchte, muss das
// Verzeichnis radata gelöscht werden. Wenn auf der Seite von verbundenen
// Clients noch Daten bestehen, werden diese wieder synchronisiert. So kann man
// sicherstellen das die Daten gesichert sind, solange genügend Relays im
// Netzwerk vorhanden sind.
const GUN = require("gun");                     //npm i gun
//const { createServer } = require("http");

const gun = GUN(['http://localhost:8765/gun', 'https://gun-manhattan.herokuapp.com/gun']);
gun.get("chat").map().once((data, id) => {
    console.log(data)
})
