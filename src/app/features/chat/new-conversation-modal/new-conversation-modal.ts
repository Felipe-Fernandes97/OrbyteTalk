import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewConversationService } from '../../../core/services/new-conversation.service';
import { User } from '../../../core/models/user.model';

type ActiveTab = 'direct' | 'group';

@Component({
  selector: 'app-new-conversation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-conversation-modal.html',
  styleUrl: './new-conversation-modal.scss'
})
export class NewConversationModal {
  isOpen$: Observable<boolean>;
  filteredUsers$: Observable<User[]>;
  selectedUsers$: Observable<User[]>;

  activeTab: ActiveTab = 'direct';
  searchQuery = '';
  groupName = '';

  constructor(private svc: NewConversationService) {
    this.isOpen$ = svc.isOpen$;
    this.filteredUsers$ = svc.filteredUsers$;
    this.selectedUsers$ = svc.selectedUsers$;
  }

  setTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.svc.setSearchQuery('');
  }

  onSearchInput(): void {
    this.svc.setSearchQuery(this.searchQuery);
  }

  onGroupNameInput(): void {
    this.svc.setGroupName(this.groupName);
  }

  toggleUser(user: User): void {
    this.svc.toggleUserSelection(user);
  }

  isSelected(userId: string): boolean {
    return this.svc.isUserSelected(userId);
  }

  startDirect(user: User): void {
    this.svc.startDirectConversation(user);
  }

  createGroup(): void {
    this.svc.createGroup();
  }

  close(): void {
    this.svc.close();
    this.searchQuery = '';
    this.groupName = '';
    this.activeTab = 'direct';
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
