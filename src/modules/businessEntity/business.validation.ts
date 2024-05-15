import Joi from 'joi';

export const fetchAllBusinessUsersValidation = Joi.object().keys({
  businessId: Joi.string().required(),
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(20),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  status: Joi.string().optional(),
  email: Joi.string().optional(),
  roleId: Joi.string().optional().default('all'),
  shouldBePaginated: Joi.boolean().optional().default(true),
});

export const fetchAllBusinessesValidation = Joi.object().keys({
  category_slug: Joi.string().trim().optional(),
  limit: Joi.number().integer().min(1).default(20),
  page: Joi.number().integer().min(1),
  status: Joi.string().optional(),
  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(),
  type: Joi.string().optional(),
  name: Joi.string().optional(),
  shouldBePaginated: Joi.boolean().optional().default(true),
});

export const createBusinessValidation = Joi.object().keys({
  businessId: Joi.string().trim().required(),
  doesBusinessConsent: Joi.boolean(),
  legalName: Joi.string().trim().optional().allow(''),
  registrationnumber: Joi.string().optional().trim(),
  logo: Joi.string().trim().optional().allow(''),
  companyEntityType: Joi.string().optional().trim().allow(''),
  industry: Joi.string().optional().trim().allow(''),
  supportPhone: Joi.string().optional().trim().allow(''),
  supportEmail: Joi.string().email().optional().trim().allow(''),
  website: Joi.string().optional().trim().allow(''),
  yearFounded: Joi.string().optional().trim().allow(''),
  overview: Joi.string().optional().trim().allow(''),
  addressDetails: Joi.object()
    .keys({
      zipCode: Joi.string().optional().trim().allow(''),
      street: Joi.string().optional().trim().allow(''),
      subStreet: Joi.string().optional().trim().allow(''),
      country: Joi.string().optional().trim().allow(''),
      state: Joi.string().optional().trim().allow(''),
      city: Joi.string().optional().trim().allow(''),
    })
    .default({}),
  termOfuseUrl: Joi.string().optional().allow(''),
  privacyPolicyUrl: Joi.string().optional().allow(''),
  serviceAgreementUrl: Joi.string().optional().allow(''),
  faqUrl: Joi.string().optional().allow(''),
  displayName: Joi.string().optional().allow(''),
});

export const frameworkToBusinessValidation = Joi.object().keys({
  businessId: Joi.string().trim().required(),
  frameworkId: Joi.string().trim().required(),
  user: Joi.object(),
});

export const reviewRequestValidation = Joi.object().keys({
  agent_id: Joi.string().trim().required(),
  accepted: Joi.boolean().required(),
});

export const sendAgentRequestValidation = Joi.object().keys({
  email: Joi.string().trim().email().required(),
});

export const dissociateAgentValidation = Joi.object().keys({
  agent_id: Joi.string().trim().required(),
  reason: Joi.string().trim().required(),
});

export const createBusinessCategoryValidation = Joi.object().keys({
  category_name: Joi.string().trim().required(),
});

export const updatePermitValidation = Joi.object().keys({
  slug: Joi.string().trim().required(),
  is_disabled: Joi.boolean().required(),
});

export const deactivateBusinessValidation = Joi.object().keys({
  business_id: Joi.string().trim().required(),
});

export const businessIdValidation = Joi.object().keys({
  businessId: Joi.string().trim().required(),
});

export const inviteBusinessAdminValidation = Joi.object().keys({
  companyEmail: Joi.string().trim().email().required(),
  adminEmail: Joi.string().trim().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  companyName: Joi.string().trim().required(),
  type: Joi.string().trim().optional().default('business'),
});

export const evidenceValidation = Joi.object().keys({
  files: Joi.array().not().empty().required(),
  user: Joi.object().required(),
  evidenceTitle: Joi.string().not().empty().required(),
  businessId: Joi.string().trim().required(),
  requirementId: Joi.string().trim().required(),
});

export const inviteTeamMemberValidation = Joi.object().keys({
  businessId: Joi.string().trim().required(),
  roleId: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
});

export const teamChangePasswordValidation = Joi.object().keys({
  resetToken: Joi.string().trim().required(),
  newPassword: Joi.string().min(6).trim().required(),
});
