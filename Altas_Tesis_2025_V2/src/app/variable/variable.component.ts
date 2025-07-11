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
import TileWMS from 'ol/source/TileWMS';

import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { Geometry } from 'ol/geom';
import { toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { HistoricoTempService } from './historico.service';

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

  temperaturas: any[] = [];

  provinciaSeleccionada: string = '';
indicadorSeleccionado: number | '' = '';
anioSeleccionado: number | null = null;


  temperaturasPorProvincia: { [id: string]: number } = {};

  fechaSeleccionada: string = ''; // formato YYYY-MM-DD

prediccionDatos: any[] = [];


 


  highlightSource?: VectorSource;
  highlightLayer?: VectorLayer<VectorSource>;

  constructor(private catalogosService: CatalogosService, private historitoTempService: HistoricoTempService) {}

  ngOnInit(): void {
    this.catalogosService.obtenerProvincias().subscribe(data => this.provincias = data);
    this.catalogosService.obtenerIndicadores().subscribe(data => this.indicadores = data);

    //this.historitoTempService.obtenerHistoricoTemperatura().subscribe(data => this.temperaturas = data);

    this.temperaturasPorProvincia = this.temperaturas.reduce((acc, temp) => {
  acc[temp.idProvincia] = temp.temperaturaPromedio_C;
  return acc;
}, {});

  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  centrarMapa(): void {
  if (this.map) {
    this.map.getView().setCenter(fromLonLat([this.longitud, this.latitud]));
    this.map.getView().setZoom(9);
  } else {
    console.warn('🗺️ El mapa no está inicializado aún.');
  }
}


  getColorPorTemperatura(temp: number): string {
  if (temp < 22) return '#313695'; // azul oscuro
  if (temp < 24) return '#4575b4';
  if (temp < 26) return '#74add1';
  if (temp < 28) return '#fdae61';
  if (temp < 30) return '#f46d43';
  return '#d73027'; // rojo intenso
}

onProvinciaSeleccionada(): void {
  this.resaltarProvincia(this.provinciaSeleccionada);
  this.actualizarEstiloProvincia();
}


nombreIndicador: string = '';
descripcionIndicador: string = '';

obtenerDescripcionIndicador(nombre: string): string {
  const descripciones: { [key: string]: string } = {
    'Temperatura': 'Los colores representan la temperatura promedio.',
    'Suelo':'Profundidad: Los valores corresponden a la profundidad de la Fracción de arcilla. Porcentaje: Los valores corresponden al porcentaje de concentración de la Fracción de arcilla dada su profundidad.',
    'Precipitación': 'Este valor corresponde a la precipitación promedio.',
    'Elevación': 'Los colores representan la elevación sobre el nivel del mar.',
    'Cobertura del suelo': 'Los colores representan la clasificación de la cobertura del suelo.',
    'Evapotranspiración': 'Los colores representan la evapotranspiración promedio.',
    'Arcilla': 'Los colores representan la cantidad de arcilla presente en el suelo.'
  };
  return descripciones[nombre] ?? '';
}


onIndicadorSeleccionada(): void {
  this.actualizarEstiloProvincia();
  this.actualizarLeyendaPorIndicador();

  const indicadorSeleccionadoObj = this.indicadores.find(
    i => i.idIndicador === Number(this.indicadorSeleccionado)
  );

  this.nombreIndicador = indicadorSeleccionadoObj?.descripcion ?? '';
  this.descripcionIndicador = this.obtenerDescripcionIndicador(this.nombreIndicador);
console.log(this.descripcionIndicador );

}

hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

actualizarTransparencia(): void {
  if (this.highlightLayer) {
    this.highlightLayer.getSource()?.getFeatures().forEach(f => f.changed());
  }
}



get anioDesdeFechaSeleccionada(): number | null {
  return this.fechaSeleccionada ? new Date(this.fechaSeleccionada).getFullYear() : null;
}



  initMap(): void {





    const baseLayer = this.getBaseLayer();

    const capaGeoServer = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8091/geoserver/Tesis/wms',
        params: {
          'LAYERS': 'Tesis:PROVINCIA_V2',
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
      layers: [baseLayer, capaGeoServer],
      view: new View({
        center: fromLonLat([this.longitud, this.latitud]),
        zoom: 8
      })
    });
  }

  actualizarBaseLayer(): void {
    const nuevaBase = this.getBaseLayer();
    this.map.getLayers().setAt(0, nuevaBase);
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

 resaltarProvincia(idProvincia: string): void {
  if (!idProvincia || idProvincia.trim() === '') {
    console.warn('⚠️ No se ha seleccionado una provincia válida');
    
    // Limpia el resaltado si existía
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
      this.highlightLayer = undefined;
    }

    

    return;
  }

const provincia = this.provincias.find(p => String(p.tN_CodigoProvincia) === idProvincia);


  console.log(provincia)
  if (!provincia || !provincia.tC_DescProvincia) {
    console.warn('⚠️ No se encontró la provincia o no tiene nombre');
    return;
  }

  const nombre = provincia.tC_DescProvincia;

  const url = `http://localhost:8091/geoserver/Tesis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Tesis:PROVINCIA_V2&outputFormat=application/json&CQL_FILTER=TC_DescProvincia='${encodeURIComponent(nombre)}'`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const features = new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      });

      if (features.length === 0) {
        console.warn(`❌ No se encontró polígono para la provincia con nombre: ${nombre}`);
        alert(`No se encontró el polígono para la provincia seleccionada: ${nombre}`);
        return;
      }

      const vectorSource = new VectorSource({ features });





      if (this.highlightLayer) {
        this.map.removeLayer(this.highlightLayer);
      }

      this.highlightLayer = new VectorLayer({
         source: vectorSource,
   style: (feature) => {
          const idProv = String(feature.get('TN_CodigoProvincia'));
          console.log('ID:--',idProv)
          const temp = this.temperaturasPorProvincia[idProv];

          const coords = (feature.getGeometry() as any).getCoordinates();
const coord = coords[0][0]; // Primer punto exterior del polígono
const [lon, lat] = toLonLat(coord);

this.longitud = parseFloat(lon.toFixed(6));
this.latitud = parseFloat(lat.toFixed(6));

          return new Style({
            stroke: new Stroke({ color: 'black', width: 1 }),
            fill: new Fill({
  color: this.hexToRgba(this.getColorPorTemperatura(temp || 0), this.transparencia)
}),

          });
        }
      });

      this.map.addLayer(this.highlightLayer);
      this.map.getView().fit(vectorSource.getExtent(), { duration: 1000 });

      console.log(`✅ Polígono encontrado: ${features.length} feature(s) para ${nombre}`);
    })
    .catch(err => {
      console.error('🚫 Error al consultar GeoServer:', err);
      alert('Error al consultar GeoServer. Verifica conexión o CQL.');
    });
}

