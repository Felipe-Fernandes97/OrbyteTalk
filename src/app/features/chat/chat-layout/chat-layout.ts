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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-chat-layout',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, CommonModule, FormsModule, ProfileDrawer, NewConversationModal],
  templateUrl: './chat-layout.html',
  styleUrl: './chat-layout.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  newMessage = '';
  showEmojiPicker = false;
  isRecording = false;
  recordingTime = 0;
  recordingInterval: any = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

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

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage({ content: this.newMessage });
    this.newMessage = '';
  }

  onEmojiSelect(event: any): void {
    const emoji = event.detail?.emoji;
    if (emoji) {
      this.newMessage += emoji;
      this.showEmojiPicker = false;
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.chatService.sendMessage({
      content: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileName: file.name,
      fileUrl: url,
      fileSize: file.size,
    });
    input.value = '';
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.chatService.sendMessage({
      content: file.name,
      type: 'audio',
      fileName: file.name,
      fileUrl: url,
      fileSize: file.size,
    });
    input.value = '';
  }

  async startRecordingAudio(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        this.chatService.sendMessage({
          content: 'Áudio gravado',
          type: 'audio',
          fileName: `áudio_${Date.now()}.webm`,
          fileUrl: url,
          fileSize: audioBlob.size,
        });
        stream.getTracks().forEach(track => track.stop());
        this.isRecording = false;
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Permissão de microfone negada ou não disponível');
      this.isRecording = false;
    }
  }

  stopRecordingAudio(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
  }

  toggleAudioRecording(): void {
    if (this.isRecording) {
      this.stopRecordingAudio();
    } else {
      this.startRecordingAudio();
    }
  }
}
