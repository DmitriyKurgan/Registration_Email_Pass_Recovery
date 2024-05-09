import {OutputUserAccountType, OutputUserType, UserAccountDBType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId, WithId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {v4 as uuidv4} from 'uuid'
import {add} from "date-fns/add";
import {authRepository} from "../repositories/auth-repository";
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
    async checkCredentials(loginOrEmail:string, password:string):Promise<WithId<UserDBType> | null>{
        const user:WithId<UserDBType> | null = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
        if (!user){
            return null
        }
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash !== passwordHash){
            return null
        }
        return user
    },
    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

}