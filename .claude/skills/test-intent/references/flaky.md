# Flaky tests — S.M.A.R.T.

A flaky test is a test that returns unpredictable results without changes to the code. A single flaky test in the suite drags the trust of every other test down with it — every green run becomes suspect, every red run becomes ambiguous.

Apply **S.M.A.R.T.** the moment you spot flakiness. Same minute, same day. No exceptions.

## (S)kip

Skip the test first. Commit, push, move on.

- Don't delete — skip. The skipped test is the crime scene; deleting it erases the evidence.
- Don't argue "but it's useful when it passes." A test you can't trust is worse than no test, because it teaches the team to ignore red.
- Use a framework-level skip with a ticket reference, so the skip is greppable and accountable.

## (M)itigate

Investigate without committing to a fix yet. Document what you find — this is the evidence the next step (or another engineer) needs.

Answer these questions:

- What exactly is failing? Is it the assertion, a timeout, an exception in setup?
- Is the failure deterministic on rerun? How frequent is it?
- Environment-specific — local only, CI only, one OS, one Node version?
- Has this test ever passed reliably? What changed recently?
- Has this pattern failed elsewhere? (Same fixture, same dependency, same module.)

Write the answers in the ticket. Most flakes have a discoverable cause within an hour of looking; the goal is to narrow the search before spending more time.

## (A)ssess

Turn the mitigation findings into a proposal: probable cause, possible fixes, time estimates. Make fixing the test official work, not overtime charity. Plan it into the next sprint.

If the cause is still unclear after mitigation, the next step is the diagnostic move, not a guess-and-check loop.

## (R)ewrite — isolate the reproduction

Build the smallest possible reproduction. Cherry-pick only what's needed into an empty repo, then re-introduce pieces until it flakes. Run the reproduction in the same environment where the flake appears (CI vs. local matters).

This is debugging by bisection. Most flakes surrender here — wrong test setup, outdated dependency, misconfigured framework flag, environment quirk. The reproduction isolates which one.

## (T)hrow away

If the test still flakes after you've given it your best, delete it. Don't feel bad — the test was not delivering value the moment it was identified as flaky. Write a replacement that tests the same intention from a different angle. Sometimes the rewrite is the moment you finally understand the flake.

---

## Common causes, listed once

These are the symptoms you'll see in mitigation. Knowing them up front speeds the diagnosis:

| Symptom                                     | Likely cause                                                                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fails only on CI                            | Env difference (Node version, clock resolution, parallelism, locale)                                                                                                                 |
| Fails when run with other tests             | Shared state, global mocks, port collisions                                                                                                                                          |
| Fails intermittently                        | Real HTTP, real timers, real FS                                                                                                                                                      |
| Always green                                | No-op assertion, assertion implied by the action                                                                                                                                     |
| Always green until a refactor               | Test was coupled to implementation, not intention                                                                                                                                    |
| Fails immediately on first run, then passes | Setup is racy (init order, async setup not awaited)                                                                                                                                  |
| Fails only after a sibling test failed      | Resource from a failed test was never cleaned up (server, port, temp file). Fix the resource, not the symptom — wrap the resource in a disposable. See [structure.md](structure.md). |
