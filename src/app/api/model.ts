export type Idea = {
  id: string;
  title: string;
  description?: string;
  discardedReason?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  owner: string;
};
