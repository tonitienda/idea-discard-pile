import { Idea, User } from "./model";

export const IdeasIndexById: { [key: string]: Idea } = {};

const usersBySub: { [key: string]: User } = {};

export const addUserToDatabase = async (user: User) => {
  console.log("Adding user to database", user);
  usersBySub[user.sub] = user;
};

export const getUserBySub = async (sub: string): Promise<User | null> => {
  console.log("Existing users:", usersBySub);
  return usersBySub[sub] || null;
};
