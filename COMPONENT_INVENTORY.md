# Component Inventory: Existing & Needed

## Overview
This document provides a complete inventory of existing common components and identifies which new components need to be created to maintain DRY principles and maximize reusability.

---

## ✅ Existing Common Components

### 1. **GenericTable** 
**Location**: `/src/components/common/GenericTable.jsx`
**Status**: ✅ Fully Implemented
**Purpose**: Reusable table component with pagination, sorting, and actions
**Props**:
```typescript
{
  columns: Array<Column>
  data: Array<any>
  pagination: PaginationObject
  onPageChange: (page: number) => void
  renderActions?: (item: any) => ReactNode
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error
  emptyMessage?: string
  skeleton?: ReactNode
}
```
**Usage**: Used in 15+ pages for data display
**Reusability**: 95% - Highly reusable

---

### 2. **ConfirmDialog**
**Location**: `/src/components/common/ConfirmDialog.jsx`
**Status**: ✅ Exists (needs verification)
**Purpose**: Confirmation dialog for destructive actions
**Usage**: Delete operations, important confirmations
**Reusability**: 90% - Highly reusable

---

### 3. **AnimalSelector**
**Location**: `/src/components/common/AnimalSelector.jsx`
**Status**: ✅ Exists
**Purpose**: Dropdown/select for choosing animals
**Domain**: Veterinary-specific (needs car wash adaptation)
**Reusability**: 60% - Domain-specific but pattern reusable

---

### 4. **ClinicSelector**
**Location**: `/src/components/common/ClinicSelector.jsx`
**Status**: ✅ Exists
**Purpose**: Dropdown/select for choosing clinics
**Domain**: Can be adapted to "Location Selector" for car wash locations
**Reusability**: 70% - Pattern reusable

---

### 5. **StorageSelector**
**Location**: `/src/components/common/StorageSelector.jsx`
**Status**: ✅ Exists
**Purpose**: Dropdown/select for storage/inventory selection
**Reusability**: 75% - Useful for inventory management

---

### 6. **GenericSearchComponent**
**Location**: `/src/components/common/GenericSearchComponent.jsx`
**Status**: ✅ Exists
**Purpose**: Reusable search input with debounce
**Reusability**: 95% - Highly reusable

---

### 7. **OptionalSection**
**Location**: `/src/components/common/OptionalSection.jsx`
**Status**: ✅ Exists
**Purpose**: Collapsible/expandable section for forms
**Reusability**: 85% - Useful for complex forms

---

### 8. **ScrollToTop**
**Location**: `/src/components/common/ScrollToTop.jsx`
**Status**: ✅ Exists
**Purpose**: Scrolls to top on route change
**Reusability**: 100% - Universal utility

---

## 🔨 New Components to Create

### 1. **PageHeader**
**Location**: `/src/components/common/PageHeader.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Consistent page headers across the app
**Props**:
```typescript
{
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: Array<{label: string, href: string}>
  className?: string
}
```
**Example Usage**:
```jsx
<PageHeader 
  title="Dashboard"
  description="Overview of your business metrics"
  actions={<Button>Create New</Button>}
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' }
  ]}
/>
```
**Priority**: HIGH - Used on every page

---

### 2. **FeatureCard**
**Location**: `/src/components/common/FeatureCard.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Reusable feature showcase card
**Props**:
```typescript
{
  icon: ReactNode
  title: string
  description: string
  className?: string
  onClick?: () => void
  href?: string
}
```
**Example Usage**:
```jsx
<FeatureCard
  icon={<Sparkles className="w-8 h-8" />}
  title="Fast Service"
  description="Quick turnaround times for all services"
/>
```
**Priority**: HIGH - Homepage, features page

---

### 3. **StatCard**
**Location**: `/src/components/common/StatCard.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Dashboard statistics display
**Props**:
```typescript
{
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: ReactNode
  className?: string
  loading?: boolean
}
```
**Example Usage**:
```jsx
<StatCard
  title="Total Revenue"
  value="$12,345"
  change="+12.5%"
  trend="up"
  icon={<DollarSign />}
