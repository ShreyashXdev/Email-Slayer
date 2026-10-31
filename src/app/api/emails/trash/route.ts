// ============================================
// API Route: /api/emails/trash
// POST — Move a captured email to trash
// ============================================
//
// ┌─────────────────────────────────────────────────────┐
// │  REAL API INTEGRATION PLACEHOLDER                   │
// │                                                     │
// │  Gmail:                                             │
// │    await gmail.users.messages.trash({               │
// │      userId: 'me',                                  │
// │      id: emailId                                    │
// │    });                                              │
// │                                                     │
// │  Outlook (Microsoft Graph):                         │
// │    await graphClient                                │
// │      .api(`/me/messages/${emailId}/move`)            │
// │      .post({ destinationId: 'deleteditems' });      │
// │                                                     │
// │  IMAP:                                              │
// │    await imapClient.moveMessage(emailId, 'Trash');  │
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
    const email = emailStore.moveToTrash(emailId);

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      message: `Email from "${email.sender}" moved to trash`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
