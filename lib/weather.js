import fetch from 'node-fetch';

let cache = { ts: 0, data: null }; //ts starts at zero, data is set to null
const TTL_MS = 5 * 60 * 1000; // 5 minutes in between refreshes
