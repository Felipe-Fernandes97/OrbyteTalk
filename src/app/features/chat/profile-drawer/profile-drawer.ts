import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './profile-drawer.html',
  styleUrl: './profile-drawer.scss',
})
export class ProfileDrawer {
  isOpen$: Observable<boolean>;

  constructor(private profileService: ProfileService) {
    this.isOpen$ = this.profileService.isProfileOpen$;
  }

  closeProfile(): void {
    this.profileService.closeProfile();
  }
}
