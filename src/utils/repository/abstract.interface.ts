import { ObjectId } from 'mongoose';

export interface IPaginateResult<T> {
  data: T;
  meta: IMeta;
}

export interface IDefaultPaginationOptions {
  limit: number;
  page: number;
}

export interface IMeta {
  totalItems: number;
  count: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface IGetMetaProps<T> {
  total: number;
  data: T[];
  limit: number;
  page: number;
}

// export interface ItemInfo {
//   quantity: number;
//   amount: number;
//   status: ItemStatus;
// }

export interface ICategories {
  _id: ObjectId;
  parent: ObjectId;
  name: string;
  subCategories: ICategories[];
}
