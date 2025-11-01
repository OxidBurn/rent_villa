# Product Requirements Document: Prime Villa Landing Page Implementation

**Version:** 1.0
**Date:** 2025-10-31
**Status:** Draft
**Author:** Development Team
**Project:** Prime Villa - Luxury Villa Rental Platform

---

## 1. Executive Summary

### 1.1 Overview
This PRD outlines the requirements for implementing the Prime Villa landing page based on approved Figma designs. The implementation will convert static design assets into a production-ready Next.js 16 application using React 19, TypeScript 5, and Tailwind CSS 4.

### 1.2 Objectives
- Convert Figma design to pixel-perfect Next.js implementation
- Establish reusable component architecture
- Create responsive, performant landing page
- Set design system foundation for future pages
- Support internationalization (Russian primary language)

### 1.3 Success Criteria
- [ ] Visual parity with Figma design (95%+ accuracy)
- [ ] Lighthouse Performance Score ≥ 90
- [ ] Lighthouse Accessibility Score ≥ 90
- [ ] Mobile responsive (320px - 1920px viewports)
- [ ] Type-safe implementation (zero TypeScript errors)
- [ ] All interactive elements functional

---

## 2. Design Specifications

### 2.1 Design System Tokens

#### Color Palette
```typescript
colors: {
  primary: {
    dark: '#06272D',    // Main text, dark elements
    teal: '#2B6C70',    // Interactive elements, links
    gold: '#D48E1E',    // Accent, Prime Villa brand
    lightGold: '#CB8E38', // Secondary gold accent
  },
  neutral: {
    white: '#FFFFFF',
    lightGray: '#EFF4F5',
  },
  categories: {
    unique: '#06272D',      // Unique villas badge
    beachfront: '#BBDCE5',  // Beachfront badge
    premium: '#FEE2AD',     // Premium class badge
  }
}
```

#### Typography
```typescript
fonts: {
  display: 'Playfair Display',  // Headings, brand elements
  body: 'Open Sans',            // Body text, UI elements
}

sizes: {
  hero: '64px',        // Hero headlines
  h1: '44px',          // Section headlines
  h2: '36px',          // Subsection headlines
  h3: '28px',          // Card titles
  h4: '22px',          // Footer section titles
  body: '16px',        // Standard body text
  bodyLarge: '18px',   // Emphasized body text
  bodySmall: '14px',   // Footer links
  label: '12px',       // Input labels
}
```

#### Spacing Scale
- Base unit: 4px
- Scale: 4, 6, 8, 10, 14, 16, 18, 20, 24, 28, 34, 40, 80, 110, 130px

#### Border Radius
- Small: 10px (cards, buttons)
- Medium: 14px (search form container)
- Large: 100px (badges)

### 2.2 Responsive Breakpoints
```typescript
breakpoints: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1440px', // Design base width
}
```

---

## 3. Component Architecture

### 3.1 Page Structure
```
src/app/page.tsx (Landing Page)
├── Header (Navigation)
├── HeroSection
│   └── SearchForm (Client Component)
├── FeaturedVillasSection
│   ├── VillaCard (x3+)
│   └── CarouselControls (Client Component)
├── DestinationsSection
│   ├── DestinationCard (x4)
│   └── CarouselControls (Client Component)
├── VillaCollectionsSection
│   └── CollectionCard (x4)
├── WorldTravelSection
│   └── CountryCard (x6)
├── AboutSection
├── Footer
```

### 3.2 Component Specifications

#### 3.2.1 Header Component
**Type:** Server Component
**Location:** `src/components/layout/Header.tsx`

**Requirements:**
- Fixed position or sticky navigation
- Logo (Prime Villa brand)
- Navigation links: Направления, О нас, Контакты
- Language selector (RU indicator)
- "Бронируй сейчас" CTA button
- Responsive mobile menu (hamburger)

**Props:**
```typescript
interface HeaderProps {
  locale?: string;
}
```

#### 3.2.2 HeroSection Component
**Type:** Server Component
**Location:** `src/components/landing/HeroSection.tsx`

**Requirements:**
- Full-width background image with gradient overlay
- Hero headline (3-part typography with gold accent)
- Pricing subtitle
- Embedded SearchForm component
- Vertical spacing: 80px top, 110px bottom

