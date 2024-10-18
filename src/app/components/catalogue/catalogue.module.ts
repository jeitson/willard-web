import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from './catalogue.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from 'src/app/core/utils/custon-ruse.strategy';


@NgModule({
  declarations: [
    CatalogueComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    CatalogueRoutingModule
  ],
  exports: [
    CatalogueComponent
  ],
})
export class CatalogueModule { }
