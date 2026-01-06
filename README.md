# CiviCRM JavaScript/TypeScript SDK

A comprehensive JavaScript/TypeScript SDK for interacting with CiviCRM API v3 and v4.

## Features

- 🚀 Support for both CiviCRM API v3 and v4
- 🔐 Multiple authentication methods (API Key, OAuth/Bearer Token)
- 📦 Full TypeScript support with type definitions
- 🎯 Entity CRUD operations made simple
- 📁 File upload and download capabilities
- ⚡ Promise-based API with async/await support
- 🛠️ Extensible and modular architecture

## Installation

```bash
npm install civicrm-js-sdk
```

or

```bash
yarn add civicrm-js-sdk
```

## Quick Start

### Basic Initialization

```typescript
import { CiviCRMApp } from "civicrm-js-sdk";

// Initialize with API key authentication
const civicrm = new CiviCRMApp(
  "https://your-site.org",  // CiviCRM base URL
  "your-site-key"            // Site key
);
```

### Initialization with Token Authentication

```typescript
import { CiviCRMApp } from "civicrm-js-sdk";

// Initialize with Bearer token
const civicrm = new CiviCRMApp(
  "https://your-site.org",
  "your-site-key",
  {
    useToken: true,
    token: () => "your-bearer-token",  // Can be async function
    tokenType: "Bearer"
  }
);
```

## Usage Examples

### Authentication

```typescript
// Login with API key
await civicrm.auth().login({
  apiKey: "your-api-key",
  key: "your-user-key"
});

// Get current user
const user = await civicrm.auth().getCurrentUser();
console.log(user);

// Validate token
const validation = await civicrm.auth().validateToken();
if (validation.valid) {
  console.log("Token is valid", validation.user);
}

// Logout
civicrm.auth().logout();
```

### Entity Operations

#### Get a Single Contact

```typescript
// Get contact by ID
const contact = await civicrm.entity().get("Contact", 123);
console.log(contact);
```

#### Get List of Contacts

```typescript
// Get all contacts with filters
const contacts = await civicrm.entity().getList("Contact", {
  filters: {
    contact_type: "Individual",
    is_deleted: 0
  },
  fields: ["id", "display_name", "email"],
  limit: 10,
  offset: 0,
  sort: { id: "DESC" }
});

console.log(contacts);
```

#### Create a Contact

```typescript
// Create new contact
const newContact = await civicrm.entity().create("Contact", {
  contact_type: "Individual",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com"
});

console.log("Created contact:", newContact);
```

#### Update a Contact

```typescript
// Update existing contact
const updatedContact = await civicrm.entity().update("Contact", 123, {
  first_name: "Jane",
  last_name: "Smith"
});

console.log("Updated contact:", updatedContact);
```

#### Delete a Contact

```typescript
// Delete contact
const deleted = await civicrm.entity().delete("Contact", 123);
console.log("Deleted:", deleted);
```

#### Get Count

```typescript
// Get count of contacts
const count = await civicrm.entity().getCount("Contact", {
  contact_type: "Individual"
});

console.log("Total contacts:", count);
```

### Working with Activities

```typescript
// Create an activity
const activity = await civicrm.entity().create("Activity", {
  activity_type_id: 1,
  subject: "Meeting",
  activity_date_time: "2024-01-15 10:00:00",
  source_contact_id: 123,
  target_contact_id: [456]
});

// Get activities
const activities = await civicrm.entity().getList("Activity", {
  filters: {
    source_contact_id: 123
  },
  limit: 20
});
```

### API Calls

#### Using API v3

```typescript
// Make a custom API v3 call
const result = await civicrm.api().callV3("Contact", "get", {
  sequential: 1,
  return: ["display_name", "email"],
  contact_type: "Individual"
});

console.log(result.values);
```

#### Using API v4

```typescript
// Make a custom API v4 call
const result = await civicrm.api().callV4("Contact", "get", {
  select: ["id", "display_name", "email"],
  where: [["contact_type", "=", "Individual"]],
  limit: 25
});

console.log(result.values);
```

