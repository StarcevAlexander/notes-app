import { Injectable, signal, computed } from '@angular/core';
import { Note, NoteColor } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly STORAGE_KEY = 'notes-app-data';

  private notesSignal = signal<Note[]>(this.loadNotes());

  readonly notes = computed(() => this.notesSignal());
  readonly pinnedNotes = computed(() =>
    this.notesSignal().filter(n => n.isPinned).sort((a, b) => b.updatedAt - a.updatedAt)
  );
  readonly regularNotes = computed(() =>
    this.notesSignal().filter(n => !n.isPinned).sort((a, b) => b.updatedAt - a.updatedAt)
  );

  private loadNotes(): Note[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveNotes(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notesSignal()));
  }

  createNote(title: string, content: string, color: NoteColor = 'yellow', tags: string[] = []): Note {
    const now = Date.now();
    const note: Note = {
      id: this.generateId(),
      title,
      content,
      color,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      tags
    };
    this.notesSignal.update(notes => [note, ...notes]);
    this.saveNotes();
    return note;
  }

  updateNote(id: string, updates: Partial<Note>): void {
    this.notesSignal.update(notes =>
      notes.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
    this.saveNotes();
  }

  deleteNote(id: string): void {
    this.notesSignal.update(notes => notes.filter(n => n.id !== id));
    this.saveNotes();
  }

  togglePin(id: string): void {
    this.notesSignal.update(notes =>
      notes.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
          : note
      )
    );
    this.saveNotes();
  }

  searchNotes(query: string): Note[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return this.notesSignal();

    return this.notesSignal().filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getTags(): string[] {
    const allTags = this.notesSignal().flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
