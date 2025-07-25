// import { Processor, WorkerHost } from "@nestjs/bullmq";
// import { QUEUE_CHAT_NAME, SEND_MESSAGE_CHAT_JOB_NAME } from "./chat.bull.constants";
// import { Job } from "bullmq";
// // import { NotificationService } from "../notification.service";
// import { IUser } from "./chat.bull.interfaces";

// @Processor(QUEUE_CHAT_NAME)
// export class ChatBullProcessor extends WorkerHost {

//     constructor(
//         // private readonly notifService: NotificationService,
//     ) {
//         super()
//     }

//     async process(job: Job, token?: string): Promise<any> {
//         // if(job.name === SEND_MESSAGE_CHAT_JOB_NAME) {
//         //     console.log(job.data);
//             // return this.notifService.updateNotifByUser(job.data as IUser)
//         // }
//     }
// }