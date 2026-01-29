# Project Structure

## Public Website (Frontend)

### Pages
- `/src/pages/public/Home.jsx` - Main public home page
- `/src/pages/auth/login.jsx` - Login page
- `/src/pages/auth/register.jsx` - Registration page
- `/src/pages/auth/forgot-password.jsx` - Forgot password page

### Components (Organized by Type)

#### Public Components (`/src/components/public/`)
- `Navbar.jsx` - Navigation bar with language toggle
- `HeroSection.jsx` - Hero section with background image (empty background ready)
- `AboutSection.jsx` - About/Mission section
- `ServicesSection.jsx` - Services showcase
- `PricingSection.jsx` - Subscription plans
- `ExtrasSection.jsx` - Additional services
- `ContactSection.jsx` - Contact form
- `Footer.jsx` - Footer with links
- `index.js` - Barrel export

#### Auth Components (`/src/components/auth/`)
- `LoginForm.jsx` - Login form component
- `RegisterForm.jsx` - Registration form component
- `ForgotPasswordForm.jsx` - Forgot password form component
- `index.js` - Barrel export

## Localization

### Translation Files
- `/src/locales/en.json` - English translations
  - `auth.login.*` - Login page translations
  - `auth.register.*` - Register page translations
  - `auth.forgot_password.*` - Forgot password translations
  - `public.*` - Public website content

- `/src/locales/ar.json` - Arabic translations (same structure)

## Design System

### Colors
- **Primary**: `#00D9FF` (Cyan) - Brand color
- **Secondary**: `#64748b` (Slate) - Secondary actions
- **Primary Foreground**: White text on primary
- **Secondary Foreground**: White text on secondary
- **Background**: `#ffffff` / Dark mode support
- **Accent**: `#00D9FF` (matches primary)
- **Destructive**: `#ef4444` (Red) - Error states

### Button Component
Uses Tailwind CSS with design token variables:
- `default` variant: Primary color background
- `secondary` variant: Secondary color background
- `outline` variant: Border with primary color
- `ghost` variant: Minimal style
- `destructive` variant: Red background
- `link` variant: Text only

All components are **100% responsive**:
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Proper padding scaling: `px-2 sm:px-4 lg:px-6`

## Bilingual Support (EN/AR)

- Automatic RTL layout for Arabic
- Language toggle in navbar
- All text from `i18n` translations
- Document direction set dynamically

## Key Features

✅ Login/Register pages with form validation
✅ Forgot password recovery flow
✅ Hero section with background image
✅ Fully responsive design (100% mobile-optimized)
✅ Bilingual support (English & Arabic)
✅ Primary & secondary color system
✅ Reusable components organized by feature
✅ Form handling with error/success states