**Visual Specs:**
- Background: Linear gradient overlay (transparent 75% → white 100%)
- Container padding: 130px horizontal
- Content max-width: 696px

#### 3.2.3 SearchForm Component
**Type:** Client Component (`"use client"`)
**Location:** `src/components/landing/SearchForm.tsx`

**Requirements:**
- Glass-morphism effect (backdrop-blur-7px, white 14% opacity)
- Three input groups: Check-in date, Check-out date, Guests
- Guest counter with Adults/Children breakdown
- Search button
- Date picker integration (react-day-picker)
- Guest dropdown with increment/decrement controls

**State Management:**
```typescript
interface SearchFormState {
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
}
```

**Interactive Elements:**
- Date pickers (calendar popover)
- Guest selector dropdown
- Form validation
- Search handler (to be integrated with API later)

#### 3.2.4 VillaCard Component
**Type:** Server Component
**Location:** `src/components/villas/VillaCard.tsx`

**Requirements:**
- Category badge (Уникальные, Берег моря, Премиум класс)
- Villa image with hover overlay
- "Подробнее" button overlay
- Location with map pin icon
- Villa name (Playfair Display)
- Description text
- Amenities row: Guests, Bedrooms, Bathrooms with icons

**Props:**
```typescript
interface VillaCardProps {
  id: string;
  category: 'unique' | 'beachfront' | 'premium';
  image: string;
  location: string;
  name: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  size?: 'small' | 'medium' | 'large';
}
```

#### 3.2.5 DestinationCard Component
**Type:** Server Component
**Location:** `src/components/destinations/DestinationCard.tsx`

**Requirements:**
- Destination image (16:9 ratio)
- "Все виллы" button overlay
- Destination name
- Villa count with home icon

**Props:**
```typescript
interface DestinationCardProps {
  id: string;
  name: string;
  image: string;
  villaCount: number;
  slug: string;
}
```

#### 3.2.6 CollectionCard Component
**Type:** Server Component
**Location:** `src/components/collections/CollectionCard.tsx`

**Requirements:**
- Collection image (aspect ratio varies)
- "Открыть подборку" CTA button
- Collection title
- Description text

**Props:**
```typescript
interface CollectionCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}
```

#### 3.2.7 CountryCard Component
**Type:** Server Component
**Location:** `src/components/destinations/CountryCard.tsx`

**Requirements:**
- Country name
- Description text
- Simple, text-focused design

**Props:**
```typescript
interface CountryCardProps {
  name: string;
  description: string;
  slug: string;
}
```

#### 3.2.8 Footer Component
**Type:** Server Component
**Location:** `src/components/layout/Footer.tsx`

**Requirements:**
- Four-column layout: Logo/Contact, Villa Collections, Destinations, Navigation, Payment Info
- Prime Villa logo (gold italic)
- Contact information (address, phones, email)
- Link lists for collections, destinations, navigation
- Payment method icons (crypto & traditional)
- Copyright notice
- Social media icons (to be added)

---

## 4. Technical Requirements

### 4.1 Technology Stack
- **Framework:** Next.js 16.0.1 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Fonts:** Google Fonts (Playfair Display, Open Sans)
- **Icons:** To be determined (Heroicons, Lucide, or custom SVG)
- **Image Optimization:** Next.js Image component

### 4.2 Performance Requirements
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Image optimization:** WebP format, responsive srcsets
- **Code splitting:** Automatic per-route
- **Bundle size:** < 200KB initial JavaScript

### 4.3 Accessibility Requirements
- **WCAG 2.1 Level AA** compliance
- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Alt text for all images
- Sufficient color contrast ratios (minimum 4.5:1)

### 4.4 SEO Requirements
- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Meta tags (title, description, og:*)
- Structured data (JSON-LD for Organization)
- Sitemap generation
- robots.txt configuration

### 4.5 Browser Support
- Chrome 90+ (last 2 versions)
- Firefox 88+ (last 2 versions)
- Safari 14+ (last 2 versions)
- Edge 90+ (last 2 versions)
- Mobile: iOS Safari 14+, Chrome Android 90+

---

## 5. Data Structure

### 5.1 Mock Data Requirements

For initial implementation, create TypeScript interfaces and mock data for:

