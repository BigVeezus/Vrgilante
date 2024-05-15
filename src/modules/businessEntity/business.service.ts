import { generateReference, generateTemporaryPassword, getAllPermissions } from './../../utils/misc';
import { BadRequestException } from '../../utils/errors/BadRequestException';
import mongoose from '../../utils/mongo';
import { BusinessEntityTypes, IndustrySectors } from './business.constant';
import {
  AddFrameworkToBusinessDTO,
  AddRequirementToBusinessDTO,
  CreateBusinessDTO,
  GetAllBusinessesDTO,
  GetBusinessRequirementDTO,
  GetBusinessUsersDTO,
  InviteNewBusinessAdminDTO,
  businessProfileDTO,
  updateTakeLookAroundStatusDTO,
} from './business.interface';
import businessRepository from './business.repository';
import slugify from 'slugify';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../role/permission';
import { IBusiness } from './business.model';
import { userTypes } from '../../modules/users/users.enum';
import bcrypt from 'bcrypt';
import frameworkRepository from '../../modules/framework/framework.repository';
import requirementRepository from '../../modules/requirement/requirement.repository';
import businessRequirementRepository from './business-requirement/business-requirement.repository';
import { GetID } from 'modules/framework/framework.interface';
import { sendWelcomeEmail } from '../../modules/notification/mail/mailService';
import usersRepository from '../../modules/users/repositories/users.repository';

export const getBusinessOptions = () => {
  return {
    businessEntityTypes: BusinessEntityTypes,
    industrySectors: IndustrySectors,
  };
};

export const fetchBusinessUsers = async (payload: GetBusinessUsersDTO) => {
  if (!payload.shouldBePaginated) return await getBusinessUsersNotPaginated(payload.businessId);
  const searchCondition = businessUsersSearchCondition(payload);
  const users = await businessRepository.getBusinessUsers(searchCondition, {
    limit: payload.limit,
    page: payload.page,
    sort: { createdAt: -1 },
  });
  return {
    data: users.data,
    pagination: users.meta,
  };
};

export const fetchBusinesses = async (payload: GetAllBusinessesDTO) => {
  if (!payload.shouldBePaginated) return await businessRepository.find({}, { _id: 1, companyName: 1 });
  const searchCondition = businessesSearchCondition(payload);
  const businesses = await businessRepository.findAndPaginate(searchCondition, { limit: payload.limit, page: payload.page }, { sort: { createdAt: 'descending' } });

  return {
    data: businesses.data,
    pagination: businesses.meta,
  };
};

export const onboardingAnalytics = async (payload: businessProfileDTO) => {
  const companyInformationLength = 3;
  const contactDetailsLength = 3;
  const addressLength = 3;
  const urlInformationLength = 2;
  const takeALookAround = payload.user.business?.completedTakeALookAround;

  // const otherUser = await businessRepository.getBusinessUsers(
  //   { email: { $ne: payload.user.email }, businessId: payload.user.businessId, active: true },
  //   { limit: 20, page: 1, sort: { createdAt: -1 } },
  // );
  const businessUsers = await usersRepository.count({
    businessId: payload.user.businessId,
    status: 'active',
  });
  // console.log(businessUsers);
  // const personnelCount = otherUser.meta.totalItems;
  // console.log('teamMember', personnelCount);
  // console.log(payload.user.businessId);

  const expectedPass = calculatedExpectedPass(payload, companyInformationLength, contactDetailsLength, addressLength, urlInformationLength);

  const documentCount = await businessRepository.getDocument(payload.user.businessId.toString());

  const companyDetailsProgress = (expectedPass / 4) * 100;
  const takeALookAroundProgress = takeALookAround ? 100 : 0;

  const personnelProgress = businessUsers > 1 ? 100 : 0;
  const documentsUploadedProgress = documentCount > 0 ? 100 : 0;
  const businessAnalytics = {
    companyDetailsProgress: {
      company_information: handleBusinessInformationPassed(payload) === companyInformationLength,
      contact_detail: handlContactInformationPassed(payload) === contactDetailsLength,
      address: handleAddressInformationPassed(payload) === addressLength,
      url: handleUrlInformationPassed(payload) === urlInformationLength,
      percent: companyDetailsProgress,
    },
    takeALookAroundProgress,
    documentsUploadedProgress,
    personnelProgress,
  };

  const totalProgress = businessAnalytics.companyDetailsProgress.percent + takeALookAroundProgress + documentsUploadedProgress + personnelProgress;
  // console.log('p', totalProgress);

  const totalProgressPercent = Math.round((totalProgress / (Object.keys(businessAnalytics).length * 100)) * 100);

  return {
    businessAnalytics,
    totalProgressPercent,
  };
};

