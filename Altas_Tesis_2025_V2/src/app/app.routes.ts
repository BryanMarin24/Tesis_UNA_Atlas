import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LogicComponent } from './login/login.component';
import { PersonaComponent } from './persona/persona.component';
import { InicioComponent } from './inicio/inicio.component';
import { AcercaComponent } from './acerca/acerca.component';
import { VariableComponent } from './variable/variable.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogicComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'variable', component: VariableComponent },
  { path: 'persona', component: PersonaComponent },
  { path: 'acerca', component: AcercaComponent },
];
