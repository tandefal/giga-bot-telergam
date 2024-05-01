import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import qs from "qs";
import {getTokenCache, setTokenCache} from "./cache.js";

async function getToken() {
    const token = getTokenCache();
    if(token) {
        return token;
    }

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            RqUID: uuidv4(),
            Authorization: `Basic ${process.env.GIGA_AUTH}`,
        },
        data: qs.stringify({
            scope: 'GIGACHAT_API_PERS',
        }),
    };

    try {
        const response = await axios(config)
        const {access_token: accessToken, expires_at: expiresAt} = response.data
        const expires = Math.floor((expiresAt - Date.now()) / 1000);
        setTokenCache(accessToken, expires);
        return accessToken;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function giga(content = '') {

    const token = await getToken()

    if(!token) {
        return 'провалена авторизация';
    }

    const data = JSON.stringify({
        model: 'GigaChat',
        messages: [
            { role: 'system', content: content }
        ],
        temperature: 1,
        top_p: 0.1,
        n: 1,
        stream: false,
        max_tokens: 512,
        repetition_penalty: 1,
        update_interval: 0,
    })

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        data,
    }

    try {
        const response = await axios(config)
        const message = response.data.choices[0].message
        return message.content
    } catch (e) {
        return e.message;
    }
}