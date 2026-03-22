import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from './services/notes.service';
import { Note, NOTE_COLORS, NoteColor } from './models/note.model';
import { NoteCardComponent } from './note-card/note-card.component';
import { NoteEditorModalComponent } from './note-editor-modal/note-editor-modal.component';
import { NoteViewModalComponent } from './note-view-modal/note-view-modal.component';
import {
  fadeInOut,
  slideInLeft,
  slideInUp,
  bounceIn,
  listAnimation,
  pulse
} from './animations/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteCardComponent, NoteEditorModalComponent, NoteViewModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [fadeInOut, slideInLeft, slideInUp, bounceIn, listAnimation, pulse]
})
export class App {
  readonly title = 'Мои Заметки';

  private notesService = inject(NotesService);

  readonly notes = this.notesService.notes;
  readonly pinnedNotes = this.notesService.pinnedNotes;
  readonly regularNotes = this.notesService.regularNotes;

  readonly searchQuery = signal('');
  readonly selectedTag = signal<string | null>(null);
  readonly isEditorOpen = signal(false);
  readonly isViewOpen = signal(false);
  readonly editingNote = signal<Note | null>(null);
  readonly viewingNote = signal<Note | null>(null);
  readonly isHovering = signal(false);

  readonly allTags = computed(() => this.notesService.getTags());

  readonly filteredPinnedNotes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const tag = this.selectedTag();

    return this.pinnedNotes().filter((note: Note) => {
      const matchesSearch = !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((t: string) => t.toLowerCase().includes(query));
      const matchesTag = !tag || note.tags.includes(tag);
      return matchesSearch && matchesTag;
    });
  });

  readonly filteredRegularNotes = computed(() => {
    const query = this.searchQuery();
    const tag = this.selectedTag();

    return this.regularNotes().filter((note: Note) => {
      const matchesSearch = !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((t: string) => t.toLowerCase().includes(query));
      const matchesTag = !tag || note.tags.includes(tag);
      return matchesSearch && matchesTag;
    });
  });

  readonly stats = computed(() => ({
    total: this.notes().length,
    pinned: this.pinnedNotes().length,
    withTags: this.notes().filter((n: Note) => n.tags.length > 0).length
  }));

  openEditor(note?: Note): void {
    this.viewingNote.set(null);
    this.isViewOpen.set(false);
    this.editingNote.set(note || null);
    this.isEditorOpen.set(true);
  }

  closeEditor(): void {
    this.isEditorOpen.set(false);
    this.editingNote.set(null);
  }

  viewNote(note: Note): void {
    this.editingNote.set(null);
    this.isEditorOpen.set(false);
    this.viewingNote.set(note);
    this.isViewOpen.set(true);
  }

  closeView(): void {
    this.isViewOpen.set(false);
    this.viewingNote.set(null);
  }

  saveNote(title: string, content: string, color: NoteColor, tags: string[]): void {
    if (this.editingNote()) {
      this.notesService.updateNote(this.editingNote()!.id, { title, content, color, tags });
    } else {
      this.notesService.createNote(title, content, color, tags);
    }
    this.closeEditor();
  }

  deleteNote(note: Note): void {
    this.notesService.deleteNote(note.id);
  }

  togglePin(note: Note): void {
    this.notesService.togglePin(note.id);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedTag.set(null);
  }

  selectTag(tag: string | null): void {
    this.selectedTag.set(tag === this.selectedTag() ? null : tag);
  }
}
