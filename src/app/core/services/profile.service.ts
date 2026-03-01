import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private isProfileOpenSubject = new BehaviorSubject<boolean>(false);
  public isProfileOpen$ = this.isProfileOpenSubject.asObservable();

  toggleProfile(): void {
    this.isProfileOpenSubject.next(!this.isProfileOpenSubject.value);
  }

  openProfile(): void {
    this.isProfileOpenSubject.next(true);
  }

  closeProfile(): void {
    this.isProfileOpenSubject.next(false);
  }
}