/>
```
**Priority**: HIGH - Dashboard

---

### 4. **LoadingState**
**Location**: `/src/components/common/LoadingState.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Generic loading state with different variants
**Props**:
```typescript
{
  type?: 'table' | 'card' | 'form' | 'page' | 'inline'
  message?: string
  className?: string
}
```
**Example Usage**:
```jsx
<LoadingState type="table" message="Loading appointments..." />
```
**Priority**: HIGH - Used everywhere

---

### 5. **EmptyState**
**Location**: `/src/components/common/EmptyState.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Empty state with icon, message, and CTA
**Props**:
```typescript
{
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}
```
**Example Usage**:
```jsx
<EmptyState
  icon={<Inbox className="w-16 h-16" />}
  title="No appointments yet"
  description="Create your first appointment to get started"
  action={<Button>Create Appointment</Button>}
/>
```
**Priority**: HIGH - Better UX for empty data

---

### 6. **Section**
**Location**: `/src/components/common/Section.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Page section wrapper with consistent padding
**Props**:
```typescript
{
  id?: string
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  background?: 'default' | 'muted' | 'gradient'
  children: ReactNode
}
```
**Example Usage**:
```jsx
<Section id="features" background="muted" containerSize="lg">
  <FeatureGrid />
</Section>
```
**Priority**: MEDIUM - Cleaner page structure

---

### 7. **Container**
**Location**: `/src/components/common/Container.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Max-width container with responsive padding
**Props**:
```typescript
{
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  children: ReactNode
}
```
**Example Usage**:
```jsx
<Container size="lg">
  <PageHeader />
  <Content />
</Container>
```
**Priority**: MEDIUM - Layout consistency

---

### 8. **ErrorState**
**Location**: `/src/components/common/ErrorState.jsx`
**Status**: ⚠️ NEEDED
**Purpose**: Error display with retry action
**Props**:
```typescript
{
  error: Error | string
  onRetry?: () => void
  title?: string
  className?: string
}
```
**Example Usage**:
```jsx
<ErrorState
  error={error}
  onRetry={refetch}
  title="Failed to load appointments"
/>
```
**Priority**: HIGH - Better error handling

---

### 9. **Badge**
**Location**: `components/ui/badge.tsx` (shadcn)
**Status**: ✅ Likely exists in shadcn components
**Purpose**: Status indicators, tags, labels
**Priority**: LOW - Already in UI library

---

### 10. **Card**
**Location**: `components/ui/card.tsx` (shadcn)
**Status**: ✅ Exists in shadcn components
**Purpose**: Container for content blocks
**Priority**: LOW - Already in UI library

---

## 📊 Usage Analysis

### Most Reusable Components (Create First)
1. **PageHeader** - Used on every internal page (~50+ pages)
2. **LoadingState** - Used with every data fetch (~100+ instances)
3. **EmptyState** - Used with every data display (~50+ instances)
4. **ErrorState** - Used with every data fetch (~100+ instances)
5. **StatCard** - Dashboard and analytics pages (~20+ instances)

### Domain-Specific Components (Lower Priority)
- **FeatureCard** - Marketing pages (~5-10 instances)
- **Section** - Marketing and public pages (~20 instances)
- **Container** - All pages, but simple wrapper (~100+ instances)

---

## 🎯 Implementation Priority

### Phase 1: Critical Commons (Week 1)
```
Priority Order:
1. LoadingState - Immediate UX improvement
2. ErrorState - Better error handling
3. EmptyState - Better empty states
4. PageHeader - Consistent headers
```

### Phase 2: Dashboard Components (Week 2)
```
Priority Order:
1. StatCard - Dashboard stats
2. Container - Layout wrapper
3. Section - Page sections
```

### Phase 3: Marketing Components (Week 3)
```
Priority Order:
1. FeatureCard - Homepage features
2. Testimonial Card (if needed)
3. PricingCard (if needed)
```

---

## 🔄 Refactoring Opportunities

### Components That Can Use GenericTable
```
Current:
- EmployeesTable.jsx
- AnimalsExaminationsTable.jsx
- CategoriesTable.jsx
- SuppliersTable.jsx
- ProductsTable.jsx
- DealsTable.jsx
- ExaminationFollowUpsTable.jsx
- GoalsTable.jsx

