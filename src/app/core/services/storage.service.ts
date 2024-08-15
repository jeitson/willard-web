import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as Bowser from 'bowser';
import { Parser } from 'bowser';

import { UtilsLocalStorageService } from 'ngx-danisoft-utils';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';

const { app_name, appKey: _appKey_ } = environment;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private browser: Parser.ParsedResult | any;
  isDarkModeActive: boolean | null = false;
  constructor(
    private auth: AuthService,
    private _localStorage: UtilsLocalStorageService
  ) {
    this.isDarkModeActive = this.DarkModeActive;
    this.browser = Bowser.parse(window.navigator.userAgent);
    this.darkMode();
  }

  get imei(): string {
    let _imei: string | null =
      this._localStorage.getItem(`${app_name}|imei`) || null;

    if (_imei === null) {
      _imei = this.setImei();
      this._localStorage.setItem(`${app_name}|imei`, _imei, false);
    }
    return _imei || '';
  }

  setImei(num?: number): string {
    if (num === undefined) {
      num = 21;
    }

    const date = new Date();
    const characters = `abc${date.getMonth()}def${date.getFullYear()}nlmst${date.getTime()}urvxy`;

    let result = 'web';
    for (let i = 0; i < num; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  get DarkModeActive(): boolean {
    this.isDarkModeActive = this._localStorage.getItem<boolean>(
      `${app_name}|darkMode`
    );
    return this.isDarkModeActive || false;
  }

  darkModeChange(e: boolean) {
    this.isDarkModeActive = e;
    this._localStorage.setItem(`${app_name}|darkMode`, e, false);
    this.darkMode();
  }

  darkMode() {
    if (this._localStorage.getItem<boolean>(`${app_name}|darkMode`) === true) {
      document.body.setAttribute('data-sidebar', 'dark');
      document.body.setAttribute('data-layout', 'vertical');
      document.body.setAttribute('data-layout-mode', 'dark');
    } else {
      document.body.setAttribute('data-sidebar', 'light');
      document.body.setAttribute('data-layout', 'vertical');
      document.body.setAttribute('data-layout-mode', 'light');
    }
    //console.log(this.DarkModeActive, this.isDarkModeActive);
  }

  setHasReloaded(e: boolean = false) {
    this._localStorage.setItem(`${app_name}|hasReloaded`, e, false);
  }

  get getHasReloaded(): boolean {
    return (
      this._localStorage.getItem<boolean>(`${app_name}|hasReloaded`) || false
    );
  }

}
