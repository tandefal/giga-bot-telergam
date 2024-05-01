import {Telegraf} from 'telegraf';
import 'dotenv/config';
import {message} from "telegraf/filters";
import {code} from "telegraf/format";

import path from 'path'
import {fileURLToPath} from 'url';
import {giga} from "./giga.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_EXTRA_CA_CERTS = path.resolve(__dirname, 'certs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


const bot = new Telegraf(process.env.BOT_TOKEN)


bot.on(message('text'), async (ctx) => {
    let message = ctx.message.text;
    try {
        const [command, ...msg] = message.split(' ');
        const isChannel = /бот/i.test(command);
        if (ctx.chat.type === 'private' || isChannel) {
            message = isChannel ? msg.join(' ') : message;
            await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));
            await ctx.reply(await giga(message), {parse_mode: 'Markdown'});
        }
    } catch (e) {
        await ctx.reply(e.message);
    }
})

bot.launch().catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))