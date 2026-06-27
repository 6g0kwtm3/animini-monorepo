# Code coverage

Code coverage measures _how much of the implementation was executed_, not _how much of the intention was validated_. The two can diverge completely.

## The trap

Code coverage is an implementation metric. It cannot see intention. A test that drives 100% of `getParity()`'s branches proves one statement ran, not that parity is computed correctly. A test that hits every line of `isEven` proves the function was called, not that odd inputs return false.

Worse: optimizing for coverage pulls tests toward implementation. The fastest way to 100% coverage is to write tests that call every function with placeholder inputs and assert on return shape — tests that survive every refactor by being meaningless.

## When coverage helps

Used as a **spotting tool**, not a target, coverage surfaces:

- Functions nobody is testing.
- Branches you missed (the odd case in `getParity`).
- Dead code (lines never executed in any test).
- A new PR that drops coverage on an unrelated module (often a real bug; occasionally a misconfigured threshold).

Run coverage, read the report, decide what to test. Don't let the report decide for you.

## When to ignore coverage

- The percentage is the target — chasing it produces noise.
- A coverage drop blocks a legitimate PR — investigate, but don't gate merges on it.
- Coverage is used as a proxy for test quality — it isn't one. Two tests at 100% coverage can be one intention-validating test and one no-op.
- The number is reported to stakeholders as a quality KPI — it isn't a quality KPI.

## The criterion that matters

For each test, ask: _which intention does this validate, and which assertion would fail if that intention broke?_ If you can answer crisply, the test is doing its job. Coverage can't answer that — only reading the test can.
