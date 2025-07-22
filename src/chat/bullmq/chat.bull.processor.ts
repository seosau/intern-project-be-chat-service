import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QUEUE_CHAT_NAME, UPDATE_NOTIF_BY_USER } from "./chat.bull.constants";
import { Job } from "bullmq";
// import { NotificationService } from "../notification.service";
import { IUser } from "./chat.bull.interfaces";

@Processor(QUEUE_CHAT_NAME)
export class notifBullProcessor extends WorkerHost {

    constructor(
        // private readonly notifService: NotificationService,
    ) {
        super()
    }

    async process(job: Job, token?: string): Promise<any> {
        if(job.name === UPDATE_NOTIF_BY_USER) {
            // return this.notifService.updateNotifByUser(job.data as IUser)
        }
    }
}