
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IBrand } from '../../common/interface/brand.interface';

export type brandDocument = HydratedDocument<IBrand>;

@Schema()
export class Brand {
  @Prop({type:String , required:true})
  name: string;
  @Prop({type:String , required:true})
  
  slug: string
  @Prop({type:Types.ObjectId , ref:'User',required:true})
  createdBy: Types.ObjectId;
  @Prop({type:Types.ObjectId , ref:'User'})
  updatedBy: Types.ObjectId;
  @Prop({type:Date , default:Date.now(),required:true})
  createdAt:Date
  @Prop({type:Date})
  updatedAt:Date
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeatureAsync([
{
    name: Brand.name,
    useFactory: () => {
        BrandSchema.pre('save', function () {
            if(this.isModified(this.name)){
        this.slug = this.name.replace(/\s+/g, '').toLowerCase();
        }});
        return BrandSchema;
    },
},
]);
