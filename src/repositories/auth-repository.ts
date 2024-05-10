import {usersAccoutsCollection} from "./db";
import {InsertOneResult, ObjectId, DeleteResult, UpdateResult} from "mongodb";
import {OutputUserAccountType, OutputUserType, UserAccountDBType} from "../utils/types";
import {UserAccountMapper} from "./query-repositories/auth-query-repository";

export const authRepository = {
    async createUser(newUser:UserAccountDBType):Promise<OutputUserAccountType | null> {
        const result:InsertOneResult<UserAccountDBType> = await usersAccoutsCollection.insertOne(newUser);
        const user: UserAccountDBType| null = await usersAccoutsCollection.findOne({_id: result.insertedId});
        return user ? UserAccountMapper(user) : null;
    },
   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await usersAccoutsCollection.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    },
    async updateConfirmation(userID:string):Promise<boolean>{
        const result: UpdateResult = await usersAccoutsCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.isConfirmed':true}});
        return result.matchedCount === 1
    },
    async updateConfirmationCode(userID:string, confirmationCode:string):Promise<boolean>{
        const result: UpdateResult = await usersAccoutsCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.confirmationCode':confirmationCode}});
        return result.matchedCount === 1
    }
}
