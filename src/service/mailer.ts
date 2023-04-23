import nodemailer from 'nodemailer'
import { UserDocument } from '../models/User'
import { emailTemplate } from '../utils/emailTemplate'
import { generateEmailVerificationToken, generateResetPasswordToken } from '../utils/token'
import * as dotenv from 'dotenv'

dotenv.config()

export type EmailData = {
  from: string;
  to: string;
  subject: string;
  body: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
  logger: true,
})

class Mailer {
  public transporter
  constructor() {
    this.transporter = transporter
  }

  public async sendTestMail(from: string, to: string, subject: string, body: string): Promise<any> {
    console.log('sending test email')
    const testAccount = await nodemailer.createTestAccount()
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      body: body,
    }

    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // send the mail with the transport object
    const info = await testTransporter.sendMail(mailOptions)

    console.log(`Message sent: %s`, info.messageId)

    return nodemailer.getTestMessageUrl(info)
  }

  /**
   * @desc : Send mail primary utility
   * @param from
   * @param to
   * @param subject
   * @param body
   * @returns {Promise<any>}
   */
  public sendMail(from: string, to: string, subject: string, body: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body,
      }

      // do not send a mail in development or testing mode
      //if (process.env.NODE_ENV !== 'production') {
        //console.log(mailOptions)
        //resolve({ message: 'Email successfully sent!' })
        //return
      //}

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('An error occurred while sending mail.')
          reject({ error: 'An error occurred while sending mail.' })
        } else {
          console.log('Email successfully sent.')
          resolve({ message: 'Email successfully sent.' })
        }
      })
    })
  }

  /**
   * @desc : Send E-mail verification link using Nodemailer and Sendgrid
   * @param {UserDocument} user
   * @returns {Promise<any>}
   */
  public async sendEmailVerificationLink(user: UserDocument): Promise<any> {
    const { email } = user
    const verificationToken = await generateEmailVerificationToken(user)
    const emailVerificationLink = `${process.env.CLIENT_URL}/auth/verify-email/${user._id}/${verificationToken}`

    const emailHTML = emailTemplate(
      'Verify Your Account',
      `<p>
                Hi, ${user.name}<br>

                Thanks for signing up, Use the link/button below to verify your email address. 
                This link will expire in 30 mins and can only be used once. 
            </p>`,
      emailVerificationLink,
      'Verify your E-mail',
    )

    return this.sendMail(
      process.env.EMAIL_FROM as string,
      email,
      'Verify your Account',
      emailHTML as string,
    )
  }

  public async sendPasswordResetLink(user: UserDocument): Promise<any> {
    const { email } = user
    /* Reset password token, Expires in 45 minutes */
    const resetPasswordToken = await generateResetPasswordToken(user)
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${resetPasswordToken}`
    const emailHTML = emailTemplate(
      'Reset your Password',
      `<p>
                Hi, ${user.name}<br>

                Click the button below to reset your password. If that does not work, 
                copy and paste the link below in your browser to reset your password.
            </p>`,
      resetPasswordLink,
      'Reset your Password',
    )

    return this.sendMail(
      process.env.EMAIL_FROM as string,
      email,
      'Reset your Password',
      emailHTML as string,
    )
  }
}

export default new Mailer()
