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
