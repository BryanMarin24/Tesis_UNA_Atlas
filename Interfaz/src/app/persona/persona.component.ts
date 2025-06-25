// src/app/persona/persona.component.ts
import { Component } from '@angular/core';
import { PersonaService, PersonaRequest } from './persona.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  persona: PersonaRequest = {
    operacion: 1,
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: 0,
    correo: ''
  };

  constructor(private personaService: PersonaService) {}

registrar() {
  this.personaService.registrarPersona(this.persona).subscribe({
    next: res => {
      console.log('Respuesta del backend:', res);
      alert('Persona registrada correctamente');
    },
    error: err => {
      console.error('Error al registrar persona:', err);
      alert('Error al registrar persona: ' + (err.error?.message || err.statusText));
    }
  });
}

}
