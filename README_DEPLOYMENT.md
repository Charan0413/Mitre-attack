# Vercel Deployment Guide

## 🚀 Deploying MITRE ATT&CK Platform to Vercel

### 📋 Prerequisites
- Vercel account (free tier is sufficient)
- GitHub account (recommended) or manual upload
- All project files prepared as per setup

### 🗂️ Final Project Structure
```
/project
├── app.py                    # Main Flask application
├── api/
│   └── index.py             # Vercel serverless entry point
├── templates/
│   └── index.html           # HTML template
├── static/
│   ├── style.css            # CSS styling
│   └── script.js            # JavaScript functionality
├── database.db              # SQLite database (optional)
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel configuration
├── .vercelignore           # Files to ignore during deployment
└── README_DEPLOYMENT.md     # This file
```

### 🛠️ Deployment Steps

#### Option 1: GitHub Integration (Recommended)
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Flask framework
   - Click "Deploy"

#### Option 2: Manual Upload
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### ⚙️ Configuration Files Created

#### `requirements.txt`
```
Flask==2.3.3
gunicorn==21.2.0
```

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ],
  "functions": {
    "api/index.py": {
      "runtime": "python3.9"
    }
  }
}
```

#### `api/index.py`
```python
from app import app

# Vercel serverless function entry point
def handler(request):
    return app(request.environ, lambda status, headers: None)
```

### 🔧 Key Modifications Made

#### `app.py` Changes
- Added `os` import for path handling
- Added Vercel configuration settings
- Added absolute database path handling
- Added fallback static data for serverless environment
- Added Vercel handler function
- Enhanced error handling for database issues

### ⚠️ Important Notes

#### SQLite Limitations
- **Serverless Environment**: SQLite has limitations in serverless environments
- **Read-Only**: Database becomes read-only on Vercel
- **Fallback**: Application uses static data if database fails
- **Recommendation**: Consider migrating to a cloud database for production

#### Static File Handling
- Templates and static files work correctly
- CSS and JavaScript are served properly
- No additional configuration needed

#### Environment Variables
- No environment variables required for basic functionality
- Database path is automatically resolved

### 🧪 Testing After Deployment

1. **Homepage Test**
   - Visit your Vercel URL
   - Should load the main interface

2. **API Test**
   - Visit `{your-url}/attack`
   - Should return JSON data

3. **Health Check**
   - Visit `{your-url}/health`
   - Should return health status

### 🔄 Updates and Redeployment

#### Automatic Updates (GitHub)
- Push changes to GitHub
- Vercel automatically redeploys

#### Manual Updates
```bash
vercel --prod
```

### 🐛 Troubleshooting

#### Common Issues
1. **404 Errors**
   - Check `vercel.json` routing
   - Verify `api/index.py` exists

2. **Build Failures**
   - Check `requirements.txt` format
   - Verify Python version compatibility

3. **Database Issues**
   - Application will fallback to static data
   - Check console logs for database errors

4. **Static File Issues**
   - Verify `templates/` and `static/` folders exist
   - Check file names are correct

#### Debug Commands
```bash
# Check deployment logs
vercel logs

# Check build output
vercel build

# Local testing
vercel dev
```

### 🌐 Production Considerations

#### Database Migration
For production use, consider:
- PostgreSQL via Vercel Postgres
- MongoDB via MongoDB Atlas
- Supabase
- PlanetScale

#### Performance Optimization
- Enable caching headers
- Optimize static files
- Consider CDN for static assets

#### Security
- Add environment variables for sensitive data
- Implement rate limiting
- Add authentication if needed

### 📊 Monitoring

#### Vercel Analytics
- Built-in performance monitoring
- Visitor analytics
- Error tracking

#### Health Monitoring
- Use `/health` endpoint
- Monitor API response times
- Check error rates

### 🎉 Success Indicators

Your deployment is successful when:
- ✅ Homepage loads at your Vercel URL
- ✅ All three tabs work (Home, Simulation, Defense)
- ✅ Attack simulation runs correctly
- ✅ API endpoints return proper data
- ✅ No 404 errors in browser console
- ✅ Responsive design works on mobile

### 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all files are present
3. Test locally with `vercel dev`
4. Review this guide for missed steps

Your MITRE ATT&CK platform is now ready for Vercel deployment! 🚀
