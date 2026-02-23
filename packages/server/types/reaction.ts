export const REACTION_TYPES = {
  like: 'like',
  dislike: 'dislike',
  love: 'love',
  haha: 'haha',
  wow: 'wow',
  sad: 'sad',
  angry: 'angry',
} as const;

export type ReactionType = keyof typeof REACTION_TYPES;
export const REACTION_TYPE_VALUES = Object.values(REACTION_TYPES);
