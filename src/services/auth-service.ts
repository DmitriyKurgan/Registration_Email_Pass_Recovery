import {OutputUserAccountType, OutputUserType, UserAccountDBType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId, WithId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {v4 as uuidv4} from 'uuid'
import {add} from "date-fns/add";
import {authRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/query-repositories/auth-query-repository";
export const users = [] as OutputUserType[]

export const authService:any = {

    async createUser(login:string, email:string, password:string):Promise<OutputUserAccountType | null> {

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser:UserAccountDBType = {
            _id: new ObjectId(),
            accountData:{
                userName:login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date(),
            },
            emailConfirmation:{
                confirmationCode:uuidv4(),
                expirationDate:add(new Date(), {
                    hours: 3,
                    minutes: 10
                }),
                isConfirmed:false,
            },
        }
        const createdAccountUser:OutputUserAccountType | null = await authRepository.createUser(newUser);
        return createdAccountUser;
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await authRepository.deleteUser(userID);
    },
    async confirmRegistration(confirmationCode:string):Promise<boolean>{
        const userAccount:WithId<UserAccountDBType> | null = await authQueryRepository.findUserByEmailConfirmationCode(confirmationCode);
        if (!userAccount) return false;
        if (userAccount.emailConfirmation.isConfirmed) return false;
        if (userAccount.emailConfirmation.confirmationCode !== confirmationCode) return false;
        if (userAccount.emailConfirmation.expirationDate < new Date()) return false;

        const result = await authRepository.updateConfirmation(userAccount._id);
        return result

    },
    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

}