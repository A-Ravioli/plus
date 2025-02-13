import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
}

// Temporary in-memory storage until we implement a proper backend
const MOCK_USERS: Record<string, { username: string; password: string }> = {
  john: { username: 'john', password: 'password123' },
  sarah: { username: 'sarah', password: 'password123' },
  mike: { username: 'mike', password: 'password123' },
};

class AuthService {
  private static readonly USER_STORAGE_KEY = '@user';
  private currentUser: User | null = null;

  constructor() {
    // Load user from storage on initialization
    this.loadUserFromStorage();
  }

  private async loadUserFromStorage() {
    try {
      const userJson = await AsyncStorage.getItem(AuthService.USER_STORAGE_KEY);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  }

  private async saveUserToStorage(user: User) {
    try {
      await AsyncStorage.setItem(AuthService.USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  async login(username: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowercaseUsername = username.toLowerCase();
    const user = MOCK_USERS[lowercaseUsername];

    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }

    this.currentUser = { username: user.username };
    await this.saveUserToStorage(this.currentUser);
    return this.currentUser;
  }

  async signup(username: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowercaseUsername = username.toLowerCase();
    
    if (MOCK_USERS[lowercaseUsername]) {
      throw new Error('Username already taken');
    }

    // Add to mock database
    MOCK_USERS[lowercaseUsername] = { username: lowercaseUsername, password };

    this.currentUser = { username: lowercaseUsername };
    await this.saveUserToStorage(this.currentUser);
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem(AuthService.USER_STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUser) {
      await this.loadUserFromStorage();
    }
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  }
}

export default new AuthService(); 