import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ChatLayout } from './features/chat/chat-layout/chat-layout';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'chat', component: ChatLayout },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];