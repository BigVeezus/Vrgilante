import { BadRequestException, env } from '../../../utils';
import { mailSubjects } from './mailEnum';
import { MailOptionsDTO, PasswordResetLinkDTO } from './mailInterface';
import nodemailer from 'nodemailer';
import sgMail = require('@sendgrid/mail');

sgMail.setApiKey(env('SENDGRID_KEY'));

export const sendWelcomeEmail = async (token: string, businessName: string, adminEmail: string) => {
  const link = `${env('FRONTEND_LINK')}auth/resetpassword?token=${token}`;
  console.log('link', link);
  const data = getWelcomeEmailData(link, businessName, adminEmail);
  return await sendMail(data);
};

export const sendPasswordReset = async (params: PasswordResetLinkDTO) => {
  const data = getPasswordResetLink(params);
  return await sendMail(data);
};

const getPasswordResetLink = (params: PasswordResetLinkDTO) => {
  const link = `${env('FRONTEND_LINK')}auth/resetpassword?token=${params.token}`;
  console.log('link', link);
  const data = {
    to: params.email,
    subject: mailSubjects.passwordReset,
    templateId: env('FORGET_PASSWORD_TEMPLATE_ID'),
    dynamicTemplateData: {
      name: params.firstName,
      link,
    },
  };
  return mailOptions(data);
};
const getWelcomeEmailData = (link: string, businessName: string, email: string) => {
  const data = {
    to: email,
    subject: mailSubjects.accountOpeningEmailOTP,
    templateId: env('WELCOME_TEMPLATE_ID'),
    dynamicTemplateData: {
      name: businessName,
      link,
    },
  };

  return mailOptions(data);
};

const mailOptions = (params: MailOptionsDTO) => {
  const { to, subject, templateId, dynamicTemplateData } = params;
  return {
    from: env('EMAIL_FROM'),
    to,
    subject,
    templateId,
    dynamicTemplateData,
  };
};

const transporter = nodemailer.createTransport({
  host: env('MAIL_HOST'),
  secure: true,
  port: Number(env('MAIL_PORT')),
  auth: {
    user: env('MAIL_USERNAME'),
    pass: env('MAIL_PASSWORD'),
  },
});

const sendMail = async (mailOptions: any) => {
  await sgMail.send(mailOptions);

  // transporter.sendMail(mailOptions, function(err, info){
  //   if(err){
  //     console.log(err)
  //   }
  // })
};
