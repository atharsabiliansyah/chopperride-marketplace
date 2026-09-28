# Security Specification: Chopper Ride Marketplace (Zero-Trust ABAC)

## 1. Data Invariants
1. **Strict User Ownership (UID Keying)**: A user may only read, write, update, or delete documents located under their own `/users/{userId}` hierarchy (`request.auth.uid == userId`). Cross-user reading or tampering is mathematically forbidden.
2. **Encrypted PII Isolation**: Sensitive data (phone numbers, private notes, bank details) must reside in `/users/{userId}/private/info` and must be encrypted before persistence. Blanket public reads to this path are prohibited.
3. **No Identity Spoofing**: Users cannot create or update a document where `userId` does not equal `request.auth.uid`.
4. **Denial of Wallet Protection**: Path variables and payload string sizes are strictly bounded (`<= 128` chars for IDs, `<= 2000000` for photo data, `<= 4000` for descriptions).
5. **No Ghost Fields**: Documents must pass strict key validation preventing arbitrary injected keys.
6. **Immutable Fields**: `userId` and `createdAt` cannot be altered once created.
7. **Verified Auth Gate**: Standard write operations require an authenticated user with a valid UID (`request.auth != null`).

---

## 2. The Dirty Dozen Payloads (Designed to Fail)

1. **Payload 1 (Cross-User Write Attack)**:
   - User `attacker_uid_123` tries to write to `/users/victim_uid_999`
   - *Expected*: `PERMISSION_DENIED`
2. **Payload 2 (Ghost Field Injection)**:
   - User tries to inject `{ "isAdmin": true, "superUser": true }` into `/users/{userId}`
   - *Expected*: `PERMISSION_DENIED`
3. **Payload 3 (Unauthenticated Read to Private Info)**:
   - Anonymous/unauthenticated visitor queries `/users/{userId}/private/info`
   - *Expected*: `PERMISSION_DENIED`
4. **Payload 4 (Identity Spoofing in Listing)**:
   - Authenticated user `user_abc` attempts to create a listing with `userId: "user_xyz"`
   - *Expected*: `PERMISSION_DENIED`
5. **Payload 5 (Oversized ID / Path Poisoning)**:
   - Attacker sends listing with ID of 5,000 junk characters to exhaust Firestore indexers
   - *Expected*: `PERMISSION_DENIED`
6. **Payload 6 (Oversized Payload / Denial of Wallet)**:
   - Attacker sends `title` containing 200,000 characters
   - *Expected*: `PERMISSION_DENIED`
7. **Payload 7 (Cross-User Listing Deletion)**:
   - User `hacker_456` sends `deleteDoc(/users/seller_789/listings/chopper_1)`
   - *Expected*: `PERMISSION_DENIED`
8. **Payload 8 (Immortal Field Mutation)**:
   - User tries to modify `createdAt` or change `userId` during an update to `/users/{userId}`
   - *Expected*: `PERMISSION_DENIED`
9. **Payload 9 (Claim Tampering by Another User)**:
   - User `user_b` tries to read or update `/users/user_a/claims/claim_1`
   - *Expected*: `PERMISSION_DENIED`
10. **Payload 10 (Direct Modification of Private Info by Third Party)**:
    - User `user_c` attempts to overwrite `/users/user_d/private/info`
    - *Expected*: `PERMISSION_DENIED`
11. **Payload 11 (Empty or Malformed Document Write)**:
    - User sends empty payload `{}` missing required keys (`displayName`, `email`)
    - *Expected*: `PERMISSION_DENIED`
12. **Payload 12 (Root Blanket Read)**:
    - Attacker attempts a collection group query on all `/users/{userId}/private` data
    - *Expected*: `PERMISSION_DENIED`