#### Generic API Requests

```typescript
// Generic GET request
const data = await civicrm.api().get("/custom/endpoint", {
  param1: "value1"
});

// Generic POST request
const response = await civicrm.api().post("/custom/endpoint", {
  data: "value"
});
```

### File Operations

#### Upload a File

```typescript
// Upload file with progress tracking
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const uploadedFile = await civicrm.file().uploadFile(
  file,
  {
    entity: "Contact",
    entity_id: 123,
    description: "Profile picture"
  },
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

console.log("File uploaded:", uploadedFile);
```

#### Download a File

```typescript
// Download file
const fileData = await civicrm.file().downloadFile(456);

// Create download link in browser
const url = window.URL.createObjectURL(fileData.data);
const a = document.createElement("a");
a.href = url;
a.download = fileData.filename;
a.click();
window.URL.revokeObjectURL(url);
```

#### Get File Info

```typescript
// Get file information
const fileInfo = await civicrm.file().getFileInfo(456);
console.log(fileInfo);
```

#### Delete a File

```typescript
// Delete file
const deleted = await civicrm.file().deleteFile(456);
console.log("File deleted:", deleted);
```

## TypeScript Usage

The SDK is written in TypeScript and provides full type definitions:

```typescript
import { CiviCRMApp, GetListOptions, User, EntityResponse } from "civicrm-js-sdk";

// Type-safe entity operations
interface Contact {
  id: number;
  display_name: string;
  email: string;
  contact_type: string;
}

const options: GetListOptions = {
  filters: { contact_type: "Individual" },
  fields: ["id", "display_name", "email"],
  limit: 10
};

const contacts = await civicrm.entity().getList<Contact>("Contact", options);
contacts.forEach((contact: Contact) => {
  console.log(contact.display_name);
});
```

## API Reference

### CiviCRMApp

Main class for initializing the SDK.

**Constructor:**
- `url` (string): Base URL of CiviCRM installation
- `siteKey` (string): CiviCRM site key
- `tokenParams` (optional): Token authentication parameters
- `name` (optional): Instance name
- `customHeaders` (optional): Custom HTTP headers

**Methods:**
- `auth()`: Get authentication module
- `entity()`: Get entity CRUD module
- `api()`: Get API module
- `file()`: Get file operations module

### CiviCRMAuth

Authentication and user management.

**Methods:**
- `login(credentials)`: Login with API key
- `logout()`: Clear authentication
- `getCurrentUser()`: Get current user information
- `validateToken()`: Validate authentication token
- `getUser()`: Get cached user data

### CiviCRMEntity

Entity CRUD operations.

**Methods:**
- `get(entity, id, params?)`: Get single entity
- `getList(entity, options?)`: Get list of entities
- `create(entity, data)`: Create new entity
- `update(entity, id, data)`: Update entity
- `delete(entity, id)`: Delete entity
- `getCount(entity, filters?)`: Get entity count

### CiviCRMAPI

Custom API calls for v3 and v4.

**Methods:**
- `callV3(entity, action, params?)`: API v3 call
- `callV4(entity, action, params?)`: API v4 call
- `get(endpoint, params?)`: Generic GET request
- `post(endpoint, data?)`: Generic POST request

### CiviCRMFile

File operations.

**Methods:**
- `uploadFile(file, fileArgs?, onProgress?)`: Upload file
- `downloadFile(fileId)`: Download file
- `deleteFile(fileId)`: Delete file
- `getFileInfo(fileId)`: Get file information

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const contact = await civicrm.entity().get("Contact", 123);
} catch (error) {
  if (error.civicrmError) {
    console.error("CiviCRM API Error:", error.message);
    console.error("Error code:", error.errorCode);
  } else {
    console.error("Network or other error:", error.message);
  }
}
```

## Building from Source

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Format code
npm run format
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please use the GitHub issue tracker.