import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { RealEstateItem } from "../shared/real-estate-item.model";
import { Category } from "../shared/category.enum";
import { SearchCriteria } from "./search-criteria.model";
import { PriceRange } from "../shared/price-range.model";
import { GeoJson } from "../shared/geo.model";

@Injectable({providedIn: 'root'})
export class SearchService {

    onUpdateList = new Subject<SearchCriteria>();
    onPriceRangeChanged = new Subject<PriceRange>();

    searchResults: RealEstateItem[] = [
        {
            address: '1121 48th Place Northeast Washington, DC',
            description: 'New Construction - 4 BD 3 BA',
            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D'],
            price: 185000,
            category: Category.Sale,
            geometry: new GeoJson ([-76.932458, 38.905337])
        },
        {
            address: '5324 James Place Northeast Washington, DC',
            description: '3 BD 2 BA Single Family Home',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D'],
            price: 228800,
            category: Category.Sold,
            geometry: new GeoJson ([-76.92377, 38.90098])
        },
        {
            address: '3438 Croffut Place Southeast',
            description: '4 BD 2 BD Townhome',
            images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D'],
            price: 299900,
            category: Category.Sale,
            geometry: new GeoJson ([-76.95642, 38.88696])
        },
        {
            address: '539 59th Street Northeast Washington, DC',
            description: '3 BD 2BA SIngle Family Home',
            images: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTF8fHxlbnwwfHx8fHw%3D'],
            price: 300000,
            category: Category.Sale,
            geometry: new GeoJson ([-76.916156, 38.896954])
        },
        
    ]

    getAllResults() {
        return this.searchResults.slice();
    }
}