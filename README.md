#  Raspberry Pi Home Dashboard

A lightweight personal dashboard built with **Node.js**, **Express**, and **vanilla JS**.  
Runs on a Raspberry Pi (or any machine with Node installed) and displays:

-  Local Time (auto updates every second)
-  Current Weather (via [Open-Meteo API](https://open-meteo.com))
-  Verse of the Day (via Bible API)
-  Pi/System Stats (CPU, memory, uptime, hostname)
-  Notes (stored in `data/notes.json`, protected by optional PIN)

---

##  Features

- **Local Network Access** → view dashboard from your phone/laptop if on the same Wi-Fi
- **Weather Units** → defaults to °F + mph for US, easily switchable to °C + km/h
- **Notes** → add/delete notes, persisted to disk
- **PIN Protection** → secure your notes API with `DASH_PIN` env variable
- **Portable** → works on Raspberry Pi, Mac, Linux, or Windows
- **DevOps Demo** → shows off environment variables, API integration, file storage, and Express routing

---

##  Installation

Clone the repo and install dependencies:

- git clone https://github.com/yourusername/home-dashboard.git
- cd home-dashboard
- npm install

---

## Configuration

Set up environment variables in a .env file:

- PORT=3000
- GIT_SHA=dev
- DASH_PIN=1234   # optional, leave blank to disable
- LAT=37.3382     # default latitude (San Jose)
- LON=-121.8863   # default longitude

---

## Run the Server

- npm start


Then open:

http://localhost:3000


On another device (same Wi-Fi):

http://<your-pi-ip>:3000


Find your Pi’s IP with:

hostname -I
