

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/version', (req, res) => res.json({ sha: GIT_SHA }));