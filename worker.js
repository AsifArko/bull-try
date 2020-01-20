let throng = require('throng');
let Queue = require("bull");

let REDIS_URI = 'redis://127.0.0.1:6379';

let workers = 2;

let maxJobsPerWorker = 50;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
    let workQueue = new Queue('work', REDIS_URI);
    let promise = workQueue.process(maxJobsPerWorker, async (job) => {
        let progress = 0;

        if (Math.random() < 0.35) {
            throw new Error("This job failed!")
        }

        while (progress < 100) {
            await sleep(50);
            progress += 1;
            console.log(`JOB : ${job.id} progress : ${progress}`);
            job.progress(progress)
        }
        return {value: `Job ${job.id} will be stored`};
    });
}

throng({workers, start});