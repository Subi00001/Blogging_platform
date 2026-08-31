import { db } from '../config/db';

export const seedDatabase = () => {
  console.log('🌱 Seeding database with initial sample data...');
  const seeded = db.resetSeed();
  console.log(`✅ Seeded ${seeded.users.length} users, ${seeded.posts.length} posts, and ${seeded.comments.length} comments.`);
  return seeded;
};

// If run standalone: tsx backend/seed/seedData.ts
if (process.argv[1] && process.argv[1].endsWith('seedData.ts')) {
  seedDatabase();
}
