import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private baseUrl = 'https://localhost:53599/api/Catalogos'; // cambia según tu backend
  private historicoUrl = 'https://localhost:53599/api/Historico';

  constructor(private http: HttpClient) {}

  obtenerProvincias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/provincia`);
  }

  obtenerIndicadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/indicadores`);
  }

  obtenerPrediccionTemperatura(idProvincia: number, idIndicador: number): Observable<any> {
    const params = new HttpParams()
      .set('idProvincia', idProvincia)
      .set('idIndicador', idIndicador);

    return this.http.get(`${this.historicoUrl}/PrediccionTemperatura`, { params });
  }
}
