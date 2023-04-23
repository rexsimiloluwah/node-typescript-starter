import Queue from 'bull'
import {sendEmailVerificationLinkProcess,sendPasswordResetLinkProcess} from '../processes/email.process'

export const emailQueue = new Queue('email', {
  redis: process.env.REDIS_URL,
})

export const sendEmailVerificationLinkQueue = new Queue('email:verification_link', {
  redis: process.env.REDIS_URL
})

export const sendPasswordResetLinkQueue = new Queue('email:reset_password', {
  redis: process.env.REDIS_URL
})

//emailQueue.process(emailProcess)
sendEmailVerificationLinkQueue.process(sendEmailVerificationLinkProcess)
sendPasswordResetLinkQueue.process(sendPasswordResetLinkProcess)


export const sendNewEmail = (data: any) => {
  emailQueue.add(data, {
    attempts: 2,
  })
}

export const sendEmailVerificationLink = async (data:any) => {
  sendEmailVerificationLinkQueue.add(data, {
    attempts: 2,
  })
}

export const sendPasswordResetLink = async (data:any) => {
  sendPasswordResetLinkQueue.add(data, {
    attempts: 2,
  })
}
