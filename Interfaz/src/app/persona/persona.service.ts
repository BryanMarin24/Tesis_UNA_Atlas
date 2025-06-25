// src/app/persona/persona.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PersonaRequest {
  operacion: number;
  idPersona?: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: number;
  correo?: string;
}

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private apiUrl = 'https://localhost:53599/api/Personas/mantenimiento';

  constructor(private http: HttpClient) {}

registrarPersona(data: PersonaRequest): Observable<any> {
  return this.http.post(this.apiUrl, data, { responseType: 'text' });
}

}
