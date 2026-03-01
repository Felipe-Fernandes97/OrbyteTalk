export interface User {
  id: string;
  name: string;
  avatarInitial: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
  isFavorite?: boolean;
  isGroup?: boolean;
  lastSeenAt?: Date;    // para "visto por último"
  isMuted?: boolean;    // para silenciar conversa
}
