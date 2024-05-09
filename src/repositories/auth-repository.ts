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
    async updateConfirmation(userID:ObjectId):Promise<boolean>{
        const result: UpdateResult = await usersAccoutsCollection.updateOne({_id:userID},
            {$set:{'emailConfirmation.isConfirmed':true}});
        return result.matchedCount === 1
    }
}
