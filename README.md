<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13SobzN8yQRyxP6oL2WXdN8Xs6Crdq3UY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` with:
   - `VITE_SUPABASE_URL=your_supabase_project_url`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key`
3. Run the app:
   `npm run dev`

## Backend

This app now uses Supabase for:

- Email/password auth
- Activities and join requests
- Group membership and realtime chat messages
- Notifications and user blocking

The database schema is managed through Supabase migrations.

## AI Backend

AI calls are now proxied through Supabase Edge Function `ai-hingaa`.

- Function path in repo: `supabase/functions/ai-hingaa/index.ts`
- Required Supabase function secret: `GEMINI_API_KEY`

If `GEMINI_API_KEY` is not set in function secrets, AI search/magic fill/moderation will return an error.

## Hackathon Stack Summary

### 1) Tech Stack

- Frontend: React + shadcn/ui
- Backend: Supabase (database, auth, tables, edge functions) connected to Gemini AI
- Deployment: Vercel + Supabase

### 2) Tools and Workflow

- Google Stitch and AI Studio for frontend markup and Gemini AI feature integration
- Lovable for full-app prototyping with markup and backend mockups
- Final app development in OpenCode with:
  - `/provider` set to `gpt-codex-5.3`
  - `/mcp` connected to the team Supabase account
  - Finalization of the complete app in OpenCode

### 3) Runtime

- Runtime: Node.js
- Local command: `npm run dev`

### 4) Manual Code Contribution (Declaration)

- Lines of code manually written: 0 (AI-assisted workflow)
