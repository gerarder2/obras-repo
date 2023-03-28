import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  window: Window & typeof globalThis;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }

  setItem(name: string, value: Record<string, any> | string): void {
    this.window.sessionStorage.setItem(name, JSON.stringify(value));
  }

  getItem(name: string): any {
    const item = this.window.sessionStorage.getItem(name);
    try {
      return JSON.parse(item);
    } catch (e) {
      return '';
    }
  }

  removeItem(name: string): void {
    this.window.sessionStorage.removeItem(name);
  }
}
