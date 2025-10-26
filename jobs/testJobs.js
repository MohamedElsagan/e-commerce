import { CronJob } from "cron";

const testJob = new CronJob(
    '*/5 * * * * *', // كل ثانيتين
    function () {
        console.log('statring');
    },
    null,
    true
);

// export { testJob };
