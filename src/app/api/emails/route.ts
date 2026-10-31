// ============================================
// API Route: /api/emails
// GET  — Retrieve all emails
// PATCH — Update email action (trashed/captured)
// ============================================
//
// ┌─────────────────────────────────────────────────────┐
// │  OAUTH / REAL API INTEGRATION PLACEHOLDER           │
// │                                                     │
// │  To connect to Gmail API:                           │
// │  1. Set up Google Cloud Console project             │
// │  2. Enable Gmail API                                │
// │  3. Create OAuth 2.0 credentials                    │
// │  4. Store credentials in env vars:                  │
// │     - GOOGLE_CLIENT_ID                              │
// │     - GOOGLE_CLIENT_SECRET                          │
// │     - GOOGLE_REDIRECT_URI                           │
// │                                                     │
// │  To connect to Outlook/Microsoft Graph API:         │
// │  1. Register app in Azure AD                        │
// │  2. Set up Mail.Read, Mail.ReadWrite permissions    │
// │  3. Store credentials in env vars:                  │
// │     - AZURE_CLIENT_ID                               │
// │     - AZURE_CLIENT_SECRET                           │
// │     - AZURE_TENANT_ID                               │
// │                                                     │
// │  Replace the emailStore calls below with:           │
// │  - Gmail: googleapis.gmail.users.messages.list()    │
// │  - Outlook: Microsoft Graph /me/messages            │
// └─────────────────────────────────────────────────────┘

import { NextResponse } from 'next/server';
import { emailStore } from '../../../lib/emailStore';

export async function GET() {
  // TODO: Replace with real API call:
  // const gmail = google.gmail({ version: 'v1', auth: oauthClient });
  // const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
  // const emails = await Promise.all(res.data.messages.map(m => gmail.users.messages.get({...})));

  const emails = emailStore.getAll();
  const stats = emailStore.getStats();

  return NextResponse.json({ emails, stats });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { emailId, action } = body;

  if (!emailId || !['trashed', 'captured'].includes(action)) {
    return NextResponse.json(
      { error: 'Invalid request. Provide emailId and action (trashed|captured).' },
      { status: 400 }
    );
  }

  // TODO: Replace with real API call:
  // Gmail:  await gmail.users.messages.trash({ userId: 'me', id: emailId });
  // Outlook: await graphClient.api(`/me/messages/${emailId}`).update({ ... });

  const email = emailStore.markAction(emailId, action);

  if (!email) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  return NextResponse.json({ email, message: `Email ${action} successfully` });
}
