export type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export type Idea = {
  id: string;
  title: string;
  description?: string;
  discardedReason?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  owner: User;
};
