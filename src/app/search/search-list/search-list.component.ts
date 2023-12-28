import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { SearchService } from "../search.service";
import { RealEstateItem } from "src/app/shared/real-estate-item.model";
import { SearchCriteria } from "../search-criteria.model";
import { Subject, Subscription, map, of, switchMap } from "rxjs";
import { PriceRange } from "src/app/shared/price-range.model";
import { MapboxService } from "src/app/map/map.service";
import { PaginationService } from "../../pagination/pagination.service";
import { SortDescriptor, SortDirection } from "./search-list-sort/search-list-sort.model";

const EARTH_RADIUS_IN_METERS = 6371e3;
const METER_CONVERSION_FACTOR = 1000;

@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit, AfterViewInit ,OnDestroy {

    originalList: RealEstateItem[] = [];
    filteredList: RealEstateItem[] = [];
    paginatedList: RealEstateItem[] = [];
    filterChangesSubscription!: Subscription
    resetSort = new Subject<void>();
    hasLocationAndRadiusValue = new Subject<boolean>();

    constructor(private searchService: SearchService,
                private mapService: MapboxService,
                private paginationService: PaginationService) {}

    ngOnInit(): void {
        this.originalList = this.searchService.getAllResults();
        this.filteredList = this.originalList;
        this.paginatedList = this.paginationService.setPaginationList(this.paginationService.page, this.filteredList);
        this.filterChangesSubscription = this.subscribeToFilterChanges();
    }    

    ngAfterViewInit(): void {
        // Argument is used to center to map based on the location of all items in a List
        this.mapService.initializeMap(this.originalList);
    }

    ngOnDestroy(): void {
        this.filterChangesSubscription.unsubscribe();
    }

    private calculatePriceRange(): PriceRange {
       const minPrice = Math.min(...this.filteredList.map(item => item.price));
       const maxPrice = Math.max(...this.filteredList.map(item => item.price));
       return {'minPrice': minPrice, 'maxPrice': maxPrice};
    }  

    private isItemMatchingCriteria(
        item: RealEstateItem, 
        criteria: SearchCriteria, 
        searchLocation?: [number, number])
        : boolean 
    {
        if (!criteria.category || criteria.category.length <= 0) return false;

        let meetsCriteria = true;

        meetsCriteria = meetsCriteria && this.isItemInCategory(item, criteria.category);
        if (criteria.location && !criteria.radius) {
            meetsCriteria = meetsCriteria && this.isItemInLocation(item, criteria.location)
         } else {
            if (criteria.location && criteria.radius && searchLocation) {
                meetsCriteria = meetsCriteria && this.isItemInRadius(item, criteria.radius, searchLocation)
            };
         };
        if (criteria.minPrice) meetsCriteria = meetsCriteria && this.isItemAboveMinPrice(item, criteria.minPrice);
        if (criteria.maxPrice) meetsCriteria = meetsCriteria && this.isItemBelowMaxPrice(item, criteria.maxPrice);
        
        return meetsCriteria;
    }

    private isItemInCategory(item: RealEstateItem, category: string[]): boolean {
        return category.includes(item.category);
    }

    private isItemInLocation(item: RealEstateItem, location: string): boolean {
        return item.address.toLowerCase().includes(location.toLowerCase());
    }

    private isItemAboveMinPrice(item: RealEstateItem, minPrice: number): boolean {
        return item.price >= minPrice;
    }

    private isItemBelowMaxPrice(item: RealEstateItem, maxPrice: number): boolean {
        return item.price <= maxPrice;
    }

    private isItemInRadius(item: RealEstateItem, radius: number, searchLocation: [number, number]): boolean {
        const [lon1, lat1] = searchLocation;
        const [lon2, lat2] = item.geometry.geometry.coordinates;
        const radiusInMeters = radius * METER_CONVERSION_FACTOR;

        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
    
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        const distanceInMeters = EARTH_RADIUS_IN_METERS * c;       
        
        return distanceInMeters <= radiusInMeters;
    }

    private getDistance(item: RealEstateItem, searchLocation: string): number {
        const searchLocationGeo = this.mapService.forwardGeocoder(searchLocation.toLowerCase());
        return 1
        
    }

    private placeAllMarkers() {
        this.paginatedList.forEach( item => {
            this.mapService.setMarker(item.geometry.geometry.coordinates)
        });
    }

    updatePaginationList(page: number) {
        this.paginationService.page = page;
        this.paginatedList = this.paginationService.setPaginationList(this.paginationService.page, this.filteredList);
        this.mapService.removeAllMarkers();
        this.placeAllMarkers();
        const newPriceRange = this.calculatePriceRange();
        this.searchService.onPriceRangeChanged.next(newPriceRange);
        this.resetSort.next();
    }

    private subscribeToFilterChanges() {
        return this.searchService.onUpdateList.pipe(
            switchMap(searchCriteria => this.applyFilters(searchCriteria))
        ).subscribe(() => this.updateFilteredItems());
    }
    
    private applyFilters(searchCriteria: SearchCriteria) {
        if (this.isLocationRadiusFilter(searchCriteria)) {
            this.hasLocationAndRadiusValue.next(false);
            return this.filterByLocationRadius(searchCriteria);
        } else {
            this.filterWithoutRadius(searchCriteria);
            return of(null);
        }
    }
    
    private isLocationRadiusFilter(searchCriteria: SearchCriteria) {
        return searchCriteria.location && searchCriteria.radius;
    }
    
    private filterByLocationRadius(searchCriteria: SearchCriteria) {
        if (searchCriteria.location) {
            return this.mapService.forwardGeocoder(searchCriteria.location.toLowerCase()).pipe(
                map(searchLocation => {
                    this.filteredList = this.originalList.filter(item =>
                        this.isItemMatchingCriteria(item, searchCriteria, searchLocation)
                    );
                })
            );
        }
        return of(null);
    }
    
    private filterWithoutRadius(searchCriteria: SearchCriteria) {
        this.filteredList = this.originalList.filter(item =>
            this.isItemMatchingCriteria(item, searchCriteria)
        );
    }
    
    private updateFilteredItems() {
        this.updatePaginationList(this.paginationService.page);
        this.isListEmptyAfterFilter();
    }
    

    private isListEmptyAfterFilter() {
        if (this.paginatedList.length < 1) {
            this.updatePaginationList(1)
            this.paginationService.resetPaginationControl.next();
        }
    }   
    
    onSort(sortValues: SortDescriptor) {
        let sortCategory = '';
        sortCategory === 'distance' ? sortCategory = 'coordinates' : sortCategory = sortValues.category;
        
        if (sortValues.direction === SortDirection.Ascending) {
         this.paginatedList.sort((a, b) => {
           if (typeof a[sortCategory] === 'string') {
            console.log(a[sortCategory]);
            
             return a[sortCategory].localeCompare(b[sortCategory]);
           } else {
             return a[sortCategory] - b[sortCategory];
           }
         });
        } else {
         this.paginatedList.sort((a, b) => {
           if (typeof a[sortCategory] === 'string') {
             return b[sortCategory].localeCompare(a[sortCategory]);
           } else {
             return b[sortCategory] - a[sortCategory];
           }
         });
        }
       }
    
    get itemsPerPage() {
        return this.paginationService.getItemsPerPage();
    }
}
