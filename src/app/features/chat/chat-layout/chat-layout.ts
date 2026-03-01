import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { ProfileDrawer } from '../profile-drawer/profile-drawer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-layout',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, CommonModule, ProfileDrawer],
  templateUrl: './chat-layout.html',
  styleUrl: './chat-layout.scss',
})
export class ChatLayout {
  isProfileOpen$: Observable<boolean>;

  constructor(private profileService: ProfileService) {
    this.isProfileOpen$ = this.profileService.isProfileOpen$;
  }

  toggleProfile(): void {
    this.profileService.toggleProfile();
  }
}
