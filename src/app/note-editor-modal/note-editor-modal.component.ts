import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note, NoteColor, NOTE_COLORS } from '../models/note.model';
import { fadeInOut, slideInUp, bounceIn, shake, glow } from '../animations/animations';

@Component({
  selector: 'app-note-editor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()" [@fadeInOut]>
      <div class="modal-overlay" (click)="close.emit()"></div>

      <div class="modal-content" [@slideInUp] [@glow]="isTitleFocused() ? 'active' : 'normal'" (click)="$event.stopPropagation()">
        <!-- Заголовок модального окна -->
        <div class="modal-header">
          <h2>{{ note() ? 'Редактировать заметку' : 'Новая заметка' }}</h2>
          <button class="close-btn" (click)="close.emit()" [@bounceIn]>
            ✕
          </button>
        </div>

        <!-- Поле заголовка -->
        <div class="form-group">
          <label class="form-label">Заголовок</label>
          <input
            type="text"
            class="form-input title-input"
            placeholder="Введите заголовок..."
            [(ngModel)]="title"
            (focus)="isTitleFocused.set(true)"
            (blur)="isTitleFocused.set(false)"
            #titleInput
          />
        </div>

        <!-- Поле содержимого -->
        <div class="form-group">
          <label class="form-label">Содержимое</label>
          <textarea
            class="form-input content-input"
            placeholder="Введите текст заметки..."
            [(ngModel)]="content"
            rows="8"
          ></textarea>
        </div>

        <!-- Выбор цвета -->
        <div class="form-group">
          <label class="form-label">Цвет заметки</label>
          <div class="color-picker">
            @for (color of colors; track color.value) {
              <button
                class="color-option {{ color.class }}"
                [class.selected]="selectedColor() === color.value"
                (click)="selectedColor.set(color.value)"
                [@bounceIn]
              >
                @if (selectedColor() === color.value) {
                  <span class="checkmark">✓</span>
                }
              </button>
            }
          </div>
        </div>

        <!-- Теги -->
        <div class="form-group">
          <label class="form-label">Теги</label>
          <div class="tags-input-container">
            <div class="tags-list" [@fadeInOut]>
              @for (tag of tags(); track tag; let i = $index) {
                <span class="tag-chip" [@bounceIn]>
                  #{{ tag }}
                  <button class="remove-tag" (click)="removeTag(i)">×</button>
                </span>
              }
            </div>
            <input
              type="text"
              class="tag-input"
              placeholder="Добавьте тег и нажмите Enter"
              [(ngModel)]="tagInput"
              (keydown.enter)="addTag()"
            />
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="modal-actions">
          <button class="btn btn-cancel" (click)="close.emit()" [@fadeInOut]>
            Отмена
          </button>
          <button
            class="btn btn-save"
            (click)="doSave()"
            [@bounceIn]
            [class.disabled]="!title().trim() && !content().trim()"
          >
            <span class="save-icon">💾</span>
            <span>{{ note() ? 'Сохранить' : 'Создать' }}</span>
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
      background: linear-gradient(135deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 40, 0.98));
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header h2 {
      font-size: 1.5rem;
      margin: 0;
      background: linear-gradient(135deg, #fff, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 100, 100, 0.2);
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 100, 100, 0.5);
        transform: rotate(90deg) scale(1.1);
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      color: #fff;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
      box-sizing: border-box;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        outline: none;
        border-color: rgba(165, 180, 252, 0.8);
        background: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 20px rgba(165, 180, 252, 0.3);
      }
    }

    .title-input {
      font-weight: 600;
    }

    .content-input {
      resize: vertical;
      min-height: 150px;
      line-height: 1.6;
    }

    .color-picker {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .color-option {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      border: 2px solid transparent;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.15) rotate(5deg);
      }

      &.selected {
        border-color: #fff;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        transform: scale(1.2);
      }

      &.note-yellow { background: linear-gradient(135deg, #ffe664, #ffc832); }
      &.note-blue { background: linear-gradient(135deg, #64b4ff, #3296ff); }
      &.note-green { background: linear-gradient(135deg, #64ff96, #32c864); }
      &.note-pink { background: linear-gradient(135deg, #ff96c8, #ff64b4); }
      &.note-purple { background: linear-gradient(135deg, #b478ff, #9650ff); }
      &.note-orange { background: linear-gradient(135deg, #ffb464, #ff8c32); }
      &.note-dark { background: linear-gradient(135deg, #505064, #323246); }
    }

    .checkmark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .tags-input-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
      border: 1px solid rgba(165, 180, 252, 0.5);
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    .remove-tag {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(255, 100, 100, 0.3);
      border: none;
      color: #fff;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 100, 100, 0.6);
        transform: scale(1.2);
      }
    }

    .tag-input {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        outline: none;
        border-color: rgba(165, 180, 252, 0.8);
        box-shadow: 0 0 15px rgba(165, 180, 252, 0.3);
      }
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;

      &.btn-cancel {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      }

      &.btn-save {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);

        &:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.6);
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      }
    }

    .save-icon {
      font-size: 1.2rem;
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
  animations: [fadeInOut, slideInUp, bounceIn, shake, glow]
})
export class NoteEditorModalComponent {
  readonly note = input<Note | null>();
  readonly close = output<void>();
  readonly saveNote = output<{ title: string; content: string; color: NoteColor; tags: string[] }>();

  readonly title = signal('');
  readonly content = signal('');
  readonly selectedColor = signal<NoteColor>('yellow');
  readonly tags = signal<string[]>([]);
  readonly tagInput = signal('');
  readonly isTitleFocused = signal(false);

  readonly colors = NOTE_COLORS;

  constructor() {
    effect(() => {
      const existingNote = this.note();
      if (existingNote) {
        this.title.set(existingNote.title);
        this.content.set(existingNote.content);
        this.selectedColor.set(existingNote.color);
        this.tags.set([...existingNote.tags]);
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.title.set('');
    this.content.set('');
    this.selectedColor.set('yellow');
    this.tags.set([]);
    this.tagInput.set('');
  }

  addTag(): void {
    const tag = this.tagInput().trim().toLowerCase();
    if (tag && !this.tags().includes(tag)) {
      this.tags.set([...this.tags(), tag]);
      this.tagInput.set('');
    }
  }

  removeTag(index: number): void {
    this.tags.set(this.tags().filter((_, i) => i !== index));
  }

  doSave(): void {
    const title = this.title().trim();
    const content = this.content().trim();

    if (!title && !content) return;

    this.saveNote.emit({
      title,
      content,
      color: this.selectedColor(),
      tags: this.tags()
    });
  }
}