actualizarEstiloProvincia(): void {
  const idProvincia = parseInt(this.provinciaSeleccionada);
  const idIndicador = Number(this.indicadorSeleccionado);

  if (!idProvincia || !idIndicador || !this.fechaSeleccionada) {
    console.warn('⚠️ Faltan filtros para actualizar el estilo.');
    return;
  }

  console.log('idProvincia', idProvincia);
  console.log('idIndicador', idIndicador);

  this.historitoTempService.obtenerTemperaturaPorFecha(this.fechaSeleccionada, idProvincia, idIndicador)
    .subscribe(data => {
      if (!data || data.length === 0) {
        console.warn('No se encontraron datos de temperatura para esta combinación.');
        return;
      }

      this.temperaturas = data;
      const tempProm = data[0].temperaturaPromedio ?? 0;
      const idProvinciaStr = String(idProvincia);
      this.temperaturasPorProvincia[idProvinciaStr] = tempProm;

      console.log(`📌 Temperatura registrada para provincia ${idProvinciaStr}: ${tempProm}`);

      this.resaltarProvincia(this.provinciaSeleccionada);

      setTimeout(() => {
        this.highlightLayer?.getSource()?.getFeatures().forEach(f => f.changed());
      }, 100);
    }, error => {
      console.error('❌ Error al obtener datos de temperatura:', error);
    });
}




