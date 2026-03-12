# Coding & Git Conventions

---

## 1. Branch Naming

- **Features:** `feature/<short-description>`  
- **Bugfixes:** `bugfix/<short-description>`  

**Example:**
* `feature/added-login-form-validation`
* `bugfix/profile-display-name-display-issue`

---

## 2. Before Committing

Ensure your branch is up-to-date and linted:

```powershell
# pull latest changes from main
git checkout main
git pull origin main
git checkout <your-branch>

# run Angular linter from Angular folder
npm run lint
Note: Fix all linting errors before committing.
```

## 3. Commit Messages
Specific to your changes:

```powershell
Format: <type>: <subject>
```
Types:
```powershell
feat: new feature
fix: bug fix
refactor: code restructuring
docs: documentation
test: adding/fixing tests
```
examples:
```powershell
feat: add login form validation
fix: correct user display name formatting
refactor: simplify navigation logic
```

## 4. Coding Best Practices
Readable names: Variable and function names should be meaningful and clear. Avoid vague names like x, temp, data.  
Comments: Add comments where necessary; explain “why” not “what.”  
Maintenance: Keep code modular, reusable, and maintainable. Run npm run lint before committing.

## 5. General Tips
Always pull the latest main before starting work.  
Fix linting issues immediately.  
Commit messages must reflect exactly what the changes do.  
Keep components, services, and modules focused and small.