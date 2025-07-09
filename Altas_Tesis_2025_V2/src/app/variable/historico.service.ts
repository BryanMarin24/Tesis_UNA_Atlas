import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoTempService {
  private baseUrl = 'https://localhost:53599/api/Historico'; // Ajusta según tu entorno

  constructor(private http: HttpClient) {}

  obtenerTemperaturaPorFecha(fecha: string, idProvincia: number, idIndicador: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/HistoricoTemperatura`, {
    params: { fecha, idProvincia, idIndicador }
  });
}


}
