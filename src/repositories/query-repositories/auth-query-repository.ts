import {OutputUserAccountType, OutputUserType, UserAccountDBType, UserDBType} from "../../utils/types";
import {ObjectId, WithId} from "mongodb";
import {getUsersFromDB} from "../../utils/utils";
import {usersAccoutsCollection, usersCollection} from "../db";

export const UserAccountMapper = (user : WithId<UserAccountDBType>) : OutputUserAccountType => {
    return {
        id: user._id.toString(),
        accountData:{...user.accountData},
        emailConfirmation:{...user.emailConfirmation},
    }
}


export const authQueryRepository = {
    async getAllUsers(query: any): Promise<any | { error: string }> {
        return getUsersFromDB(query);
    },
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const user:WithId<UserAccountDBType> | null = await usersAccoutsCollection.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return user
},
    async findUserByID(userID:string){
        const user = await usersCollection.findOne({_id: new ObjectId(userID)})
        return user
    }
}
