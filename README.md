# Node-SMA (Social Media App Backend)

## Project Overview
Node-SMA is a backend application for a social media platform built with **Node.js** and **Express.js**. It provides APIs for user management, post creation, comments, followers, stories, and customizable feeds. The application is designed with scalability, modularity, and best practices in mind.

---

## Features
- **User Management**: Register, login, update profile, and authentication using JWT.
- **Post Management**: Create, update, delete, and fetch posts with media support.
- **Comments**: Add and fetch comments for posts in real-time using WebSocket.
- **Followers**: Follow/unfollow users and fetch followers/followings with pagination.
- **Stories**: Ephemeral stories that expire after 24 hours.
- **Feeds**: Customizable feeds based on user preferences, trending topics, and hashtags.
- **Search**: Search posts by content or hashtags.
- **Trending**: Fetch trending hashtags and topics.
- **Rate Limiting**: Protect APIs from abuse.
- **Caching**: Redis-based caching for improved performance.

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager, comes with Node.js)
- **MongoDB** (v4.4 or higher)
- **Redis** (for caching and rate limiting)

---

## Setup Instructions
1. Clone the repository

2. Install dependencies : npm install

3. Set up and run MongoDB

4. Run project with : npm start