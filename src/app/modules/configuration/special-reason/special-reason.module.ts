import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialReasonRoutingModule } from './special-reason-routing.module';
import { SpecialReasonComponent } from './special-reason.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [SpecialReasonComponent],
  imports: [
    CommonModule,
    SpecialReasonRoutingModule,
    CatalogueModule
  ]
})
export class SpecialReasonModule { }
