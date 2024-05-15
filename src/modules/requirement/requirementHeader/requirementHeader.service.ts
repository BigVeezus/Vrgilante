import { cSVFormat } from 'modules/framework/framework.interface';
import requirementHeaderRepository from './requirementHeader.repository';
import mongoose from 'mongoose';
import { requirementsHeader } from '../requirement.interface';

export const createRequirementHeader = async (payload: cSVFormat[], frameworkId: string) => {
  const mappedData = mapPayloadToHeaderRequirement(payload, frameworkId);
  const data = await requirementHeaderRepository.createMany(mappedData);
  // await requirementHeaderRepository.deleteMany();
  return {
    data: '',
  };
};

export const getFrameWorkRequirementsHeaders = async (frameworkId: mongoose.Types.ObjectId) => {
  const filter = {
    frameworkId: frameworkId,
  };

  const headers = await requirementHeaderRepository.requirementHeaderModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'framework-requirements',
        localField: '_id',
        foreignField: 'requirementHeaderId',
        pipeline: [
          {
            $lookup: {
              from: 'sub-requirements',
              localField: '_id',
              foreignField: 'requirementId',
              as: 'sub_requirements',
            },
          },
        ],
        as: 'child_requirements',
      },
    },
  ]);
  if (headers.length == 0) return [];
  else return headers;
};

export const getFrameWorkRequirementsHeadersByBusiness = async (frameworkId: mongoose.Types.ObjectId, businessId: string) => {
  const filter = {
    frameworkId: frameworkId,
  };

  // const secondFilter = {
  // 'child_requirements.business_requirement_data.status': 'not-started',
  // 'child_requirements.sub_requirements.business_sub_data.status': 'not-started',
  // };
  const secondFilter = {
    $and: [
      {
        $or: [{ 'child_requirements.business_requirement_data.status': 'in-progress' }, { 'child_requirements.sub_requirements.business_sub_data.status': 'in-progress' }],
      },
    ],
  };

  const headers = await requirementHeaderRepository.requirementHeaderModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'framework-requirements',
        localField: '_id',
        foreignField: 'requirementHeaderId',
        pipeline: [
          {
            $lookup: {
              from: 'sub-requirements',
              localField: '_id',
              foreignField: 'requirementId',
              pipeline: [
                {
                  $lookup: {
                    from: 'businessrequirements',
                    localField: '_id',
                    foreignField: 'subRequirementId',
                    pipeline: [
                      {
                        $match: {
                          businessId: new mongoose.Types.ObjectId(businessId),
                        },
                      },
                    ],
                    as: 'business_sub_data',
                  },
                },
              ],
              as: 'sub_requirements',
            },
          },
          {
            $lookup: {
              from: 'businessrequirements',
              localField: '_id',
              foreignField: 'requirementId',
              pipeline: [
                {
                  $match: {
                    businessId: new mongoose.Types.ObjectId(businessId),
                  },
                },
              ],
              as: 'business_requirement_data',
            },
          },
          // ],
        ],
        as: 'child_requirements',
      },
    },
    {
      $match: secondFilter,
    },
  ]);
  if (headers.length == 0) return [];
  else return headers;
};

function mapPayloadToHeaderRequirement(payload: cSVFormat[], frameworkId: string) {
  let dataArr: requirementsHeader[] = [];

  for (let i = 0; i < payload.length; i++) {
    const requirementHeader = {
      frameworkId: new mongoose.Types.ObjectId(frameworkId),
      clause: payload[i].index,
      title: payload[i].title,
      sub_title: payload[i].sub_title,
    };
    dataArr.push(requirementHeader);
  }
  return dataArr;
}
