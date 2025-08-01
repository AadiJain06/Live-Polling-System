# Live Polling System

A real-time interactive polling system built with React, Redux, Express.js, and Socket.io. Perfect for educational environments where teachers can create polls and students can answer them in real-time.

## 🚀 Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ Set configurable time limits (10-300 seconds)
- ✅ View live polling results with visual progress bars
- ✅ Ask new questions only when previous poll is complete
- ✅ Real-time chat with students
- ✅ Remove students from the session
- ✅ Beautiful, modern UI with animations

### Student Features
- ✅ Enter unique name on first visit
- ✅ Submit answers once a question is asked
- ✅ View live polling results after submission
- ✅ 60-second time limit with countdown timer
- ✅ Real-time chat with teachers and other students
- ✅ Responsive design for all devices

### Technical Features
- ✅ Real-time communication with Socket.io
- ✅ Redux state management
- ✅ Modern React with hooks
- ✅ Styled-components for styling
- ✅ Framer Motion animations
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Error handling and validation

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   
   # Return to root
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

   Create a `.env` file in the client directory:
   ```env
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎯 Usage

### For Teachers
1. Open the application in your browser
2. Select "I am Teacher"
3. You'll be taken to the Teacher Dashboard
4. Click "Create New Poll" to create a poll
5. Fill in the question, options, and time limit
6. Click "Create Poll" to start the poll
7. View real-time results as students answer
8. Use the chat feature to communicate with students

### For Students
1. Open the application in your browser
2. Select "I am Student"
3. Enter your name when prompted
4. Wait for the teacher to create a poll
5. Select your answer and click "Submit"
6. View the results after submission
7. Use the chat feature to communicate

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set the build command: `npm run build`
   - Set the output directory: `build`
   - Set environment variables:
     ```
     REACT_APP_SERVER_URL=https://your-backend-url.com
     ```

3. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set the build command: `npm run build`
   - Set the publish directory: `build`
   - Set environment variables in Netlify dashboard

### Backend Deployment (Railway/Heroku)

1. **Deploy to Railway**
   - Connect your GitHub repository to Railway
   - Set environment variables:
     ```
     PORT=5000
     CLIENT_URL=https://your-frontend-url.com
     ```

2. **Deploy to Heroku**
   ```bash
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   
   # Deploy
   git push heroku main
   ```

## 📁 Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── styles/        # Global styles
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Express.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Client (.env)**
```env
REACT_APP_SERVER_URL=http://localhost:5000
```

### Customization

- **Time Limits**: Modify the time limit range in `PollCreator.js`
- **UI Colors**: Update the gradient colors in `GlobalStyles.js`
- **Socket Events**: Add new events in `server/index.js`

## 🐛 Troubleshooting

### Common Issues

1. **Socket connection failed**
   - Check if the server is running
   - Verify the `REACT_APP_SERVER_URL` environment variable
   - Check CORS settings in the server

2. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Port conflicts**
   - Change the port in the server `.env` file
   - Update the client environment variable accordingly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Intervue.io for the assignment opportunity
- React and Express.js communities
- Socket.io for real-time functionality
- Framer Motion for animations

---

**Built with ❤️ for the Intervue.io SDE Intern Assignment** 