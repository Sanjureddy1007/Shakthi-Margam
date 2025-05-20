# Shakti Margam: Deployment Guide

This guide provides step-by-step instructions for deploying the Shakti Margam AI assistant to make it accessible online.

## Option 1: Deploying to Vercel (Recommended)

Vercel offers a straightforward deployment process for React applications and provides a generous free tier.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (can sign up with your GitHub account)
- Node.js installed locally

### Deployment Steps

1. **Prepare the project for deployment**

```bash
# Navigate to the project directory
cd /workspace/shakti-margam

# Ensure all dependencies are installed
npm install

# Build the project
npm run build
```

2. **Initialize Git repository (if not already done)**

```bash
# Initialize git repository
git init

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit of Shakti Margam AI assistant"
```

3. **Push to GitHub**

Create a new repository on GitHub, then:

```bash
# Add the remote repository
git remote add origin https://github.com/your-username/shakti-margam.git

# Push to GitHub
git push -u origin main
```

4. **Deploy on Vercel**

- Go to [Vercel](https://vercel.com/)
- Sign in with your GitHub account
- Click "New Project"
- Import your shakti-margam repository
- Keep the default settings (Vercel automatically detects React projects)
- Click "Deploy"

Your project will be deployed and available at `https://shakti-margam.vercel.app` (or a similar URL provided by Vercel).

## Option 2: Deploying to Netlify

Netlify is another excellent option for deploying React applications.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Netlify account (can sign up with your GitHub account)

### Deployment Steps

1. **Prepare the build as in Option 1**

2. **Create a netlify.toml file in the project root**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Push to GitHub as in Option 1**

4. **Deploy on Netlify**

- Go to [Netlify](https://netlify.com/)
- Sign in with your GitHub account
- Click "New site from Git"
- Select your GitHub repository
- Keep the default build settings (they should match your netlify.toml)
- Click "Deploy site"

Your project will be available at a URL like `https://shakti-margam.netlify.app` or with a custom generated name.

## Option 3: Setting up a Custom Domain

After deploying to either Vercel or Netlify, you can add a custom domain for a more professional appearance.

### Steps for Adding a Custom Domain

1. **Purchase a domain** from a registrar like Namecheap, GoDaddy, or Google Domains (e.g., `shaktimargam.ai`)

2. **Add the domain to your hosting provider**:
   - In Vercel: Navigate to your project → Settings → Domains → Add Domain
   - In Netlify: Navigate to your project → Settings → Domain management → Add custom domain

3. **Configure DNS settings** at your domain registrar following the instructions provided by Vercel/Netlify

4. **Wait for DNS propagation** (can take up to 48 hours, but usually much faster)

5. **Set up HTTPS** (both Vercel and Netlify provide free SSL certificates automatically)

## Important Post-Deployment Steps

After deploying Shakti Margam, take these essential steps:

1. **Test thoroughly** on the live environment
   - Test all key features and modules
   - Test on different devices and browsers
   - Verify that the AI assistant responds correctly

2. **Set up analytics** to monitor usage
   - Add Google Analytics or a similar tool
   - Track key metrics like user engagement and feature usage

3. **Implement monitoring**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Configure error tracking (e.g., Sentry)

4. **Create a feedback mechanism**
   - Add a feedback form for Telangana women entrepreneurs
   - Collect and address initial user feedback

5. **Update documentation with the live URL**
   - Update all documentation to refer to the live deployment
   - Create user guides with screenshots from the live system

## Estimated Deployment URL

After following these steps, your Shakti Margam AI assistant will be available at:

- Vercel: `https://shakti-margam.vercel.app`
- Netlify: `https://shakti-margam.netlify.app`
- Custom domain (recommended): `https://shaktimargam.ai`

This makes the AI assistant globally accessible, allowing women entrepreneurs in Telangana to benefit from the specialized guidance it provides.