---
title: Coding Conventions
description: Our take on coding and design in general
---

This page documents the coding conventions we follow at Florete. These are not rigid rules but agreed‑upon practices that emerge from code reviews and team discussions. They help us maintain consistency, reduce friction during reviews, and make the codebase more predictable for everyone.

When you encounter a situation where multiple approaches seem equally valid, these conventions provide a default direction. They are living notes - we add more of them as the project evolves and as we learn better ways of working.

### Functions

Functions should have single purpose and clean verb-based name. It is bad if a function does more than one thing and is called `doThisAndThat`.

### Unit Tests

Unit tests should be written in a way to treat code under test as white-box, not black-box. This means unit tests should explicitly test private APIs, not only public APIs. This is especially true for high-level public APIs - it is often infeasible to cover all the internal branches via high-level tests.

### Error Handling (Rust)

A module's `Error` type is part of its public API: callers will match on it, log it, and propagate it. Expose only as many variants as callers actually have a reason to handle differently.

- **Default to `struct Error(String)`** with ad‑hoc messages constructed at the call site. This is the right shape for the vast majority of modules: the caller's only meaningful response is "propagate or report".
- **Use `enum Error { … }`** only when callers genuinely need to branch on the variant (e.g. retry on one kind, fail on another). Adding variants "in case someone wants them later" turns the error into noise.
- **Message style**: capitalized first word, no trailing period — `Error::new("Failed to parse CSR")`. Treat them like log lines.

We propagate errors with [`error-stack`](https://docs.rs/error-stack), wrapping them as `Report<Error>`:

- **Use `change_context(Error::new("…"))`** when crossing a module boundary, i.e. when an underlying error from another crate or module is being turned into *our* module's error. Inside a single module, just return your `Error` directly — chaining contexts within one module adds noise without adding information.
- **Use `change_context_lazy(|| Error::new(format!("…{x}…")))`** only when the new context is non‑trivial to construct (allocates beyond a string literal, calls a function, captures a heavy value). For simple literals, prefer plain `change_context` — the happy‑path allocation is negligible and `_lazy` adds a closure layer.
- **Describe what was being attempted**, not what failed underneath — `change_context(Error::new("Failed to sign CSR"))` is more useful at the call site than re‑stating the lower error.
- **Avoid `map_err` for error wrapping** — it discards the underlying error and breaks the `Report` chain, so debug output loses the original cause. Reach for it only when `change_context` is not available, which is rare: the underlying error must implement `std::error::Error + Send + Sync + 'static`. The usual culprits are errors carrying borrowed data (`&'a str` inside), non-`Send`/`Sync` errors (hold an `Rc`/`RefCell`), or types from a library that aren't wired up as `Error` at all. If you do reach for `map_err`, fold any salient detail from the discarded error into the new message.

### API Design

#### Make impossible states unrepresentable

If an API does not allow some combination of parameters, **there should be no way to pass that combination**. Don't accept it and then runtime-reject: prevent the call from type-checking. The library API should be *total* — every well-typed call is a valid call.

The technique is to introduce a *subset type* for the restricted parameter and a constructor that converts the unrestricted form into it. Example: in `core::identity`, `Kind` has six variants but only `Service` and `Vertex` can be bound to a node. Two functions instead of one:

```rust
pub fn build_id_in_cluster(td, kind: Kind, name) -> Result<SpiffeId, _>; // any Kind
pub fn build_id_on_node(td, kind: NodeScopableKind, node, name) -> Result<SpiffeId, _>; // subset
```

`NodeScopableKind` is a 2-variant enum and `Kind::into_node_scopable() -> Option<NodeScopableKind>` is the only way to obtain one. Calling `build_id_on_node(_, Kind::User, _, _)` doesn't compile.

**Where the runtime check goes:** at the boundary that turns untyped input into typed values — CLI flag parsing, YAML/JSON deserialization, RPC handlers. Those layers are inherently partial because they consume strings; their job is to convert successfully (and call the typed primitive) or fail loudly. The library trusts what it receives.

If you find yourself writing the same boundary dispatch in two places (e.g. two binaries both translate `(kind, optional_scope) → SpiffeId`), expose a **convenience wrapper next to the typed primitives**, not in `cli`/binary code. The wrapper is partial on input but its implementation must route through the typed primitives — it can't construct a bad combination either; it only translates user input to the typed call.

**Net rule:** the type system enforces what's representable; the parser/CLI layer enforces what was actually typed. The runtime check exists in exactly one place — at the trust boundary — never in the trusted core.
