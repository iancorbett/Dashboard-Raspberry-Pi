const $ = sel => document.querySelector(sel); //allows shorthand
const pinInput = $('#pin'); //grab pin input element from html page
let PIN = ''; //initialize PIN to an empty string

function hdr() { return PIN ? { 'x-dash-pin': PIN } : {}; } //if a PIN has been set, this builds a header object, if no PIN, it just returns {} (an empty header set)

function tickClock() {
    const d = new Date(); //find current date
    $('#clock').textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // find local time and return in proper format
  }
  setInterval(tickClock, 1000); tickClock(); //call function every second

  async function loadMeta() { //marks the function as async, so you can use await inside it
    const [v,h] = await Promise.all([ //runs multiple async tasks at the same time
      fetch('/version').then(r=>r.json()),
      fetch('/health').then(r=>r.json())
    ]);
    $('#meta').textContent = JSON.stringify({ version: v, health: h }, null, 2);
  }
  loadMeta();