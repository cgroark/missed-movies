# Missed Movies

A full stack React/Node.js application to keep track of all those movies you've been meaning to watch or want to save for later. This project was built with React/TypeScript, Node.js, PostgreSQL (Supabase), and RESTful API architecture.

## Overview

With full CRUD capabilities built with RESTful architecture and a PostgreSQL database on Supabase, users can search, add, edit, delete, and view movies. They can organize movies into categories, which they can customize. Users can search for movies and scroll through top movie lists via the Open Movie Database (OMDb) API.

Project provides full authentication: users can sign up and create a password. Sign up and verify via email from Supabase then sign in for full access.

### Features

- Authentication: username/password, email verification via Supabase
- Search for any movie (OMDb API)
- Via infinite scroll, view hundreds of suggested movies via OMDb API top lists of movies
- View, add, edit, delete movies
- Organize movies into categories, which can be customized.

### Technology

- React
- TypeScript
- PostgreSQL
- RESTful API architecture
- Supabase database and auth
- HTML/SCSS
- CSS-in-JS styled components
- React-Router
- React Radix UI
- Phosphorus Icons
- OMDb API
- Vercel hosting

### Viewing and Testing

- Locally you can clone this repo and run npm install and npm run dev to spin up the backend and frontend concurrently
- You can check it out deployment on Vercel at https://missedmovies.vercel.app/


### Password reset setup

The login page includes **Forgot password?**. It sends a Supabase recovery email with a redirect to the current frontend origin plus `/reset-password`. The recovery page lets the user enter and confirm a new password; Supabase enforces the project's password policy.

In Supabase → Authentication → URL Configuration, add these Redirect URLs:

- `https://missedmovies.vercel.app/reset-password` (or your deployed frontend domain)
- `http://localhost:5173/reset-password` (adjust the port for local development)

Ensure the Site URL points to the deployed frontend and the Reset Password email template retains Supabase's `{{ .ConfirmationURL }}` link. Frontend hosting must serve the SPA for `/reset-password`; the existing Vercel rewrite does this.

To verify with a test account:

1. Open Login → Forgot password, submit the email, and check the generic confirmation.
2. Open the received link in a signed-out browser, enter matching new passwords, and submit.
3. Sign out and verify login with the new password; the old password should fail.
4. Check mismatched passwords, rejected password policies, expired links, and resending a reset request.
