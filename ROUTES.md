# API Routes Manifest

This document outlines the API architecture for Pawsitive, including methods, auth requirements, and example usage using the `x-owner-id` centralized middleware auth strategy.

## Base URL
All routes run relative to the host (e.g., `http://localhost:3000`).

## Authentication
All protected routes verify the `x-owner-id` header via Next.js Edge Middleware (`src/middleware.ts`).
- Standard flow: Supabase identifies the GitHub user and issues the `x-owner-id`.
- Judging Flow: Pass `x-owner-id: demo` to authenticate as the demo seed user.

---

### `GET /api/owners/me/stats`
Gets the current owner's profile and pet data (used to hydrate the dashboard).
**Auth Required:** Yes
```bash
curl -X GET http://localhost:3000/api/owners/me/stats \
  -H "x-owner-id: demo"
```

### `GET /api/pets/:id`
Gets full profile and historical logs for a specific pet.
**Auth Required:** Yes
```bash
curl -X GET http://localhost:3000/api/pets/demo-pet-id \
  -H "x-owner-id: demo"
```

### `POST /api/activity-logs`
Creates a new activity log. Employs `zod` validation and idempotency checking.
**Auth Required:** Yes
```bash
curl -X POST http://localhost:3000/api/activity-logs \
  -H "x-owner-id: demo" \
  -H "Content-Type: application/json" \
  -d '{"petId": "demo-pet-id", "activityType": "WALK", "value": 45, "idempotencyKey": "unique-uuid-123"}'
```

### `POST /api/care-plans`
Generates an AI personalized daily care plan using Google Gemini 2.0 based on recent logs. Employs a sliding-window rate limit (5/min).
**Auth Required:** Yes
```bash
curl -X POST http://localhost:3000/api/care-plans \
  -H "x-owner-id: demo" \
  -H "Content-Type: application/json" \
  -d '{"petId": "demo-pet-id"}'
```

### `GET /api/health`
Checks API and Database connectivity.
**Auth Required:** No
```bash
curl -X GET http://localhost:3000/api/health
```
