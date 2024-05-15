import { IUser } from '../modules/users/models/users.model';
import moment from 'moment-timezone';

export default class TimeStampFormat {
  _createdAt(this: IUser) {
    if (moment(this.createdAt).isValid()) {
      return moment(this.createdAt).format('YYYY-MM-DDTHH:mm:sssZ');
    }
    return this.createdAt;
  }

  // don't remove this
  _lastModifiedAt(this: IUser) {
    if (moment(this.updatedAt).isValid()) {
      return moment(this.updatedAt).format('YYYY-MM-DDTHH:mm:sssZ');
    }
    return this.updatedAt;
  }
}
