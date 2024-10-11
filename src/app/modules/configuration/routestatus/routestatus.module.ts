import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutestatusRoutingModule } from './routestatus-routing.module';
import { RoutestatusComponent } from './routestatus.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    RoutestatusComponent
  ],
  imports: [
    CommonModule,
    RoutestatusRoutingModule,
    CatalogueModule
  ]
})
export class RoutestatusModule { }
