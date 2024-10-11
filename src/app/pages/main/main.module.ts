import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TopbarComponent } from 'src/app/layout/topbar/topbar.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { AuthService } from '@auth0/auth0-angular';


@NgModule({
  declarations: [
    MainComponent,
    TopbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
