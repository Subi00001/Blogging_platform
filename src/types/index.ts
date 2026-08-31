export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: IUser | string;
  views: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  post: string | IPost;
  user: IUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: IUser;
}

export interface IPostQuery {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  sort?: 'latest' | 'oldest' | 'comments' | 'views';
  page?: number;
  limit?: number;
}

export interface IPaginatedPosts {
  posts: IPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  categories: { [key: string]: number };
}

export interface IAdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
  recentActivity: {
    type: 'post' | 'comment' | 'user';
    description: string;
    timestamp: string;
    link?: string;
  }[];
}
