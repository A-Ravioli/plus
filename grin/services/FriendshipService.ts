interface FriendshipStatus {
  status: 'pending' | 'accepted' | 'rejected';
  initiator: string;
  timestamp: string;
}

// Temporary in-memory storage until we implement a proper backend
const MOCK_FRIENDSHIPS: Record<string, Record<string, FriendshipStatus>> = {
  john: {
    sarah: { status: 'accepted', initiator: 'john', timestamp: new Date().toISOString() },
    mike: { status: 'accepted', initiator: 'mike', timestamp: new Date().toISOString() }
  },
  sarah: {
    john: { status: 'accepted', initiator: 'john', timestamp: new Date().toISOString() },
    mike: { status: 'pending', initiator: 'sarah', timestamp: new Date().toISOString() }
  },
  mike: {
    john: { status: 'accepted', initiator: 'mike', timestamp: new Date().toISOString() },
    sarah: { status: 'pending', initiator: 'sarah', timestamp: new Date().toISOString() }
  }
};

class FriendshipService {
  async sendFriendRequest(fromUsername: string, toUsername: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Initialize user's friendship records if they don't exist
    MOCK_FRIENDSHIPS[fromUsername] = MOCK_FRIENDSHIPS[fromUsername] || {};
    MOCK_FRIENDSHIPS[toUsername] = MOCK_FRIENDSHIPS[toUsername] || {};

    const status: FriendshipStatus = {
      status: 'pending',
      initiator: fromUsername,
      timestamp: new Date().toISOString()
    };

    // Update both users' friendship records
    MOCK_FRIENDSHIPS[fromUsername][toUsername] = status;
    MOCK_FRIENDSHIPS[toUsername][fromUsername] = status;
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const friendship = MOCK_FRIENDSHIPS[username]?.[friendUsername];
    if (!friendship || friendship.status !== 'pending') {
      throw new Error('No pending friend request found');
    }

    const status: FriendshipStatus = {
      status: 'accepted',
      initiator: friendship.initiator,
      timestamp: new Date().toISOString()
    };

    // Update both users' friendship records
    MOCK_FRIENDSHIPS[username][friendUsername] = status;
    MOCK_FRIENDSHIPS[friendUsername][username] = status;
  }

  async rejectFriendRequest(username: string, friendUsername: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const friendship = MOCK_FRIENDSHIPS[username]?.[friendUsername];
    if (!friendship || friendship.status !== 'pending') {
      throw new Error('No pending friend request found');
    }

    const status: FriendshipStatus = {
      status: 'rejected',
      initiator: friendship.initiator,
      timestamp: new Date().toISOString()
    };

    // Update both users' friendship records
    MOCK_FRIENDSHIPS[username][friendUsername] = status;
    MOCK_FRIENDSHIPS[friendUsername][username] = status;
  }

  async getMutualFriends(username: string): Promise<string[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userFriendships = MOCK_FRIENDSHIPS[username] || {};
    return Object.entries(userFriendships)
      .filter(([_, status]) => status.status === 'accepted')
      .map(([friendUsername]) => friendUsername);
  }

  async areMutuals(username1: string, username2: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const friendship1 = MOCK_FRIENDSHIPS[username1]?.[username2];
    const friendship2 = MOCK_FRIENDSHIPS[username2]?.[username1];

    return (
      friendship1?.status === 'accepted' &&
      friendship2?.status === 'accepted'
    );
  }

  async getPendingRequests(username: string): Promise<string[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userFriendships = MOCK_FRIENDSHIPS[username] || {};
    return Object.entries(userFriendships)
      .filter(([_, status]) => status.status === 'pending' && status.initiator !== username)
      .map(([friendUsername]) => friendUsername);
  }
}

export default new FriendshipService(); 