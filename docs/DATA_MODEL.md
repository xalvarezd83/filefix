# FileFix Data Model

## Core relationship

User
 ├── Subscription
 ├── Files
 ├── ValidationTemplates
 │    └── ValidationRules
 ├── ValidationRuns
 │    └── ValidationErrors
 ├── ChatConversations
 │    └── ChatMessages
 ├── UsageEvents
 └── AuditEvents

Project is an optional multi-file workspace layer.

## Why this model

### User
Identity and ownership boundary. Every customer-owned object is connected to a User either directly or through a Project.

### Subscription
Stripe billing state is cached here so application authorization does not have to call Stripe on every request.

### File
Stores metadata only. Actual file bytes live in S3/R2. `objectKey` is the durable storage pointer.

### ValidationTemplate
A reusable definition such as "Customer Import". It is the main retention mechanism for the $4.99/month product.

### ValidationRule
One rule per field/check. `parameters` is JSON so the schema can evolve without migrations for every new validation type.

Examples:

```json
{"allowed":["PR","NY","FL"]}
```

```json
{"min":0,"max":100}
```

```json
{"pattern":"^[A-Z]{2}-[0-9]+$"}
```

### ValidationRun
One execution of a template against one file. Keeps the original file immutable and makes results auditable.

### ValidationError
Row/column-level failure details. This supports the human-readable error report.

### ChatConversation / ChatMessage / ChatSource
Reserved for the later AI assistant. ChatSource explicitly links a conversation to files, which is safer than giving an AI model unrestricted access to a user's entire workspace.

### UsageEvent
Append-only product metering. Use this for monthly quotas, analytics and future plan enforcement.

### AuditEvent
Security/product audit trail for actions such as upload, validation, deletion, download and billing changes.

## Future additions

For production scale, consider:
- Organization / Team
- APIKey
- WebhookEndpoint
- ProcessingJob
- FileVersion
- ShareLink
- Notification
- UsagePeriod
- EncryptionKey metadata / key rotation records
- DataRetentionPolicy
