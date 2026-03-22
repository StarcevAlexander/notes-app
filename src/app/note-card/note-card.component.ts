import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note, NOTE_COLORS } from '../models/note.model';
import { fadeInOut, flipIn, bounceIn, pulse } from '../animations/animations';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="note-card {{ note().color }}"
      [@flipIn]
      [@pulse]="isHovered ? 'pulsing' : 'normal'"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      (click)="view.emit()"
    >
      <!-- Блик при наведении -->
      <div class="shine-effect" [class.active]="isHovered"></div>

      <!-- Заголовок -->
      <div class="note-header" (click)="$event.stopPropagation()">
        <h3 class="note-title">{{ note().title || 'Без названия' }}</h3>
        <button
          class="pin-btn"
          [class.pinned]="note().isPinned"
          (click)="togglePin.emit(); $event.stopPropagation()"
          [@bounceIn]
        >
          📌
        </button>
      </div>

      <!-- Содержимое -->
      <p class="note-content">{{ note().content }}</p>

      <!-- Теги -->
      @if (note().tags.length > 0) {
        <div class="note-tags" [@fadeInOut]>
          @for (tag of note().tags; track tag) {
            <span class="tag">#{{ tag }}</span>
          }
        </div>
      }

      <!-- Дата -->
      <div class="note-footer">
        <span class="note-date">
          {{ formatDate(note().updatedAt) }}
        </span>

        <!-- Действия -->
        <div class="note-actions" [class.visible]="isHovered">
          <button class="action-btn edit" (click)="edit.emit(); $event.stopPropagation()" title="Редактировать">
            ✏️
          </button>
          <button class="action-btn delete" (click)="delete.emit(); $event.stopPropagation()" title="Удалить">
            🗑️
          </button>
        </div>
      </div>

      <!-- Цветовой индикатор -->
      <div class="color-indicator {{ note().color }}"></div>
    </div>
  `,
  styles: [`
    .note-card {
      position: relative;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 200px;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      &.yellow { background: linear-gradient(135deg, rgba(255, 230, 100, 0.3), rgba(255, 200, 50, 0.2)); }
      &.blue { background: linear-gradient(135deg, rgba(100, 180, 255, 0.3), rgba(50, 150, 255, 0.2)); }
      &.green { background: linear-gradient(135deg, rgba(100, 255, 150, 0.3), rgba(50, 200, 100, 0.2)); }
      &.pink { background: linear-gradient(135deg, rgba(255, 150, 200, 0.3), rgba(255, 100, 180, 0.2)); }
      &.purple { background: linear-gradient(135deg, rgba(180, 120, 255, 0.3), rgba(150, 80, 255, 0.2)); }
      &.orange { background: linear-gradient(135deg, rgba(255, 180, 100, 0.3), rgba(255, 140, 50, 0.2)); }
      &.dark { background: linear-gradient(135deg, rgba(80, 80, 100, 0.4), rgba(50, 50, 70, 0.3)); }
    }

    .shine-effect {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
      pointer-events: none;

      &.active {
        left: 100%;
      }
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .note-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin: 0;
      word-break: break-word;
    }

    .pin-btn {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.2s ease;
      padding: 0.25rem;

      &:hover {
        transform: scale(1.2) rotate(15deg);
      }

      &.pinned {
        opacity: 1;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
      }
    }

    .note-content {
      flex: 1;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      word-break: break-word;
    }

    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .note-date {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .note-actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.visible {
        opacity: 1;
      }
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &.edit {
        background: rgba(100, 200, 255, 0.3);

        &:hover {
          background: rgba(100, 200, 255, 0.6);
          transform: scale(1.15);
        }
      }

      &.delete {
        background: rgba(255, 100, 100, 0.3);

        &:hover {
          background: rgba(255, 100, 100, 0.6);
          transform: scale(1.15);
        }
      }
    }

    .color-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;

      &.yellow { background: linear-gradient(90deg, #ffe664, #ffc832); }
      &.blue { background: linear-gradient(90deg, #64b4ff, #3296ff); }
      &.green { background: linear-gradient(90deg, #64ff96, #32c864); }
      &.pink { background: linear-gradient(90deg, #ff96c8, #ff64b4); }
      &.purple { background: linear-gradient(90deg, #b478ff, #9650ff); }
      &.orange { background: linear-gradient(90deg, #ffb464, #ff8c32); }
      &.dark { background: linear-gradient(90deg, #646482, #46465a); }
    }
  `],
  animations: [fadeInOut, flipIn, bounceIn, pulse]
})
export class NoteCardComponent {
  readonly note = input.required<Note>();
  readonly view = output<void>();
  readonly edit = output<void>();
  readonly delete = output<void>();
  readonly togglePin = output<void>();

  isHovered = false;

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  }
}
