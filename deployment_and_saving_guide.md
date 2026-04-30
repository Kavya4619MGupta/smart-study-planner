# Deployment and Saving Guide

This guide covers how to save your changes to the project, how to address the "bootstrap/changes not reflecting" issue, and how to set up automatic deployment.

## 1. How to Save Your Changes (Git)
To permanently save your changes so you don't lose them, you should use **Git**. The project already has a `.git` folder initialized.

Open a terminal in the root folder (`c:\Users\VICTUS\Downloads\smart-study-planner\smart-study-planner`) and run the following commands:

```bash
# 1. Add all the modified files to the staging area
git add .

# 2. Commit the changes with a descriptive message
git commit -m "feat: added forgot password with OTP and show/hide password toggles"
```

If you have a GitHub repository connected, you can upload them to the internet by running:
```bash
git push origin main
```

## 2. Changes Not Reflecting (Bootstrap Issue)
You mentioned being "unable to get to bootstrap" and changes not reflecting in the final project. This application uses plain CSS (and Vite for React), not Bootstrap. If your changes aren't reflecting, it is almost certainly due to one of the following:

- **The Development Server isn't running:** You must have the Vite dev server running to see live changes. Open a terminal in the `client/` folder and run `npm run dev`. Wait for the console to say `Vite server ready` and go to `http://localhost:5173`.
- **The Backend isn't running:** Open another terminal in the `server/` folder and run `node server.js` or `npm start`.
- **You are viewing a stale production build:** If you built the project previously using `npm run build`, you might be viewing the old `dist` folder. During development, always use `npm run dev`.

## 3. How to Deploy with Automatic Uploads
To make sure your project is deployed to the internet and updates automatically every time you push code, you can use **Vercel** (for the frontend) and **Render** (for the backend).

### Backend Deployment (Render.com)
1. Push your code to a GitHub repository.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `server`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `node server.js`.
7. Add an environment variable for `JWT_SECRET`.
8. Click **Deploy**. Render will give you a live URL (e.g., `https://smart-study-backend.onrender.com`).

### Frontend Deployment (Vercel.com)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Connect the same GitHub repository.
3. Set the **Root Directory** to `client`.
4. Vercel will automatically detect that it is a Vite project and set the build command to `npm run build`.
5. **IMPORTANT:** Update your `client/src/pages/ForgotPassword.jsx` (and any other files that use `localhost:5000`) to point to the live Render URL instead of `http://localhost:5000`. Ideally, use an environment variable (e.g. `import.meta.env.VITE_API_URL`).
6. Click **Deploy**.

Once both are set up, any time you run `git push`, Vercel and Render will automatically build and deploy your newest changes.
