let express = require('express');
let Queue = require('bull');

let PORT = 5001;
let REDIS_URI = 'redis://127.0.0.1:6379';

let app = express();

let workQueue = new Queue('work', REDIS_URI);

app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname}));
app.get('/client.js', (req, res) => res.sendFile('client.js', {root: __dirname}));

app.post('/job', async (req, res) => {
    let job = await workQueue.add();
    console.log("New Job Pushed in the Queue " + job.id);
    res.json({id: job.id})
});

app.get('/job/:id', async (req, res) => {
    let id = req.params.id;

    let job = await workQueue.getJob(id);
    if (!job) {
        res.status(404).end();
    } else {
        let state = await job.getState();
        let progress = await job._progress;
        let reason = job.failedReason;
        res.json({id, state, progress, reason})
    }
});

app.get('/jobs', async (req, res) => {
    let jobs = await workQueue.getCompleted();
    res.json({jobs});
});

workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job ${jobId} completed with result ${result}`);
});

app.listen(PORT, () => console.log("Server is Running at " + "http://127.0.0.1:5001"));