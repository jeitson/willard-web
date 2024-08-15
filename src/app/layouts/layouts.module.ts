import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './errors/page404/page404.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarComponent } from './sidebar/components/simplebar/simplebar.component';
import { FormsModule } from '@angular/forms';
import { Page500Component } from './errors/page500/page500.component';
import { MaintenanceComponent } from './errors/maintenance/maintenance.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { CerrarSesionComponent } from './errors/cerrar-sesion/cerrar-sesion.component';

@NgModule({
  declarations: [
    Page404Component,
    SidebarComponent,
    FooterComponent,
    TopbarComponent,
    SimplebarComponent,
    Page500Component,
    MaintenanceComponent,
    UnauthorizedComponent,
    CerrarSesionComponent,
  ],
  exports: [
    Page404Component,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    SimplebarComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
})
export class LayoutsModule {}
