# Flat tests

When several tests cover the same unit, **keep them flat** — one `test()` per scenario, no `describe` nesting, no shared mutable state threaded through `beforeEach`. Then pair flatness with **disposable objects** (`using` / `Symbol.dispose`) so cleanup is guaranteed even when an assertion throws.

Flatness is the shape; disposables are the safety belt. One without the other leaves a gap.

## Why flat

Nesting trades cognitive load for line count. Each `describe` level adds variables defined in some outer scope, mutated in some inner `beforeEach`, then read in a test somewhere below. Reading a test means tracing which `beforeEach` ran, in what order, and what state each variable holds. The agent (and the human) does this work on every read.

```ts
// ❌ Nested: what is `handleSubmit`? Who assigns it? Where?
describe('Login', () => {
  let handleSubmit
  beforeEach(() => { handleSubmit = jest.fn() })

  describe('when valid', () => {
    beforeEach(() => { /* sets up user, utils */ })
    describe('on submit', () => {
      it('calls onSubmit', () => {
        expect(handleSubmit).toHaveBeenCalled() // where did it come from?
      })
    })
  })
})
```

```ts
// ✅ Flat: every value is local, every test is self-contained
test('Login calls onSubmit with credentials when valid input is submitted', () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(<Login onSubmit={handleSubmit} />)
  userEvent.type(getByLabelText(/username/i), 'michelle')
  userEvent.type(getByLabelText(/password/i), 'smith')
  userEvent.click(getByText(/submit/i))
  expect(handleSubmit).toHaveBeenCalledWith({ username: 'michelle', password: 'smith' })
})
```

A flat test reads top to bottom with no scroll, no jumping, no variable archaeology. The trade is some duplication. Accept the duplication until it's painful.

## AHA: extract when it hurts, not before

When duplication starts to bite, extract a **function** that returns a value — never a `beforeEach` that mutates shared state.

```ts
function setupSuccessCase() {
  const handleSubmit = jest.fn()
  const utils = render(<Login onSubmit={handleSubmit} />)
  const user = { username: 'michelle', password: 'smith' }
  userEvent.type(utils.getByLabelText(/username/i), user.username)
  userEvent.type(utils.getByLabelText(/password/i), user.password)
  userEvent.click(utils.getByText(/submit/i))
  return { ...utils, handleSubmit, user }
}

test('Login calls onSubmit on success', () => {
  const { handleSubmit, user } = setupSuccessCase()
  expect(handleSubmit).toHaveBeenCalledWith(user)
})
```

Composing setup functions (e.g. `setup()` + scenario-specific helpers) gives you the DRY of nested `beforeEach` without the shared mutable state. Each helper returns a fresh object; nothing carries across tests.

`beforeEach` and `afterEach` are still appropriate when they pair as **lifecycle**, not code reuse: start a server in `beforeAll`, stop it in `afterAll`. Mock a global in `beforeAll`, restore it in `afterAll`. The smell is using `beforeEach` to factor out a few lines that each test could just as easily run itself.

## Group by file, not by `describe`

When the scenarios for one unit genuinely multiply, split the file. A test file per scenario (or per cluster of related scenarios) keeps each file small enough to read at a glance, runs in parallel with the others, and removes the urge to nest.

```
tests/auth/
  google.test.ts
  credentials.test.ts
  magic-link.test.ts
```

The file system is your grouping hierarchy. Drop `describe` unless it adds meaning beyond what the file name already conveys (it almost never does in modern JS).

## Cleanup: disposables make flat safe

Flat tests have one sharp edge: cleanup that lives at the end of the test body doesn't run when an assertion throws. The server stays up, the temp dir stays, the mock stays installed. Subsequent tests pay the cost.

```ts
// ❌ Looks flat, but cleanup is skipped on assertion failure
test('auth flow', async () => {
  const server = createTestServer()
  await server.listen()
  // ...test body...
  await server.close() // never runs if anything above throws
})
```

The fix is **disposable objects**: co-locate the cleanup callback with the resource, declare it via `Symbol.dispose` (or `Symbol.asyncDispose`), and consume with `using`. The runtime guarantees the dispose runs when the binding goes out of scope — including on throw.

```ts
function createTestServer() {
  const server = new Server()
  return {
    instance: server,
    async [Symbol.asyncDispose]() {
      await server.close()
    },
  }
}

test('auth flow', async () => {
  await using server = createTestServer()
  await server.instance.listen()
  // ...test body...
  // server.close() runs here, even if the body threw
})
```

A few rules for disposables in tests:

- Prefer disposables over `try/finally` — they're harder to forget and impossible to misplace.
- Write the dispose callback _once_, in the factory that creates the resource. The test never has to know how to clean up.
- If you can't use `using` yet (older TS, polyfill required), wrap the resource in a helper that exposes `setup` and `teardown` and pairs them with `try/finally` inside the test. The pattern is the same; the language feature is just shorter.

## The two checks per test file

Before considering a test file done:

1. **No `describe` deeper than zero** unless the level encodes a genuine context (rare). If you have one, justify it in a comment.
2. **No mutable variable** that is assigned in one place and read in another. Every test owns its own state; setup helpers return fresh objects.

If both hold, the file is maintainable; if either fails, refactor before adding the next test.