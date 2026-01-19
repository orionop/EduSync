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

1. Navigate to the `app/` directory and install dependencies:
   ```bash
   cd app
   npm install
   ```

2. Set up environment variables:
   ```bash
   cd app
   cp .env.example .env
   ```
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
   ```

3. Set up the database:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the database migrations from `db/migrations/` in order:
     - `001_create_users_table.sql`
     - `002_update_users_table_add_missing_fields.sql`
     - `003_enhance_rls_policies.sql`
     - `004_update_trigger_for_oauth.sql`
     - `007_cross_user_connectivity.sql`
   - Configure OAuth providers in Supabase Dashboard (Google, GitHub, Discord)

4. Run the development server:
   ```bash
   cd app
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 📋 Pull Request Process

1. **Update your fork** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly:
   - Test in all affected portals (student, faculty, admin)
   - Ensure no console errors
   - Test edge cases
   - Verify responsive design on different screen sizes
   - Test accessibility features (keyboard navigation, ARIA labels)

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

The project follows a unified application structure in the `app/` directory:
- `app/src/components/` - React components organized by portal (admin/, faculty/, student/, shared/)
- `app/src/routes/` - Route components organized by portal
- `app/src/context/` - React Context providers
- `app/src/lib/` - Utility libraries and services
- `app/src/utils/` - Helper functions
- `app/src/styles/` - Global styles and theme

Guidelines:
- Place components in appropriate directories (`admin/`, `faculty/`, `student/`, or `shared/`)
- Use consistent naming conventions (PascalCase for components)
- Group related files together
- Keep files focused on a single responsibility
- Use `shared/` directory for components used across multiple portals

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

- Test your changes in all affected portals (student, faculty, admin)
- Test with different user roles (student, faculty, admin)
- Test edge cases and error scenarios
- Ensure responsive design works on different screen sizes
- Test cross-user communication features (notifications, messages, announcements)
- Verify loading states and empty states are properly displayed
- Test form validation and error handling
- Verify accessibility features (keyboard navigation, screen readers)

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
- Update CHANGELOG.md with your changes (following the existing format)
- Keep inline comments clear and helpful
- Document any new database migrations in `db/migrations/`
- Update `.env.example` if you add new environment variables

## 🔒 Security

- **Never commit** API keys, secrets, or credentials
- Use environment variables for sensitive data (prefixed with `VITE_` for client-side)
- Never log sensitive information in production (use `import.meta.env.DEV` checks)
- Report security vulnerabilities privately to the maintainer
- Follow security best practices
- Ensure all Supabase keys are in `.gitignore`
- Never expose service role keys in client-side code

## ❓ Questions?

If you have questions or need help:

- Open an issue for discussion
- Check existing issues and pull requests
- Review the README.md for setup instructions
- Check database migration files in `db/migrations/` for schema changes

## 🙏 Thank You!

Your contributions make EduSync better for everyone. Thank you for taking the time to contribute!

