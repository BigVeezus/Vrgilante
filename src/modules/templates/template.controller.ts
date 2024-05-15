import { BadRequestException, validate } from '../../utils';
import mongoose from 'mongoose';
import { CreateTemplateBodyDTO, EditTemplateDto, GetAllTemplatesDTO, GetOneTemplateDTO } from './template.interface';
import { createTemplateValidator } from './template.validator';
import * as templateService from './template.service';

export const templateCreation = async (params: CreateTemplateBodyDTO) => {
  const value = validate(params, createTemplateValidator);
  const data = await templateService.createTemplate(value);
  return {
    data,
    message: 'Sucessfully created template',
  };
};

export const getAlltemplates = async (params: GetAllTemplatesDTO) => {
  const data = await templateService.getAllTemplates(params);
  return {
    data,
    message: 'Sucessfully retrieved all templates',
  };
};

export const getOnetemplate = async (params: GetOneTemplateDTO) => {
  const data = await templateService.getOneTemplate(params);
  return {
    data,
    message: 'Sucessfully retrieved template by Id',
  };
};

export const EditOnetemplate = async (params: EditTemplateDto) => {
  const data = await templateService.editTemplate(params);
  return {
    data,
    message: 'Sucessfully edited template',
  };
};

export const deleteTemplate = async (params: GetOneTemplateDTO) => {
  await templateService.deleteTemplate(params);
  return {
    data: '',
    message: 'Sucessfully deleted template',
  };
};
