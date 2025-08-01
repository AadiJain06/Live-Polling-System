# Deployment Guide

This guide will help you deploy the Live Polling System to production.

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign up
3. Click "New Project" and import your repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable:
   ```
   REACT_APP_SERVER_URL=https://your-railway-app.railway.app
   ```
6. Deploy!

#### Backend (Railway)
1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure the project:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   PORT=5000
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. Deploy!

### Option 2: Netlify + Heroku

#### Frontend (Netlify)
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign up
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Add environment variable:
   ```
   REACT_APP_SERVER_URL=https://your-heroku-app.herokuapp.com
   ```
7. Deploy!

#### Backend (Heroku)
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set CLIENT_URL=https://your-netlify-app.netlify.app
   ```
4. Deploy:
   ```bash
   git subtree push --prefix server heroku main
   ```

## 🔧 Manual Deployment

### Frontend Build
```bash
cd client
npm install
npm run build
```

### Backend Setup
```bash
cd server
npm install
npm start
```

## 🌐 Environment Variables

### Frontend (.env)
```env
REACT_APP_SERVER_URL=https://your-backend-url.com
```

### Backend (.env)
```env
PORT=5000
CLIENT_URL=https://your-frontend-url.com
```

## 📝 Production Checklist

- [ ] Environment variables are set correctly
- [ ] CORS is configured for production domains
- [ ] SSL certificates are enabled
- [ ] Error handling is in place
- [ ] Logging is configured
- [ ] Performance monitoring is set up

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly in backend
   - Check that the frontend URL matches exactly

2. **Socket Connection Failed**
   - Verify the backend URL in frontend environment
   - Check that the backend is running and accessible

3. **Build Failures**
   - Clear cache and node_modules
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📊 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

### Backend
- Enable compression middleware
- Implement rate limiting
- Use connection pooling
- Monitor memory usage

## 🔒 Security Considerations

- Use HTTPS in production
- Implement proper CORS policies
- Add rate limiting
- Validate all inputs
- Sanitize user data
- Use environment variables for secrets

## 📈 Monitoring

### Recommended Tools
- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: Railway/Heroku logs, Sentry
- **Real-time**: Socket.io monitoring

### Health Checks
- Add `/api/health` endpoint
- Monitor socket connections
- Track poll completion rates
- Monitor response times

---

**Happy Deploying! 🚀** 