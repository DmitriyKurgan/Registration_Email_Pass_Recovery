import nodemailer from 'nodemailer'
//"kmhy ekrl yvpy gsha"
export const emailManager = {
    async sendEmail(email:string,message:string){
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