indicadoresConfig: any = {
  1: { // Temperatura
    min: 18,
    max: 27,
    gradient: 'linear-gradient(to right, #313695, #4575b4, #74add1, #fdae61, #f46d43, #d73027)',
    nota: 'Los colores representan la temperatura promedio anual, tomando como referencia sus valores mínimos y máximos.'
  },
  2: { // Suelo
    min: 2,
    max: 100,
    gradient: 'linear-gradient(to right, yellow, #8888ff, blue)',
    nota: 'Los colores representan la cantidad de arcilla presente en el suelo, tomando como referencia sus valores mínimos y máximos.'
  },
  3: { // Elevación
    min: 0,
    max: 130,
    gradient: 'linear-gradient(to right, blue, cyan, yellow, red, white)',
    nota: 'Los colores representan la elevación sobre el nivel del mar, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.'
  },
    4: { // Cobertura de suelo
    min: '',  // No aplica escala numérica
    max: '',
    gradient: 'linear-gradient(to right, #ffff00, #ffcc00, #ff9900, #ff0000, #990000, #0000ff, #0066cc, #009933, #66cc00, #999900)',
    nota: 'Los colores representan la clasificación de la cobertura de suelo.'
  },
    5: { // Evapotranspiración
    min: 98,
    max: 146,
    gradient: 'linear-gradient(to right, #313695, #74add1, #ffffbf, #f46d43, #a50026)',
    nota: 'Los colores representan la evapotranspiración promedio anual, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.'
  },
    6: { // Precipitación
    min: 15,
    max: 30,
    gradient: 'linear-gradient(to right, #ffffb2, #fefecb, #c7e9b4, #7fcdbb, #41b6c4, #2c7fb8, #253494)',
    nota: 'Los colores representan las precipitaciones promedio anuales, tomando como referencia sus valores mínimos y máximos presentes en la barra de colores.'
  }



  // Puedes seguir agregando más indicadores aquí
};



minLeyenda: any = 0;
maxLeyenda: any = 0;

gradienteLeyenda: string = '';
notaLeyenda: string = '';



mostrarExtremos: boolean = true;


mostrarPrediccion: boolean = false;


actualizarLeyendaPorIndicador(): void {
  const config = this.indicadoresConfig[this.indicadorSeleccionado];
  if (config) {
    this.minLeyenda = config.min;
    this.maxLeyenda = config.max;
    this.gradienteLeyenda = config.gradient;
    this.notaLeyenda = config.nota;
    this.nombreIndicador = config.nombre || '';
    this.descripcionIndicador = config.descripcion || '';
    this.mostrarExtremos = config.min !== undefined && config.min !== '';
  } else {
    this.gradienteLeyenda = '';
    this.notaLeyenda = '';
    this.nombreIndicador = '';
    this.descripcionIndicador = '';
    this.mostrarExtremos = false;
  }
}


get provinciaSeleccionadaNombre(): string {
  const provincia = this.provincias.find(p => p.tN_CodigoProvincia == this.provinciaSeleccionada);
  return provincia ? provincia.tC_DescProvincia : '';
}



  obtenerPrediccion(): void {
    if (!this.provinciaSeleccionada || !this.indicadorSeleccionado) {
      alert('Debe seleccionar provincia e indicador');
      return;
    }

    const idProvincia = Number(this.provinciaSeleccionada);
    const idIndicador = Number(this.indicadorSeleccionado);

    this.catalogosService.obtenerPrediccionTemperatura(idProvincia, idIndicador)
      .subscribe(
        (data: any[]) => {
          this.prediccionDatos = data;
          console.log(this.prediccionDatos);
        },
        (error) => {
          console.error('Error al obtener predicción:', error);
        }
      );
  }

}
