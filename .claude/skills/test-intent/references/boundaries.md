# Test boundaries

A test's boundary is the imaginary line past which the test treats code as a fixed given rather than something under test. Mocking is the tool that establishes the boundary — but the boundary is the decision; mocking is just the implementation.

## Where to draw the line

Walk through every member of the testing equation and ask: _is this member related to the intention I'm validating?_ Eliminate the ones that aren't.

For `fetchUser(id)`:

- The HTTP request itself — _not_ the function's concern. Mock.
- The endpoint URL and payload — _is_ the function's concern. Assert it (or test it through the response shape).
- Parsing the response — _is_ the function's concern. Don't mock.
- Calling `toCamelCase` on the parsed body — _is_ the function's concern. Don't mock.
- The internal `db` connection, if there is one — _not_ the function's concern. Mock.

The mock is the chisel; the boundary is what you choose to sculpt.

## Default-boundary these

Always take out of the test, unless you're explicitly writing an integration test that crosses them:

- **Network** — every real HTTP call.
- **Real clocks and timers** — fake them (`vi.useFakeTimers()`, `jest.useFakeTimers()`, etc.).
- **Randomness** — `Math.random`, UUIDs, anything non-deterministic.
- **Filesystem** — temp files at most, never the real FS the app uses.
- **Environment** — `process.env`, `import.meta.env`. Inject or stub.

The `tdd` skill lists the same defaults with terser wording; the reasoning lives here.

## Don't over-mock

Over-mock and you've tested the implementation dressed up in different names. Symptoms:

- You're mocking a function you also wrote.
- You're asserting on call counts or call order.
- The test reads as a checklist of internal steps.
- Refactoring the internals (without changing behavior) breaks the test.

When in doubt, leave the boundary wider. A test that exercises more real code and asserts on user-visible outcomes is almost always better than one that asserts on internal choreography.

## Unit vs. integration: it's the boundary, not the size

A unit test is not "small" — it's "narrow boundary." An integration test is not "big" — it's "wide boundary." The choice is about which members of the testing equation are real and which are mocked. A 200-line test that exercises a real database through a real query builder is a unit test with a wide setup phase; a 5-line test that mocks every collaborator is an integration test of nothing.

Pick the boundary by the intention, not the line count:

- _Does this function decide which HTTP request to make?_ Mock the HTTP, keep everything else.
- _Does this component render correctly given a real API response?_ Mock only the API, let the rendering tree run real.
- _Does the entire system still work after a refactor?_ Mock nothing — write the slowest, broadest test you can afford.

## Mocking for mockability's sake is a smell

If you're adding a parameter like `open: (address) => void` to a function purely so a test can pass a stub, the function's signature is now serving the test instead of its caller. That trade-off is almost never worth it. Keep the function's signature clean; mock the dependency it actually uses (`vi.spyOn(sql, 'open')` or similar).

Testability is the relationship between code complexity and setup complexity. A testable design is one where the setup complexity stays proportional to the code complexity. Pushing every dependency into the call site is a recipe for noisy call sites and brittle tests.
