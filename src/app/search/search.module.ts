import { NgModule } from "@angular/core";
import { SearchComponent } from "./search.component";
import { CategoryFilterComponent } from "./search-bar/category-filter/category-filter.component";
import { PriceRangeFilterComponent } from "./search-bar/price-range-filter/price-range-filter.component";
import { RadiusFilterComponent } from "./search-bar/radius-filter/radius-filter.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LocationSearchComponent } from "./search-bar/location-search/location-search.component";
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { SearchListComponent } from "./search-list/search-list.component";
import { SearchDetailComponent } from "./search-detail/search-detail.component";
import { SearchFilterComponent } from "./search-list-filter/search-list-filter.component";
import { SearchItemComponent } from "./search-list/search-item/search-item.component";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [
        SearchComponent,
        CategoryFilterComponent,
        PriceRangeFilterComponent,
        RadiusFilterComponent,
        SearchBarComponent,
        LocationSearchComponent,
        SearchListComponent,
        SearchDetailComponent,
        SearchFilterComponent,
        SearchItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSliderModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule
    ]
})
export class SearchModule {
}