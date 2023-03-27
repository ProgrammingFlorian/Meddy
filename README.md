# Meddy

## Installation
- Installation necessary packages \
  `npm install`


- Configure Supabase: \
  Create a File `.env.local` in the root folder with the following contents:
> NEXT_PUBLIC_SUPABASE_URL=`(Supabase URL)` \
> NEXT_PUBLIC_SUPABASE_ANON_KEY=`(Supabase Anon Key)` \
> NEXT_PUBLIC_SUPABASE_SERVICE_ROLE=`(Supabase Service Role Key)` (Only needed for admin scripts)

## Usage
Start the development server: \
`npm run dev`

Build the app for production: \
`npm run build`

Run the built app in production mode: \
`npm start`

Build docker Image: \
`docker build -t swait .`

Run docker on port 3000: \
`docker run -d -p 3000:3000 swait`

### Admin Scripts

Invite a new user per e-mail (and assign him to an organisation): \
`node scripts/create-user` \
Note: This only works out of the root directory, not inside the scripts directory (Due to environment file)

## Technical Overview

The Frontend uses Next.js, TypeScript, TailwindCSS, Mantine.\
Supabase is used as backend.