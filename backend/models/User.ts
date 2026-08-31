export interface IUserDoc {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  profileImage: string;
  bio: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
