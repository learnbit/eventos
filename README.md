# EventosBol

## Internal event submission

`POST /api/internal/events` accepts event candidates from Eventos Agent. Each successful submission creates a `pending` event. A signed-in admin can approve or reject it at `/admin/events`. Approval makes an upcoming event eligible for public listings.

### Configuration

Set these server-side variables in the Next.js environment. For local development, use `.env.local`.

| Variable | Purpose |
| --- | --- |
| `INTERNAL_API_KEY` | Shared secret. Eventos Agent sends the same value in the `x-internal-api-key` header. |
| `ADMIN_USER_ID` | Clerk user ID of the admin who owns submitted candidates and can review them. |

Keep the shared secret in the server and agent environments. Use HTTPS outside local development. Submissions authenticate with the shared secret and require no Clerk session.

### Request and response

Send a JSON object with `Content-Type: application/json`.

```json
{
  "title": "Feria gastronómica de Tiquipaya",
  "category": "feria",
  "date": "2026-12-06",
  "time": "09:00",
  "location": "Tiquipaya, Cochabamba",
  "description": "Feria de platos tradicionales."
}
```

All six fields must be non-empty strings after trimming surrounding whitespace. The supported categories are `feria`, `kermesse`, `garage-sale`, and `meetup`. The title must produce a slug through the existing event slug helper.

Use a valid calendar date in `YYYY-MM-DD` and 24-hour time in `HH:mm`. The API interprets both in `America/La_Paz`. For example, `2026-12-06` at `09:00` is stored as `2026-12-06T13:00:00.000Z`. The API rejects start times that have already passed.

The API ignores extra fields. It sets ownership from `ADMIN_USER_ID`, sets `status` to `pending` and `isHidden` to `false`, and leaves the image, coordinates, and rejection reason null.

A successful request returns HTTP 201 with this shape.

```json
{
  "id": "generated-event-id",
  "slug": "feria-gastronomica-de-tiquipaya",
  "status": "pending"
}
```

Errors use a JSON object with an `error` string.

| Status | Meaning |
| --- | --- |
| 400 | Malformed JSON or invalid event data |
| 401 | Missing or invalid API key, or no API key configured on the server |
| 500 | Server configuration or persistence failure |

The endpoint creates a new record on each successful submission. Replaying a request after an ambiguous timeout can create another pending record.

### Local testing

Run the route tests with Vitest. They use a fixed clock and mocked Prisma calls and require no API credentials or database.

```sh
npm run test:run -- src/app/api/internal/events/route.test.ts
```

For a manual check, configure the local app with a test database and the variables above, then run `npm run dev`. Save the request example as `candidate.json` and use a future date and time in Bolivia. Load the test key into your shell environment before sending the request.

```sh
curl -i http://localhost:3000/api/internal/events \
  -H 'Content-Type: application/json' \
  -H "x-internal-api-key: ${INTERNAL_API_KEY}" \
  --data-binary @candidate.json
```

Confirm that the response is HTTP 201 and that the candidate appears in the admin review queue. The manual check creates a record in the configured database.
