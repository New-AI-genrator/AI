import { UserWithoutPassword } from '../types/user';

// In a production app, replace this with a real database connection
let users: UserWithoutPassword[] = [];

export const db = {
  // Find user by email
  async findUserByEmail(email: string): Promise<UserWithoutPassword | undefined> {
    return users.find(user => user.email === email);
  },
  
  // Find user by ID
  async findUserById(id: string): Promise<UserWithoutPassword | undefined> {
    return users.find(user => user.id === id);
  },
  
  // Create user
  async createUser(userData: Omit<UserWithoutPassword, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword> {
    const newUser: UserWithoutPassword = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    return newUser;
  },
  
  // Update user
  async updateUser(id: string, updates: Partial<UserWithoutPassword>): Promise<UserWithoutPassword | undefined> {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
};
