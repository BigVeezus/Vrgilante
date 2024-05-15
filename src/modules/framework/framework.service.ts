import { generateReference, generateTemporaryPassword, getAllPermissions } from './../../utils/misc';
import { BadRequestException } from '../../utils/errors/BadRequestException';
import mongoose from '../../utils/mongo';
import frameworkRepository from './framework.repository';
import * as requirementService from '../requirement/requirement.service';
import * as requirementHeaderService from '../requirement/requirementHeader/requirementHeader.service';
import { CreateFrameworkDTO, GetAllFrameworksDTO, GetID, GetMultipleFrameworksRequirementDTO, GetOneBusinessFrameworkID, RequirementUploadDTO, cSVFormat } from './framework.interface';
import slugify from 'slugify';
import { auditorPermissions, superAdminPermissions, supportStaffPermissions, systemAdministratorPermission, vegeelSuperAdminPermissions } from '../role/permission';
import { userTypes } from '../../modules/users/users.enum';
import { title } from 'process';
var csv = require('jquery-csv');
import fs from 'fs';
import { parse } from 'csv-parse';
import { IRequirement } from 'modules/requirement/requirement.model';

export const createFramework = async (payload: CreateFrameworkDTO) => {
  const frameworkData = mapFrameworkData(payload);
  return await frameworkRepository.create(frameworkData);
};

export const getAllFrameworks = async (param: GetAllFrameworksDTO) => {
  const limit = Number(param.limit) || 30;
  const currentPage = Number(param.page) || 1;
  const skip = limit * (currentPage - 1);
  const search = param.search || '';
  const category = param.category || '';
  const version = param.version || '';
  const date = param?.date?.split(',') || [];
  const regex = new RegExp(`${search}`, 'i');

  const filters = {
    ...(category != '' && {
      category: category,
    }),
    ...(version != '' && {
      version: version,
    }),
    ...(search.length > 0 && {
      $and: [
        {
          $or: [{ title: regex }, { shortName: regex }],
        },
      ],
    }),
    ...(date.length > 0 && {
      createdAt: {
        $gte: new Date(date[0]),
        $lte: new Date(date[1]),
      },
    }),
  };

  const frameworks = await frameworkRepository.frameworkModel.aggregate([
    {
      $match: filters,
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $skip: skip,
    },
  ]);

  const count = await frameworkRepository.count(filters);
  //  const totalCount = await frameworkRepository.count()
  return {
    frameworks,
    count,
    currentPage,
  };
};

export const getOneFramework = async (params: GetID) => {
  const dataArr = [];
  const frameworkData = await frameworkRepository.findById(params.id);
  if (!frameworkData) return [];
  const requirementsHeaders = await requirementHeaderService.getFrameWorkRequirementsHeaders(frameworkData._id);
  // const requirements = await requirementService.getFrameWorkRequirements(frameworkData._id);
  const requirementHeadersObj = {
    requirementsHeaders,
  };
  const count = {
    requirementHeaderCount: requirementsHeaders.length,
  };
  dataArr.push(frameworkData, requirementHeadersObj, count);
  // console.log(dataArr);
  return dataArr;
};

export const getOneBusinessFramework = async (params: GetOneBusinessFrameworkID) => {
  const dataArr = [];
  const frameworkData = await frameworkRepository.findById(params.id);
  if (!frameworkData) return [];
  const requirementsHeaders = await requirementHeaderService.getFrameWorkRequirementsHeadersByBusiness(frameworkData._id, params.businessId);
  // const requirements = await requirementService.getFrameWorkRequirements(frameworkData._id);
  const requirementHeadersObj = {
    requirementsHeaders,
  };
  // const count = {
  //   requirementHeaderCount: requirementsHeaders.length,
  // };
  dataArr.push(frameworkData, requirementHeadersObj);
  // console.log(dataArr);
  return dataArr;
};

export const readCSV = async (filePayload: RequirementUploadDTO) => {
  const requirementsArr: any = [];
  const subRequirementsArr: any = [];
  const headersArr: any[] = [];
  // const evidenceArr: any[] = [];
  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePayload.files[0].path)
        .pipe(
          parse({
            delimiter: ',',
            columns: true,
            ltrim: true,
          }),
        )
        .on('data', function (row: cSVFormat) {
          // This will push the object row into the array
          if (!row.index || !row.title) {
            return;
          }
          if (row.sub_index) {
            subRequirementsArr.push(row);
          }
          const index = row.index;
          const indexArr = index.split('.');
          // console.log(indexArr);
          if (indexArr[1] == '0' || !indexArr[1]) {
            headersArr.push(row);
            return;
          }
          const evidence = row.suggested_evidence;
          const evidenceArr = evidence.split(',');
          row.numOfEvidenceRequired = evidenceArr.length;
          requirementsArr.push(row);
        })
        .on('error', function (error: { message: string }) {
          console.log(error.message);
          fs.unlinkSync(filePayload.files[0].path);
          reject(error.message);
        })
        .on('end', function (data: any) {
          fs.unlinkSync(filePayload.files[0].path);
          resolve();
        });
    });

    return {
      subRequirementsArr,
      requirementsArr,
      headersArr,
    };
  } catch (error) {
    throw new BadRequestException({ message: error as string });
  }
};

export const getMultipleFrameworksRequirements = async (params: GetMultipleFrameworksRequirementDTO) => {
  let requirements: any = [];
  await Promise.all(
    params.frameworks.map(async (framework) => {
      const frameworkRequiement = await frameworkRepository.getRequirment({ frameworkId: new mongoose.Types.ObjectId(framework) });
      console.log('log', frameworkRequiement);
      if (frameworkRequiement.length > 0) {
        requirements.push(...frameworkRequiement);
      }
    }),
  );
  return requirements;
};

const mapFrameworkData = (payload: CreateFrameworkDTO) => {
  return {
    title: payload.title,
    shortName: payload.shortName,
    category: payload.category,
    description: payload.description,
    complianceStandard: {
      name: payload.complianceStandard.name,
      description: payload.complianceStandard.description,
    },
    referenceLinks: payload.referenceLinks,
    slug: slugify(payload.title, '-'),
    departmentResponsible: {
      name: payload.departmentName,
      description: payload.departmentDescription,
    },
    implementationGuidance: {
      name: payload.implementationGuidance.name,
      description: payload.implementationGuidance.description,
      documentUrl: payload.implementationGuidance.documentUrl,
    },
  };
};
