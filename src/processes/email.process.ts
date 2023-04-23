import { Job } from 'bull'
import Mailer,{EmailData} from '../service/mailer'

const emailProcess = async (job: Job) => {
  const { from, to, subject, html } = job.data
  console.log(from, to, subject, html)
  const result = await Mailer.sendTestMail(from, to, subject, html)
  console.log('nodemailer test message url: ', result)
}

export const sendEmailVerificationLinkProcess = async (job:Job) => {
  const user = job.data
  await Mailer.sendEmailVerificationLink(user)
}

export const sendPasswordResetLinkProcess = async (job:Job) => {
  const user = job.data
  await Mailer.sendPasswordResetLink(user)
}

export default emailProcess
