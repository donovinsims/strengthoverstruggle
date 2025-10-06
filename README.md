# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/aed96f9b-485c-4ea5-b6f9-5fc2e8ef1dd5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aed96f9b-485c-4ea5-b6f9-5fc2e8ef1dd5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aed96f9b-485c-4ea5-b6f9-5fc2e8ef1dd5) and click on Share -> Publish.

## Environment configuration

This project ships without any third-party credentials, so it can be remixed safely. If you want to restore optional services, set the following environment variables in a local `.env` file (Lovable keeps it outside of source control):

- `VITE_DONATION_URL` – Stripe (or other) donation checkout URL. When omitted, donation buttons are hidden or replaced with placeholder messaging.
- `VITE_DATAFAST_WEBSITE_ID` – DataFast analytics site identifier. Analytics are disabled unless this is provided.
- `VITE_DATAFAST_DOMAIN` – Optional domain hint for DataFast analytics. Defaults to `strength-over-struggle.com` when not set.

All of these values are optional; leave them blank to keep the project free of secrets.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Security Features

This project implements comprehensive security best practices:

### Content Security Policy (CSP)
- Configured to prevent XSS attacks and unauthorized resource loading
- Allows necessary resources while blocking potentially malicious content
- Permits Stripe checkout functionality with secure domain allowlist

### External Link Security
- All external links use `rel="noopener noreferrer"` to prevent tabnabbing attacks
- Stripe checkout links open securely without exposing window.opener

### Security Headers
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing attacks
- `X-Frame-Options: DENY` - Blocks clickjacking attempts
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to sensitive browser features

### Input Validation Framework
- Utility functions in `src/lib/security.ts` for input sanitization
- Email, phone, and URL validation with Zod schemas
- Rate limiting helpers for future API implementations
- HTML sanitization to prevent XSS attacks

### Security Guidelines for Future Development
1. Always validate and sanitize user inputs using the security utilities
2. Use HTTPS for all external integrations
3. Implement proper error handling without exposing sensitive information
4. Follow the principle of least privilege for permissions
5. Regular security audits and dependency updates

### Secure External Integrations
- Stripe checkout integration uses secure domain allowlist
- External links properly configured with security attributes
- No sensitive data exposed in client-side code
