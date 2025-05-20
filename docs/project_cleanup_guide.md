# Shakti Margam Project Cleanup Guide

This document provides guidelines for maintaining a clean and organized project structure for the Shakti Margam application.

## Regular Cleanup Tasks

### 1. Remove Temporary Files

Regularly check for and remove temporary files:

```bash
# Find temporary files
find . -name "*.tmp" -o -name "*.bak" -o -name "*.old" -o -name "temp*"

# Remove temporary files (after reviewing)
find . -name "*.tmp" -o -name "*.bak" -o -name "*.old" -o -name "temp*" -delete
```

### 2. Clean Build Artifacts

Remove build artifacts before committing:

```bash
# Clean build artifacts
rm -rf dist
rm -rf build
rm -rf .cache
```

### 3. Update Dependencies

Regularly update dependencies and remove unused ones:

```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Find unused dependencies
npx depcheck
```

## Code Organization Guidelines

### 1. Component Structure

- Place components in appropriate directories:
  - `src/components`: Reusable UI components
  - `src/pages`: Page-level components
  - `src/layouts`: Layout components
  - `src/context`: Context providers

### 2. File Naming Conventions

- Use PascalCase for component files: `ComponentName.tsx`
- Use camelCase for utility files: `utilityName.ts`
- Use kebab-case for CSS files: `component-name.css`

### 3. Import Organization

- Group imports in the following order:
  1. React and third-party libraries
  2. Components
  3. Hooks and contexts
  4. Utilities and helpers
  5. Types and interfaces
  6. Assets and styles

## Documentation Organization

- Keep all documentation in the `docs` directory
- Use descriptive filenames for documentation files
- Organize documentation by topic:
  - Architecture
  - Development guides
  - Deployment guides
  - User guides

## Git Practices

### 1. Gitignore

Ensure the following are in `.gitignore`:

- Build artifacts: `dist/`, `build/`
- Dependency directories: `node_modules/`
- Environment files: `.env`, `.env.local`
- Editor files: `.vscode/`, `.idea/`
- Temporary files: `*.log`, `*.tmp`, `*.bak`

### 2. Branch Management

- Delete merged branches
- Keep feature branches up to date with main
- Use descriptive branch names: `feature/feature-name`, `bugfix/issue-description`

## Pre-Deployment Checklist

Before deploying, ensure:

1. All console.log statements are removed or commented out
2. All TODO comments are addressed
3. All temporary code is removed
4. All tests pass
5. Build completes successfully
6. Environment variables are properly configured

## Monitoring and Maintenance

- Regularly check for security vulnerabilities: `npm audit`
- Monitor performance and optimize as needed
- Update documentation when making significant changes
- Review and clean up code regularly
