import { Document, Model } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import LoginInfo, { ILoginInfo } from '../models/loginInfo.model';

class LoginInfoRepository extends AbstractRepository<ILoginInfo> {
  constructor(readonly loginInfoModel: Model<ILoginInfo & Document>) {
    super(loginInfoModel);
  }
}

export default new LoginInfoRepository(LoginInfo);
