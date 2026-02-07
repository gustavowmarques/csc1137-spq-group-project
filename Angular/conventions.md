# MediTrack - Team Coding & Git Cheatsheet

Quick reference for Angular frontend development and Git workflow.

---

## 1. Branch Naming

- **Features:** `feature/<short-description>`  
- **Bugfixes:** `bugfix/<short-description>`  
- Branch names should be **clear and specific**.

**Example:**
* `feature/added-login-form-validation`
* `bugfix/profile-display-name-display-issue`

---

## 2. Before Committing

Always ensure your branch is up-to-date and linted:

```powershell
# pull latest changes from main
git checkout main
git pull origin main
git checkout <your-branch>

# run Angular linter
ng lint
Note: Fix all linting errors before committing. Commit only tested, working code.
```

## 3. Commit Messages
Use imperative style and be specific to your changes:

```powershell
Format: <type>: <subject>
```
Types:
```powershell
feat → new feature
fix → bug fix
refactor → code restructuring
docs → documentation
test → adding/fixing tests
```
Commit message examples:
```powershell
feat: add login form validation
fix: correct user display name formatting
refactor: simplify navigation logic
```

## 4. Coding Best Practices
Readable names: Use meaningful variable, function, and class names. Avoid vague names like x, temp, data; prefer descriptive names.  
Comments: Add comments where necessary; explain “why” not “what.”  
Maintenance: Keep code modular, reusable, and maintainable. Run ng lint before committing.

## 5. General Tips
Always pull the latest main before starting work.  
Fix linting issues immediately.  
Commit messages must reflect exactly what the changes do.  
Keep components, services, and modules focused and small.