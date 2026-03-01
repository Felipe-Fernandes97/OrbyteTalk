import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ChatLayout } from './features/chat/chat-layout/chat-layout';
import { Profile } from './features/chat/profile/profile';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'chat', component: ChatLayout },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
