import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export type BLogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date | string
    isMembership:boolean
}

export type OutputBlogType = BLogType & {id:string}

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName:string
    createdAt: Date | string
}

export type OutputPostType = PostType & {id:string}

export type UserType = {
    // login: string
    // email: string
    // createdAt: Date | string
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}

// export type UserAccountType = {
//     accountData: AccountDataType,
//     emailConfirmation: EmailConfirmationType
// }

export type UserDBType = {
    // _id: ObjectId
    // login: string
    // email: string
    // passwordSalt: string
    // passwordHash: string
    // createdAt: Date | string
    _id: ObjectId
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}

// export type UserAccountDBType = {
//     _id: ObjectId
//     accountData: AccountDataType,
//     emailConfirmation: EmailConfirmationType
// }

export type AccountDataType = {
    userName: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: Date | string
}

export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date | string,
    isConfirmed:boolean
}


export type OutputUserType = UserType & {id:string}
//export type OutputUserAccountType = UserAccountType & {id:string}

export type CommentType = {
    postId?:string
    content:string
    commentatorInfo:{
        userId: string,
        userLogin: string
    }
    createdAt:string
}

export type OutputCommentType = CommentType & {id:string}

export type BlogsServiceType = {
    createBlog(body: BLogType): Promise<OutputBlogType | null>
    updateBlog(blogID: string, body: BLogType): Promise<boolean>
    deleteBlog(blogID: string): Promise<boolean>
}

export type PostsServiceType = {
    createPost(body: PostType, blogName: string, blogID: string):Promise<OutputPostType | null>
    updatePost(postID: string, body: PostType): Promise<boolean>
    deletePost(postID: string): Promise<boolean>
}

export type AccessTokenType = {
    accessToken:string
}
