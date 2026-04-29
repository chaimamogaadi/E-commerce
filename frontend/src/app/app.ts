import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatbotComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-chatbot />
  `,
  styles: [`
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }
  `]
})
export class AppComponent {}