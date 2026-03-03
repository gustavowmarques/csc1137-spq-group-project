## Tech Stack
- Frontend: Angular
- Authentication: Firebase Authentication via Google Sign-In
- Database: Cloud Firestore
- Hosting: Firebase Hosting
- CI/CD: GitLab CI
- Testing: Karma, Jasmine

## Roles
- Doctor / Nurse: access to patients, visits, prescriptions, and allergies
- Admin: user management only

## Environments
- Staging: deployed automatically when a feature branch is merged into `develop`
- Production: deployed automatically when `develop` is merged into `main`
