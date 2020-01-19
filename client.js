let jobs = {};

async function addJob() {
    let res = await fetch('job/', {method: 'POST'});
    let job = await res.json();
    jobs[job.id] = {id: job.id, state: "queued"};
    render();
}

async function updateJobs() {
    for (let id of Object.keys(jobs)) {
        let res = await fetch(`/job/${id}`);
        let result = await res.json();
        if (!!jobs[id]) {
            jobs[id] = result;
        }
        render();
    }
}

function clear() {
    jobs = {};
    render();
}

function render() {
    let s = "";
    for (let id of Object.keys(jobs)) {
        s += renderJob(jobs[id]);
    }
    document.querySelector("#job-summary").innerHTML = s;
}

function renderJob(job) {
    let progress = job.progress || 0;
    let color = "bg-light-green";

    if (job.state === "completed") {
        color = "bg-light-green";
        progress = 100;
    } else if (job.state === "failed") {
        color = "bg-red";
        progress = 100;
    }

    return document.querySelector('#job-template')
        .innerHTML
        .replace('{{id}}', job.id)
        .replace('{{state}}', job.state)
        .replace('{{color}}', color)
        .replace('{{progress}}', progress);
}

window.onload = function () {
    document.querySelector("#add-job").addEventListener("click", addJob);
    document.querySelector("#clear").addEventListener("click", clear);

    setInterval(updateJobs, 200);
};
