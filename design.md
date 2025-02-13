# Gratitude Twitterified App - Design Document

## Overview
This mobile app is a twitter-inspired gratitude journaling solution built with React Native and Expo. Its goal is to let users post daily bullet list "threads" of things that went well, include photos/videos, and view similar posts from their mutual friends. The app features a simple login system, a focused daily journaling screen, and a timeline that only shows posts from trusted connections, along with push notifications to remind users to post each day.

## Key Features
- Simple login with a unique username and password.
- Daily gratitude journaling screen with the prompt "What went well today?".
- Bullet list formatting for journaling posts.
- Ability to attach photos and videos to posts.
- A Twitter-like feed displaying expandable threads of mutual friends' posts.
- In-app notifications when a friend posts.

## File Structure

```
.
├── App.js
├── design.md
├── package.json
├── assets/
│   ├── images/         # Static images for the app
│   └── videos/         # Static videos or placeholders
├── screens/
│   ├── LoginScreen.js       # Handles user authentication (login/signup)
│   ├── HomeScreen.js        # Displays the timeline of gratitude posts
│   └── CreatePostScreen.js  # Interface for journaling gratitude and adding media
├── components/
│   ├── GratitudeInput.js    # Text input component with prompt and bullet creation
│   ├── PostListItem.js      # Single post view in the feed
│   ├── ExpandableThread.js  # Expands to show full details of a post thread
│   └── MediaPicker.js       # Component to select and attach photos/videos
├── navigation/
│   ├── AuthNavigator.js     # Navigation logic for authentication flow
│   └── AppNavigator.js      # Main navigation for the authenticated parts of the app
├── services/
│   ├── ApiService.js        # Handles API requests (posting/fetching posts, etc.)
│   ├── AuthService.js       # Manages user login/signup and session handling
│   ├── NotificationService.js  # Integrates with Expo notifications
│   └── FriendshipService.js    # Filters posts to show only mutual friends' content
└── utils/
    └── helpers.js           # Utility functions (formatting, bullet list processing, etc.)
```

## File Descriptions

### App.js
- Entry point of the application. Sets up global providers (state management, navigation, and notifications) and renders the main navigator (AppNavigator or AuthNavigator based on authentication state).

### package.json
- Lists project dependencies including Expo, React, React Native, React Navigation, etc.

### assets/
- Contains static assets like images and videos used by the app and for placeholder content.

### screens/
- LoginScreen.js: Provides UI for user authentication. Implements a simple form for a unique username and a password. Communicates with AuthService for login/signup operations.
- HomeScreen.js: Displays a Twitter-like timeline with gratitude threads from mutual friends. Uses components like PostListItem and ExpandableThread to present posts.
- CreatePostScreen.js: Presents an input form with the prompt "What went well today?". Initially shows only the text input. Once at least one bullet is added, the interface reveals additional options such as expanding the text area, attaching media, and finally posting.

### components/
- GratitudeInput.js: A text input component for journaling. It allows users to enter bullet points and supports a simple UI to add multiple entries.
- PostListItem.js: Renders a preview of a gratitude post for the timeline, including truncated bullet points and media thumbnails.
- ExpandableThread.js: Wraps the PostListItem to allow expansion on tap, displaying full details and the complete thread.
- MediaPicker.js: Provides functionality to attach photos and videos by integrating with the device's media library. Works with the CreatePostScreen to update the post with media content.

### navigation/
- AuthNavigator.js: Manages navigation flow prior to authentication. Separates login and signup screens (if needed) from the main app.
- AppNavigator.js: Holds the routing for the core functionalities of the app such as the HomeScreen and CreatePostScreen. Ensures only authenticated users can access these screens.

### services/
- ApiService.js: Contains functions to make API calls for posting new gratitude entries, fetching posts for the timeline, and interacting with the backend server.
- AuthService.js: Handles user authentication operations, including signup, login, session persistence, and logout.
- NotificationService.js: Integrates with Expo's notification APIs to send and receive notifications. Sends reminders whenever a friend posts a new gratitude update.
- FriendshipService.js: Ensures that only posts from mutual friends are fetched and visible to the user by checking friendship status.

### utils/
- helpers.js: Contains helper functions for formatting dates, processing user input (like bullet formatting), and any general utility logic required across the app.

## Additional Considerations
- Login: The authentication mechanism will use a simple unique username and password. Consider using secure token storage for session management.
- Media Handling: Leverage Expo's media libraries for a smoother integration with the device's image and video pickers.
- Notifications: Use Expo Notifications for cross-platform push notifications. Make sure to handle permissions appropriately.
- State Management: For simplicity, React Context can be used; however, consider Redux if the state management grows more complex.
- API/Backend: Initially, you might use a local server or Firebase as the backend. The ApiService should be designed to be easily replaceable depending on the backend choice.

This design document lists the application structure and provides a roadmap for file creation, ensuring all functionalities are modular and maintainable.

