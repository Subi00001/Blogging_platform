export interface IPostDoc {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string; // User ID
  views: number;
  createdAt: string;
  updatedAt: string;
}
