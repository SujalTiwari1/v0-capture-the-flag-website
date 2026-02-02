# CTF Event Website - Setup Guide

## Overview
This is a fully functional Capture The Flag (CTF) event website built with Next.js 16, React, Supabase, and Tailwind CSS.

## Features
- ✅ User Authentication (Register/Login)
- ✅ Challenge Management with Category Filtering
- ✅ Flag Submission System
- ✅ Real-time Leaderboard
- ✅ User Dashboard with Stats
- ✅ Responsive Design
- ✅ Dark Theme UI

## Prerequisites
- Node.js 16+ (or use the v0 environment)
- A Supabase account with a PostgreSQL database
- Vercel account (for deployment)

## Setup Instructions

### 1. Database Setup

First, create the database tables. Copy and paste the contents of `/scripts/setup-database.sql` into your Supabase SQL editor to create:
- `users` table
- `challenges` table  
- `submissions` table
- `solves` table

### 2. Seed Sample Data

(Optional) To populate the database with sample challenges, run the contents of `/scripts/seed-challenges.sql` in your Supabase SQL editor.

### 3. Environment Variables

Add the following environment variables to your Vercel/v0 project settings:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

You can find these values in your Supabase project settings under "API".

### 4. Authentication Setup

In Supabase, ensure:
1. Email authentication is enabled
2. Confirm email settings are configured
3. Email templates are set up (optional but recommended)

## File Structure

\`\`\`
/app
  /page.tsx                 # Home page with hero section
  /login/page.tsx          # Login page
  /register/page.tsx       # Registration page
  /dashboard/page.tsx      # User dashboard with stats
  /challenges/page.tsx     # Challenges list with category filtering
  /challenges/[id]/page.tsx # Individual challenge detail & flag submission
  /leaderboard/page.tsx    # Global leaderboard
  /rules/page.tsx          # Rules and marking scheme

/lib
  /supabase.ts             # Supabase client and types

/scripts
  /setup-database.sql      # Database schema creation
  /seed-challenges.sql     # Sample challenges data

/components/ui/           # Pre-built shadcn/ui components
\`\`\`

## Key Features Explained

### 1. Challenges Page with Category Filtering
The `/challenges` page displays all challenges grouped by category:
- Categories are automatically extracted from the database
- Each category can be expanded/collapsed
- Shows difficulty, points, and solve status
- Problems are clearly visible per category

### 2. Flag Submission
Users can submit flags on the challenge detail page:
- Simple text comparison for flag validation
- Points awarded automatically on correct submission
- User scores update in real-time
- Shows "Solved" badge after successful submission

### 3. Leaderboard
Real-time leaderboard showing:
- User rankings by total points
- Number of challenges solved
- Team information
- Year of participant
- Medal indicators (🥇🥈🥉)

### 4. User Dashboard
Personal dashboard with:
- Total points and challenges solved
- Recent solves timeline
- Profile information
- Quick navigation to challenges and leaderboard

## Adding Custom Challenges

To add custom challenges, insert them into the `challenges` table:

\`\`\`sql
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points, resources)
VALUES (
  'Challenge Title',
  'Category Name',
  'easy|medium|hard',
  '2025',
  'Short description',
  'Full description with details',
  'flag{the_actual_flag}',
  10,
  '{"resource_name": "https://resource-url.com"}'::jsonb
);
\`\`\`

## Customization

### Difficulty Colors
Edit the `getDifficultyColor()` function in challenge components to customize difficulty badge colors.

### Points System
Modify the points awarded per difficulty level in the database seed script.

### Categories
Add new categories by simply inserting challenges with new category names - they'll automatically appear.

### Theme
All styling uses Tailwind CSS with a dark slate theme. Edit the color classes in components to customize.

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel settings
4. Click "Deploy"

### Deploy Using CLI
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Troubleshooting

### Challenges not loading
- Check if Supabase URL and API key are correct
- Ensure database tables are created (run setup-database.sql)
- Check browser console for errors

### Flag submission failing
- Verify the flag_hash in the database matches the submitted flag (case-sensitive)
- Check Supabase RLS policies are allowing submissions

### Leaderboard empty
- Ensure users have registered and solved at least one challenge
- Check if the `solves` table has entries

### Authentication issues
- Verify Supabase Auth is enabled
- Check email confirmation settings
- Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY has proper permissions

## Performance Tips

1. Use Supabase replication for better read performance
2. Add indexes for frequently queried fields (already done in setup-database.sql)
3. Consider caching leaderboard data for high-traffic scenarios
4. Use Vercel Analytics to monitor performance

## Security Notes

- Flags are stored as hashes in the database (should implement proper hashing in production)
- Implement rate limiting for flag submission attempts
- Add CAPTCHA for bot prevention
- Monitor for brute force attacks on flags
- Validate all user inputs server-side

## Support

For issues with the application, check:
1. The v0 chat for code-related questions
2. Supabase documentation for database issues
3. Next.js docs for framework-related questions

Enjoy the CTF competition!
