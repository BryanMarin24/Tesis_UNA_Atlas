import { Component, OnInit, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogosService } from './variable.service';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./variable.component.css']
})
export class VariableComponent implements OnInit, AfterViewInit {
  map!: Map;
  longitud: number = -85.6;
  latitud: number = 10.2;
  transparencia: number = 0.8;
  tipoMapa: string = 'osm';

 provincias: any[] = [];
indicadores: any[] = [];
anios: any[] = [];

provinciaSeleccionada = '';
indicadorSeleccionado = '';
anioSeleccionado = '';

constructor(private catalogosService: CatalogosService) {}

ngOnInit(): void {
  this.catalogosService.obtenerProvincias().subscribe(data => this.provincias = data);
  this.catalogosService.obtenerIndicadores().subscribe(data => this.indicadores = data);
  this.catalogosService.obtenerAnios().subscribe(data => this.anios = data);
}
  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const baseLayer = this.getBaseLayer();

    this.map = new Map({
      target: 'map',
      layers: [baseLayer],
      view: new View({
        center: fromLonLat([this.longitud, this.latitud]),
        zoom: 8
      })
    });
  }

  getBaseLayer(): TileLayer<XYZ | OSM> {
    if (this.tipoMapa === 'satellite') {
      return new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
        }),
        opacity: this.transparencia
      });
    } else {
      return new TileLayer({
        source: new OSM(),
        opacity: this.transparencia
      });
    }
  }
}
