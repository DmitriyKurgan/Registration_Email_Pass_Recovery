import {OutputUserAccountType, OutputUserType, UserAccountDBType, UserAccountType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId, WithId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {v4 as uuidv4} from 'uuid'
import {add} from "date-fns/add";
import {authRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/query-repositories/auth-query-repository";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {emailManager} from "../managers/email-manager";
import {authService} from "./auth-service";
export const users = [] as OutputUserType[]

export const emailService:any = {
    async sendEmail(userAccount:OutputUserAccountType, confirmationCode:string):Promise<SMTPTransport.SentMessageInfo | null> {
        debugger
        const message =  `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        try {
            const gmailResponse:SMTPTransport.SentMessageInfo = await emailManager.sendEmail(userAccount.accountData.email, message);
            console.log('confirmationCode:', confirmationCode)
            return gmailResponse
        } catch (error) {
            console.error(error);
           // await authService.deleteUser(userAccount.id);
            return null;
        }
    },
}