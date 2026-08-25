# Assertions

Assertions are the heart of any test. They convert the intention into a checkable promise: _this is what must be true when the code is done_.

## Skip implicit assertions

Some things are guaranteed by the action itself. Asserting them again is noise — and worse, it can mask the real failure behind a less informative one.

- `render(<Component />)` implies _Component rendered_. Don't follow it with a `getByTestId` existence check.
- `fireEvent.change(input, { value: 'x' })` implies _the input exists and its value changed_. Don't re-assert either.
- `expect(obj).toEqual({ a: 1 })` implies _obj is an object with key a equal to 1_. Don't separately assert `toBeTypeOf('object')` or `toHaveLength`.

When a redundant assertion is the first to fail, the error message points you at the wrong thing ("expected length 3, got 2") instead of the right thing ("expected ['a','b','c'], got ['a','b']"). The diff is the signal; the count check throws it away.

## One assertion, one intention

A test should fail for one reason. Two assertions in one test can both pass when one intention is broken (the failing assertion is masked) or both fail when the same intention is broken (noisy output).

When you find yourself adding a second assertion, ask: _is this the same intention, or am I testing two intentions in a trench coat?_ Split into two tests if it's the latter.

## Assert on the outcome, not the steps

`expect(result).toBe(expected)` over `expect(steps).toEqual([...])`. The user doesn't care which internal function you called; they care about the result.

If a step-order assertion feels necessary, it's usually a sign the function does too much — split the function, not the test.

## Inverse assertions for "should NOT happen"

`expect(notification).not.toBeInTheDocument()` runs once and passes. If the notification appears _later_, you get a false positive. The fix:

```ts
// Flip the assertion: wait for the thing to appear, then assert the wait failed.
const visible = waitFor(() => expect(notification).toBeVisible())
await expect(visible).rejects.toThrow()
```

The inverse assertion pattern works any time the absence is the contract and the presence might be delayed. Pair it with `waitFor` (never `sleep`) — `sleep` is a guess, `waitFor` is a state.

## When to throw with a plain `if`

Custom test helpers and setup utilities sometimes need a sanity check that isn't part of the intention. A plain `if (!foo) throw new Error('test setup broken: ...')` is fine — and clearer than wrapping setup noise in `expect()` calls that pollute the failure output. The Golden Rule applies to assertions, not to setup integrity checks.
