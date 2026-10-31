// ============================================
// Email State Store — In-Memory State Manager
// ============================================

import { Email } from '../types';
import { mockEmails } from './mockEmails';

class EmailStore {
  private emails: Email[];

  constructor() {
    this.emails = JSON.parse(JSON.stringify(mockEmails));
  }

  getAll(): Email[] {
    return [...this.emails];
  }

  getUnread(): Email[] {
    return this.emails.filter(e => e.status === 'unread');
  }

  getCaptured(): Email[] {
    return this.emails.filter(e => e.action === 'captured');
  }

  getTrashed(): Email[] {
    return this.emails.filter(e => e.action === 'trashed');
  }

  getById(id: string): Email | undefined {
    return this.emails.find(e => e.id === id);
  }

  markAction(id: string, action: 'trashed' | 'captured'): Email | undefined {
    const email = this.emails.find(e => e.id === id);
    if (email) {
      email.action = action;
      email.status = action;
    }
    return email;
  }

  // Final dashboard actions
  moveToTrash(id: string): Email | undefined {
    const email = this.emails.find(e => e.id === id);
    if (email) {
      email.status = 'trashed';
      email.action = 'trashed';
    }
    return email;
  }

  archiveEmail(id: string): Email | undefined {
    const email = this.emails.find(e => e.id === id);
    if (email) {
      email.status = 'archived';
    }
    return email;
  }

  reset(): void {
    this.emails = JSON.parse(JSON.stringify(mockEmails));
  }

  getStats() {
    return {
      total: this.emails.length,
      killed: this.emails.filter(e => e.action === 'trashed').length,
      captured: this.emails.filter(e => e.action === 'captured').length,
      archived: this.emails.filter(e => e.status === 'archived').length,
    };
  }
}

// Singleton — shared across API routes
export const emailStore = new EmailStore();
