import {OutputUserType, UserDBType} from "../../utils/types";
import {ObjectId, WithId} from "mongodb";
import {getUsersFromDB} from "../../utils/utils";
import {usersCollection} from "../db";

export const UserMapper = (user : WithId<UserDBType>) : OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}


export const usersQueryRepository = {
    async getAllUsers(query: any): Promise<any | { error: string }> {
        return getUsersFromDB(query);
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or: [{login:loginOrEmail}, {email:loginOrEmail}]})
        return user
},
    async findUserByID(userID:string){
        const user = await usersCollection.findOne({_id: new ObjectId(userID)})
        return user
    }
}
