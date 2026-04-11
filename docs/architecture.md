## Architecture Overview

MediTrack is built across three layers: frontend, backend, and database. The Angular frontend connects to Firebase via the AngularFire SDK, which handles authentication and real-time data access. Firebase then communicates with Firestore through the Google Cloud Firestore API.

- **Frontend (Angular):** Role-based UI views for Admin, Doctor, and Nurse. Route guards and UI elements enforce RBAC. Forms validate patient data, prescriptions, and allergies before submission.
- **Backend (Firebase):** Handles authentication via Google Sign-In. Firebase Auth manages user sessions and validates every request using tokens. There is no custom backend server so Firebase acts as the backend layer.
- **Database (Firestore):** Real-time NoSQL database with five collections: Patients, Visits, Prescriptions, Allergies, and Users. All records are linked via patient ID. Firestore Security Rules enforce role-based access at the data level.

## Tech Stack
- Frontend: Angular
- Authentication: Firebase Authentication via Google Sign-In
- Database: Cloud Firestore
- Hosting: Firebase Hosting
- CI/CD: GitLab CI
- Testing: Karma, Jasmine

## Roles
- Doctor / Nurse: access to patients, visits, prescriptions, and allergies (nurse can only view-only)
- Admin: user management only

## Data Model
Five Firestore collections, all linked by `patientId`:

- **Users:** uid, email, displayName, role
- **Patients:** id, firstName, lastName, dateOfBirth
- **Visits:** id, patientId, notes, createdBy
- **Prescriptions:** id, patientId, drugName, startDate, endDate, durationDays, dailyDosage
- **Allergies:** id, patientId, allergen, severity

## CI/CD Pipeline

The pipeline has 5 stages i.e. lint, test, sonar, build, deploy and first three stages run on every commit to `develop` or `main` branches while the build and deploy only run on merge request targeting `develop` or `main`. Each environment has its own separate Firestore database.

- **Staging:** deployed automatically when a feature branch is merged into `develop`
- **Production:** deployed automatically when `develop` is merged into `main`

## Declaration of Authorship and AI Non-Usage

### By submitting this project, the team declares that:

1. All work submitted is the original work of the team members.
2. No AI, LLM, or generative tools were used to generate project documentation,
   reports, source code, or assessment submissions.
3. All work complies with Dublin City University’s academic integrity policy
   and the requirements of the CSC1137 module.

### Signatories
- Gustavo
- Shaheer Imran
- Saumitra Bhosle
- Quentin L.
- Amaan
- Alexis Roi Pechon

---