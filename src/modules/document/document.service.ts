import mammoth from 'mammoth';
import { DocumentDTO, DocumentStatusUpdateDTO, GetDocumentByIdDTO, GetDocumentByRequirementID, GetDocumentsDTO, REVIEWCYCLE, fileType } from './document.interface';
import fs from 'fs';
import documentRepository from './document.repository';
import mongoose, { mongo } from 'mongoose';
import { BadRequestException } from '../../utils';
import * as requirementService from '../requirement/requirement.service';
import { storeRequirementHistory } from '../../modules/requirement/requirementHistory/requirementHistory.service';
import { storeDocumenttHistory } from './documentHistory/document-history.service';

export const addDocument = async (payload: DocumentDTO) => {
  console.log('params', payload);
  let content: string = payload.content ?? ' ';

  // await validateApprover(payload.approver, payload.businessId);
  // await validateReviwer(payload.reviewer, payload.businessId);

  if (payload.files && payload.files?.length > 0) {
    // handle reading of file and convert to html
    content = await handleFileContent(payload.files);
  }

  let nextReview = calculateNextYearReviewDate();
  if (payload.reviewCycle == REVIEWCYCLE.QUARTERLY) {
    nextReview = calculateNextQuarterlyReviewDate();
  }

  let frameworkIds: any = [];
  let requirementIds: any = [];
  if (payload.frameworkIds.length > 0) {
    frameworkIds = payload.frameworkIds.map((str) => new mongoose.Types.ObjectId(str));
  }

  if (payload.requirementIds.length > 0) {
    requirementIds = payload.requirementIds.map((str) => new mongoose.Types.ObjectId(str));
  }

  const document = await documentRepository.create({
    businessId: new mongoose.Types.ObjectId(payload.businessId),
    frameworkIds: frameworkIds,
    requirementIds: requirementIds,
    content,
    documentName: payload.documentName,
    classification: payload.classification,
    version: payload.version,
    reviewCycle: payload.reviewCycle,
    approver: new mongoose.Types.ObjectId(payload.approver),
    reviewer: new mongoose.Types.ObjectId(payload.reviewer),
    owner: payload.user._id,
    nextReview,
  });

  await storeDocumenttHistory({
    content: `Added new evidence "${document.documentName}"`,
    modifiedBy: payload.user._id,
    businessId: document.businessId,
  });
  await Promise.all([
    requirementIds.forEach(async (requirementId: any) => {
      await storeRequirementHistory({
        content: `Added new evidence "${document.documentName}"`,
        modifiedBy: payload.user._id,
        businessId: document.businessId,
        requirementId,
      });
    }),
  ]);

  // console.log(requirementIds);

  await requirementService.updateRequirementService(requirementIds, document.businessId);

  return document;
};

export const updateDocumentStatus = async (payload: DocumentStatusUpdateDTO) => {
  const document = await documentRepository.findOne({
    _id: new mongoose.Types.ObjectId(payload.documentId),
    businessId: new mongoose.Types.ObjectId(payload.businessId),
  });
  if (!document) throw new BadRequestException({ message: 'Document not found' });

  if (document.owner.toString() != payload.user._id.toString() && document.approver.toString() != payload.user._id.toString()) {
    throw new BadRequestException({ message: 'Action cannot be performed' });
  }

  const updateDocument = await documentRepository.update(payload.documentId, { status: payload.status });
  await storeDocumenttHistory({
    content: `${document.documentName} was ${payload.status}`,
    modifiedBy: payload.user._id,
    businessId: document.businessId,
  });
  await Promise.all([
    document.requirementIds.forEach(async (requirementId) => {
      await storeRequirementHistory({
        content: `${document.documentName} was ${payload.status}`,
        modifiedBy: payload.user._id,
        businessId: document.businessId,
        requirementId,
      });
    }),
  ]);

  return updateDocument;
};

