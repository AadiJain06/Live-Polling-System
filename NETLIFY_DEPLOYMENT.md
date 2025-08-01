# Netlify Deployment Guide

## Prerequisites

1. **Backend Server**: You need to deploy your backend server first. You can use:
   - Heroku
   - Railway
   - Render
   - DigitalOcean App Platform
   - Any other Node.js hosting service

## Step 1: Deploy Backend Server

1. Deploy your `server` folder to your chosen hosting service
2. Get the production URL of your backend (e.g., `https://your-app.herokuapp.com`)

## Step 2: Update Environment Variables

1. Open `netlify.toml`
2. Replace `https://your-backend-server-url.herokuapp.com` with your actual backend URL
3. Example:
   ```toml
   [build.environment]
     REACT_APP_SERVER_URL = "https://your-actual-backend-url.com"
   ```

## Step 3: Deploy to Netlify

### Option A: Deploy via Git (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/build`
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   cd client
   npm install
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=client/build
   ```

## Step 4: Configure Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add:
   - **Key**: `REACT_APP_SERVER_URL`
   - **Value**: Your backend server URL (e.g., `https://your-backend.herokuapp.com`)

## Step 5: Redeploy

After setting environment variables, trigger a new deployment:
1. Go to your Netlify dashboard
2. Click "Trigger deploy" > "Deploy site"

## Troubleshooting

### 404 Errors
- Make sure `_redirects` file is in `client/public/`
- Verify `netlify.toml` has correct redirects

### Socket Connection Issues
- Check that `REACT_APP_SERVER_URL` is set correctly
- Ensure backend server is running and accessible
- Check CORS settings on your backend server

### Build Failures
- Make sure all dependencies are in `package.json`
- Check that Node.js version is compatible (use Node 16+)

## Important Notes

1. **Backend URL**: Make sure your backend server URL is accessible from the internet
2. **CORS**: Your backend server must allow requests from your Netlify domain
3. **Environment Variables**: All environment variables must be prefixed with `REACT_APP_` to be accessible in the React app
4. **Build Directory**: The build output goes to `client/build/`, not the root

## Example Backend CORS Configuration

If you're using Express.js, make sure your backend allows requests from your Netlify domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-netlify-app.netlify.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));
``` 