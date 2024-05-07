import {OutputUserType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId, WithId} from "mongodb";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
export const users = [] as OutputUserType[]

export const usersService:any = {

    async createUser(login:string, email:string, password:string):Promise<OutputUserType | null> {

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser:UserDBType = {
            _id: new ObjectId(),
            login,
            email,
            passwordSalt,
            passwordHash,
            createdAt: new Date()
        }
        const createdUser = await usersRepository.createUser(newUser);
        return createdUser;
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await usersRepository.deleteUser(userID);
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