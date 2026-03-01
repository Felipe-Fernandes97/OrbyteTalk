import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { NewConversationService } from '../../../core/services/new-conversation.service';
import { ChatService } from '../../../core/services/chat.service';
import { ProfileDrawer } from '../profile-drawer/profile-drawer';
import { NewConversationModal } from '../new-conversation-modal/new-conversation-modal';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-chat-layout',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, CommonModule, FormsModule, ProfileDrawer, NewConversationModal],
  templateUrl: './chat-layout.html',
  styleUrl: './chat-layout.scss',
})
export class ChatLayout {
  isProfileOpen$: Observable<boolean>;
  conversations$: Observable<User[]>;
  filteredConversations$: Observable<User[]>;
  selectedUser$: Observable<User | null>;
  isLoadingConversations$: Observable<boolean>;
  isLoadingMessages$: Observable<boolean>;
  searchQuery$: Observable<string>;
  activeFilter$: Observable<string>;
  isOptionsOpen$: Observable<boolean>;
  messages$: Observable<Message[]>;

  isSidebarCollapsed = false;
  sidebarSearch = '';

  constructor(
    private profileService: ProfileService,
    private newConversationService: NewConversationService,
    private chatService: ChatService
  ) {
    this.isProfileOpen$ = this.profileService.isProfileOpen$;
    this.conversations$ = this.chatService.conversations$;
    this.filteredConversations$ = this.chatService.filteredConversations$;
    this.selectedUser$ = this.chatService.selectedUser$;
    this.isLoadingConversations$ = this.chatService.isLoadingConversations$;
    this.isLoadingMessages$ = this.chatService.isLoadingMessages$;
    this.searchQuery$ = this.chatService.searchQuery$;
    this.activeFilter$ = this.chatService.activeFilter$;
    this.isOptionsOpen$ = this.chatService.isOptionsOpen$;
    this.messages$ = this.chatService.messages$;
  }

  toggleProfile(): void {
    this.profileService.toggleProfile();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  openNewConversation(): void {
    this.newConversationService.open();
  }

  selectUser(user: User): void {
    this.chatService.selectUser(user);
  }

  closeConversation(): void {
    this.chatService.closeConversation();
  }

  onSidebarSearch(): void {
    this.chatService.setSearchQuery(this.sidebarSearch);
  }

  setFilter(filter: string): void {
    this.chatService.setFilter(filter as any);
  }

  formatTime(date: Date): string {
    return this.chatService.formatTime(date);
  }

  toggleOptionsMenu(): void {
    this.chatService.toggleOptionsMenu();
  }

  closeOptionsMenu(): void {
    this.chatService.closeOptionsMenu();
  }

  toggleFavorite(user: User): void {
    this.chatService.toggleFavorite(user);
  }

  toggleMute(user: User): void {
    this.chatService.toggleMute(user);
  }

  clearHistory(): void {
    this.chatService.clearHistory();
  }

  deleteConversation(user: User): void {
    this.chatService.deleteConversation(user.id);
  }
}
