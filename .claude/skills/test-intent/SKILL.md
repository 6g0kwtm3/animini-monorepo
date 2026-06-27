---
name: test-intent
description: Write tests that validate the intention behind the system, not the implementation. Use when writing or reviewing a test, deciding what to test, mocking dependencies, drawing test boundaries, dealing with flaky tests, or when the user mentions testing implementation details, false positives, or test setup.
---

# Tests validate intention

A test earns its place when it fails at the right time. Fail when the **intention** behind the system is not met — the user's promise, the behavior the code exists to deliver. Never fail for any other reason.

This is the **Golden Rule**: a test must fail _if and only if_ the intention behind the system is not met.

The implementation may change. The intention stays. Test the intention.

---

## The two-line test

Before writing any test, answer one question:

> When will this test fail, and is every reason it could fail a violation of the intention I'm testing?

If a reason isn't a violation, fix the test (move the boundary, drop the assertion, replace the network call with a stub). A test that can fail for the wrong reason is worse than no test — it erodes trust in the whole suite.

**Why this matters:** the most expensive test bug is the false positive. A green test that should be red teaches you nothing, hides regressions, and slowly destroys faith in the suite. Flaky tests are the same disease at lower amplitude: any failure you can't immediately attribute to intent damage is one more reason to stop trusting the runner.

---

## Anatomy

Every test is **setup → action → assertion**, no matter the language or level.

- **Setup** — the box the code runs in. Render the component, mount the app, mock the network, fix the clock. Skip setup only when the code is pure enough to need none.
- **Action** — the user's action, not yours. Click, type, navigate, call. The more the action resembles how the software is actually used, the more confidence the test gives you.
- **Assertion** — compare actual to expected. Skip the assertion when the action implies it (e.g. `render(<X />)` implies _X rendered_). See [assertions.md](assertions.md) for what to assert, what to skip, and how to handle the negative.

When in doubt about any of the three, ask: _which part of this serves the intention, and which part is implementation leaking in?_

---

## Boundaries

A test's **boundary** is where you stop executing real code. Anything past the boundary is given (mocked, fixed, stubbed); anything before it is under test.

You draw the boundary with one question: _is this member of the testing equation related to the intention I'm validating?_ If not, take it out.

Default-mock these — they are almost never part of the intention:

- HTTP requests and network calls
- Side effects (filesystem, real DOM events the test doesn't trigger, real timers)
- Non-deterministic values (dates, randomness, UUIDs, timezones)

**Don't over-mock.** A test that mocks its own internal collaborators is testing the shape of the implementation. The boundary is a chisel; chisel enough and nothing is left to test. If you're mocking something you also wrote, stop — the boundary is in the wrong place. See [boundaries.md](boundaries.md) for where to draw the line between unit and integration.

---

## When a test misbehaves

A passing test is suspicious until proven guilty. Three failure modes to spot:

- **Always green** — the test asserts nothing that can fail, or asserts things implied by the action. Strip the assertion or delete the test.
- **Fails for the wrong reason** — network blip, file order, shared state, sleep instead of `waitFor`. The boundary moved without you noticing.
- **Flaky in CI** — apply **S.M.A.R.T.** the moment you spot it: Skip → Mitigate → Assess → Rewrite → Throw away. Skip first, investigate second. A flaky test in the suite poisons trust in every other test. See [flaky.md](flaky.md).

---

## What this skill is not

This skill is about writing a single test well. It is not:

- The **TDD loop** — see `tdd` for red-green-refactor and tracer bullets.
- A coverage target — code coverage is a tool, not a goal. A 100%-covered implementation-detail test is worse than a 50%-covered intention test. See [coverage.md](coverage.md).
- A code-style guide for test files.

When the work is "drive this feature with tests," invoke `tdd`. When the work is "write or fix this one test so it actually validates something," you're here.