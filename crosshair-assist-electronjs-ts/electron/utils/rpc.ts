import {Client} from "discord-rpc";

const client    = new Client({ transport: 'ipc' });

client.on('ready', () => {
    client.clearActivity ();
    client.setActivity ({
        state: 'Societyg Software',
        startTimestamp: Date.now(),
        largeImageKey: "https://pngimg.com/uploads/aim/aim_PNG42.png",
        instance: false,
        buttons: [{
            label: "Download now",
            url: "https://github.com/AroliSG/aim-assist"
        }]
    })
});


// Log in to RPC with client id
setTimeout (() => {
    client.login({ clientId: '886014861153280040' });
}, 15000);