export const inviteNewBusinessAdmin = async (params: InviteNewBusinessAdminDTO) => {
  const { companyName, type = 'business', adminEmail, companyEmail } = params;
  const existingBusinessAdmin = await businessRepository.findUser({
    $or: [{ email: adminEmail }, { 'contactInformation.supportPhone': companyEmail }],
  });
  if (existingBusinessAdmin)
    throw new BadRequestException({
      message: 'An account with this email already exists',
    });
  const checkCompanyEmail = await businessRepository.findOne({
    $or: [{ 'contactInformation.supportPhone': companyEmail }, { 'contactInformation.supportPhone': adminEmail }],
  });
  if (checkCompanyEmail) {
    throw new BadRequestException({
      message: 'A company account with this email already exists',
    });
  }
  const slug = await handleSlugGenerating(companyName, type);
  return handleSavingAdminInvite(params, slug);
};

export const createBusiness = async (params: CreateBusinessDTO) => {
  const business = await businessRepository.findById(params.businessId);
  if (!business) throw new BadRequestException({ message: 'Business not found' });
  if (business.status != 'invited') throw new BadRequestException({ message: 'Account already created' });
  if (!params.doesBusinessConsent) throw new BadRequestException({ message: 'Business must accept policy terms and conditions' });
  const businessData = getBusinessData(params, business);
  return await businessRepository.update(business._id.toString(), businessData);
};

export const updateTakeLookAroundStatus = async (params: updateTakeLookAroundStatusDTO) => {
  const business = await businessRepository.findById(params.businessId);
  if (!business) throw new BadRequestException({ message: 'Business not found' });
  if (business.completedTakeALookAround) throw new BadRequestException({ message: 'Take a look around already completed' });
  await businessRepository.update(params.businessId, { completedTakeALookAround: true });
  business.completedTakeALookAround = true;
  return business;
};

export const addRequirement = async (params: AddRequirementToBusinessDTO) => {
  const requirement = await requirementRepository.findById(params.requirementId);
  if (!requirement) throw new BadRequestException({ message: 'requirement not found' });
  const data = await businessRequirementRepository.create({
    ...params,
    businessId: new mongoose.Types.ObjectId(params.businessId),
    requirementId: new mongoose.Types.ObjectId(params.requirementId),
  });
  return data;
};

export const getBusinessRequirements = async (params: GetBusinessRequirementDTO) => {
  // return businessRequirementRepository.find({ businessId: params.businessId });
  const status = params.status || '';
  const clause = params.clause || '';
  const processOwner = params.processOwner || '';

  const filters = {
    businessId: new mongoose.Types.ObjectId(params.businessId),
    ...(status != '' && {
      status: status,
    }),
    ...(clause != '' && {
      'requirements.clause': clause,
    }),
    ...(processOwner != '' && {
      processOwner: processOwner,
    }),
  };

  return businessRequirementRepository.businessRequirementModel.aggregate([
    {
      $lookup: {
        from: 'framework-requirements',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirements',
      },
    },
    { $match: filters },
  ]);
};

