
// mockData.js
// Basic hardcoded data used by various components/pages for prototyping.

export const POSTS = [
  {
    id: 1,
    user: { username: 'alice', verified: true },
    location: 'Wonderland',
    likes: 120,
    caption: 'What a beautiful day!',
  },
  {
    id: 2,
    user: { username: 'bob', verified: false },
    location: 'Builder HQ',
    likes: 89,
    caption: 'Can we fix it? Yes we can! 👷‍♂️',
  },
];

export const STORIES = [
  { id: 3, username: 'You', viewed: false, hasLive: false, isYou: true },
  { id: 1, username: 'alice', viewed: false, hasLive: false, isYou: false },
  { id: 2, username: 'bob', viewed: true, hasLive: true, isYou: false },
];

export const SUGGESTED = [
  { id: 1, username: 'charlie', mutualFollowers: 5, following: false },
  { id: 2, username: 'dana', mutualFollowers: 2, following: true },
];

export const MESSAGES = [
  { id: 1, username: 'alice', name: 'Alice', online: true, time: '2h', lastMessage: 'Hey there!', unread: 1 },
  { id: 2, username: 'bob', name: 'Bob', online: false, time: '1d', lastMessage: 'Working hard', unread: 0 },
];

