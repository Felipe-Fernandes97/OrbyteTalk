import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class NewConversationService {
  // --- Modal visibility state ---
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  // --- Mock user data ---
  private readonly mockUsers: User[] = [
    { id: '1', name: 'Ana Lima', avatarInitial: 'A', isOnline: true, lastMessage: 'Até mais!' },
    { id: '2', name: 'Carlos Melo', avatarInitial: 'C', isOnline: false, lastMessage: 'Vou verificar...' },
    { id: '3', name: 'Diana Cruz', avatarInitial: 'D', isOnline: true, lastMessage: 'Ok!' },
    { id: '4', name: 'Eduardo Silva', avatarInitial: 'E', isOnline: false, lastMessage: undefined },
    { id: '5', name: 'Fernanda Costa', avatarInitial: 'F', isOnline: true, lastMessage: 'Oi!' },
  ];

  // --- Search query state ---
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  // --- Filtered user list (derived observable) ---
  public filteredUsers$: Observable<User[]> = combineLatest([
    this.searchQuerySubject
  ]).pipe(
    map(([query]) => {
      const q = query.toLowerCase().trim();
      if (!q) return this.mockUsers;
      return this.mockUsers.filter(u => u.name.toLowerCase().includes(q));
    })
  );

  // --- Group creation state ---
  private selectedUsersSubject = new BehaviorSubject<User[]>([]);
  public selectedUsers$ = this.selectedUsersSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  public groupName$ = this.groupNameSubject.asObservable();

  // --- Modal control ---
  open(): void {
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
    this.resetState();
  }

  // --- Search ---
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  // --- Group user selection ---
  toggleUserSelection(user: User): void {
    const current = this.selectedUsersSubject.value;
    const index = current.findIndex(u => u.id === user.id);
    if (index === -1) {
      this.selectedUsersSubject.next([...current, user]);
    } else {
      this.selectedUsersSubject.next(current.filter(u => u.id !== user.id));
    }
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUsersSubject.value.some(u => u.id === userId);
  }

  setGroupName(name: string): void {
    this.groupNameSubject.next(name);
  }

  // --- Actions ---
  startDirectConversation(user: User): void {
    console.log('Starting direct conversation with', user);
    // Future: navigate to conversation, emit event, etc.
    this.close();
  }

  createGroup(): void {
    const users = this.selectedUsersSubject.value;
    const name = this.groupNameSubject.value;
    console.log('Creating group', { name, users });
    // Future: call backend, add to conversation list, navigate
    this.close();
  }

  private resetState(): void {
    this.searchQuerySubject.next('');
    this.selectedUsersSubject.next([]);
    this.groupNameSubject.next('');
  }
}
