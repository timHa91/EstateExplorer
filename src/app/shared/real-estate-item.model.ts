import { Category } from "./category.enum"

export class RealEstateItem {
    description: string
    address: string
    images: string[]
    price: number
    category: Category

    constructor(obj?: any) {
        this.description = obj && obj.description || null;
        this.images = obj && obj.image || [];
        this.address = obj && obj.adress || null;
        this.price = obj && obj.price || null;
        this.category = obj && obj.category || [];
    }
}