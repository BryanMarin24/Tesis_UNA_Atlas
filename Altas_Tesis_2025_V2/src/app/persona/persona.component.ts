import { Component, OnInit } from '@angular/core';
import { PersonaService, PersonaRequest } from './persona.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
   imports: [CommonModule, FormsModule,MapaComponent],
  standalone: true,
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
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

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas(): void {
    this.personaService.obtenerPersonas().subscribe({
      next: (data) => this.personas = data,
      error: (err) => console.error('Error cargando personas', err)
    });
  }

  editarPersona(p: any): void {
    this.persona = { ...p }; // Cargar datos al formulario
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
        this.limpiarFormulario(); // También puedes limpiar después de eliminar si gustas
      },
      error: err => console.error('Error al eliminar', err)
    });
  }

  registrar(): void {
    const operacion = this.persona.idPersona ? 2 : 1; // 1 = insertar, 2 = actualizar
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
}
