export interface ICommentDoc {
  _id: string;
  post: string; // Post ID
  user: string; // User ID
  content: string;
  createdAt: string;
  updatedAt: string;
}
