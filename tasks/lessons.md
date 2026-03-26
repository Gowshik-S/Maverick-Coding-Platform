# Lessons Learned

- Add new lessons here when a user correction reveals a reusable mistake pattern.
- If an external execution API is reachable but returns runtime-unknown or policy blocks, prefer provisioning a local service in compose and wiring env to it for deterministic runtime behavior.
- When database schema constraints are missing (columns/unique/indexes), apply schema migrations first instead of adding long-term code workarounds; then revert code to clean upsert/query patterns.
- Never cast mixed-type skill values directly with `float(...)` in ranking/gap logic; normalize labels like `beginner/intermediate/advanced` first and only return 404 for true not-found cases.
