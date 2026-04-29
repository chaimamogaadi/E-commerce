import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating toggle button -->
    <button class="chat-toggle" (click)="toggleChat()" [class.open]="isOpen()">
      @if (isOpen()) {
        <span class="icon-close">✕</span>
      } @else {
        <span class="icon-chat">💬</span>
        @if (!auth.isLoggedIn()) {
          <span class="lock-dot" title="Login to use AI chat"></span>
        }
      }
    </button>

    <!-- Chat panel -->
    @if (isOpen()) {
      <div class="chat-panel">
        <div class="chat-header">
          <div class="header-left">
            <div class="avatar">AI</div>
            <div>
              <p class="bot-name">ShopSmart Assistant</p>
              <p class="bot-status">Powered by phi3:mini · local</p>
            </div>
          </div>
          <button class="btn-clear" (click)="clearChat()" title="Clear chat">⟳</button>
        </div>

        @if (!auth.isLoggedIn()) {
          <div class="login-prompt">
            <p>Please log in to use the AI shopping assistant.</p>
          </div>
        } @else {
          <div class="messages" #messageContainer>
            @if (messages().length === 0) {
              <div class="welcome-msg">
                <p>Hi! I'm your AI shopping assistant.</p>
                <p>Try asking me:</p>
                <div class="suggestions">
                  @for (s of suggestions; track s) {
                    <button class="suggestion-chip" (click)="sendSuggestion(s)">{{ s }}</button>
                  }
                </div>
              </div>
            }

            @for (msg of messages(); track msg.timestamp) {
              <div class="message" [class.user-msg]="msg.role === 'user'" [class.bot-msg]="msg.role === 'assistant'">
                @if (msg.role === 'assistant') {
                  <div class="msg-avatar">AI</div>
                }
                <div class="msg-bubble">
                  <p class="msg-text">{{ msg.text }}</p>
                  <p class="msg-time">{{ msg.timestamp | date:'HH:mm' }}</p>
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="message bot-msg">
                <div class="msg-avatar">AI</div>
                <div class="msg-bubble typing-bubble">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            }
          </div>

          <div class="chat-input">
            <input
              type="text"
              [(ngModel)]="inputText"
              (keydown.enter)="send()"
              placeholder="Ask about products..."
              [disabled]="isLoading()"
              #inputField
            />
            <button class="btn-send" (click)="send()" [disabled]="isLoading() || !inputText.trim()">
              ➤
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .chat-toggle {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #e94560;
      border: none;
      color: #fff;
      font-size: 1.4rem;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(233,69,96,0.4);
      transition: transform 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-toggle:hover { transform: scale(1.08); background: #c73652; }
    .chat-toggle.open { background: #555; box-shadow: none; }
    .lock-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 10px;
      height: 10px;
      background: #ffc107;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .chat-panel {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 360px;
      height: 520px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      z-index: 999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .chat-header {
      background: #1a1a2e;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e94560;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .bot-name { color: #fff; font-size: 0.9rem; font-weight: 600; margin: 0; }
    .bot-status { color: #aaa; font-size: 0.72rem; margin: 0; }
    .btn-clear {
      background: transparent;
      border: none;
      color: #aaa;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }
    .btn-clear:hover { color: #fff; }

    .login-prompt {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      color: #888;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .welcome-msg { color: #888; font-size: 0.88rem; }
    .welcome-msg p { margin-bottom: 8px; }
    .suggestions { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .suggestion-chip {
      background: #f0f4ff;
      border: 1px solid #c5d0ff;
      color: #3949ab;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s;
    }
    .suggestion-chip:hover { background: #dce3ff; }

    .message { display: flex; gap: 8px; align-items: flex-end; }
    .user-msg { flex-direction: row-reverse; }
    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e94560;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.62rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .msg-bubble {
      max-width: 75%;
      padding: 10px 13px;
      border-radius: 16px;
    }
    .bot-msg .msg-bubble {
      background: #f4f6fb;
      border-bottom-left-radius: 4px;
    }
    .user-msg .msg-bubble {
      background: #e94560;
      border-bottom-right-radius: 4px;
    }
    .msg-text {
      margin: 0;
      font-size: 0.87rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .bot-msg .msg-text { color: #1a1a2e; }
    .user-msg .msg-text { color: #fff; }
    .msg-time { margin: 4px 0 0; font-size: 0.68rem; opacity: 0.6; }
    .bot-msg .msg-time { color: #999; }
    .user-msg .msg-time { color: #ffd; text-align: right; }

    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 14px 16px;
    }
    .dot {
      width: 7px;
      height: 7px;
      background: #aaa;
      border-radius: 50%;
      animation: bounce 1.2s infinite;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-6px); }
    }

    .chat-input {
      padding: 12px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      gap: 8px;
    }
    .chat-input input {
      flex: 1;
      border: 1.5px solid #e0e0e0;
      border-radius: 24px;
      padding: 9px 16px;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input input:focus { border-color: #e94560; }
    .chat-input input:disabled { background: #fafafa; }
    .btn-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e94560;
      color: #fff;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .btn-send:hover:not(:disabled) { background: #c73652; }
    .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isOpen    = signal(false);
  isLoading = signal(false);
  messages  = signal<ChatMessage[]>([]);
  inputText = '';

  suggestions = [
    'Find me a blue jacket under €50',
    'What shoes do you have?',
    'Show me black hoodies',
    'What is your cheapest product?'
  ];

  constructor(
    private chatService: ChatService,
    public auth: AuthService
  ) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  clearChat(): void {
    this.messages.set([]);
  }

  sendSuggestion(text: string): void {
    this.inputText = text;
    this.send();
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading()) return;

    this.inputText = '';
    this.isLoading.set(true);

    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    this.messages.update(msgs => [...msgs, userMsg]);

    this.chatService.sendMessage(text).subscribe({
      next: res => {
        const botMsg: ChatMessage = {
          role: 'assistant',
          text: res.reply,
          timestamp: new Date()
        };
        this.messages.update(msgs => [...msgs, botMsg]);
        this.isLoading.set(false);
      },
      error: () => {
        const errMsg: ChatMessage = {
          role: 'assistant',
          text: 'Sorry, I could not connect to the AI. Make sure Ollama is running.',
          timestamp: new Date()
        };
        this.messages.update(msgs => [...msgs, errMsg]);
        this.isLoading.set(false);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }
}