import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';
const USER_ID = 'user_id';
const ROL_ID = 'rol_id';
const USER_PROFILE = 'user-profile';
const IS_TEMPORAL = 'temporal';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	constructor() {}

	signOut(): void {
		sessionStorage.clear();
	}

	public saveToken(token: string): void {
		window.sessionStorage.removeItem(TOKEN_KEY);
		window.sessionStorage.setItem(TOKEN_KEY, token);
	}

	public getToken(): string | null {
		return sessionStorage.getItem(TOKEN_KEY);
	}

	public saveUser(user: any): void {
		window.sessionStorage.removeItem(USER_KEY);
		window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
	}

	public getUser(): any {
		const user = window.sessionStorage.getItem(USER_KEY);
		if (user) {
			return JSON.parse(user);
		}

		return {};
	}

	public getUserId(): string {
		const userid = window.sessionStorage.getItem(USER_ID);
		if (userid) {
			return userid;
		}

		return '';
	}

  saveProfile(profile: any){
    window.sessionStorage.removeItem(USER_PROFILE);
		window.sessionStorage.setItem(USER_PROFILE, profile);
  }

	public saveUserId(userId: string): void {
		window.sessionStorage.removeItem(USER_ID);
		window.sessionStorage.setItem(USER_ID, userId);
	}

	public saveRolId(content: string): void {
		window.sessionStorage.removeItem(ROL_ID);
		window.sessionStorage.setItem(ROL_ID, content);
	}

	public getRolID(): any {
		const rol = window.sessionStorage.getItem(ROL_ID);
		if (rol) {
			return JSON.parse(rol);
		}

		return '';
	}

	public getMenu(): any {
		const menu = this.getUser().menu;
		if (menu) {
			return JSON.parse(menu);
		}

		return '';
	}

  public clearSession(): any {
		sessionStorage.clear();
	}
}
