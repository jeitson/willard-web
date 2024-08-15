import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { FormsModule } from '@angular/forms';
import { RolesComponent } from './roles.component';


@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
