import mongoose, { Document, Model } from 'mongoose';
import { AbstractRepository } from '../../../utils/repository/abstract.repository';
import OldPassword, { IOldPassword } from '../models/oldPassword.model';
import bcrypt from 'bcrypt';

class OldPasswordRepository extends AbstractRepository<IOldPassword> {
  constructor(readonly oldPasswordModel: Model<IOldPassword & Document>) {
    super(oldPasswordModel);
  }

  async savePassword(userId: mongoose.Types.ObjectId, password: string) {
    return await this.schemaModel.create({
      password,
      changedAt: new Date(),
      userId,
    });
  }

  async checkOldPasswords(userId: mongoose.Types.ObjectId, password: string) {
    let result = false;
    const OldPasswords = await this.schemaModel.find({ userId });
    for (let i = 0; i < OldPasswords.length; i += 1) {
      if (await bcrypt.compare(password, OldPasswords[i].password)) {
        result = true;
        break;
      }
    }
    return result;
  }
}

export default new OldPasswordRepository(OldPassword);
