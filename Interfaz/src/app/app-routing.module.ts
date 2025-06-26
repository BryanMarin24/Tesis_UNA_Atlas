import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { EstudiosComponent } from './estudios/estudios.component';

import { ReporteriaComponent } from './reporteria/reporteria.component';
import { AcercaComponent } from './acerca/acerca.component';
import { PersonaComponent } from './persona/persona.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'estudios', component: EstudiosComponent },
  { path: 'mantenimiento', component: PersonaComponent },
  { path: 'reporteria', component: ReporteriaComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
