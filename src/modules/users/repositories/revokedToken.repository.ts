import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import RevokedToken, { IRevokedToken } from '../models/revokedToken.model';
import { Model, Document } from 'mongoose';

class RevokedTokenRepository extends AbstractRepository<IRevokedToken> {
  constructor(readonly revokedTokenModel: Model<IRevokedToken & Document>) {
    super(revokedTokenModel);
  }
}

export default new RevokedTokenRepository(RevokedToken);
