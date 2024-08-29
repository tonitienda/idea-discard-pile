// TODO - Split model between "Rquest" and "Response" models
// For example IdeaRequest does not have createdAt, updatedAt and is generated upon insertion
// But when retrieving it, it has createdAt, updatedAt, etc.

export type PublicUser = {
  id: string;
  handle: string;
  picture: string;
};

export type User = PublicUser & {
  sub: string;
  email: string;
  name: string;
};

export type Idea = {
  id: string;
  title: string;
  description?: string;
  discardedReason?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  owner: PublicUser;
  moderation?: {};
  isFlagged?: boolean;
};

export type IdeaModeration = {
  ideaId: string;
  ideaProbability: number;
  spamProbability: number;
  spamExplanation: string;
  offensiveProbability: number;
  relevanceProbability: number;
  sentiment: string;
  uniquenessProbability: number;
  clarityProbability: number;
  culturalSensitivity: number;
  engagementPotential: number;
};

export type AdminDashboard = {
  ideasCount: number;
  usersCount: number;
};
