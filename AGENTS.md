# Cipher Developer Guide

## General Instructions:

- Parse and prioritize the directions defined in `AGENTS.md` that are closest to the code you are working on.
- When generating new TypeScript code, please follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- All code should be compatible with TypeScript 5.0 and Node.js 18+.
- Prefer native Node.js libraries over spawning subprocesses.

## Coding Style:

- Interface names should be prefixed with `I` (e.g., `IUserService`).
- Private class members should be prefixed with an underscore (`_`).
- Always use strict equality (`===` and `!==`).
- Maintain a component-driven project structure.
- Avoid duplication by using clear, modular code organization.
- 2-space indentation, consistent with standard TypeScript style.

## Regarding Dependencies:
- Avoid introducing new external dependencies unless absolutely necessary.
- If a new dependency is required, please state the reason.

## Project Structure
- If `.metagit.yml` exists, parse and use it for locating important component paths .
- `./src/app` - frontend code and application entrypoints.
- `./src/core` - core logic and backend components.
- `./memAgent/cipher.yml` - default application configuration.
- `./docs` - documentation for this project.
- `./examples` - example project implementations.

## Security

- No hardcoded sensitive data
- Use environment variables for secrets
- Sanitize inputs to external services

## Tools

- pnpm: Node.js package manager
- eslint/prettier: Formatting and linting
- jest: Testing framework
- tsc: Type checking

## Command-Line Tools

- Use the `gh` command-line to interact with GitHub.
- Use the `glow` command-line to present markdown content.
- Use the `jq` command to read and extract information from JSON files.
- The `rg` (ripgrep) command is available for fast searches in text files.
- Pipe content into `pbcopy` to copy it into the clipboard. Example: `echo "hello" | pbcopy`.
- Pipe from `pbpaste` to get the contents of the clipboard. Example: `pbpaste > fromclipboard.txt`.
- Unless instructed otherwise, always use the `pnpm` Node.js package manager for JavaScript/TypeScript.
  - `pnpm run ...` for running scripts.
  - `pnpm ...` for managing environments, installing packages, etc.

## Documentation Sources

- If working with a new library or tool, consider looking for its documentation from its website, GitHub project, or the relevant llms.txt.
  - It is always better to have accurate, up-to-date documentation at your disposal, rather than relying on your pre-trained knowledge.
- You can search the following directories for llms.txt collections for many projects:
  - https://llmstxt.site/
  - https://directory.llmstxt.cloud/
- If you find a relevant llms.txt file, follow the links until you have access to the complete documentation.