```typescript
// src/types/villa.ts
export interface Villa {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  category: 'unique' | 'beachfront' | 'premium';
  images: string[];
  amenities: {
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
  };
  pricePerNight: {
    amount: number;
    currency: 'EUR' | 'USD';
  };
  featured: boolean;
}

// src/types/destination.ts
export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  villaCount: number;
  featured: boolean;
}

// src/types/collection.ts
export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  criteria: string[];
}
```

### 5.2 Content Management
- **Phase 1:** Hardcoded mock data in TypeScript files
- **Phase 2:** (Future) Integration with headless CMS or database

---

## 6. Implementation Phases

### Phase 1: Foundation Setup (Estimated: 2-3 hours)
**Deliverables:**
- [x] Branch created: `landing-page-design`
- [ ] Tailwind configuration with design tokens
- [ ] Font setup (Playfair Display, Open Sans)
- [ ] Base layout structure
- [ ] TypeScript interfaces for all data types
- [ ] Mock data files

**Acceptance Criteria:**
- Tailwind custom colors accessible via `text-primary-dark`, etc.
- Fonts loading correctly
- No TypeScript errors
- Build successful

### Phase 2: Header & Footer (Estimated: 2-3 hours)
**Deliverables:**
- [ ] Header component with navigation
- [ ] Footer component with all sections
- [ ] Mobile responsive navigation
- [ ] Logo integration

**Acceptance Criteria:**
- Header sticky/fixed behavior working
- Mobile menu functional
- All links present (non-functional, placeholder hrefs)
- Footer layout matches design

### Phase 3: Hero Section (Estimated: 3-4 hours)
**Deliverables:**
- [ ] Hero section with background image
- [ ] SearchForm client component
- [ ] Date picker integration
- [ ] Guest selector dropdown
- [ ] Form state management

**Acceptance Criteria:**
- Glass-morphism effect rendering correctly
- Date pickers functional
- Guest counter incrementing/decrementing
- Form validation working
- Responsive layout

### Phase 4: Villa Components (Estimated: 4-5 hours)
**Deliverables:**
- [ ] VillaCard component
- [ ] FeaturedVillasSection with carousel
- [ ] Carousel navigation controls
- [ ] Mock villa data (minimum 6 villas)

**Acceptance Criteria:**
- Cards matching design exactly
- Category badges displaying correctly
- Image overlays working
- Carousel navigation functional
- Responsive grid layout

### Phase 5: Destination & Collection Sections (Estimated: 3-4 hours)
**Deliverables:**
- [ ] DestinationCard component
- [ ] DestinationsSection with carousel
- [ ] CollectionCard component
- [ ] VillaCollectionsSection grid
- [ ] Mock destination/collection data

**Acceptance Criteria:**
- Destination cards matching design
- Collection cards in correct layout
- All CTAs present
- Responsive layouts

### Phase 6: World Travel & About Sections (Estimated: 2-3 hours)
**Deliverables:**
- [ ] CountryCard component
- [ ] WorldTravelSection grid
- [ ] AboutSection with crypto payment info
- [ ] Mock country data

**Acceptance Criteria:**
- Country cards in grid layout
- About section styling accurate
- Crypto payment mentions prominent

### Phase 7: Polish & Optimization (Estimated: 2-3 hours)
**Deliverables:**
- [ ] Image optimization (Next.js Image)
- [ ] Icon integration (finalize icon library)
- [ ] Micro-interactions (hover states, transitions)
- [ ] Loading states
- [ ] Error boundaries

**Acceptance Criteria:**
- All images using Next.js Image
- Smooth transitions on interactive elements
- No layout shifts (CLS = 0)
- Error boundaries in place

### Phase 8: Testing & QA (Estimated: 2-3 hours)
**Deliverables:**
- [ ] Lighthouse audit (Performance, Accessibility, SEO)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (basic)

**Acceptance Criteria:**
- Lighthouse scores meet requirements
- No console errors
- Works on all target browsers
- Keyboard accessible

---

## 7. Acceptance Criteria

### 7.1 Visual Quality
- [ ] Design matches Figma mockups (±5px tolerance)
- [ ] Typography sizes, weights, and families correct
- [ ] Colors match design tokens exactly
- [ ] Spacing consistent with design system
- [ ] Images display properly with correct aspect ratios
- [ ] Icons aligned and sized correctly

