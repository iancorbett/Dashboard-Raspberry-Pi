import os from 'os'; //operating system
import fs from 'fs'; //file system

export function getSystem() {
    const freemem = os.freemem(); // free RAM (bytes)
    const totalmem = os.totalmem(); //total RAM (bytes)
    const memUsed = 1 - freemem / totalmem; //percentage of memory in use (as a ratio between 0 and 1)
  
    let disk = null;
    try {
      fs.statSync('/app/data'); //tries to see if /app/data exists
      disk = { mounted: true, path: '/app/data' };
    } catch {
      disk = { mounted: false };
    }
  
    return {
      hostname: os.hostname(), // machine name
      platform: os.platform(), // 'linux', 'darwin', 'win32'
      arch: os.arch(), // 'x64', 'arm'
      uptime: os.uptime(), // seconds since boot
      loadavg: os.loadavg(), // CPU load averages
      mem: { total: totalmem, free: freemem, usedRatio: Number(memUsed.toFixed(3)) },
      disk
    };
  }