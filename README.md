# civicrm-js-sdk

TypeScript/JavaScript SDK for [CiviCRM](https://civicrm.org) - Simple and elegant API for React, Vue, Angular and Node.js.

<p align="center">
  <img src="https://img.shields.io/npm/v/civicrm-js-sdk?style=flat-square" />
  <img src="https://img.shields.io/npm/l/civicrm-js-sdk?style=flat-square" />
  <img src="https://img.shields.io/npm/dt/civicrm-js-sdk?style=flat-square" />
</p>

## Features

- 🔒 **Secure** - API key and site key authentication
- 🚀 **Simple** - Intuitive API similar to frappe-js-sdk
- 📦 **TypeScript** - Full type definitions for all CiviCRM entities
- 🔄 **Dual API Support** - Works with both API v3 and API v4
- 🎯 **Entity-based** - Direct access to Contact, Membership, Activity, etc.
- ⚡ **Lightweight** - Only axios as dependency

## Installation

```bash
npm install civicrm-js-sdk
# or
yarn add civicrm-js-sdk
# or
pnpm add civicrm-js-sdk
```

## Quick Start

```typescript
import { CiviCRM } from 'civicrm-js-sdk';

// Initialize the SDK
const civicrm = new CiviCRM({
  baseUrl: 'https://your-civicrm.org',
  apiKey: 'your-api-key',
  siteKey: 'your-site-key',
  apiVersion: 4, // Optional: default is 4, can be 3
});

// Get contacts
const contacts = await civicrm.Contact.get({ limit: 10 });

// Create a contact
const newContact = await civicrm.Contact.create({
  contact_type: 'Individual',
  first_name: 'John',
  last_name: 'Doe',
});

// Update a contact
await civicrm.Contact.update(123, { first_name: 'Jane' });

// Delete a contact
await civicrm.Contact.delete(123);
```

## API Reference

### Initialization

```typescript
import { CiviCRM } from 'civicrm-js-sdk';

const civicrm = new CiviCRM({
  baseUrl: 'https://your-civicrm.org',  // Required
  apiKey: 'your-api-key',                // Required
  siteKey: 'your-site-key',              // Required
  apiVersion: 4,                         // Optional: 3 or 4 (default: 4)
  timeout: 30000,                        // Optional: request timeout in ms
  customHeaders: {                       // Optional: custom headers
    'X-Custom-Header': 'value'
  },
});
```

### Available Entities

The SDK provides direct access to these CiviCRM entities:

- `civicrm.Contact`
- `civicrm.Email`
- `civicrm.Phone`
- `civicrm.Address`
- `civicrm.Membership`
- `civicrm.Activity`
- `civicrm.Contribution`
- `civicrm.Participant`
- `civicrm.Event`
- `civicrm.Relationship`
- `civicrm.Note`
- `civicrm.Group`
- `civicrm.GroupContact`
- `civicrm.Tag`
- `civicrm.EntityTag`
- `civicrm.CustomField`
- `civicrm.CustomGroup`
- `civicrm.OptionValue`
- `civicrm.OptionGroup`
- `civicrm.UFMatch`
- `civicrm.LineItem`
- `civicrm.MembershipType`
- `civicrm.MembershipStatus`
- `civicrm.ContributionRecur`
- `civicrm.PriceSet`
- `civicrm.PriceField`
- `civicrm.PriceFieldValue`

For other entities, use:
```typescript
const campaigns = await civicrm.entity('Campaign').get();
```

### Entity Methods

Each entity provides these methods:

#### `get(params?)` - Get multiple records

```typescript
// Get all contacts
const contacts = await civicrm.Contact.get();

// Get with API v4 style filters
const contacts = await civicrm.Contact.get({
  where: [
    ['contact_type', '=', 'Individual'],
    ['is_deleted', '=', false],
  ],
  select: ['id', 'display_name', 'email'],
  orderBy: { created_date: 'DESC' },
  limit: 10,
  offset: 0,
});

// Get with simple filters (works with both v3 and v4)
const contacts = await civicrm.Contact.get({
  contact_type: 'Individual',
  is_deleted: false,
});
```

#### `getOne(id, params?)` - Get a single record by ID

```typescript
const contact = await civicrm.Contact.getOne(123);
const contact = await civicrm.Contact.getOne(123, { 
  select: ['id', 'display_name', 'email'] 
});
```

#### `create(data)` - Create a new record

```typescript
const contact = await civicrm.Contact.create({
  contact_type: 'Individual',
  first_name: 'John',
  last_name: 'Doe',
  email_primary: {
    email: 'john@example.com',
  },
});

const membership = await civicrm.Membership.create({
  contact_id: 123,
  membership_type_id: 1,
  join_date: '2024-01-01',
  start_date: '2024-01-01',
});
```

#### `update(id, data)` - Update an existing record

```typescript
const updated = await civicrm.Contact.update(123, {
  first_name: 'Jane',
  job_title: 'CEO',
});
```

#### `save(data)` - Create or update based on ID presence

```typescript
// Create new (no id)
const contact = await civicrm.Contact.save({
  contact_type: 'Individual',
  first_name: 'John',
});

// Update existing (has id)
const updated = await civicrm.Contact.save({
  id: 123,
  first_name: 'Jane',
});
```

#### `delete(id)` - Delete a record

```typescript
await civicrm.Contact.delete(123);
```

#### `getCount(params?)` - Get count of records

```typescript
const count = await civicrm.Contact.getCount({
  contact_type: 'Individual',
});
```

#### `exists(params)` - Check if records exist

```typescript
const exists = await civicrm.Contact.exists({
  email: 'john@example.com',
});
```

#### `first(params?)` - Get the first matching record

```typescript
const contact = await civicrm.Contact.first({
  email: 'john@example.com',
});
```

#### `action(actionName, params?)` - Call custom entity action

```typescript
const fields = await civicrm.Contact.action('getfields');
```

### Raw API Calls

For advanced usage, you can make raw API calls:

```typescript
// API v3 call
const result = await civicrm.callV3('Contact', 'get', {
  contact_type: 'Individual',
});

// API v4 call  
const result = await civicrm.callV4('Contact', 'get', {
  where: [['contact_type', '=', 'Individual']],
});

// Auto-select version based on config
const result = await civicrm.call('Contact', 'get', { ... });
```

### Switch API Version

```typescript
// Check current version
const version = civicrm.getApiVersion(); // 3 or 4

// Switch version
civicrm.setApiVersion(3);
```

## Usage Examples

### Complete Member Registration Flow

```typescript
import { CiviCRM } from 'civicrm-js-sdk';

const civicrm = new CiviCRM({
  baseUrl: 'https://your-civicrm.org',
  apiKey: 'your-api-key',
  siteKey: 'your-site-key',
});

async function registerMember(formData: any) {
  // 1. Create contact
  const contact = await civicrm.Contact.create({
    contact_type: 'Individual',
    first_name: formData.firstName,
    last_name: formData.lastName,
  });

  // 2. Add email
  await civicrm.Email.create({
    contact_id: contact.id,
    email: formData.email,
    location_type_id: 1,
    is_primary: 1,
  });

  // 3. Add phone
  if (formData.phone) {
    await civicrm.Phone.create({
      contact_id: contact.id,
      phone: formData.phone,
      location_type_id: 1,
      phone_type_id: 1,
      is_primary: 1,
    });
  }

  // 4. Add address
  await civicrm.Address.create({
    contact_id: contact.id,
    street_address: formData.address,
    city: formData.city,
    postal_code: formData.postcode,
    country_id: formData.countryId,
    state_province_id: formData.stateId,
    location_type_id: 1,
    is_primary: 1,
  });

  // 5. Create membership
  const membership = await civicrm.Membership.create({
    contact_id: contact.id,
    membership_type_id: formData.membershipTypeId,
    join_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
  });

  return { contact, membership };
}
```

### Get User Profile with Related Data

```typescript
async function getUserProfile(contactId: number) {
  // Get all related data in parallel
  const [contact, emails, phones, addresses, memberships] = await Promise.all([
    civicrm.Contact.getOne(contactId),
    civicrm.Email.get({ where: [['contact_id', '=', contactId]] }),
    civicrm.Phone.get({ where: [['contact_id', '=', contactId]] }),
    civicrm.Address.get({ where: [['contact_id', '=', contactId], ['is_primary', '=', 1]] }),
    civicrm.Membership.get({ 
      where: [['contact_id', '=', contactId]],
      orderBy: { start_date: 'DESC' },
      limit: 1,
    }),
  ]);

  return {
    ...contact,
    emails,
    phones,
    primaryAddress: addresses[0],
    currentMembership: memberships[0],
  };
}
```

### Working with Custom Fields

```typescript
// Get custom field ID by name
const customFields = await civicrm.CustomField.get({
  where: [['name', '=', 'Interests']],
  select: ['id'],
});
const interestsFieldId = customFields[0]?.id;

// Read custom field value
const contact = await civicrm.Contact.getOne(123, {
  select: ['id', 'display_name', `custom_${interestsFieldId}`],
});

// Update custom field value
await civicrm.Contact.update(123, {
  [`custom_${interestsFieldId}`]: 'Music, Art, Technology',
});
```

### Using with Vue/Nuxt

```typescript
// composables/useCiviCRM.ts
import { CiviCRM } from 'civicrm-js-sdk';

let civicrmInstance: CiviCRM | null = null;

export function useCiviCRM() {
  if (!civicrmInstance) {
    const config = useRuntimeConfig();
    civicrmInstance = new CiviCRM({
      baseUrl: config.public.civicrmUrl,
      apiKey: config.civicrmApiKey,
      siteKey: config.civicrmSiteKey,
    });
  }
  return civicrmInstance;
}

// In your component
const civicrm = useCiviCRM();
const contacts = await civicrm.Contact.get({ limit: 10 });
```

### Using with React

```typescript
// hooks/useCiviCRM.ts
import { useMemo } from 'react';
import { CiviCRM } from 'civicrm-js-sdk';

export function useCiviCRM() {
  return useMemo(() => new CiviCRM({
    baseUrl: process.env.REACT_APP_CIVICRM_URL!,
    apiKey: process.env.REACT_APP_CIVICRM_API_KEY!,
    siteKey: process.env.REACT_APP_CIVICRM_SITE_KEY!,
  }), []);
}

// In your component
function ContactList() {
  const civicrm = useCiviCRM();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    civicrm.Contact.get({ limit: 10 }).then(setContacts);
  }, [civicrm]);

  return <ul>{contacts.map(c => <li key={c.id}>{c.display_name}</li>)}</ul>;
}
```

## TypeScript Support

The SDK includes full TypeScript definitions:

```typescript
import { CiviCRM, Contact, Membership, Email } from 'civicrm-js-sdk';

const civicrm = new CiviCRM({ ... });

// Type-safe entity operations
const contact: Contact = await civicrm.Contact.getOne(123);
const memberships: Membership[] = await civicrm.Membership.get({
  where: [['contact_id', '=', contact.id]],
});

// With generics for custom types
interface MyContact extends Contact {
  custom_interests?: string;
}

const myContact = await civicrm.Contact.getOne<MyContact>(123);
console.log(myContact?.custom_interests);
```

## Error Handling

```typescript
import { CiviCRM, CiviCRMError } from 'civicrm-js-sdk';

try {
  const contact = await civicrm.Contact.getOne(999999);
} catch (error) {
  const civiError = error as CiviCRMError;
  console.error('Error:', civiError.message);
  console.error('Code:', civiError.error_code);
  console.error('Details:', civiError.details);
}
```

## Server-Side Proxy (Recommended)

For security, don't expose API keys in client-side code. Use a server-side proxy:

```typescript
// Server endpoint (e.g., Next.js API route, Nuxt server route)
// pages/api/civicrm.ts
import { CiviCRM } from 'civicrm-js-sdk';

const civicrm = new CiviCRM({
  baseUrl: process.env.CIVICRM_URL,
  apiKey: process.env.CIVICRM_API_KEY,
  siteKey: process.env.CIVICRM_SITE_KEY,
});

export default async function handler(req, res) {
  const { entity, action, params } = req.body;
  try {
    const result = await civicrm.call(entity, action, params);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## Links

- [CiviCRM Documentation](https://docs.civicrm.org/)
- [CiviCRM API Explorer](https://docs.civicrm.org/dev/en/latest/api/)
- [GitHub Repository](https://github.com/esakkirajaravenantech/civicrm-js-sdk)
