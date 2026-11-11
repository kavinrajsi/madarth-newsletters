export interface Newsletter {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

// Placeholder issues. Replace with real newsletters (Zoho Campaigns export / API).
export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'n1',
    sender: 'Madarth®',
    subject: 'Musings: Branding in the age of AI',
    preview: 'This month we look at how Indian brands are rethinking identity as AI reshapes creative work.',
    time: '09:34 AM',
    unread: true,
  },
  {
    id: 'n2',
    sender: 'Madarth®',
    subject: 'Case study: Renaflex logo story',
    preview: 'How we named and designed Renaflex, a fibre cement board that makes flexibility look dependable.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 'n3',
    sender: 'Madarth®',
    subject: 'Musings: Why every brand needs a point of view',
    preview: 'A short read on positioning, voice and the cost of sounding like everyone else.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 'n4',
    sender: 'Madarth®',
    subject: 'Festive campaigns that worked',
    preview: 'Five festive-season campaigns from across FMCG, finance and OTT, and what made them land.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 'n5',
    sender: 'Madarth®',
    subject: 'Studio notes: October round-up',
    preview: 'New work, new faces and what the Chennai studio has been reading this month.',
    time: '1 week ago',
    unread: false,
  },
];
