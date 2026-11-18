// TODO - Split model between "Rquest" and "Response" models
// For example IdeaRequest does not have createdAt, updatedAt and is generated upon insertion
// But when retrieving it, it has createdAt, updatedAt, etc.

export const INTERACTION_LOVE = "iloveit";
export const INTERACTION_NOT_USEFUL = "notuseful";
export const INTERACTION_FUNNY = "funny";
export const INTERACTION_SUPPORT = "icanhelp";

export const REACTIONS: string[] = [
  INTERACTION_LOVE,
  INTERACTION_NOT_USEFUL,
  INTERACTION_FUNNY,
  INTERACTION_SUPPORT,
];

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
  slug: string;
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
  reactions: { [key: string]: number };
  myReactions: { [key: string]: boolean };
  teardown?: Teardown;
};

export const VERDICTS = ["worth-reviving", "needs-a-twist", "let-it-go"] as const;
export type Verdict = (typeof VERDICTS)[number];

export type PriorArt = {
  name: string;
  description: string;
  status: "active" | "defunct" | "unknown";
};

// An honest assessment of an idea, generated once when it is shared.
export type Teardown = {
  summary: string;
  priorArt: PriorArt[];
  whyItFails: string[];
  mustBeTrue: string[];
  firstExperiment: string;
  verdict: Verdict;
  verdictReason: string;
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
  flaggedIdeasCount: number;
  reactionsCount: number;
};
