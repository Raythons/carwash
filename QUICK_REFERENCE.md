# Quick Reference Guide

## 🎨 Color Palette

```css
/* Primary Colors */
--color-primary: #00D9FF          /* Cyan - Brand, CTAs */
--color-secondary: #1e293b        /* Slate 800 - Replaces black */
--color-accent: #0ea5e9          /* Sky 500 - Highlights */
--color-success: #14b8a6         /* Teal 500 - Success states */

/* Neutrals */
--color-background: #ffffff       /* White */
--color-foreground: #0f172a      /* Slate 900 - Text */
--color-muted: #f1f5f9           /* Slate 100 - Subtle backgrounds */
--color-border: #e2e8f0          /* Slate 200 - Borders */
```

---

## 📏 Spacing Scale

```
XS:  8px   gap-2, p-2, m-2
SM:  16px  gap-4, p-4, m-4
MD:  24px  gap-6, p-6, m-6
LG:  32px  gap-8, p-8, m-8
XL:  48px  gap-12, p-12, m-12
2XL: 64px  gap-16, p-16, m-16
3XL: 96px  gap-24, p-24, m-24
```

---

## 🔤 Typography

```css
Font: Inter (Google Fonts)

/* Sizes */
h1: text-5xl (48px) md:text-7xl (72px)
h2: text-4xl (36px) md:text-5xl (48px)
h3: text-3xl (30px)
h4: text-2xl (24px)
h5: text-xl (20px)
h6: text-lg (18px)
body: text-base (16px)
small: text-sm (14px)

/* Line Heights */
Headings: leading-tight (1.25)
Body: leading-relaxed (1.75)
```

---

## 🧩 Common Components

### Already Exist ✅
- `GenericTable` - Table with pagination
- `ConfirmDialog` - Confirmation dialogs
- `GenericSearchComponent` - Search with debounce
- `OptionalSection` - Collapsible sections
- `ScrollToTop` - Utility
- `AnimalSelector` - Dropdown selector
- `ClinicSelector` - Dropdown selector
- `StorageSelector` - Dropdown selector

### Need to Create ⚠️
1. **PageHeader** (HIGH) - Page titles/descriptions
2. **LoadingState** (HIGH) - Loading skeletons
3. **EmptyState** (HIGH) - Empty data displays
4. **ErrorState** (HIGH) - Error messages
5. **StatCard** (HIGH) - Dashboard stats
6. **FeatureCard** (MED) - Feature showcases
7. **Container** (MED) - Layout wrapper
8. **Section** (MED) - Page sections
9. **Component Index** (HIGH) - Barrel exports

---

## 📦 Component Usage

### PageHeader
```jsx
<PageHeader 
  title="Dashboard"
  description="Overview of your metrics"
  actions={<Button>Create New</Button>}
/>
```

### LoadingState
```jsx
<LoadingState type="table" message="Loading data..." />
```

### EmptyState
```jsx
<EmptyState
  icon={<Inbox />}
  title="No data yet"
  description="Create your first item"
  action={<Button>Create</Button>}
/>
```

### ErrorState
```jsx
<ErrorState
  error={error}
  onRetry={refetch}
  title="Failed to load"
/>
```

### StatCard
```jsx
<StatCard
  title="Revenue"
  value="$12,345"
  change="+12.5%"
  trend="up"
  icon={<DollarSign />}
/>
```

---

## 🎭 Button Styles

```jsx
/* Primary */
<Button className="px-8 py-3 bg-primary text-white rounded-xl 
                   hover:scale-105 transition-all duration-300">
  Primary Action
</Button>

/* Secondary */
<Button className="px-8 py-3 bg-secondary text-white rounded-xl 
                   hover:bg-secondary/90 transition-all duration-300">
  Secondary Action
</Button>

/* Outline */
<Button className="px-8 py-3 border-2 border-primary text-primary rounded-xl 
                   hover:bg-primary hover:text-white transition-all duration-300">
  Outline Button
</Button>
```

---

## 💳 Card Styles

```jsx
/* Feature Card */
<div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl 
                transition-all duration-300 border border-border 
                hover:-translate-y-2">
  {/* Content */}
</div>

/* Stat Card */
<div className="bg-gradient-to-br from-primary/10 to-accent/10 
                rounded-2xl p-8 border border-primary/20">
  {/* Content */}
</div>
```

---

## 📝 Form Inputs

```jsx
<input 
  className="w-full px-4 py-3 rounded-xl border-2 border-border 
             bg-input focus:border-primary focus:ring-4 focus:ring-primary/20 
             transition-all duration-200 outline-none"
  type="text"
  placeholder="Enter text..."
/>
```

---

## 🎬 Animations

```css
/* Transitions */
transition-all duration-300 ease-in-out

/* Hover Effects */
hover:scale-105 hover:shadow-xl

/* Active States */
active:scale-98

/* Page Transitions */
.page-transition {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px  (sm)
Tablet:  640-1024px (md/lg)
Desktop: > 1024px (xl/2xl)

Usage:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🔄 Data Loading Pattern

```jsx
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  retry: 3,
})

