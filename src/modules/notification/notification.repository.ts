import { AbstractRepository } from '../../utils/repository/abstract.repository';
import { INotification } from './notification.model';
import { Model, Document } from 'mongoose';
import Notification from './notification.model';

class NotificationRepository extends AbstractRepository<INotification> {
  constructor(readonly notificationModel: Model<INotification & Document>) {
    super(notificationModel);
  }
}

export default new NotificationRepository(Notification);
