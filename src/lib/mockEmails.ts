// ============================================
// Mock Email Data — 20 Unread Emails
// ============================================

import { Email } from '../types';

export const mockEmails: Email[] = [
  { id: '1',  sender: 'LinkedIn',         subject: 'You have 5 new connection requests',          status: 'unread' },
  { id: '2',  sender: 'Amazon',           subject: 'Your order has been shipped!',                status: 'unread' },
  { id: '3',  sender: 'John Doe',         subject: 'Quick question about the project',            status: 'unread' },
  { id: '4',  sender: 'GitHub',           subject: '[inbox-slayer] New pull request #42',         status: 'unread' },
  { id: '5',  sender: 'Netflix',          subject: 'New arrivals you might like',                 status: 'unread' },
  { id: '6',  sender: 'Spotify',          subject: 'Your weekly playlist is ready',               status: 'unread' },
  { id: '7',  sender: 'Jane Smith',       subject: 'Meeting tomorrow at 3 PM',                    status: 'unread' },
  { id: '8',  sender: 'Uber Eats',        subject: 'Hungry? 30% off your next order',             status: 'unread' },
  { id: '9',  sender: 'Google',           subject: 'Security alert: New sign-in detected',        status: 'unread' },
  { id: '10', sender: 'Twitter/X',        subject: 'You have 12 new notifications',               status: 'unread' },
  { id: '11', sender: 'Slack',            subject: 'Sarah mentioned you in #general',             status: 'unread' },
  { id: '12', sender: 'Medium',           subject: 'Daily digest: Top stories for you',           status: 'unread' },
  { id: '13', sender: 'PayPal',           subject: 'You received a payment of $50.00',            status: 'unread' },
  { id: '14', sender: 'Boss Man',         subject: 'URGENT: Q4 Report needed by EOD',             status: 'unread' },
  { id: '15', sender: 'Discord',          subject: 'You missed 47 messages in Dev Chat',          status: 'unread' },
  { id: '16', sender: 'Adobe',            subject: 'Your Creative Cloud subscription renews soon', status: 'unread' },
  { id: '17', sender: 'Mom',              subject: 'Call me when you get a chance ❤️',             status: 'unread' },
  { id: '18', sender: 'Duolingo',         subject: '🦉 Your streak is about to end!',             status: 'unread' },
  { id: '19', sender: 'Newsletter Bot',   subject: 'This Week in AI: GPT-5 rumors and more',     status: 'unread' },
  { id: '20', sender: 'Steam',            subject: 'The Autumn Sale is HERE — up to 90% off',    status: 'unread' },
];
