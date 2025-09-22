const $ = sel => document.querySelector(sel); //allows shorthand
const pinInput = $('#pin'); //grab pin input element from html page
let PIN = ''; //initialize PIN to an empty string

function hdr() { return PIN ? { 'x-dash-pin': PIN } : {}; } //if a PIN has been set, this builds a header object, if no PIN, it just returns {} (an empty header set)

function tickClock() {
    const d = new Date(); //find current date
    $('#clock').textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // find local time and return in proper format
  }
  setInterval(tickClock, 1000); tickClock(); //call function every second

  async function loadMeta() {
    try {
      // fetch both in parallel
      const [vRes, hRes] = await Promise.all([
        fetch('/version'),
        fetch('/health')
      ]);
  
      // parse both as JSON in parallel
      const [v, h] = await Promise.all([
        vRes.json(),
        hRes.json()
      ]);
  
      $('#meta').textContent = JSON.stringify({ version: v, health: h }, null, 2);
    } catch (err) {
      $('#meta').textContent = `Failed to load meta: ${err}`;
    }
  }
  loadMeta();

  async function loadWeather() {
    const lat = localStorage.getItem('lat'); //lataitude
    const lon = localStorage.getItem('lon'); //longitude
    const qs = lat && lon ? `?lat=${lat}&lon=${lon}` : ''; //querey string, at lat and lon to the request
    const w = await fetch('/api/weather' + qs).then(r=>r.json()); //call to weather api
    const c = w.current_units || {}; //units, celsius, fahrenheit mph etc
    const cur = w.current || {}; //current measurements, temp, wind etc
    $('#weather').textContent =
      `Temp: ${cur.temperature_2m}${c.temperature_2m || '°F'}\n` +
      `Feels: ${cur.apparent_temperature}${c.apparent_temperature || '°F'}\n` +
      `Wind: ${cur.wind_speed_10m}${c.wind_speed_10m || 'mph'}`;
  }
  loadWeather();

  async function loadVerse() {
    const v = await fetch('/api/verse').then(r=>r.json()); //make fetch call to api
    const out = v && v.verse && v.verse.details //check if it hs everything thats needed
      ? `${v.verse.details.text}\n— ${v.verse.details.reference}` //if it does print text then reference on a new line
      : JSON.stringify(v, null, 2);
    $('#verse').textContent = out; //dynamically change text content to whatever was etche from api
  }
  loadVerse();
  