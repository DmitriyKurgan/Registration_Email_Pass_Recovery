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
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const userAccount:WithId<UserAccountDBType> | null = await usersAccoutsCollection.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return userAccount ? UserAccountMapper(userAccount) : null
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const userAccount:WithId<UserAccountDBType> | null = await usersAccoutsCollection.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return userAccount ? UserAccountMapper(userAccount) : null
    },
}
