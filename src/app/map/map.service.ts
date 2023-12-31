import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { RealEstateItem } from '../shared/real-estate-item.model';
import { Observable, map } from 'rxjs';
import { FeatureCollection } from '../shared/geo.model';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  constructor(private http: HttpClient) { }

  initializeMap(list: RealEstateItem[]) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.getCenter(list),
      zoom: 13,
      accessToken: environment.mapbox.accessToken,
    });
  }

  forwardGeocoder(searchText: string): Observable<[number, number]> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${environment.mapbox.accessToken}&limit=1`;
    return this.http.get<FeatureCollection>(url)
    .pipe(
    map( response => {
       return response.features[0].geometry.coordinates;
        })
    );
  }
  
  private getCenter(list: RealEstateItem[]): [number, number] {
    let longSum = 0
    let latSum = 0;
    list.forEach(item => {
        longSum += item.geometry.geometry.coordinates[0];
        latSum += item.geometry.geometry.coordinates[1];
    });
    return [(longSum / list.length), (latSum / list.length)]
  }

  setMarker(coordinates: [number, number]) {
    const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(this.map);

    this.markers.push(marker);
  }

  removeAllMarkers() {
    if(this.markers.length > 0) {
        this.markers.forEach(marker => {
            marker.remove();
        });
    }
  }
}
