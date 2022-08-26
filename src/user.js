import GUN from "gun";
import "gun/sea";
import "gun/axe";
import { writable } from "svelte/store";

// Database
export const gun = GUN(
    {peers: ["http://localhost:8765/gun"]
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


