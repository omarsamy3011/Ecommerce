import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../dataBase/model/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<ProductDocument>,
	) {}

	create(createProductDto: CreateProductDto): Promise<ProductDocument> {
		return new this.productModel({
			...createProductDto,
			brand: this.toObjectId(createProductDto.brand),
		}).save();
	}

	findAll(): Promise<ProductDocument[]> {
		return this.productModel.find().populate('brand').sort({ createdAt: -1 }).exec();
	}

	async findOne(id: string): Promise<ProductDocument> {
		this.ensureValidId(id);
		const product = await this.productModel.findById(id).populate('brand').exec();
		if (!product) {
			throw new NotFoundException(`Product ${id} was not found`);
		}
		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
		this.ensureValidId(id);
		const update = {
			...updateProductDto,
			...(updateProductDto.name !== undefined
				? { slug: this.toSlug(updateProductDto.name) }
				: {}),
			...(updateProductDto.brand !== undefined
				? { brand: this.toObjectId(updateProductDto.brand) }
				: {}),
		};
		const product = await this.productModel
			.findByIdAndUpdate(id, update, { new: true, runValidators: true })
			.populate('brand')
			.exec();
		if (!product) {
			throw new NotFoundException(`Product ${id} was not found`);
		}
		return product;
	}

	async remove(id: string): Promise<ProductDocument> {
		this.ensureValidId(id);
		const product = await this.productModel.findByIdAndDelete(id).exec();
		if (!product) {
			throw new NotFoundException(`Product ${id} was not found`);
		}
		return product;
	}

	private ensureValidId(id: string): void {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException(`Product ${id} was not found`);
		}
	}

	private toObjectId(id?: string): Types.ObjectId | undefined {
		return id && Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined;
	}

	private toSlug(name: string): string {
		return name.trim().replace(/\s+/g, '-').toLowerCase();
	}
}
