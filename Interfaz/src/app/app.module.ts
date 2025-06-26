import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonaComponent } from './persona/persona.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [AppComponent,PersonaComponent],
  imports: [BrowserModule, FormsModule,AppRoutingModule,HttpClientModule,MenuComponent  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
