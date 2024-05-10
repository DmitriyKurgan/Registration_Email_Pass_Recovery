import nodemailer from 'nodemailer'
//"kmhy ekrl yvpy gsha"
export const emailManager = {
    async sendEmail(email:string, confirmationCode:string,message:string){
        const companyEmail = process.env.COMPANY_EMAIL;
        const companyPassword = process.env.COMPANY_PASSRORD;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: companyEmail,
                pass: companyPassword,
            }
        })

        const info = await transport.sendMail({
            from:`Dima Kurgan<${companyEmail}>`,
            to: email,
            subject: 'Registration',
            html: message
        })

        return info
    }
}



    // async sendRegistrationEmail(email: string, confirmationCode: string) {
    //     const registrationSubject = "Confirm your email";
    //     const registrationMessage = `<h1>Thank you for registration!</h1><p>To finish registration process please follow the link below:<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a></p>`;
    //     await emailAdapter.sendEmail(
    //         email,
    //         registrationSubject,
    //         registrationMessage
    //     );
    // },
    //
    // async sendChangePasswordEmail(email: string, recoveryCode: string) {
    //     const registrationSubject = "Password recovery";
    //     const registrationMessage = `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href="https://somesite.com/password-recovery?recoveryCode=${recoveryCode}">recovery password</a></p>`;
    //     await emailAdapter.sendEmail(
    //         email,
    //         registrationSubject,
    //         registrationMessage
    //     );
    // },
