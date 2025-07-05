import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private baseUrl = 'https://localhost:53599/api/Catalogos'; // cambia según tu backend

  constructor(private http: HttpClient) {}

  obtenerProvincias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/provincia`);
  }

  obtenerIndicadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/indicadores`);
  }

  obtenerAnios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/anio`);
  }
}
