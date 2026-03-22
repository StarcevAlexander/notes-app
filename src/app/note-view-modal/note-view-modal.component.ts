import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note, NOTE_COLORS } from '../models/note.model';
import { fadeInOut, slideInUp, bounceIn } from '../animations/animations';

@Component({
  selector: 'app-note-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()" [@fadeInOut]>
      <div class="modal-overlay" (click)="close.emit()"></div>

      <div class="modal-content {{ note().color }}" [@slideInUp] (click)="$event.stopPropagation()">
        <!-- Заголовок модального окна -->
        <div class="modal-header">
          <h2>
            @if (note().isPinned) {
              <span class="pinned-badge">📌 </span>
            }
            {{ note().title || 'Без названия' }}
          </h2>
          <div class="header-actions">
            <button
              class="icon-btn"
              (click)="togglePin.emit()"
              [title]="note().isPinned ? 'Открепить' : 'Закрепить'"
              [@bounceIn]
            >
              {{ note().isPinned ? '📌' : '📍' }}
            </button>
            <button class="close-btn" (click)="close.emit()" [@bounceIn]>
              ✕
            </button>
          </div>
        </div>

        <!-- Мета-информация -->
        <div class="note-meta">
          <span class="meta-item">
            <span class="meta-icon">📅</span>
            <span>Создано: {{ formatDate(note().createdAt) }}</span>
          </span>
          <span class="meta-item">
            <span class="meta-icon">✏️</span>
            <span>Изменено: {{ formatDate(note().updatedAt) }}</span>
          </span>
        </div>

        <!-- Содержимое -->
        <div class="note-body">
          <p class="note-text">{{ note().content || 'Нет содержимого' }}</p>
        </div>

        <!-- Теги -->
        @if (note().tags.length > 0) {
          <div class="note-tags">
            <span class="tags-label">Теги:</span>
            <div class="tags-list">
              @for (tag of note().tags; track tag) {
                <span class="tag-chip">#{{ tag }}</span>
              }
            </div>
          </div>
        }

        <!-- Кнопки действий -->
        <div class="modal-actions">
          <button class="btn btn-edit" (click)="edit.emit()" [@bounceIn]>
            <span class="btn-icon">✏️</span>
            <span>Редактировать</span>
          </button>
          <button class="btn btn-delete" (click)="delete.emit()" [@bounceIn]>
            <span class="btn-icon">🗑️</span>
            <span>Удалить</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
    }

    .modal-content {
      position: relative;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);

      &.yellow { background: linear-gradient(135deg, rgba(255, 230, 100, 0.35), rgba(255, 200, 50, 0.25)); }
      &.blue { background: linear-gradient(135deg, rgba(100, 180, 255, 0.35), rgba(50, 150, 255, 0.25)); }
      &.green { background: linear-gradient(135deg, rgba(100, 255, 150, 0.35), rgba(50, 200, 100, 0.25)); }
      &.pink { background: linear-gradient(135deg, rgba(255, 150, 200, 0.35), rgba(255, 100, 180, 0.25)); }
      &.purple { background: linear-gradient(135deg, rgba(180, 120, 255, 0.35), rgba(150, 80, 255, 0.25)); }
      &.orange { background: linear-gradient(135deg, rgba(255, 180, 100, 0.35), rgba(255, 140, 50, 0.25)); }
      &.dark { background: linear-gradient(135deg, rgba(80, 80, 100, 0.45), rgba(50, 50, 70, 0.35)); }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .modal-header h2 {
      font-size: 1.5rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.95);
      word-break: break-word;
    }

    .pinned-badge {
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 100, 100, 0.3);
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 100, 100, 0.6);
        transform: rotate(90deg) scale(1.1);
      }
    }

    .note-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .meta-icon {
      font-size: 1rem;
    }

    .note-body {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .note-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.05rem;
      line-height: 1.8;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .note-tags {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
    }

    .tags-label {
      display: block;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.75rem;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag-chip {
      padding: 0.4rem 0.9rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4));
      border: 1px solid rgba(165, 180, 252, 0.5);
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.95);
      font-size: 0.85rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;

      &.btn-edit {
        background: linear-gradient(135deg, rgba(100, 200, 255, 0.3), rgba(100, 180, 255, 0.4));
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.5), rgba(100, 180, 255, 0.6));
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 20px rgba(100, 180, 255, 0.4);
        }
      }

      &.btn-delete {
        background: linear-gradient(135deg, rgba(255, 100, 100, 0.3), rgba(255, 80, 80, 0.4));
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, rgba(255, 100, 100, 0.5), rgba(255, 80, 80, 0.6));
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 20px rgba(255, 100, 100, 0.4);
        }
      }
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    // Scrollbar
    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  `],
  animations: [fadeInOut, slideInUp, bounceIn]
})
export class NoteViewModalComponent {
  readonly note = input.required<Note>();
  readonly close = output<void>();
  readonly edit = output<void>();
  readonly delete = output<void>();
  readonly togglePin = output<void>();

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
