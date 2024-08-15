import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from 'src/app/core/events/event-bus.service';
import { StorageService } from 'src/app/core/services/storage.service';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Auth0Service } from 'src/app/core/services/auth0.service';
const { app_name } = environment;

@Component({
  selector: 'wlrd-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements AfterViewInit, OnInit, OnDestroy {
  user: any = null;
  idToken: any;
  accessToken: any;

  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  url_avatar = 'http://127.0.0.1:3200/auth/avatar/8';

  eventBusSub?: Subscription;
  _isDarkModeActive: boolean = false;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private document: any,
    private storageService: StorageService,
    private auth0Service: Auth0Service,
    private eventBusService: EventBusService
  ) {}

  ngOnDestroy(): void {
    this.eventBusSub?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.auth0Service.getUser().subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
    if (!(await this.auth0Service.isAuthenticated())) {
      this._login();
    }
  }

  openMobileMenu: boolean = false;


  async ngOnInit(): Promise<void> {

    this.openMobileMenu = false;
    this.element = document.documentElement;



    this._isDarkModeActive =
      this.storageService.isDarkModeActive !== null
        ? this.storageService.isDarkModeActive
        : false;

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
    this.url_avatar = this.user?.picture || this.url_avatar;
  }

  setLanguage(text: string, lang: string, flag: string) {}

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    console.log('toggleMobileMenu::', event);
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Confirmas que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'CANCELAR',
      confirmButtonText: 'CERRAR SESIÓN',
    }).then((result) => {
      if (result.value) {
        this._logout();
      }
    });
  }

  _logout(): void {
    this.storageService.setHasReloaded(false);
    this.auth0Service.logout();
  }

  _login(): void {
    this.auth0Service.login();
  }
  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  darkModeChange(e: boolean) {
    this.storageService.darkModeChange(e);
    this._isDarkModeActive = this.storageService.isDarkModeActive || false;
    this.eventBusService.emit({
      name: `${app_name}||darkMode`,
      value: e,
    });
  }
}
