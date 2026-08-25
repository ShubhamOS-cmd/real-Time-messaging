import { Worker } from "bullmq";
import { BullMQ_Redis } from "../redis/index.js";
import {sendMail} from "../config/mailer.js";


const emailWorker = new Worker("emails" , async(job)=>{
    console.log("I am inside the work" , job.id , job.data);
    const {to , subject , body} = job.data;
    await sendMail(to , subject , body);
} , {
    connection:BullMQ_Redis,
    concurrency:5, // worker processes 5 jobs simultaneously instead of one at a time 
    stalledInterval:30000, // on every 30 secs bullMQ checks are there any job that started but never finished 
    maxStalledCount:2
})
emailWorker.on("completed" , (job) => {
    console.log("Completed job done" , job.id);
})

emailWorker.on("failed" , (job , err) => {
    console.log("Job is Falied" , job.id , err.message);
})
/**
 * What is stalledInterval -> When a worker picks up a job - bullMQ expects the worker to finish and report back within a certain time , 
 * if the worker crashes mid job it never report back . That job is now stuck in active state forever . Nobody is processing it so that is stalled job 
 * BullMQ runs a background check every stalledInterval ms to find these stuck jobs 
 * are there any jobs marked "active" that have not reported back so that job is stalled 
 * maxStalledCount -> How many times a job is alllowed to stall before BullMQ gives up on it  
 */
/*
Redis is a single threaded it process one command at a time 
BullMQ internally uses a special Redis command called BLPOP Blocking left pop
this command tells to redis ->  Wait  until a job appears in this queue 
redis does not freeze and wait , redis registers this wait and moves on 
when we add email in emailQueue internally does LPUSH to redis list 
redis sees LPUSH -> checks if anyone is waiting on this key 
yes -> immediately notifies bullmq worker , worker wakes up and processes the job 
this is called event driven blocking 
*/
/*
const redis = new Redis({ host: "localhost", port: 6379 })
ioredis opens a tcp socket b/w your node app and redis server 
every command we send goes one after another 
redis.blpop("bull:emails:wait", 0)
// 0 means wait forever until data appears
ioredis sends this command through the TCP and then waits for a response 
during this wait - ioredis cannot send any new command on this same connection . This line is occupied waiting for BLPOP's response.
if we send the another command either the app crashes or queue the command 

So the solution is two connection to same redis 
Both point to same Redis - same data , same queue , but two seprate TCP lines - so one being occupied never affects other . 

*/

/*
why we can't use mailer direct means
 why we can not directly send the mail instead of sending in queue and the worker pick up and then send the message 
 if we send directly our controller stops and wait until email is sent 
 1. Slow response -> this takes 2 to 5 seconds on avg , user exp is bad
 2. What is gmail down
 3. No retry mechanism
 4. server under load example 10000 users req otp at same time 
 by bullmq speed adding message to queue takes ms , user gets response 
 if gmail down jobs is stays in queue and reties automatically 
 rate control concurrency: 5 means only 5 emails sent a time 
 if job failed BullMQ retries 3 times automatically 
 */