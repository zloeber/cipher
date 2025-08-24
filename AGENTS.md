# Cipher Developer Guide

## Project Structure
- ./src - main code entrypoint
- ./memAgent/cipher.yml - Application configuration
- ./docs - documentation for this project
- ./examples - example project implementations

## Code Style Guidelines
- If you find an AGENTS.md file in the target directory of your code use its defined guidelines instead of these
- Write TypeScript code compliant with the latest ECMAScript standards, optimized for readability and maintainability
- Use explicit type annotations for all variables, functions, parameters, and return types
- Always use interfaces or type aliases for data structures
- Use interface definitions for creating pluggable code bases
- Maintain a component-driven project structure
- Avoid duplication by using clear, modular code organization
- 2-space indentation, consistent with standard TypeScript style
- Use path utilities from Node.js (e.g., `path.join()`), imports at the top of files
- Remove unused imports and variables (use '_' for unused)
- Combine if statements, use ternary operators for simple logic
- Prefer native Node.js libraries over spawning subprocesses
- Private members prefixed with `#` (private fields) or `_` (private methods)
- Use `instanceof` or `typeof` for type checks

## Naming Conventions
- Use `camelCase` for variables, functions, and object properties
- Use `PascalCase` for class, interface, type alias, and enum names
- Use `UPPER_SNAKE_CASE` for constants and environment variables, prefixed with provider or context (e.g., `OLLAMA_API_KEY`, `OPENAI_ORG_ID`)
- Filenames should use `kebab-case` and match the exported entity when possible (e.g., `user-service.ts` for `UserService`)
- Use descriptive and consistent configuration file names (e.g., `agents.yaml`, `cipher.config.ts`)
- Avoid abbreviations; prefer clarity and explicitness in all names

## Error Handling
- Use try-catch with meaningful error messages
- No bare catch statements; always handle or log errors
- Log errors with a unified logger (e.g., Winston, Pino)
- Always use secure configuration file loading
- Functions should return the expected type or throw an error

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
