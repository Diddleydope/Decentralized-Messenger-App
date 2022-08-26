const GUN = require("gun");                     //npm i gun
const { createServer } = require("http");

const gun = GUN({
    web: createServer().listen(8765),
    //file: "db"
});
gun.get("chat").map().once((data, id) => {
    console.log(data)
})
