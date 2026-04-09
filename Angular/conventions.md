# Coding & Git Conventions

---

## 1. Branch Naming

All branch names must include the issue ID as a prefix so GitLab can automatically link work items with the branch:
- `<issue-id>-<type>/<short-description>`   

**Example:**
* `123-feature/add-login-form-validation`
* `234-bugfix/profile-display-name-display-issue`
* `75-docs/update-conventions`

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
Specific to your changes and it must include the issue ID at the end.

```powershell
Format: <type>: <subject> Ref <#issue-id>
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
feat: added login form validation Ref #12
fix: corrected user display name formatting Ref #23
refactor: simplified navigation logic Ref #34
```
## 4. Merge Request Practices
All merge request descriptions must include the following at the end to ensure merge requests are linked directly to the issue:
```powershell
- Related to #<issue-id>
- Closes #<issue-id>
```

## 5. Coding Best Practices
Readable names: Variable and function names should be meaningful and clear. Avoid vague names like x, temp, data.  
Comments: Add comments where necessary; explain “why” not “what.”  
Maintenance: Keep code modular, reusable, and maintainable. Run npm run lint before committing.

## 6. General Tips
Always pull the latest main before starting work.  
Fix linting issues immediately.  
Commit messages must reflect exactly what the changes do.  
Keep components, services, and modules focused and small.