if (isLoading) return <LoadingState type="table" />
if (isError) return <ErrorState error={error} onRetry={refetch} />
if (!data?.length) return <EmptyState />
return <DataDisplay data={data} />
```

---

## 🎯 Implementation Priority

### Week 1: Foundation
1. Update `/src/index.css` colors
2. Add Inter font
3. Create LoadingState
4. Create ErrorState
5. Create EmptyState
6. Create PageHeader

### Week 2: Auth Pages
1. Redesign LoginForm
2. Create RegisterForm
3. Create ForgotPasswordModal

### Week 3: Homepage
1. Hero section
2. Features section
3. Navbar & Footer

### Week 4: Dashboard
1. Create StatCard
2. Update dashboard
3. Refactor existing pages

---

## ✅ Common Patterns

### Page Layout
```jsx
<Container size="lg">
  <PageHeader 
    title="Page Title"
    description="Description"
    actions={<Button>Action</Button>}
  />
  
  <div className="mt-8">
    {/* Content */}
  </div>
</Container>
```

### Data Display
```jsx
{isLoading && <LoadingState type="table" />}
{isError && <ErrorState error={error} onRetry={refetch} />}
{!data?.length && <EmptyState title="No data" />}
{data?.length > 0 && <GenericTable data={data} columns={columns} />}
```

### Form with States
```jsx
<form onSubmit={handleSubmit}>
  {error && <ErrorAlert>{error}</ErrorAlert>}
  {success && <SuccessAlert>{success}</SuccessAlert>}
  
  <Input {...} />
  
  <Button disabled={isSubmitting}>
    {isSubmitting ? 'Loading...' : 'Submit'}
  </Button>
</form>
```

---

## 📂 File Locations

```
Key Files:
/src/index.css                              # Theme tokens
/src/components/common/                      # Generic components
/src/components/auth/LoginForm.jsx          # Login page
/src/components/auth/RegisterForm.jsx       # Register page
/src/pages/public/Home.jsx                  # Homepage
/DESIGN_PLAN.md                             # Full specs (769 lines)
/COMPONENT_INVENTORY.md                     # Component details (536 lines)
/DESIGN_IMPLEMENTATION_SUMMARY.md           # Overview (710 lines)
```

---

## 🔍 Finding Components

```javascript
// After creating common/index.js
import { 
  PageHeader, 
  LoadingState, 
  EmptyState,
  ErrorState,
  StatCard,
  FeatureCard,
  Container,
  Section,
  GenericTable 
} from '@/components/common'
```

---

## 🎨 Gradient Examples

```jsx
/* Background Gradients */
className="bg-gradient-to-br from-slate-50 to-slate-100"
className="bg-gradient-to-br from-primary/5 via-accent/5 to-slate-50"
className="bg-gradient-to-r from-primary to-accent"

/* Text Gradients */
className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
```

---

## 🛠️ Utility Classes

```css
/* Shadows */
shadow-sm shadow-md shadow-lg shadow-xl shadow-2xl

/* Rounded Corners */
rounded-lg (0.5rem) rounded-xl (0.75rem) rounded-2xl (1rem) rounded-3xl (1.5rem)

/* Transitions */
transition-all duration-200 ease-in-out
transition-colors duration-300
transition-transform duration-300

/* Text Utilities */
text-balance (headlines) text-pretty (paragraphs)
truncate (single line) line-clamp-2 (2 lines)
```

---

## ♿ Accessibility Checklist

```jsx
/* Buttons */
<button aria-label="Descriptive label">
  <Icon className="w-5 h-5" />
  <span className="sr-only">Screen reader text</span>
</button>

/* Forms */
<Label htmlFor="email">Email</Label>
<Input 
  id="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby="email-error"
/>
{error && <span id="email-error" className="text-destructive">{error}</span>}

/* Focus */
focus:ring-4 focus:ring-primary/20 focus:outline-none
```

---

## 📊 Testing Checklist

- [ ] Mobile (< 640px) works
- [ ] Tablet (640-1024px) works
- [ ] Desktop (> 1024px) works
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Animations smooth (60fps)
- [ ] Loading states show
- [ ] Empty states show
- [ ] Error states show with retry

---

## 🚀 Performance Tips

```javascript
/* Image Optimization */
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"
  width={600}
  height={400}
/>

/* Code Splitting */
const Component = React.lazy(() => import('./Component'))

/* Memoization */
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b])
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
```

---

## 📋 Common Imports

```javascript
// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Common Components
import { GenericTable } from '@/components/common'

// Icons
import { Check, X, AlertCircle, Loader2 } from 'lucide-react'

// Utilities
import { cn } from '@/lib/utils'

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
```

---

## 🎯 Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Install new package
npm install package-name
```

---

## 📞 Documentation Links

- **Full Design Specs**: See `DESIGN_PLAN.md`
- **Component Details**: See `COMPONENT_INVENTORY.md`
- **Implementation Guide**: See `DESIGN_IMPLEMENTATION_SUMMARY.md`
- **This Cheat Sheet**: `QUICK_REFERENCE.md`

---

**Remember**: 
- Use semantic color tokens (primary, secondary, accent)
- Generous spacing (gap-6 to gap-12)
- Smooth transitions (300ms)
- Loading/Empty/Error states for all data
- Mobile-first responsive design
- WCAG AA accessibility
