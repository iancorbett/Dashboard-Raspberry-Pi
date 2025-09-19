const $ = sel => document.querySelector(sel); //allows shorthand
const pinInput = $('#pin'); //grab pin input element from html page
let PIN = ''; //initialize PIN to an empty string

function hdr() { return PIN ? { 'x-dash-pin': PIN } : {}; } //if a PIN has been set, this builds a header object, if no PIN, it just returns {} (an empty header set)
