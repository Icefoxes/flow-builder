import { ObjectId } from "mongodb";
import { HttpException } from "../exceptions/HttpException";
import metaModel, { NodeTypeMeta } from "../models/meta.model";

class MetaService {
  public async getMetas(): Promise<NodeTypeMeta[]> {
    return metaModel.find().exec();
  }

  public async createMeta(meta: NodeTypeMeta): Promise<NodeTypeMeta> {
    const findMeta = await metaModel.findOne({ name: meta.name }).exec();
    if (findMeta)
      throw new HttpException(400, `meta name ${findMeta.name} already exist`);

    return metaModel.create(meta);
  }

  public async UpdateMeta(
    metaId: string,
    meta: NodeTypeMeta
  ): Promise<NodeTypeMeta | null> {
    const findMeta = await metaModel.findOne({ name: meta.name }).exec();
    if (findMeta && findMeta.id != new ObjectId(metaId))
      throw new HttpException(409, `meta name ${findMeta.name} already exist`);

    const updated = await metaModel
      .findByIdAndUpdate(new ObjectId(metaId), meta, { new: true })
      .exec();
    return updated;
  }

  public async DeleteMeta(metaId: string): Promise<NodeTypeMeta> {
    const metaTobeDeleted = await metaModel
      .findByIdAndDelete(new ObjectId(metaId))
      .exec();
    if (!metaTobeDeleted) throw new HttpException(409, "Meta doesn't exist");

    return metaTobeDeleted.id;
  }
}

export default MetaService;
