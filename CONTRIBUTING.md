# Contributing to EduSync

Thank you for your interest in contributing to EduSync! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/EduSync.git
   cd EduSync
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## 📝 Development Workflow

### Setting Up Development Environment

1. Install dependencies for each portal:
   ```bash
   cd student && npm install
   cd ../admin && npm install
   cd ../faculty && npm install
   cd ../login && npm install
   ```

2. Set up environment variables (see `.env.example` files in each portal directory)

3. Set up the database (see `db/README.md`)

4. Run the development servers:
   ```bash
   # Terminal 1
   cd student && npm run dev
   
   # Terminal 2
   cd faculty && npm run dev
   
   # Terminal 3
   cd admin && npm run dev
   
   # Terminal 4
   cd login && npm run dev
   ```

## 📋 Pull Request Process

1. **Update your fork** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly:
   - Test in all affected portals
   - Ensure no console errors
   - Test edge cases

4. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: Add new feature description"
   # or
   git commit -m "fix: Fix bug description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots if UI changes
   - Testing notes

## 📐 Coding Standards

### TypeScript/React

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components
- Prefer named exports over default exports
- Use meaningful variable and function names

### Code Style

- Use ESLint configuration provided in the project
- Format code with Prettier (if configured)
- Follow existing code patterns and structure
- Add comments for complex logic
- Keep functions small and focused

### File Structure

- Place components in appropriate directories
- Use consistent naming conventions (PascalCase for components)
- Group related files together
- Keep files focused on a single responsibility

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: Add placement eligibility calculator
fix: Resolve authentication redirect issue
docs: Update installation instructions
```

## 🧪 Testing

- Test your changes in all affected portals
- Test with different user roles (student, faculty, admin)
- Test edge cases and error scenarios
- Ensure responsive design works on different screen sizes

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** of the bug
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** (if applicable)
6. **Environment**:
   - Browser and version
   - Operating system
   - Node.js version

## 💡 Suggesting Features

When suggesting features:

1. Check if the feature has been requested before
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity

## 📚 Documentation

- Update README.md if you change setup instructions
- Add JSDoc comments for new functions/components
- Update CHANGELOG.md with your changes
- Keep inline comments clear and helpful

## 🔒 Security

- **Never commit** API keys, secrets, or credentials
- Use environment variables for sensitive data
- Report security vulnerabilities privately to the maintainer
- Follow security best practices

## ❓ Questions?

If you have questions or need help:

- Open an issue for discussion
- Check existing issues and pull requests
- Review the documentation in `docs/` directory

## 🙏 Thank You!

Your contributions make EduSync better for everyone. Thank you for taking the time to contribute!

