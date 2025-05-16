# Contributing to echord

Thank you for considering contributing to echord! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `pnpm install`
3. Create a `.env` file based on `.env.example`
4. Run tests with `pnpm test`

## Development Workflow

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Run tests to ensure your changes don't break existing functionality
4. Submit a pull request

## Code Style

This project uses ESLint and Prettier. Before submitting a PR:

1. Run `pnpm lint` to check for lint errors
2. Run `pnpm format` to format the code

## Testing

Add tests for any new features or bugfixes:

1. Add unit tests for core functionality
2. Add integration tests if necessary
3. Run tests with `pnpm test`

## Documentation

Update documentation when adding or changing features:

1. Update the README.md if necessary
2. Update or add JSDoc comments to public API functions
3. Add examples if appropriate

## Pull Request Process

1. Update the README.md if necessary
2. Update the version number according to [semantic versioning](https://semver.org/)
3. The PR should pass all CI checks
4. Your PR will be reviewed by maintainers

## Questions?

If you have any questions or need help, feel free to open an issue or discussion. 