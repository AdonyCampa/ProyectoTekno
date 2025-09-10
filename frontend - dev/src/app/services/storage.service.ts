import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser = typeof window !== 'undefined';

  getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }
}
