# Plus App Design Document

## 1. Introduction

The Plus App is an Expo-based mobile application that combines elements of a gratitude journal, social networking (similar to Twitter and Bereal), and a gamified point system to encourage daily journaling. Users are reminded to reflect on their day and record their gratitude in linked bullet points (a journaling thread). Once a journal is posted, it becomes visible only to approved friends. Additionally, users are rewarded with points for maintaining a consistent journaling habit.

## 2. Core Features

### 2.1 Gratitude Journaling

- **Prompted Journaling:** Users receive a daily reminder (via push notifications) to record what is going well.
- **Threaded Entries:** Journals are composed of linked bullet points, similar to a Twitter thread, allowing for multi-part entries.
- **Drafts and Posting:** Users can compose entries in drafts and choose when to publish. Once posted, entries are locked for viewing by friends.

### 2.2 Social Feed and Friend System

- **Controlled Visibility:** Only friends can view each other's posted journals.
- **Friend-ing Mechanism:** Users can send friend requests, accept/decline invites, and have a friend list to manage their connections.
- **User Profiles:** Each user has a profile that includes their basic info and point tally.

### 2.3 Point/Reward System

- **Points Accumulation:** Users earn points based on frequency, consistency, and perhaps content quality of their journaling.
- **Gamification:** Points are used to unlock achievements, badges, or new features within the app, incentivizing regular use.
- **Leaderboards and Progress Tracking:** Future iterations might include leaderboards to foster friendly competition.

### 2.4 Notifications

- **Journaling Reminders:** Use Expo's push notifications to remind users to journal at a set time in the evening.
- **Friend Activity:** Notify users when friends post new journals or send friend requests.

## 3. System Architecture

### 3.1 Frontend

- **Built With:** Expo and React Native.
- **UI Components:** Custom components for journaling, social interactions, and notifications, possibly utilizing third-party UI kits (e.g., React Native Paper).

### 3.2 Backend

- **Authentication:** Using Firebase Auth or a custom Node/Express setup for user sign-up/login.
- **Data Storage:** Options include:
  - Cloud Firestore for real-time data handling (journals, friend connections, user profiles).
  - Alternative: A dedicated backend using REST/GraphQL and a traditional SQL/NoSQL database.
- **Push Notifications:** Managed via Expo Notification services.

### 3.3 Data Flow Overview

1. **Journaling Flow:** 
   - User receives a reminder to journal.
   - Enters journal entry in a threaded format.
   - Saves it as a draft, then posts it.
   - Once posted, the journal entry is stored in the backend and becomes visible to friends.

2. **Point System Flow:**
   - On journal post, backend calculates point increment based on criteria (e.g., streaks, completeness).
   - Updates user's point total in their profile.

3. **Friend System Flow:**
   - Users search for and send friend requests.
   - Friend requests are managed in a separate collection/table.
   - Once accepted, the friend relationship is established and used for feed filtering.

## 4. Data Models

### 4.1 User

- user_id (unique identifier)
- username
- email
- profile_picture
- points (cumulative total)
- friends (list of user_ids or reference to a friendship collection)

### 4.2 Journal/Post

- post_id (unique identifier)
- user_id (author reference)
- timestamp
- content (array of bullet points for threaded entries)
- privacy (set to ensure only friends can view once posted)

### 4.3 Friendship

- request_id
- requester_id
- receiver_id
- status (pending, accepted, declined)

## 5. Additional Considerations

- **Offline Capability:** Allow drafting and caching of journal entries when offline, syncing when online.
- **Scalability:** Backend should scale with growth; consider indexing on crucial fields for Firestore or SQL optimization.
- **Security and Privacy:** Journals are private and only shared with friends; implement robust authentication and data access rules.
- **User Experience:** Smooth transitions between drafting, posting, and feedback collection (e.g., points update).

## 6. Third-Party Libraries and Tools

- Expo (for development and notifications)
- React Native (for the mobile app framework)
- Firebase (for authentication, database, and notifications) or alternative backend services
- UI Libraries (React Native Paper, etc.) for rapid UI development

## 7. Roadmap and Milestones

1. **Phase 1 - Core Journaling:**
   - Implement authentication and basic journaling (draft and post).
   - Set up a simple backend (Firebase/Node) for data storage.

