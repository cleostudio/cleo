# Context Map

Personal site v3 contexts. System-wide ADRs live in `docs/adr/`.

## Active contexts

- **Content** — MDX blog and newsletters under `content/`
- **Explore** — country pages from `lib/countries.ts`
- **Cleo agent** — OpenAI Responses API at `/cleo` and `/api/responses`
  (`lib/cleo/`, `components/cleo/`)

## Removed contexts

AMA Booking, Media Library, owner admin (Clerk), Neon/Postgres, rate-limit
backends, and related ADRs/docs were deleted. Do not restore them without an
explicit product decision. OpenAI is the only third-party API.
