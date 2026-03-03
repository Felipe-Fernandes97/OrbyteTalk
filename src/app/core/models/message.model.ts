export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isSent: boolean;      // true = enviada por mim, false = recebida
  isRead: boolean;      // true = destinatário leu (✓✓ azul)
  type?: 'text' | 'file' | 'audio' | 'image';
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
}
