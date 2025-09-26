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

  async function loadSystem() {
    const s = await fetch('/api/system').then(r=>r.json()); //make fetch call to api
    $('#system').textContent = JSON.stringify(s, null, 2);//dynamically change text content
  }
  loadSystem();

  pinInput.addEventListener('change', () => { PIN = pinInput.value.trim(); loadNotes(); }); 

  async function loadNotes() {
    const res = await fetch('/api/notes', { headers: hdr() }); //use fetch to get notes, using async function
    if (!res.ok) { $('#notes').innerHTML = `<li>Locked (enter PIN)</li>`; return; } //locked if theres not a susuccessful res
    const { notes } = await res.json();
    $('#notes').innerHTML = notes.map(n => //map through notes and create new span for each note using text and id
      `<li><span>${n.text}</span><button data-id="${n.id}">✕</button></li>`
    ).join('');
    $('#notes').querySelectorAll('button').forEach(btn => {//add event listener to each button
      btn.addEventListener('click', async () => {
        await fetch('/api/notes/' + btn.dataset.id, { method: 'DELETE', headers: hdr() });
        loadNotes();
      });
    });
  }
  loadNotes();

$('#add-note').addEventListener('submit', async e => {
  e.preventDefault();
  const text = $('#note-text').value.trim();
  if (!text) return;
  await fetch('/api/notes', {//use post req this time as we are adding a note as opposed to fetching existing notes
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...hdr() },
    body: JSON.stringify({ text })
  });
  $('#note-text').value = '';
  loadNotes();
});