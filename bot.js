const mineflayer = require('mineflayer');

process.on('uncaughtException', (err) => {
    console.log(`[NPC] Error interno ignorado: ${err.message}`);
});

process.on('unhandledRejection', (reason) => {
    console.log(`[NPC] Promesa rechazada ignorada: ${reason}`);
});

let chatInterval = null;
let moveInterval = null;

function createBot() {
    if (chatInterval) clearInterval(chatInterval);
    if (moveInterval) clearInterval(moveInterval);

    const bot = mineflayer.createBot({
        host: 'logcraft.mcsh.io',
        port: 25565,
        username: 'UWU',
        version: '1.21.4',
        hideErrors: true,
        checkTimeoutInterval: 60 * 1000
    });

    bot.on('login', () => {
        console.log('[NPC] Conexión establecida con LogCraft.');
    });

    bot.on('spawn', () => {
        console.log('[NPC] El bot ha aparecido en el mapa.');
        
        setTimeout(() => {
            bot.chat('/login cubo16');
        }, 3000);
    });

    bot.on('kicked', (reason) => {
        let mensaje = reason;
        try {
            mensaje = JSON.stringify(reason);
        } catch (e) {}
        console.log(`[NPC] El servidor expulsó al bot por: ${mensaje}`);
    });

    // 1. Anuncio en el chat cada 5 minutos
    chatInterval = setInterval(() => {
        if (!bot || !bot.entity) return;

        bot.chat('&b&lDISFRUTA DEL SERVIDOR ?');
        console.log('[NPC] Mensaje anunciado en el chat.');
    }, 5 * 60 * 1000);

    // 2. Sistema Anti-AFK Dinámico (Gira la vista, camina y salta cada 40 segundos)
    moveInterval = setInterval(() => {
        if (!bot || !bot.entity) return;

        try {
            // Girar la mirada a una dirección aleatoria
            const yaw = (Math.random() * Math.PI * 2) - Math.PI;
            const pitch = (Math.random() * 0.4) - 0.2; // Mirar ligeramente hacia arriba/abajo
            bot.look(yaw, pitch, true);

            // Elegir al azar caminar adelante o atrás
            const direccion = Math.random() > 0.5 ? 'forward' : 'back';
            bot.setControlState(direccion, true);
            
            setTimeout(() => {
                bot.setControlState(direccion, false);
            }, 700);

            // Saltar
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 400);

            console.log('[NPC] Movimiento Anti-AFK dinámico ejecutado.');
        } catch (err) {
            console.log(`[NPC] Error en movimiento: ${err.message}`);
        }
    }, 40000);

    bot.on('end', (reason) => {
        if (chatInterval) clearInterval(chatInterval);
        if (moveInterval) clearInterval(moveInterval);
        console.log(`[NPC] Conexión finalizada (${reason}). Reintentando en 10 segundos...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => console.log(`[NPC] Error de red: ${err.message}`));
}

createBot();
