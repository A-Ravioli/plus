import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import md5 from 'md5'; // We'll use this to generate Gravatar URLs
import * as Contacts from 'expo-contacts';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  findFriendsFromContacts: () => Promise<Array<{ email: string; username: string }>>;
  sendFriendRequest: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  };

  const checkUsernameAvailable = async (username: string) => {
    const snapshot = await firestore()
      .collection('users')
      .where('username', '==', username.toLowerCase())
      .get();
    
    return snapshot.empty;
  };

  const findFriendsFromContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Contact permission was denied');
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        // Extract all email addresses from contacts
        const contactEmails = data
          .filter(contact => contact.emails && contact.emails.length > 0)
          .map(contact => contact.emails![0].email!.toLowerCase());

        // Query Firestore for users with these emails
        const usersSnapshot = await firestore()
          .collection('users')
          .where('email', 'in', contactEmails)
          .get();

        return usersSnapshot.docs.map(doc => ({
          email: doc.data().email,
          username: doc.data().username,
          userId: doc.id,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error finding friends:', error);
      return [];
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!user) throw new Error('Must be logged in to send friend requests');

    const batch = firestore().batch();
    
    // Add to target user's incoming requests
    batch.update(firestore().collection('users').doc(targetUserId), {
      friendRequests: firestore.FieldValue.arrayUnion({
        userId: user.uid,
        status: 'pending',
        timestamp: firestore.FieldValue.serverTimestamp(),
      }),
    });

    // Add to current user's outgoing requests
    batch.update(firestore().collection('users').doc(user.uid), {
      sentRequests: firestore.FieldValue.arrayUnion({
        userId: targetUserId,
        status: 'pending',
        timestamp: firestore.FieldValue.serverTimestamp(),
      }),
    });

    await batch.commit();
  };

  const signIn = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    // Check username availability first
    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error('Username is already taken');
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await firestore().collection('users').doc(user.uid).set({
        username: username.toLowerCase(),
        displayUsername: username, // Preserve original casing for display
        email: email.toLowerCase(),
        avatarUrl: getGravatarUrl(email),
        points: 0,
        level: 1,
        streak: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastJournalDate: null,
        totalJournals: 0,
        friends: [],
        friendRequests: [],
        sentRequests: [],
      });
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    checkUsernameAvailable,
    findFriendsFromContacts,
    sendFriendRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 