Refactor: Convert to use GenericTable configuration
Benefit: Reduce code duplication by ~60%
```

### Components That Can Use PageHeader
```
Current Pages (manually implementing headers):
- All /dashboard/* pages
- All /clinic/* pages
- All management pages

Refactor: Replace with <PageHeader /> component
Benefit: Consistent styling, reduce duplication
```

### Components That Need LoadingState
```
Current: Most components use basic "Loading..." text
Refactor: Use <LoadingState /> with proper skeletons
Benefit: Better loading UX, consistent patterns
```

---

## 📋 Component Creation Checklist

For each new common component:

- [ ] Create component file in `/src/components/common/`
- [ ] Write comprehensive PropTypes/TypeScript types
- [ ] Add JSDoc comments for IntelliSense
- [ ] Create Storybook story (if applicable)
- [ ] Add to this inventory document
- [ ] Update usage examples
- [ ] Test responsive behavior
- [ ] Test accessibility (keyboard, screen reader)
- [ ] Add to component index for easy imports

---

## 🔍 Current Common Component Index

**Location**: `/src/components/common/index.js`
**Status**: ⚠️ Should be created
**Purpose**: Barrel export for easy imports

```javascript
// /src/components/common/index.js

// Data Display
export { default as GenericTable } from './GenericTable'
export { default as StatCard } from './StatCard'
export { default as FeatureCard } from './FeatureCard'

// Layout
export { default as PageHeader } from './PageHeader'
export { default as Container } from './Container'
export { default as Section } from './Section'

// State Management
export { default as LoadingState } from './LoadingState'
export { default as EmptyState } from './EmptyState'
export { default as ErrorState } from './ErrorState'

// Interactions
export { default as ConfirmDialog } from './ConfirmDialog'
export { default as GenericSearchComponent } from './GenericSearchComponent'

// Utilities
export { default as ScrollToTop } from './ScrollToTop'
export { default as OptionalSection } from './OptionalSection'

// Domain Specific
export { default as AnimalSelector } from './AnimalSelector'
export { default as ClinicSelector } from './ClinicSelector'
export { default as StorageSelector } from './StorageSelector'
```

**Usage After Index**:
```javascript
// Before
import GenericTable from '@/components/common/GenericTable'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'

// After
import { GenericTable, LoadingState, EmptyState } from '@/components/common'
```

---

## 📈 Reusability Metrics

| Component | Reusability | Current Usage | Potential Usage | ROI |
|-----------|-------------|---------------|-----------------|-----|
| GenericTable | 95% | 15 pages | 50+ pages | Very High |
| PageHeader | 90% | 0 pages | 50+ pages | Very High |
| LoadingState | 95% | 0 | 100+ instances | Very High |
| EmptyState | 90% | 0 | 50+ instances | Very High |
| ErrorState | 90% | 0 | 100+ instances | Very High |
| StatCard | 85% | 0 | 20+ instances | High |
| FeatureCard | 70% | 0 | 10 instances | Medium |
| Section | 85% | 0 | 30 instances | Medium |
| Container | 95% | 0 | 100+ instances | High |
| ConfirmDialog | 90% | Unknown | 30+ instances | High |

**Total Code Reduction Estimate**: 30-40% with proper common component usage

---

## 🎨 Design System Integration

### Relationship with shadcn/ui
```
shadcn/ui (Primitive Components)
    ↓
Common Components (Business Logic)
    ↓
Page-Specific Components (Application Logic)
```

**Example**:
```jsx
// shadcn Button (primitive)
<Button>Click me</Button>

// Common LoadingState (business logic)
<LoadingState type="table">
  <Button>Click me</Button>
</LoadingState>

// Page-specific AppointmentTable (application logic)
<AppointmentTable>
  <LoadingState type="table">
    <GenericTable data={data} />
  </LoadingState>
</AppointmentTable>
```

---

## Conclusion

**Existing Common Components**: 8
**Needed Common Components**: 9
**Total After Implementation**: 17 common components

**Benefits**:
- 30-40% reduction in code duplication
- Consistent UX across all pages
- Faster feature development
- Easier maintenance and updates
- Better testing coverage

**Next Steps**:
1. Create Phase 1 components (LoadingState, ErrorState, EmptyState, PageHeader)
2. Create component index for easy imports
3. Refactor existing pages to use common components
4. Document component usage patterns
