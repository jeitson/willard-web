import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { CollectionCentersComponent } from './collection-centers/collection-centers.component';
import { ProductComponent } from '../configuration/product/product.component';
import { ConveyorComponent } from '../configuration/conveyor/conveyor.component';
import { AdviserComponent } from '../configuration/adviser/adviser.component';
import { CustomersComponent } from '../configuration/customers/customers.component';


@NgModule({
  declarations: [
    CollectionCentersComponent,
    ProductComponent,
    ConveyorComponent,
    AdviserComponent,
    CustomersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConfigurationRoutingModule
  ]
})
export class ConfigurationModule { }