const getBusinessUsersNotPaginated = async (businessId: string) => {
  return await businessRepository.getUserNonPaginated({ businessId: businessId, isBlocked: false, status: 'activated' });
};
const getBusinessData = (payload: CreateBusinessDTO, business: IBusiness) => {
  return {
    // companyName: payload.displayName ?? business.,
    doesBusinessConsent: payload.doesBusinessConsent ?? business.doesBusinessConsent,
    yearFounded: payload.yearFounded ?? business.yearFounded,
    overview: payload.overview,
    businessInformation: {
      legalName: payload.legalName ?? payload.legalName,
      registrationnumber: payload.registrationnumber ?? business.businessInformation.registrationnumber,
      logo: payload.logo ?? business.businessInformation.logo,
      companyEntityType: payload.companyEntityType ?? business.businessInformation.companyEntityType,
      industry: payload.industry ?? business.businessInformation.industry,
      displayName: payload.displayName ?? business.businessInformation.displayName,
    },
    contactInformation: {
      supportPhone: payload.supportPhone ?? business.contactInformation.supportPhone,
      supportEmail: payload.supportEmail ?? business.contactInformation.supportEmail,
      website: payload.website ?? business.contactInformation.website,
    },
    officeAddress: {
      zipCode: payload.addressDetails.zipCode ?? business.officeAddress.zipCode,
      street: payload.addressDetails.street ?? business.officeAddress.street,
      subStreet: payload.addressDetails.subStreet ?? business.officeAddress.subStreet,
      country: payload.addressDetails.country ?? business.officeAddress.country,
      state: payload.addressDetails.state ?? business.officeAddress.state,
      city: payload.addressDetails.city ?? business.officeAddress.city,
    },
    policyInformation: {
      termsOfUse: payload.termOfuseUrl ?? business.policyInformation.termsOfUse,
      privacyPolicy: payload.privacyPolicyUrl ?? business.policyInformation.privacyPolicy,
      serviceAgreement: payload.serviceAgreementUrl ?? business.policyInformation.serviceAgreement,
      faq: payload.faqUrl ?? business.policyInformation.faq,
    },
    isVerified: true,
    active: true,
    status: 'activated',
  };
};

const handleSlugGenerating = async (legalName: string, type: string) => {
  let slug =
    type === 'business'
      ? slugify(`vegeel-business-${legalName}-${Math.floor(1000 + Math.random() * 9000)}`, {
          lower: true,
          strict: true,
        })
      : slugify('vegeel-super-admin', {
          lower: true,
          strict: true,
        });
  let existingBusinessWithSlug = await businessRepository.findOne({
    slugPrefix: slug,
  });
  while (existingBusinessWithSlug) {
    slug = slugify(`vegeel-business-${legalName}-${Math.floor(1000 + Math.random() * 9000)}`, {
      lower: true,
      strict: true,
    });
    existingBusinessWithSlug = await businessRepository.findOne({
      slugPrefix: slug,
    });
  }
  return slug;
};

const handleSavingAdminInvite = async (data: InviteNewBusinessAdminDTO, slug: string) => {
  const { companyName, type, companyEmail, firstName, lastName, adminEmail } = data;
  try {
    const businessInformation = {
      legalName: companyName,
      registrationNumber: '',
      logo: '',
      tagline: '',
      industry: '',
    };
    const permissions = type === 'admin' ? getAllPermissions(vegeelSuperAdminPermissions.permissions) : getAllPermissions(superAdminPermissions.permissions);

    const session = await businessRepository.schemaModel.startSession();
    session.startTransaction();
    const data = {
      contactInformation: {
        supportEmail: companyEmail,
        supportPhone: '',
        website: '',
        facebook: '',
        instagram: '',
        twitter: '',
      },
      businessInformation,
      status: 'invited',
      slugPrefix: slug,
      permissions,
    };
    const business = await businessRepository.create(data, { session });

    const role = await businessRepository.getRole({ type: 'business', slug: 'admin' });
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(generateTemporaryPassword(8), salt);
    const businessAdmin = await businessRepository.createUser(
      {
        firstName,
        lastName,
        email: adminEmail,
        isOwner: true,
        status: 'invited',
        resetPasswordToken: generateReference(20),
        resetPasswordExpires: new Date(Date.now() + 31536000000),
        businessId: business._id,
        roleId: role?._id,
        password: passwordHashed,
        userType: userTypes.BUSINESS,
        permissions,
        isAdmin: true,
      },
      { session },
    );
    await session.commitTransaction();
    session.endSession();

    sendWelcomeEmail(businessAdmin.resetPasswordToken!, companyName, adminEmail);
    // send email to businessAdmin
    return businessAdmin;
  } catch (error) {
    console.log(error);
    throw new BadRequestException({ message: 'Error Sending Invite' });
  }
};

