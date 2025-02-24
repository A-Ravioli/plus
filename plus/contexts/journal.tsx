import React, { createContext, useContext, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './auth';

interface JournalEntry {
  id: string;
  userId: string;
  content: string[];
  createdAt: Date;
  points: number;
}

interface PointsCalculation {
  basePoints: number;
  streakBonus: number;
  qualityBonus: number;
  totalPoints: number;
}

interface JournalContextType {
  postJournal: (entries: string[]) => Promise<void>;
  getUserJournals: () => Promise<JournalEntry[]>;
  getFriendsJournals: (limit?: number, lastDoc?: any) => Promise<JournalEntry[]>;
  calculatePoints: (entries: string[]) => PointsCalculation;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Calculate points based on various factors
  const calculatePoints = (entries: string[]): PointsCalculation => {
    let calculation: PointsCalculation = {
      basePoints: 0,
      streakBonus: 0,
      qualityBonus: 0,
      totalPoints: 0,
    };

    // Base points: 10 points per entry
    calculation.basePoints = entries.length * 10;

    // Quality bonus: Based on entry length and content
    const qualityPoints = entries.reduce((total, entry) => {
      const words = entry.trim().split(/\s+/).length;
      // 1 point for every 3 words, max 10 points per entry
      return total + Math.min(Math.floor(words / 3), 10);
    }, 0);
    calculation.qualityBonus = qualityPoints;

    calculation.totalPoints = calculation.basePoints + calculation.streakBonus + calculation.qualityBonus;
    return calculation;
  };

  const postJournal = async (entries: string[]) => {
    if (!user) throw new Error('User must be authenticated');

    const userRef = firestore().collection('users').doc(user.uid);
    const journalRef = firestore().collection('journals').doc();

    try {
      // Get user data for streak calculation
      const userData = (await userRef.get()).data();
      const lastJournalDate = userData?.lastJournalDate?.toDate() || null;
      const today = new Date();
      
      // Calculate streak
      let streak = userData?.streak || 0;
      if (lastJournalDate) {
        const lastDate = new Date(lastJournalDate);
        const dayDifference = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDifference === 1) {
          // Consecutive day, increase streak
          streak += 1;
        } else if (dayDifference > 1) {
          // Streak broken
          streak = 1;
        }
        // If dayDifference === 0, user already journaled today, streak stays the same
      } else {
        // First journal entry
        streak = 1;
      }

      // Calculate points including streak bonus
      const pointsCalculation = calculatePoints(entries);
      pointsCalculation.streakBonus = Math.min(streak * 5, 50); // Max 50 points streak bonus
      pointsCalculation.totalPoints += pointsCalculation.streakBonus;

      // Batch write to update both journal and user data
      const batch = firestore().batch();

      // Create journal entry
      batch.set(journalRef, {
        userId: user.uid,
        content: entries,
        createdAt: firestore.FieldValue.serverTimestamp(),
        points: pointsCalculation.totalPoints,
        pointsBreakdown: pointsCalculation,
      });

      // Update user data
      batch.update(userRef, {
        lastJournalDate: firestore.FieldValue.serverTimestamp(),
        streak: streak,
        totalJournals: firestore.FieldValue.increment(1),
        points: firestore.FieldValue.increment(pointsCalculation.totalPoints),
      });

      await batch.commit();
    } catch (error) {
      console.error('Error posting journal:', error);
      throw error;
    }
  };

  const getUserJournals = async () => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const snapshot = await firestore()
        .collection('journals')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(30)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as JournalEntry[];
    } catch (error) {
      console.error('Error fetching user journals:', error);
      throw error;
    }
  };

  const getFriendsJournals = async (limit = 50, lastDoc?: any) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      // Get user's friends list
      const userData = (await firestore().collection('users').doc(user.uid).get()).data();
      const friendIds = userData?.friends || [];

      if (friendIds.length === 0) return [];

      // Create base query
      let query = firestore()
        .collection('journals')
        .where('userId', 'in', friendIds)
        .orderBy('createdAt', 'desc')
        .limit(limit);

      // Add startAfter if we have a lastDoc
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      // Get friends' journals
      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as JournalEntry[];
    } catch (error) {
      console.error('Error fetching friends journals:', error);
      throw error;
    }
  };

  const value = {
    postJournal,
    getUserJournals,
    getFriendsJournals,
    calculatePoints,
  };

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
} 