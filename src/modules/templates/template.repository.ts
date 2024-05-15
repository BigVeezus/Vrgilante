import mongoose, { Model, Document, CreateOptions, Require_id } from 'mongoose';
import { AbstractRepository } from '../../utils/repository/abstract.repository';
import Template, { ITemplate } from './template.model';
import usersRepository from '../users/repositories/users.repository';

class TemplateRepository extends AbstractRepository<ITemplate> {
  constructor(readonly templateModel: Model<ITemplate & Document>) {
    super(templateModel);
  }
}
export default new TemplateRepository(Template);
