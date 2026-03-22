export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  tags: string[];
}

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange' | 'dark';

export const NOTE_COLORS: { value: NoteColor; label: string; class: string }[] = [
  { value: 'yellow', label: 'Жёлтый', class: 'note-yellow' },
  { value: 'blue', label: 'Синий', class: 'note-blue' },
  { value: 'green', label: 'Зелёный', class: 'note-green' },
  { value: 'pink', label: 'Розовый', class: 'note-pink' },
  { value: 'purple', label: 'Фиолетовый', class: 'note-purple' },
  { value: 'orange', label: 'Оранжевый', class: 'note-orange' },
  { value: 'dark', label: 'Тёмный', class: 'note-dark' },
];
