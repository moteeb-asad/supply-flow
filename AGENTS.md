<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in
`node_modules/next/dist/docs/`.

The installed Next.js documentation is the source of truth for
Next.js APIs, conventions, and behavior. Do not rely on training
data or older Next.js documentation when the installed docs are available.

<!-- END:nextjs-agent-rules -->

# Decision records: keep `docs/decisions/` up to date

Record every bigger decision in `docs/decisions/`, both before building it (when the choice is being made) and after it is done (update the record with what was actually built).

A decision counts as bigger when it is hard to reverse or would surprise someone reading the code, for example:

- schema changes, new columns, triggers, database functions, RLS policies
- background jobs or schedulers (e.g. `pg_cron`)
- a rule the app depends on (how a status or metric is worked out, who can see what)
- a new library, build or hosting change, or a pattern every screen should follow

How:

- Copy the template in `docs/decisions/README.md` into `docs/decisions/NNNN-short-title.md`, using the next number, and add it to the index table there.
- Fill in Context, Decision, Why, Alternatives considered and Consequences. Keep it short.
- Commit it in the same branch and PR as the change it explains.
- Never rewrite an old decision. When one changes, add a new record and mark the old one `Status: Superseded by NNNN`.
