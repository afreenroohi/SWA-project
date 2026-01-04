# Create Agreement Modal Component

A reusable modal component for creating agreements with three options, designed to match the RFP creation flow.

## Features

- ✅ Three creation options:
  1. **Create from Scratch** - Start a new agreement from the beginning
  2. **Request from Agreement** - Create based on existing agreement
  3. **Request from Electric Market** - Create from electric market request

- ✅ Responsive design that works on all devices
- ✅ RTL (Right-to-Left) language support
- ✅ Smooth animations and hover effects
- ✅ Consistent with existing RFP design patterns
- ✅ Easy to integrate and customize

## Quick Start

### 1. Import the Component

Add to your module (e.g., `contract.module.ts`):

```typescript
import { CreateAgreementModalComponent } from 'src/app/components/create-agreement-modal/create-agreement-modal.component';

@NgModule({
  declarations: [
    CreateAgreementModalComponent,
    // ... other components
  ],
})
export class ContractModule { }
```

### 2. Add to Your Component

In your TypeScript file:

```typescript
export class YourComponent {
  showCreateAgreementModal = false;

  openCreateAgreementModal(): void {
    this.showCreateAgreementModal = true;
  }

  onAgreementOptionSelected(option: string): void {
    // Handle the selected option
    console.log('Selected:', option);
  }
}
```

### 3. Add to Your Template

```html
<!-- Trigger Button -->
<button nz-button (click)="openCreateAgreementModal()">
  Create Agreement
</button>

<!-- Modal Component -->
<app-create-agreement-modal
  [(isVisible)]="showCreateAgreementModal"
  (optionSelected)="onAgreementOptionSelected($event)">
</app-create-agreement-modal>
```

## Component API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isVisible` | `boolean` | `false` | Controls modal visibility |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `isVisibleChange` | `EventEmitter<boolean>` | Emitted when modal visibility changes |
| `optionSelected` | `EventEmitter<string>` | Emitted when user selects an option |

### Option Values

The `optionSelected` event emits one of these values:
- `'scratch'` - Create from Scratch
- `'agreement'` - Request from Agreement
- `'electric'` - Request from Electric Market

## Translations

Add these keys to your translation files:

**English (en.json):**
```json
{
  "Create Agreement": "Create Agreement",
  "Create from Scratch": "Create from Scratch",
  "Request from Agreement": "Request from Agreement",
  "Request from Electric Market": "Request from Electric Market"
}
```

**Arabic (ar.json):**
```json
{
  "Create Agreement": "إنشاء اتفاقية",
  "Create from Scratch": "إنشاء من البداية",
  "Request from Agreement": "طلب من اتفاقية",
  "Request from Electric Market": "طلب من السوق الكهربائي"
}
```

## For More Information

- **Complete Integration Guide:** See `EXACT_CHANGES.ts`
- **Implementation Checklist:** See `CHECKLIST.md`
- **Visual Preview:** See `VISUAL_PREVIEW.txt`
- **File Index:** See `INDEX.md`