2. **Phase 2 - Friend System:**
   - Develop friend request and approval workflows.
   - Integrate user feeds based on friend connections.

3. **Phase 3 - Point System:**
   - Define point algorithm and adjust backend to update points on journal post.
   - Display points on user profiles and consider leaderboards.

4. **Phase 4 - Notifications & Enhancements:**
   - Integrate push notifications for journaling reminders and friend activity.
   - Polish UI/UX based on user feedback.

## 8. Future Directions

- **Advanced Analytics:** Track journaling trends and offer insights to users.
- **Additional Social Features:** Such as commenting, liking, or sharing within secure friend networks.
- **Monetization/Ads:** Explore sustainable revenue if the app scales.

## 9. Backend Database Choice and Setup

To minimize costs while maintaining scalability and ease-of-integration, I recommend using Firebase's Cloud Firestore along with Firebase Authentication and related services. This approach offers several benefits:

- **Cost Efficiency:** Firebase offers a generous free tier (Spark Plan) which is often sufficient for early-stage apps. As usage grows, you only pay for what you use.
- **Real-Time Capabilities:** Firestore supports real-time data syncing which is ideal for social feeds and journaling updates.
- **Ease of Setup:** Quickly integrate with Expo by simply adding Firebase SDKs.
- **Security:** Define and enforce strict Firestore security rules ensuring that only authenticated users can read/write data, and that journal entries are visible only to approved friends.
- **Offline Support:** Firestore provides built-in offline caching, ensuring a smooth user experience even with intermittent connectivity.

**Setup Steps:**
1. Create a Firebase project and enable Firestore and Firebase Authentication.
2. Define collections such as `users`, `journals`, and `friendships`.
3. Configure security rules to restrict access:
   - Only allow users to read/write their own data or data shared by friends.
   - Validate operations like journal posting and friend management via server-side functions if necessary.
4. Consider using Firebase Functions for operations like computing point rewards upon journal posting.

## 10. Detailed Frontend Design and User Flow

### Frontend Framework and Tools
- Build the app using Expo and React Native for rapid development and cross-platform support.
- Use React Navigation to manage the app's screen transitions and bottom tab navigation.
- Leverage UI libraries such as React Native Paper for consistent and attractive components.
- Manage global state (e.g., user authentication, notifications) using Context API or Redux.

### Authentication and Onboarding
- **Login/Signup Flow:**
  - Integrate Firebase Authentication to support email/password, Google, or Apple sign-in options.
  - Use a dedicated login screen that directs new users to an onboarding process (setting up a profile with username and profile picture).
- **Splash Screen:**
  - On app launch, display a splash screen that checks authentication status and directs the user either to the login screen or the home screen.

### Main Navigation and User Flow
- **Home Screen:**
  - Displays the daily journaling prompt if it's the designated time.
  - Once a journal post is published, show a feed of friends' recent entries.
  - Utilize a bottom tab navigator with tabs such as Home, Journal, Friends, and Profile.

- **Journal Composition Screen:**
  - Provide an interface for drafting multi-part journal entries in a threaded bullet point format.
  - Implement auto-save for drafts and a clean UI for editing entries.
  - Upon posting, trigger an update to the backend to record the journal and update the point system.

- **Friend and Social Interaction:**
  - Design screens for searching for friends, sending/receiving friend requests, and managing friend lists.
  - Include a notification center to alert users to relevant activities (new journal posts, friend requests, etc.).

- **Profile and Gamification:**
  - Create a profile screen where users can view personal details, point totals, and journal history.
  - Display achievements and milestones in a visually engaging manner to motivate regular usage.

### Additional User Flow Considerations
- **Push Notifications:**
  - Use Expo's Notification services to send timely reminders for journaling, as well as updates on social interactions.
- **Offline Functionality:**
  - Leverage Firestore's offline persistence to allow users to draft entries and view cached data even without network connectivity.
- **User Experience:**
  - Ensure smooth transitions between screens with clear calls-to-action, such as clearly labeled buttons for posting journals and navigating the friend system.
  - Provide feedback on actions (e.g., animations when posting a journal, visual cues when points are updated).

---

This document serves as a high-level blueprint for developing the Plus app. Each section identifies key components and functionalities required to bring the app from concept to reality, with an emphasis on scalability, user engagement, and a secure social journaling experience.
