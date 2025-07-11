import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PersonaService, PersonaRequest } from './persona.service';
import { MapaComponent } from '../mapa/mapa.component';
 import CircleStyle from 'ol/style/Circle'; // Agrega este import
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';

import TileWMS from 'ol/source/TileWMS';

import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';

import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MapaComponent],
})
export class PersonaComponent implements OnInit, AfterViewInit {
  persona: any = {
    idPersona: null,
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: null,
    correo: ''
  };

  personas: any[] = [];

  constructor(private personaService: PersonaService) {}

  map!: Map;
  longitud: number = -85.6;
  latitud: number = 10.2;
  transparencia: number = 1;
  tipoMapa: string = 'osm';
radioPunto: number = 7;



  puntoSource = new VectorSource();
  puntoLayer = new VectorLayer({
    source: this.puntoSource,
   

style: new Style({
  image: new CircleStyle({
    radius: this.radioPunto, // puedes enlazarlo a una variable
          fill: new Fill({ color: 'rgba(241, 14, 14, 0.32)' }), // rojo con 30% opacidad
    stroke: new Stroke({ color: 'white', width: 2 })
  })
})


  });

  

  ngOnInit(): void {
    this.cargarPersonas();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  cargarPersonas(): void {
    this.personaService.obtenerPersonas().subscribe({
      next: (data) => this.personas = data,
      error: (err) => console.error('Error cargando personas', err)
    });
  }

  editarPersona(p: any): void {
    this.persona = { ...p };
  }

  eliminarPersona(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return;

    const body: PersonaRequest = {
      operacion: 3,
      idPersona: id,
      nombre: '',
      apellido1: '',
      apellido2: '',
      telefono: 0,
      correo: ''
    };

    this.personaService.registrarPersona(body).subscribe({
      next: () => {
        alert('✅ Persona eliminada');
        this.cargarPersonas();
        this.limpiarFormulario();
      },
      error: err => console.error('Error al eliminar', err)
    });
  }

  registrar(): void {
    const operacion = this.persona.idPersona ? 2 : 1;

    const body: PersonaRequest = {
      operacion: operacion,
      idPersona: this.persona.idPersona ?? 0,
      nombre: this.persona.nombre,
      apellido1: this.persona.apellido1,
      apellido2: this.persona.apellido2,
      telefono: this.persona.telefono,
      correo: this.persona.correo
    };

    this.personaService.registrarPersona(body).subscribe({
      next: () => {
        alert('✅ Persona registrada/actualizada');
        this.limpiarFormulario();
        this.cargarPersonas();
      },
      error: err => console.error('Error al registrar', err)
    });
  }

  limpiarFormulario(): void {
    this.persona = {
      idPersona: null,
      nombre: '',
      apellido1: '',
      apellido2: '',
      telefono: null,
      correo: ''
    };
  }

  centrarMapa(): void {
    if (this.map) {
      this.map.getView().setCenter(fromLonLat([this.longitud, this.latitud]));
      this.map.getView().setZoom(9);
    } else {
      console.warn('🗺️ El mapa no está inicializado aún.');
    }
  }

  initMap(): void {
    const baseLayer = this.getBaseLayer();

    const capaGeoServer = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8091/geoserver/Tesis/wms',
        params: {
          'LAYERS': 'Tesis:DISTRITO_V2',
          'TILED': true,
          'VERSION': '1.1.1',
          'FORMAT': 'image/png',
          'TRANSPARENT': true
        },
        serverType: 'geoserver'
      }),
      opacity: 0.0
    });

    this.map = new Map({
      target: 'map',
      layers: [baseLayer, capaGeoServer, this.puntoLayer],
      view: new View({
        center: fromLonLat([this.longitud, this.latitud]),
        zoom: 8
      })
    });

    this.map.on('click', (event) => {
      const coord = event.coordinate;
      const wgs84Coord = toLonLat(coord);

      // Limpiar punto anterior
      this.puntoSource.clear();

      // Crear y agregar nuevo punto
      const point = new Point(coord);
      const feature = new Feature(point);
      this.puntoSource.addFeature(feature);

      // Convertir a GeoJSON
      const geojson = new GeoJSON().writeFeatureObject(feature);

      console.log('📍 Punto clickeado:', wgs84Coord);
      console.log('📦 GeoJSON:', geojson);

      // Aquí podrías guardar el punto:
      // this.guardarPunto(geojson);
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

  // Ejemplo de función para guardar
  guardarPunto(geojson: any): void {
    const body = {
      idPersona: this.persona.idPersona,
      ubicacion: geojson // puedes enviarlo como string también
    };

    // Llama a tu backend aquí
    // this.http.post('/api/guardar-punto', body).subscribe(...)
  }


  actualizarEstiloPunto(): void {
  const nuevoEstilo = new Style({
    image: new CircleStyle({
      radius: this.radioPunto,
      fill: new Fill({ color: 'rgba(241, 14, 14, 0.32)' }), // rojo con 30% opacidad
      stroke: new Stroke({ color: 'white', width: 2 })
    })
  });

  this.puntoLayer.setStyle(nuevoEstilo);
}

}
