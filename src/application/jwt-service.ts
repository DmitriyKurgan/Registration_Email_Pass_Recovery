import {AccessTokenType, OutputUserType, UserDBType, UserType} from "../utils/types";
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";

export const jwtService:any = {

    async createJWT(user:OutputUserType):Promise<AccessTokenType> {
        const accessToken = {
            accessToken:  jwt.sign({userId:user.id}, settings.JWT_SECRET, {expiresIn:'90h'})
        }
        return accessToken
    },
    async getUserIdByToken(token:string):Promise<ObjectId | null>{
        try {
           const result:any = jwt.verify(token, settings.JWT_SECRET);
           return result.userId;
        } catch (e:unknown) {
            return null
        }
    }

}