### 7.2 Functionality
- [ ] All navigation links present (even if placeholder)
- [ ] Search form captures user input
- [ ] Date pickers functional
- [ ] Guest counter increments/decrements
- [ ] Carousel navigation works
- [ ] CTAs clickable (placeholder actions acceptable)
- [ ] Form validation provides feedback

### 7.3 Responsiveness
- [ ] Mobile layout (320px - 767px) functional
- [ ] Tablet layout (768px - 1023px) functional
- [ ] Desktop layout (1024px+) matches design
- [ ] No horizontal scroll at any breakpoint
- [ ] Text readable at all sizes
- [ ] Images scale appropriately

### 7.4 Performance
- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP < 2.5s
- [ ] No layout shifts (CLS < 0.1)
- [ ] Images lazy-loaded
- [ ] Bundle size optimized

### 7.5 Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Components follow Next.js best practices
- [ ] Proper use of Server vs Client Components
- [ ] Reusable components extracted
- [ ] Code self-documenting (no inline comments per CLAUDE.md)

### 7.6 Accessibility
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images

---

## 8. Out of Scope (Future Phases)

The following items are **NOT** included in this PRD:

- [ ] Backend API integration
- [ ] Real villa/destination data from database
- [ ] User authentication
- [ ] Booking functionality
- [ ] Payment processing
- [ ] Multi-language support (i18n infrastructure)
- [ ] Admin CMS integration
- [ ] Search functionality (API-connected)
- [ ] Filtering/sorting logic
- [ ] Map integration
- [ ] Email notifications
- [ ] User reviews/ratings
- [ ] Wishlist/favorites
- [ ] Property comparison

---

## 9. Dependencies & Assumptions

### 9.1 Dependencies
- Figma design files (provided)
- Design export files (HTML, text styles) (provided)
- Image assets in `public/` folder (provided)
- Next.js 16 project setup (existing)

### 9.2 Assumptions
- Russian language content only for initial release
- Static content (no CMS for now)
- Mock data sufficient for demonstration
- Icons can be sourced from open-source libraries
- All images already optimized or will be optimized during build
- No legal/compliance requirements at this stage

### 9.3 Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Design-to-code translation issues | Medium | Regular design review checkpoints |
| Performance issues with large images | High | Use Next.js Image optimization, WebP format |
| Browser compatibility issues | Medium | Cross-browser testing in Phase 8 |
| Responsive layout challenges | Medium | Mobile-first approach, frequent device testing |
| Scope creep (adding features) | High | Strict adherence to PRD, defer to future phases |

---

## 10. Success Metrics

### 10.1 Development Metrics
- [ ] Total development time: 20-25 hours estimated
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] Test coverage: Not required for Phase 1

### 10.2 Quality Metrics
- [ ] Lighthouse Performance: ≥ 90
- [ ] Lighthouse Accessibility: ≥ 90
- [ ] Lighthouse Best Practices: ≥ 90
- [ ] Lighthouse SEO: ≥ 90

### 10.3 User Experience Metrics
(To be measured post-deployment)
- Page load time < 3s
- Time to interactive < 3.5s
- Bounce rate baseline established
- User engagement with search form

---

## 11. Sign-off

### 11.1 Stakeholders
- **Product Owner:** [Name]
- **Design Lead:** [Name]
- **Tech Lead:** [Name]
- **Developer:** [Name]

### 11.2 Approval
- [ ] Design approved
- [ ] Technical approach approved
- [ ] Timeline approved
- [ ] Resource allocation approved

---

## 12. Appendix

### 12.1 Figma Design Reference
- **File:** Prime Villa Design
- **Node ID:** 1-3 (Landing Page)
- **URL:** `https://www.figma.com/design/wkNtnq7SSgk4GidGvwLhpm/Prime-Villa?node-id=1-3`

### 12.2 Design Assets Location
- **Code Export:** `/uploads/originals/98fcfe99-2674-426f-b981-563c60e67509.txt`
- **Text Styles:** `/uploads/originals/24af62c4-23b5-4ca3-8d5c-829a2e066a9c.txt`
- **Images:** `/public/` folder

### 12.3 Related Documentation
- `CLAUDE.md` - Project guidelines
- `docs/deployment.md` - Deployment procedures
- Next.js 16 Documentation: https://nextjs.org/docs

---

**Document End**
