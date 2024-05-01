import NodeCache from "node-cache";

const exp = 1800;
const TOKEN = "TOKEN_KEY";
const myCache = new NodeCache({stdTTL: exp, checkperiod: 120});

export function setTokenCache(value, expiresAt= exp) {
    return myCache.set(TOKEN, value, expiresAt);
}

export function getTokenCache() {
    return myCache.get(TOKEN);
}