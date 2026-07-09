# Contributing to [SDK Name]

Thanks for your interest in contributing! This is an unofficial, community-maintained Node.js SDK for the MyCover.ai API, and contributions of all kinds — bug fixes, new features, docs, tests — are welcome.

## Before you start

- Check the [issues](../../issues) list to see if your bug or feature is already being tracked.
- For anything non-trivial (new features, breaking changes), please open an issue first to discuss the approach before writing code. This avoids wasted effort if the change doesn't fit the project's direction.
- For small fixes (typos, docs, minor bugs), feel free to open a pull request directly.

## Getting started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/Glitzyken/mca-nodejs-sdk.git
   cd mca-nodejs-sdk
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a new branch for your change:
   ```bash
   git checkout -b fix/short-description
   ```
   Use a prefix that describes the change: `fix/`, `feat/`, `docs/`, `chore/`, `test/`.

## Making changes

- Keep pull requests focused — one fix or feature per PR is easier to review than a bundle of unrelated changes.
- Follow the existing code style. Run the linter/formatter before committing:
  ```bash
  npm run lint
  npm run format
  ```
- Add or update tests for any behavior you change. PRs that reduce test coverage will be asked for revisions.
- Update the README or relevant docs if your change affects the public API or usage.
- Write clear commit messages. Conventional Commits style is preferred but not strictly enforced, e.g.:
  ```
  fix: handle null response from payments endpoint
  feat: add support for webhook verification
  docs: update quickstart example
  ```

## Running tests

```bash
npm test
```

Please make sure all tests pass locally before opening a PR. If you're adding a new feature, include tests that cover it.

## Submitting a pull request

1. Push your branch to your fork.
2. Open a pull request against the `main` branch of this repository.
3. In the PR description, explain:
   - What the change does and why
   - Any related issue number (e.g. `Closes #12`)
   - How you tested it
4. A maintainer will review your PR, may request changes, and will merge once it's ready.

## Code of Conduct

Be respectful and constructive. This project follows a simple standard: assume good intent, give and receive feedback kindly, and keep discussions focused on the work.

## Licensing

By submitting a contribution to this project, you agree that it will be licensed under the same [Apache License 2.0](./LICENSE) that covers the rest of the codebase, and that you have the right to submit the work under that license.

## Questions?

Open an issue with the `question` label, or start a discussion in the repo's [Discussions](../../discussions) tab if enabled.