const calculatedExpectedPass = (payload: businessProfileDTO, companyInformationLength: number, contactDetailsLength: number, addressLength: number, urlInformationLength: number) => {
  const companyInformationPassed = handleBusinessInformationPassed(payload) === companyInformationLength;
  const contactInformationPassed = handlContactInformationPassed(payload) === contactDetailsLength;
  const addressInformationPassed = handleAddressInformationPassed(payload) === addressLength;
  const urlInformationPassed = handleUrlInformationPassed(payload) === urlInformationLength;

  return Number(companyInformationPassed) + Number(contactInformationPassed) + Number(addressInformationPassed) + Number(urlInformationPassed);
};

const handlContactInformationPassed = (payload: businessProfileDTO) => {
  const { supportPhone, supportEmail, website } = payload.user.business?.contactInformation || {};
  return (supportPhone ? 1 : 0) + (supportEmail ? 1 : 0) + (website ? 1 : 0);
};

const handleBusinessInformationPassed = (payload: businessProfileDTO) => {
  const { legalName, companyEntityType, tagline, industry } = payload.user.business?.businessInformation || {};
  console.log('legalName', legalName);
  return (legalName ? 1 : 0) + (companyEntityType ? 1 : 0) + (industry ? 1 : 0);
};

const handleAddressInformationPassed = (payload: businessProfileDTO) => {
  const { street, country, state } = payload.user.business?.officeAddress || {};
  return (street ? 1 : 0) + (country ? 1 : 0) + (state ? 1 : 0);
};

const handleUrlInformationPassed = (payload: businessProfileDTO) => {
  const { termsOfUse, privacyPolicy } = payload.user.business?.policyInformation || {};
  return (termsOfUse ? 1 : 0) + (privacyPolicy ? 1 : 0);
};

const businessUsersSearchCondition = (params: GetBusinessUsersDTO) => {
  let criteria: any = {
    businessId: new mongoose.Types.ObjectId(params.businessId),
  };
  if (params.status) {
    const status = params.status.split(',');
    criteria = {
      ...criteria,
      status: { $in: status },
    };
  }

  if (params.email) {
    criteria = {
      ...criteria,
      email: params.email,
    };
  }

  if (params.roleId !== 'all') {
    criteria = {
      roleId: params.roleId,
      businessId: new mongoose.Types.ObjectId(params.businessId),
    };
  }

  if (params.firstName) {
    const regex = new RegExp(params.firstName, 'i');
    criteria = {
      ...criteria,
      firstName: { $regex: regex },
    };
  }

  if (params.lastName) {
    const regex = new RegExp(params.lastName, 'i');
    criteria = {
      ...criteria,
      lastName: { $regex: regex },
    };
  }
  return criteria;
};

const businessesSearchCondition = (params: GetAllBusinessesDTO) => {
  let criteria = {};

  if (params.status) {
    const status = params.status.split(',');
    criteria = {
      ...criteria,
      status: { $in: status },
    };
  }

  if (params.type) {
    const type = params.type.split(',');
    criteria = {
      ...criteria,
      type: { $in: type },
    };
  }

  if (params.startDate && params.endDate) {
    criteria = {
      ...criteria,
      createdAt: {
        $gte: new Date(params.startDate),
        $lte: new Date(params.endDate),
      },
    };
  }

  if (params.name) {
    const regex = new RegExp(params.name, 'i');
    criteria = {
      ...criteria,
      companyName: { $regex: regex },
    };
  }

  criteria = {
    ...criteria,
    type: { $in: ['standard', 'premium', 'admin'] },
  };

  return criteria;
};
