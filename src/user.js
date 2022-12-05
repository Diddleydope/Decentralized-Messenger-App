import GUN from "gun";
import "gun/sea";
import "gun/axe";
import { writable } from "svelte/store";

// Database
// Die Datenbank muss nur einmal für das ganze Projekt erzeugt werden. Weil sie
// exportiert wird, muss sie später nicht neu initialisiert werden. Das ist
// auch gut so, denn dann muss die config nicht immer angepasst werden.
// *peers*: Aus der Dokumentation von Gun ist zu entnehmen das Gun eine nur
// lokale Datenbank anlegt wenn keine *peers* angegeben werden. Möchte man also
// die Daten verteilen, braucht es einen Relay server. Der wird in den Peers
// angegeben.
// TODO: Herausfinden ob auch ein webclient als relay dienen kann. Im Moment
// sieht es nicht so aus. Wenn der Relayserver wegfällt, dann bricht auch die
// Kommunikation unter den Peers zusammen. Das sollte eigentlich nicht so sein,
// das kommt vlt in einer neueren Version wieder. Ansonsten einfach genügend
// Relays zur Verfügung stellen.
export const gun = GUN({
    peers: ["https://172.105.92.43:80/gun", "https://172.26.212.231:80/gun"]
});

// Gun User
export const user = gun.user().recall({sessionStorage: true}); //.recall({sessionStorage: true})

// Current User's username
export const username = writable('');

user.get('alias').on(v => username.set(v));

//sets username to alias value
gun.on('auth', async(event) => {
    const alias = await user.get('alias');
    username.set(alias);

    console.log(`Currently logged in as ${alias}`);
})