export const getDocumentsByRequirementID = async (payload: GetDocumentByRequirementID) => {
  const document = await documentRepository.findAndPopulate(
    { requirementIds: { $in: [new mongoose.Types.ObjectId(payload.requirementId)] }, businessId: new mongoose.Types.ObjectId(payload.businessId) },
    { page: payload.page, limit: payload.limit },
    [
      { path: 'frameworkIds', select: 'title description' },
      { path: 'approver', select: 'firstName lastName photo' },
      { path: 'reviewer', select: 'firstName lastName photo' },
      { path: 'owner', select: 'firstName lastName photo' },
    ],
    {},
  );
  return document;
};

export const getAllDocuments = async (payload: GetDocumentsDTO) => {
  if (!payload.shouldBePaginated) {
    return await getDocuments(payload.businessId);
  }
  const condition = getDocumentsCondition(payload);
  const documents = await documentRepository.findAndPopulate(
    condition,
    { page: payload.page, limit: payload.limit },
    [
      { path: 'frameworkIds', select: 'title description' },
      { path: 'approver', select: 'firstName lastName photo' },
      { path: 'reviewer', select: 'firstName lastName photo' },
      { path: 'owner', select: 'firstName lastName photo' },
    ],
    {},
  );
  return documents;
};

export const getDocument = async (payload: GetDocumentByIdDTO) => {
  const document = await documentRepository.findByIdAndPopulate(payload.documentId, [
    { path: 'frameworkIds', select: 'title description' },
    { path: 'requirementIds', select: 'title clause' },
    { path: 'approver', select: 'firstName lastName photo' },
    { path: 'reviewer', select: 'firstName lastName photo' },
    { path: 'owner', select: 'firstName lastName photo' },
  ]);

  return document;
};

const getDocuments = async (businessId: string) => {
  const documents = await documentRepository.find({ businessId: new mongoose.Types.ObjectId(businessId) });
  return documents;
};

const getDocumentsCondition = (payload: GetDocumentsDTO) => {
  let criteria: any = {
    businessId: new mongoose.Types.ObjectId(payload.businessId),
  };
  if (payload.framework) {
    criteria.framework = {
      frameworksIds: { $in: new mongoose.Types.ObjectId(payload.framework) },
    };
  }

  if (payload.owner) {
    criteria.owner = {
      owner: new mongoose.Types.ObjectId(payload.owner),
    };
  }

  if (payload.version) {
    const regex = new RegExp(payload.version, 'i');
    criteria.version = {
      version: { $regex: regex },
    };
  }

  if (payload.status) {
    const status = payload.status.split(',');
    criteria.status = {
      status: { $in: status },
    };
  }

  return criteria;
};

const handleFileContent = async (payload: [fileType]) => {
  let textContent = '';
  await new Promise<void>((resolve, reject) => {
    mammoth
      .convertToHtml({ path: payload[0].path })
      .then(function (result: any) {
        var html = result.value;
        textContent = textContent.concat(html);
        const messages = result.messages;
        console.log(messages);
        fs.unlinkSync(payload[0].path);
        resolve();
      })
      .catch(function (error: any) {
        console.error(error);
        fs.unlinkSync(payload[0].path);
        reject(error);
      });
  });

  return textContent;
};

const validateApprover = async (approverId: string, businessId: string) => {
  const approver = await documentRepository.fetchUser({ _id: new mongoose.Types.ObjectId(approverId), businessId: new mongoose.Types.ObjectId(businessId) });
  if (!approver) throw new BadRequestException({ message: 'Approver do not belong to the business' });
  return approver;
};

const validateReviwer = async (reviewId: string, businessId: string) => {
  const reviewer = await documentRepository.fetchUser({ _id: new mongoose.Types.ObjectId(reviewId), businessId: new mongoose.Types.ObjectId(businessId) });
  if (!reviewer) throw new BadRequestException({ message: 'Review do not belong to this business' });
  return reviewer;
};

const calculateNextQuarterlyReviewDate = () => {
  const nextReviewDate = new Date();
  nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
  return nextReviewDate;
};

const calculateNextYearReviewDate = () => {
  const nextReviewDate = new Date();
  nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
  return nextReviewDate;
};
