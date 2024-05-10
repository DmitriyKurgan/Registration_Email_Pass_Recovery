import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";
import {
    authMiddleware,
    validateAuthRequests, validateEmailResendingRequests,
    validateErrorsMiddleware, validateRegistrationConfirmationRequests,
    validateUsersRequests, validationUserUnique
} from "../middlewares/middlewares";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import { emailManager} from "../managers/email-manager";
import {authService} from "../services/auth-service";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {OutputUserAccountType, UserAccountDBType} from "../utils/types";
import {authQueryRepository} from "../repositories/query-repositories/auth-query-repository";
import {WithId} from "mongodb";
import {emailService} from "../services/email-service";

export const authRouter = Router({});

authRouter.post('/login', validateAuthRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
     const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (!user){
          return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
      }
    const token = await jwtService.createJWT(user);
      res.status(CodeResponsesEnum.OK_200).send(token);
});

authRouter.post('/registration',
     validateUsersRequests,
     validationUserUnique("email"),
     validationUserUnique("login"),
     validateErrorsMiddleware,
    async (req: Request, res: Response) => {
        const userAccount:OutputUserAccountType | null = await authService.createUser(req.body.login, req.body.email, req.body.password);
        if (!userAccount || !userAccount.emailConfirmation.confirmationCode){
          return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        const gmailResponse = await emailService.sendEmail(userAccount, userAccount.emailConfirmation.confirmationCode);
        if(!gmailResponse){
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        res.sendStatus(CodeResponsesEnum.Not_content_204)
});
authRouter.post('/registration-confirmation', validateRegistrationConfirmationRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const confirmationCode = req.body.confirmationCode;
    const confirmationResult = authService.confirmRegistration(confirmationCode);
    if (!confirmationResult){
        return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});
authRouter.post('/registration-email-resending', validateEmailResendingRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const userEmail = req.body.email;
    const confirmationCodeUpdatingResult = authService.resendEmail(userEmail);
    if (!confirmationCodeUpdatingResult) return;
    res.sendStatus(CodeResponsesEnum.Not_content_204);
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

