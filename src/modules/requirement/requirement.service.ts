import { cSVFormat } from 'modules/framework/framework.interface';
import { CreateRequirementDTO, requirements, subRequirements } from './requirement.interface';
import requirementRepository from './requirement.repository';
import mongoose from 'mongoose';
import requirementHeaderRepository from './requirementHeader/requirementHeader.repository';
import { BadRequestException } from '../../utils';
import subRequirementRepository from './sub-requirement/sub-requirement.repository';
import businessRequirementRepository from '../../modules/businessEntity/business-requirement/business-requirement.repository';

export const createRequirements = async (payload: cSVFormat[], frameworkId: string) => {
  const mappedData = await mapPayloadToRequirement(payload, frameworkId);
  await requirementRepository.createMany(mappedData);
  // await requirementRepository.deleteMany();
  return {
    success: true,
  };
};

export const createSubRequirements = async (payload: cSVFormat[], frameworkId: string) => {
  const mappedData = await mapPaloadToSubRequirements(payload, frameworkId);
  await subRequirementRepository.createMany(mappedData);
  // await subRequirementRepository.deleteMany();
  return {
    success: true,
  };
};

export const getFrameWorkRequirements = async (frameworkId: mongoose.Types.ObjectId) => {
  return requirementRepository.find({ frameworkId: frameworkId });
};

export const updateRequirementService = async (requirementIds: mongoose.Types.ObjectId[], businessId: mongoose.Types.ObjectId) => {
  for (let i = 0; i < requirementIds.length; i++) {
    await businessRequirementRepository.create({
      requirementId: new mongoose.Types.ObjectId(requirementIds[0]),
      status: 'in-progress',
      businessId: businessId,
    });

    const subs = await subRequirementRepository.findOne({
      requirementId: new mongoose.Types.ObjectId(requirementIds[0]),
    });

    if (!subs) continue;
    await businessRequirementRepository.create({
      subRequirementId: subs._id,
      status: 'in-progress',
      businessId: businessId,
    });
  }
  return 'done';
};

async function mapPayloadToRequirement(payload: cSVFormat[], frameworkId: string) {
  let dataArr: requirements[] = [];
  let headerId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  for (let i = 0; i < payload.length; i++) {
    // console.log(payload[i].index);
    const indexArr = payload[i].index.split('.');
    const data = await requirementHeaderRepository.findOne({
      frameworkId: new mongoose.Types.ObjectId(frameworkId),
      clause: `${indexArr[0]}`,
    });
    if (!data) throw new BadRequestException({ message: 'header not found' });
    headerId = data!._id;
    // console.log(headerId);

    const requirement = {
      frameworkId: new mongoose.Types.ObjectId(frameworkId),
      requirementHeaderId: headerId,
      clause: payload[i].index,
      title: payload[i].title,
      sub_title: payload[i].sub_title,
      controlObjective: payload[i].objective,
      implementationGuidance: payload[i].guidance,
      suggestedEvidence: payload[i].suggested_evidence,
      // numOfEvidenceRequired: payload[i].numOfEvidenceRequired,
      document: payload[0].document,
      numOfEvidenceRequired: payload[0].document?.length || 0,
    };
    dataArr.push(requirement);
  }
  return dataArr;
}

async function mapPaloadToSubRequirements(payload: cSVFormat[], frameworkId: string) {
  // const indexArr = payload[0]?.index;
  let firstIndex: string = '';
  let dataArr: subRequirements[] = [];
  let requirementId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  // console.log(payload[0]);

  for (let i = 0; i < payload.length; i++) {
    const data = await requirementRepository.findOne({
      frameworkId: new mongoose.Types.ObjectId(frameworkId),
      clause: payload[i].index,
    });
    if (!data) throw new BadRequestException({ message: 'no requirementIds found' });
    requirementId = data!._id;
    const requirement = {
      frameworkId: new mongoose.Types.ObjectId(frameworkId),
      requirementId: requirementId,
      clause: payload[i].sub_index,
      title: payload[i].title,
      sub_title: payload[i].sub_title,
      controlObjective: payload[i].objective,
      implementationGuidance: payload[i].guidance,
      suggestedEvidence: payload[i].suggested_evidence,
      document: payload[0].document,
      numOfEvidenceRequired: payload[0].document?.length || 0,
      // numOfEvidenceRequired: payload[i].numOfEvidenceRequired,
    };
    dataArr.push(requirement);
  }
  return dataArr;
}
