import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';

type ConversationFilter = 'all' | 'unread' | 'favorites' | 'groups';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private isLoadingConversationsSubject = new BehaviorSubject<boolean>(true);
  public isLoadingConversations$ = this.isLoadingConversationsSubject.asObservable();

  private isLoadingMessagesSubject = new BehaviorSubject<boolean>(false);
  public isLoadingMessages$ = this.isLoadingMessagesSubject.asObservable();

  private conversationsSubject = new BehaviorSubject<User[]>([]);
  public conversations$ = this.conversationsSubject.asObservable();

  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  public selectedUser$ = this.selectedUserSubject.asObservable();

  // Filtros e pesquisa
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  private activeFilterSubject = new BehaviorSubject<ConversationFilter>('all');
  public activeFilter$ = this.activeFilterSubject.asObservable();

  private isOptionsOpenSubject = new BehaviorSubject<boolean>(false);
  public isOptionsOpen$ = this.isOptionsOpenSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // Observable derivado: conversas filtradas
  public filteredConversations$: Observable<User[]> = combineLatest([
    this.conversationsSubject,
    this.searchQuerySubject,
    this.activeFilterSubject
  ]).pipe(
    map(([conversations, query, filter]) => {
      let result = conversations;

      // Aplica filtro de tópico
      if (filter === 'unread') {
        result = result.filter(u => u.unreadCount && u.unreadCount > 0);
      } else if (filter === 'favorites') {
        result = result.filter(u => u.isFavorite);
      } else if (filter === 'groups') {
        result = result.filter(u => u.isGroup);
      }

      // Aplica pesquisa por nome ou última mensagem
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.lastMessage?.toLowerCase().includes(q)
        );
      }

      return result;
    })
  );

  private readonly mockMessages: Message[] = [
    { id: '1', content: 'Oi, tudo bem?', timestamp: new Date(Date.now() - 25 * 60000), isSent: false, isRead: true },
    { id: '2', content: 'Tudo sim! E você?', timestamp: new Date(Date.now() - 20 * 60000), isSent: true, isRead: true },
    { id: '3', content: 'Aqui também! Vamos construir?', timestamp: new Date(Date.now() - 15 * 60000), isSent: false, isRead: true },
    { id: '4', content: 'Claro! Que feature fazemos hoje?', timestamp: new Date(Date.now() - 10 * 60000), isSent: true, isRead: false }
  ];

  private readonly mockConversations: User[] = [
    {
      id: '1',
      name: 'Felipe',
      avatarInitial: 'F',
      isOnline: true,
      lastMessage: 'Oi, tudo bem?',
      lastMessageAt: new Date(Date.now() - 3 * 60000),
      unreadCount: 2,
      isFavorite: false,
      isGroup: false
    },
    {
      id: '2',
      name: 'Ana',
      avatarInitial: 'A',
      isOnline: true,
      lastMessage: 'Até mais!',
      lastMessageAt: new Date(Date.now() - 90 * 60000),
      unreadCount: 0,
      isFavorite: true,
      isGroup: false,
      lastSeenAt: new Date(Date.now() - 15 * 60000)
    },
    {
      id: '3',
      name: 'Carlos',
      avatarInitial: 'C',
      isOnline: false,
      lastMessage: 'Vou verificar...',
      lastMessageAt: new Date(Date.now() - 26 * 3600000),
      unreadCount: 5,
      isFavorite: false,
      isGroup: true,
      lastSeenAt: new Date(Date.now() - 3 * 3600000)
    }
  ];

  constructor() {
    this.loadConversations();
  }

  private loadConversations(): void {
    // Simula carregamento inicial (2s)
    setTimeout(() => {
      this.conversationsSubject.next(this.mockConversations);
      this.isLoadingConversationsSubject.next(false);
    }, 2000);
  }

  selectUser(user: User): void {
    this.selectedUserSubject.next(user);
    this.closeOptionsMenu();

    // Simula loading das mensagens (1s)
    this.isLoadingMessagesSubject.next(true);
    setTimeout(() => {
      this.isLoadingMessagesSubject.next(false);

      // Carrega mensagens
      this.messagesSubject.next(this.mockMessages);

      // Limpa badge ao entrar na conversa
      const updated = this.conversationsSubject.value.map(u =>
        u.id === user.id ? { ...u, unreadCount: 0 } : u
      );
      this.conversationsSubject.next(updated);
    }, 1000);
  }

  closeConversation(): void {
    this.selectedUserSubject.next(null);
    this.messagesSubject.next([]);
    this.closeOptionsMenu();
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  setFilter(filter: ConversationFilter): void {
    this.activeFilterSubject.next(filter);
  }

  toggleOptionsMenu(): void {
    this.isOptionsOpenSubject.next(!this.isOptionsOpenSubject.value);
  }

  closeOptionsMenu(): void {
    this.isOptionsOpenSubject.next(false);
  }

  toggleFavorite(user: User): void {
    this.updateConversation(user.id, { isFavorite: !user.isFavorite });
    this.closeOptionsMenu();
  }

  toggleMute(user: User): void {
    this.updateConversation(user.id, { isMuted: !user.isMuted });
    this.closeOptionsMenu();
  }

  clearHistory(): void {
    this.messagesSubject.next([]);
    this.closeOptionsMenu();
  }

  deleteConversation(userId: string): void {
    const updated = this.conversationsSubject.value.filter(u => u.id !== userId);
    this.conversationsSubject.next(updated);
    this.selectedUserSubject.next(null);
    this.messagesSubject.next([]);
    this.closeOptionsMenu();
  }

  private updateConversation(userId: string, changes: Partial<User>): void {
    const updated = this.conversationsSubject.value.map(u =>
      u.id === userId ? { ...u, ...changes } : u
    );
    this.conversationsSubject.next(updated);
    // Se é o usuário selecionado, atualiza também a seleção
    if (this.selectedUserSubject.value?.id === userId) {
      this.selectedUserSubject.next({ ...this.selectedUserSubject.value, ...changes });
    }
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 2) {
      return 'ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  }
}
