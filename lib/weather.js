import fetch from 'node-fetch';

let cache = { ts: 0, data: null }; //ts starts at zero, data is set to null
const TTL_MS = 5 * 60 * 1000; // 5 minutes in between refreshes

export async function getWeather(lat, lon) { //takes in latitude and longitude to find where to get weather data
    const now = Date.now(); //find date info for current time
    if (cache.data && now - cache.ts < TTL_MS) { // dont get new data yet
        return cache.data; //return same data
    }
}