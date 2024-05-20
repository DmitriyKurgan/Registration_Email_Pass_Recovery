import {Request, Response, Router} from "express";
import {
    authMiddleware,
    validateAuthorization, validateBlogIdForPostsRequests, validateCommentsRequests,
    validateErrorsMiddleware,
    validatePostsRequests, validationPostsCreation
} from "../middlewares/middlewares";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {posts, postsService} from "../services/posts-service";
import {OutputBlogType, OutputCommentType, OutputPostType} from "../utils/types";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {comments, commentsService} from "../services/comments-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";

export const postsRouter = Router({});

postsRouter.get('/', async (req:Request, res:Response)=>{
    const queryValues = getQueryValues({
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        searchNameTerm: req.query.searchNameTerm
    })
    const posts =  await postsQueryRepository.getAllPosts({...queryValues})
    if (!posts || !posts.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }
    res.status(CodeResponsesEnum.OK_200).send(posts);
});

postsRouter.get('/:id', async (req:Request, res:Response)=>{
    const postID:string = req.params.id;
    const postByID:OutputPostType|null = await postsQueryRepository.findPostByID(postID);
    if (!postID || !postByID){
       return res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
    res.status(CodeResponsesEnum.OK_200).send(postByID);
});

postsRouter.get('/:id/comments', async (req:Request, res:Response)=>{
    const queryValues = getQueryValues({
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
    })
    const postID:string = req.params.id;
    const postByID:OutputPostType|null = await postsQueryRepository.findPostByID(postID);
    if (!postID || !postByID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
    const commentsForParticularPost = await commentsQueryRepository.findAllCommentsByPostID(postID, queryValues)
    if (!commentsForParticularPost || !commentsForParticularPost.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }
    res.status(CodeResponsesEnum.OK_200).send(commentsForParticularPost);
});

postsRouter.post('/',
    validateAuthorization,
    validatePostsRequests,
    validateBlogIdForPostsRequests,
    validationPostsCreation,
    validateErrorsMiddleware,
    async (req:Request, res:Response)=>{
    const blog: OutputBlogType | null = await blogsQueryRepository.findBlogByID(req.body.blogId)
    if (!blog){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const newPost: OutputPostType| null = await postsService.createPost( req.body, blog.name, blog.id);
    if (!newPost) {
        return
    }
    posts.push(newPost);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
});

postsRouter.post('/:id/comments',
    authMiddleware,
    validateCommentsRequests,
    validateErrorsMiddleware,
    async (req:Request, res:Response)=>{
    const post: OutputPostType | null = await postsQueryRepository.findPostByID(req.params.id)
    if (!post){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const user = await usersQueryRepository.findUserByID(req.userId!)

    const newComment: OutputCommentType| null = await commentsService.createComment(req.body, post.id, req.userId, user!.accountData.userName);
    if (!newComment) {
        return
    }
    comments.push(newComment);
    res.status(CodeResponsesEnum.Created_201).send(newComment);
});


postsRouter.put('/:id',
    validateAuthorization,
    validatePostsRequests,
    validateBlogIdForPostsRequests,
    validationPostsCreation,
    validateErrorsMiddleware,
    async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isUpdated = await postsService.updatePost(postID, req.body);

    if (!isUpdated || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const postByID = await postsQueryRepository.findPostByID(postID);
    res.status(CodeResponsesEnum.Not_content_204).send(postByID);
});

postsRouter.delete('/:id', validateAuthorization, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isDeleted = await postsService.deletePost(postID);
    if(!isDeleted || !postID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});