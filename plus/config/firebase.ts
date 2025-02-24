import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  // TODO: Add your Firebase configuration here
  // You can find these values in your Firebase project settings
  apiKey: "AIzaSyDj074vV1sIS0ArGTVjS1phd_7SROToAF0",
  authDomain: "plus-41f70.firebaseapp.com",
  projectId: "plus-41f70",
  // storageBucket: "plus-41f70.firebasestorage.app",
  messagingSenderId: "220947337657",
  appId: "1:220947337657:android:123456789012"
};

export const initializeFirebase = () => {
  try {
    return initializeApp(firebaseConfig);
  } catch (error: any) {
    // Ignore the "app already exists" error in development
    if (error?.message && !/already exists/.test(error.message)) {
      console.error('Firebase initialization error', error.stack);
    }
  }
}; 