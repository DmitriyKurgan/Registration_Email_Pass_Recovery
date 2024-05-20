import {InsertOneResult, ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {OutputUserType, UserDBType} from "../utils/types";
import {usersCollection} from "./db";
import {UserMapper} from "./query-repositories/users-query-repository";

export const authRepository = {
   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await usersCollection.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    },
    async updateConfirmation(userID:string):Promise<boolean>{
        const result: UpdateResult = await usersCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.isConfirmed':true}});
        return result.matchedCount === 1
    },
    async updateConfirmationCode(userID:string, confirmationCode:string):Promise<boolean>{
        const result: UpdateResult = await usersCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.confirmationCode':confirmationCode}});
        return result.matchedCount === 1
    }
}
