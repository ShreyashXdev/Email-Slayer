// ============================================
// API Route: /api/emails/archive
// POST — Save/archive a captured email back to inbox
// ============================================
//
// ┌─────────────────────────────────────────────────────┐
// │  REAL API INTEGRATION PLACEHOLDER                   │
// │                                                     │
// │  Gmail:                                             │
// │    await gmail.users.messages.modify({              │
// │      userId: 'me',                                  │
// │      id: emailId,                                   │
// │      requestBody: {                                 │
// │        removeLabelIds: ['UNREAD'],                   │
// │        addLabelIds: ['INBOX']                        │
// │      }                                              │
// │    });                                              │
// │                                                     │
// │  Outlook (Microsoft Graph):                         │
// │    await graphClient                                │
// │      .api(`/me/messages/${emailId}`)                 │
// │      .update({ isRead: true });                     │
// │                                                     │
// │  IMAP:                                              │
// │    await imapClient.addFlags(emailId, ['\\Seen']);   │
// └─────────────────────────────────────────────────────┘

import { NextResponse } from 'next/server';
import { emailStore } from '../../../../lib/emailStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailId } = body;

    if (!emailId) {
      return NextResponse.json(
        { error: 'emailId is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with real API call (see placeholder above)
    const email = emailStore.archiveEmail(emailId);

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      message: `Email from "${email.sender}" archived/saved`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
