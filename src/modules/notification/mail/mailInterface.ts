export interface sendWelcomeLinkDTO {
  link: string;
}

export interface MailOptionsDTO {
  to: string;
  subject: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: any;
}

export interface PasswordResetLinkDTO {
  firstName: string;
  token: string;
  email: string;
}
