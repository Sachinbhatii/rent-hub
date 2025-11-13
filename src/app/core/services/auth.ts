import { Injectable } from '@angular/core';
import { DB } from './db';

@Injectable({ providedIn: 'root' })
export class Auth {
  private currentUser: any = null;

  constructor(private db: DB) { }

  async signup(user: any) {
    await this.db.add('users', user);
  }

  async login(email: string, password: string) {
    const users = await this.db.getAll('users');
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      this.currentUser = found;
      sessionStorage.setItem('user', JSON.stringify(found));
      return true;
    }
    return false;
  }

  isLoggedIn() {
    return !!sessionStorage.getItem('user');
  }

  logout() {
    sessionStorage.removeItem('user');
    this.currentUser = null;
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  }

  async getUserByEmail(email: string) {
    const users = await this.db.getAll('users');
    return users.find((u: any) => u.email === email);
  }

}
