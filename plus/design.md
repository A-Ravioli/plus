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

- **Built With:** Expo and React Native
- **UI Components:** 
  - GlueStack UI for a consistent, accessible, and customizable component system
  - Benefits of using GlueStack:
    - Universal themes and styling system
    - Built-in dark mode support
    - Customizable design tokens
    - Accessibility-first components
    - Type-safe components with TypeScript
  - Key components we'll utilize:
    - `Button`, `Input`, `TextArea` for journaling interface
    - `Avatar`, `Card` for user profiles and journal entries
    - `Toast` for notifications and feedback
    - `Modal` for confirmations and detailed views
    - `Tabs` for navigation between sections
    - `Form` components for authentication flows

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
- GlueStack UI for component library and theming system
- Additional UI utilities as needed for specific features

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

### First Experience with the App
Users should signup and create a unique username. Then, they should be prompted to load in their contacts. They should be able to select specific contacts to add as friends and either invite to the app or add as a friend in the app if they are already a user. Then, they should go to a page where they can select a profile picture. Lastly, they should be prompted to write a journal entry in the bullet format. Once they have written a journal entry, they can post it and see their friends' journals for that day. They can't edit the journal entry once it's posted.

### Frontend Framework and Tools
- Build the app using Expo and React Native for rapid development and cross-platform support
- Use React Navigation to manage the app's screen transitions and bottom tab navigation
- Implement GlueStack UI for a consistent and accessible component system:
  - Set up custom theme configuration
  - Define color tokens and typography system
  - Create reusable component compositions
- Manage global state (e.g., user authentication, notifications) using Context API or Redux

### Authentication and Onboarding
- **Login/Signup Flow:**
  - Use GlueStack's `Form`, `Input`, and `Button` components for authentication screens
  - Create a cohesive visual hierarchy using GlueStack's spacing and layout system
  - Implement form validation using GlueStack's form components
  - Style authentication screens using GlueStack's theme tokens

### Main Navigation and User Flow
- **Home Screen:**
  - Utilize GlueStack's `Card` component for journal entries
  - Implement pull-to-refresh using GlueStack's feedback components
  - Use `Toast` for success/error notifications
  - Create custom layouts using GlueStack's responsive grid system

- **Journal Composition Screen:**
  - Build with GlueStack's `TextArea` and rich text components
  - Implement draft saving with visual feedback using `Toast`
  - Use `Modal` for confirmation dialogs
  - Add rich formatting options using GlueStack's button groups

- **Friend and Social Interaction:**
  - Create friend cards using GlueStack's `Card` and `Avatar` components
  - Implement search with GlueStack's `Input` and filtering components
  - Use `Toast` for friend request notifications
  - Build activity feed using GlueStack's list components

- **Profile and Gamification:**
  - Design profile layout using GlueStack's responsive grid
  - Implement achievements using custom-styled `Badge` components
  - Create point displays using GlueStack's typography system
  - Build settings screens using GlueStack's form components

### UI/UX Guidelines with GlueStack

1. **Theming and Styling:**
   - Define a consistent color palette using GlueStack's theme tokens
   - Create responsive layouts using GlueStack's built-in spacing system
   - Implement dark mode using GlueStack's color mode utilities
   - Use GlueStack's typography scale for consistent text hierarchy

2. **Component Patterns:**
   - Create reusable component compositions for common UI patterns
   - Implement consistent form layouts using GlueStack's form components
   - Use GlueStack's animation utilities for micro-interactions
   - Maintain accessibility through GlueStack's built-in a11y features

3. **Responsive Design:**
   - Utilize GlueStack's breakpoint system for adaptive layouts
   - Implement responsive spacing using theme tokens
   - Create flexible grids for different screen sizes
   - Ensure touch targets meet accessibility guidelines

4. **Performance Considerations:**
   - Lazy load components when possible
   - Implement virtual lists for long scrolling content
   - Use GlueStack's optimized components for better performance
   - Monitor and optimize re-renders using React DevTools

---

This document serves as a high-level blueprint for developing the Plus app. Each section identifies key components and functionalities required to bring the app from concept to reality, with an emphasis on scalability, user engagement, and a secure social journaling experience.
