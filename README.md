# Meddy

## Installation
- Installation necessary packages \
  `npm install`


- Configure Supabase: \
  Create a File `.env.local` in the root folder with the following contents:
> NEXT_PUBLIC_SUPABASE_URL=`(Supabase URL)` \
> NEXT_PUBLIC_SUPABASE_ANON_KEY=`(Supabase Anon Key)`

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
`docker run -p 3000:3000 swait`

## Technical Overview

The Frontend uses Next.js, TypeScript, TailwindCSS, Mantine.\
Supabase is used as backend.