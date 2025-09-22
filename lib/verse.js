import fetch from 'node-fetch';

let cache = { ts: 0, data: null };//start timestap at zero and count up, initialize data to null
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function getVerse() {
  const now = Date.now(); //get current date
  if (cache.data && now - cache.ts < TTL_MS) return cache.data; //if less than 12 hours, dnt call again yet

  // keyless verse API
  const r = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json', { timeout: 8000 }); //make api call, timeout after 8 sec
  if (!r.ok) throw new Error(`verse ${r.status}`); //throw error after 8 sec
  const json = await r.json();

  cache = { ts: now, data: json };
  return json;
}