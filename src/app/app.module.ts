import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { GroupChannelModule} from '@sendbird/chat/groupChannel';
import { ConnectedComponent } from './component/connected/connected.component';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const appRoutes:Routes =[
 
  // {path:'Inic', component: IniciarSesionComponent},
 
  {path:'Connected', component: ConnectedComponent},
  {path:'Con', component: AppComponent},
  
  
  
 ]
@NgModule({
  declarations: [
    AppComponent,
    ConnectedComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes,{onSameUrlNavigation: 'reload'})
  ],
  exports:[RouterModule],
  providers: [GroupChannelModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
