import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";
import {authMiddleware, validateAuthRequests, validateErrorsMiddleware} from "../middlewares/middlewares";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";

export const authRouter = Router({});

authRouter.post('/login', validateAuthRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
     const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (!user){
          return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
      }
    const token = await jwtService.createJWT(user);
      res.status(CodeResponsesEnum.OK_200).send(token);
});

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const myID = req.userId
    if (!myID){
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401);
    }
    const user = await usersQueryRepository.findUserByID(myID);
    if (!user){
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    }
    res.status(CodeResponsesEnum.OK_200).send({
        email: user.email,
        login: user.login,
        userId: myID
    })
});

