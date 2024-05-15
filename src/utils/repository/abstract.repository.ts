import mongoose, {
  CreateOptions,
  FilterQuery,
  InsertManyOptions,
  Model,
  MongooseUpdateQueryOptions,
  PopulateOption,
  ProjectionType,
  QueryOptions,
  Require_id,
  Schema,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { IDefaultPaginationOptions, IGetMetaProps, IMeta, IPaginateResult } from './abstract.interface';

export abstract class AbstractRepository<TSchema extends Record<string, any>> {
  constructor(readonly schemaModel: Model<TSchema>) {}

  getModel() {
    return this.schemaModel;
  }

  async findById(id: string | mongoose.Types.ObjectId, projection?: ProjectionType<TSchema>, options?: QueryOptions<TSchema>) {
    return this.schemaModel
      .findById(id, projection, {
        projection: { __v: false },
        ...options,
      })
      .lean<TSchema>();
  }

  async findByIdAndPopulate(id: string | mongoose.Types.ObjectId, populate: string | any[], projection?: ProjectionType<TSchema>, options?: QueryOptions<TSchema>) {
    return this.schemaModel
      .findById(id, projection, {
        projection: { __v: false },
        ...options,
      })
      .populate(populate)
      .lean<TSchema>();
  }
  async findOne(schemaFilterQuery: FilterQuery<TSchema>, projection?: ProjectionType<TSchema>, options?: QueryOptions<TSchema>) {
    return this.schemaModel
      .findOne(schemaFilterQuery, projection, {
        projection: { __v: false },
        ...options,
      })
      .lean<TSchema>();
  }

  async find(schemaFilterQuery: FilterQuery<TSchema>, projection?: ProjectionType<TSchema>, options?: QueryOptions<TSchema>) {
    return this.schemaModel
      .find(schemaFilterQuery, projection, {
        projection: { __v: 0 },
        ...options,
      })
      .sort({ createdAt: -1 })
      .lean<TSchema[]>();
  }

  async findAndHideDetails(schemaFilterQuery: FilterQuery<TSchema>, projection?: ProjectionType<TSchema>, options?: QueryOptions<TSchema>) {
    return this.schemaModel
      .find(schemaFilterQuery, projection, {
        projection: { __v: 0, password: 0, userType: 0, oldPasswords: 0 },
        ...options,
      })
      .lean<TSchema[]>();
  }

  async create(createSchemaData: Partial<Omit<Require_id<TSchema>, '_id'>>, options?: CreateOptions): Promise<TSchema> {
    // const schema = new this.schemaModel(createSchemaData);
    // return schema.save().then((doc) => doc.toObject());
    return this.schemaModel.create([createSchemaData], { ...options }).then((res) => res[0].toObject());
  }

  async createMany(createSchemaData: Array<Partial<Omit<Require_id<TSchema>, '_id'>>>, options?: InsertManyOptions): Promise<TSchema[]> {
    return this.schemaModel.insertMany(createSchemaData, { ...options, lean: true }).then((res) => res) as Promise<TSchema[]>;
  }

  async count(schemaFilterQuery: FilterQuery<TSchema>): Promise<number> {
    return this.schemaModel.find(schemaFilterQuery).countDocuments().lean();
  }

  async findAndPaginate(schemaFilterQuery: FilterQuery<TSchema>, options = this.DEFAULTPAGINATIONOPTIONS, query: QueryOptions<TSchema>): Promise<IPaginateResult<TSchema[] | null>> {
    const { limit = 20, page = 1 } = options;
    const [data, total] = await Promise.all([
      this.schemaModel
        .find(schemaFilterQuery, {}, query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean<TSchema[]>(),
      this.count(schemaFilterQuery),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  async findAndPopulate(
    schemaFilterQuery: FilterQuery<TSchema>,
    options = this.DEFAULTPAGINATIONOPTIONS,
    populate: string | any[],
    query: QueryOptions<TSchema>,
  ): Promise<IPaginateResult<TSchema[] | null>> {
    const { limit = 20, page = 1 } = options;
    const [data, total] = await Promise.all([
      this.schemaModel
        .find(schemaFilterQuery, {}, query)
        .sort({ createdAt: -1 })
        .populate(populate)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean<TSchema[]>(),
      this.count(schemaFilterQuery),
    ]);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }
  async findOneAndUpdate(entityFilterQuery: FilterQuery<TSchema>, updateData: UpdateQuery<TSchema>, options?: QueryOptions<TSchema> & { upsert: true }): Promise<TSchema | null> {
    return this.schemaModel.findOneAndUpdate(entityFilterQuery, updateData, {
      new: true,
      ...(options && options),
    });
  }

  async update(id: Schema.Types.ObjectId | string, updateSchemaData: UpdateQuery<TSchema>, options?: QueryOptions): Promise<TSchema | null> {
    return this.schemaModel.findByIdAndUpdate(id, updateSchemaData, {
      new: true,
      lean: true,
      ...options,
    });
  }

  async updateMany(schemaFilterQuery: FilterQuery<TSchema>, updateData: UpdateWithAggregationPipeline | UpdateQuery<TSchema>, options?: MongooseUpdateQueryOptions): Promise<boolean> {
    const updateResult = await this.schemaModel.updateMany(schemaFilterQuery, updateData, options);
    return updateResult.matchedCount >= 1;
  }

  async findOneAndDelete(schemaFilterQuery: FilterQuery<TSchema>, options?: QueryOptions<TSchema>): Promise<TSchema | null> {
    return this.schemaModel.findOneAndDelete(schemaFilterQuery, options);
  }

  async delete(id: Schema.Types.ObjectId | string, options?: QueryOptions<TSchema>): Promise<TSchema | null> {
    return this.schemaModel.findByIdAndDelete(id, options);
  }

  async deleteMany(entityFilterQuery?: FilterQuery<TSchema>): Promise<boolean> {
    const deleteResult = await this.schemaModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  private DEFAULTPAGINATIONOPTIONS: IDefaultPaginationOptions = {
    limit: 10,
    page: 1,
  };

  protected getMeta({ total, data, limit, page }: IGetMetaProps<TSchema>): IMeta {
    return {
      totalItems: total,
      count: data?.length,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
