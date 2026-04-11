# Software Quality Assurance Plan

## 1. Overview

This document is about the Software Process Quality used for the Meditrack app. This app is used to allow health care professionals to manage patient records, visits, prescriptions, and allergy information. The information handled by this app is very sensitive and there are laws around it (e.g. HIPAA).

This information needs to be secure to ensure data privacy and compliance. The areas we care most about are prescription safety, patient registration and identification, role-based access control  and authentication.

We want to prioritise testing rather than keeping it as an afterthought. This will save us time later.

## 2. Scope

This plan describes the testing process, tools and methods used to test the application. It ensures that the MediTrack app is quality assured. We prioritised testing on high-risk features such as prescription safety, authentication, and role-based access control because these areas directly impact patient safety and data security.

### Within the Test Scope

- Registration and management of patients.
- Preparation and Validation of Prescriptions.
- Medicine Interaction checking.
- Management of allergy records.
- Role-based access control (Doctor, Nurse, Admin).
- Storing and retrieving patient data in databases.

### Outside the Testing Scope

- Infrastructure provided by third-party cloud providers.
- Security configuration of the hosting environment itself.

These things are the responsibility of platform providers, not ours. 

## 3. Testing Frameworks

### Unit and Integration Testing: Karma + Jasmine

Since our app is built on Angular, we will use Karma and Jasmine because they are the default for Angular. They let us run tests in a real browser and easily swap out Firestore for test data. We looked at other tools too, but they needed extra steps for setup to work with our tech stack. Therefore, the chosen tools are compatible with the Angular technology stack and the Shift-Left strategy of continuous testing.

Jasmine will be used to write test cases for: 
- Medicine Interaction validation logic.
- Prescription calculation rules.
- Role-based access control decisions.
- Patient data validation rules.

Karma will run the unit and integration tests automatically whenever changes are pushed into the repository. Running the test cases in browsers ensures the application works as expected in all browsers. This is crucial since the application is for healthcare professionals.

### Static Analysis: ESLint

We have already configured the linter via `ng lint`. This runs automatically in CI on every merge to the develop and main branches to catch linting errors. We use two environments for testing and deployment: Production is for real users with live data, while Staging is for testing with mock data. This allows us to test comprehensivley without impacting real patient records.

### CI Pipeline: GitLab CI

Our pipeline runs on every push and blocks merges if anything fails. This ensures that no code goes into production without proper testing, which is very critical in healthcare systems, as system failures can affect the integrity of the healthcare data. The DevOps team is responsible for this.

### Coverage reporting: Istanbul

In the case of MediTrack, the Istanbul tool would be incorporated into the CI/CD pipeline to obtain the code coverage reports after the execution of the tests. 

A high code coverage would imply that: 
- Business logic, such as Medicine Interaction rules, has been sufficiently tested.
- All the edge conditions have been covered.
- The dead code has been identified.

Although it is not possible to have 100% code coverage, which would imply the absence of errors in the code, a high code coverage would imply a high degree of confidence in the reliability of the code.

## 4. Testing Levels

### 4.1 Unit Testing

We will test individual functions and methods. These will check the validation of important parts of the app like:
- Medicine conflict and allergy checks.
- Access control and route protection.
- Form validation and display logic.
- Authentication and role-based redirection.

### 4.2 Integration Testing

For our MediTrack app, the integration testing will verify:
- Frontend services (Angular services).
- The database.
- User role restrictions (Doctor, Nurse and Admin).
- Authentication.

We will be checking these workflows:
- Adding a new patient.
- Issuing a prescription for a patient.
- Documenting patient allergies.
- Making sure user roles (Doctor, Nurse, Admin) restrict access to certain features.

Integration tests use a separate test database, so the main data is not affected.

### 4.3 System Testing

For our MediTrack app, system testing will use a black box approach to validate the complete end-to-end workflows from the user’s perspective. We will use Cypress because it provides fast end-to-end tests for Angular. So far this has been done manually and the results have been recorded in test cases document.

Some of the scenarios that we will test with Cypress:
- Doctor logs in and views patient list or creates a new patient.
- Doctor tries to add a prescription with conflict and gets an error.
- Doctor tries to prescribe a medicine matching a severe allergy and gets an error.
- Nurse logs in and can view patient list but cannot edit details.
- Admin logs in and sees users page and can change a user's role.
- Admin tries to navigate to patients page but gets redirected to users page.
- Unauthenticated users get redirected to login page.
- Logged-in user gets redirected away from login page.

### 4.4 Regression Testing

When new features are added or existing bugs are fixed, the CI pipeline re-runs the existing tests to ensure we do not break existing code elsewhere. The CI pipeline handles the regression test. This runs automatically whenever a new code is pushed to the repository. 

## 5. Non-Functional Testing

Other than functional testing, the system will undergo non-functional testing as well. Such tests are related to the quality of performance and reliability of MediTrack.

### Performance Testing

We will check that patient data retrieval and list rendering remain responsive under normal use. MediTrack is not expected to handle thousands of concurrent users. We have not yet focused on this because other testing needed more attention given the sensitive nature of our app.

### Security Testing

Since MediTrack handles sensitive medical data, security testing is very important to ensure:
- Authentication works correctly (Google Sign-In flow).
- Role-based access control is enforced at the route level and in the UI.
- Unauthorised users cannot reach restricted pages.
- Sensitive data is not exposed.

### Reliability Testing

The system should handle errors gracefully and notify user when an error is detected. It also entails confirming that the system can recover from faults without losing valuable data.

## 6. Risk-Based Testing

We looked at each module in the MediTrack app and categorised them by risk.

**High risk:**
- Medicine interaction checks: risk of prescribing conflicting medicines.
- Allergy block: risk of giving a patient a medicine they are allergic to.
- Route guards: risk of unauthorised users accessing sensitive features.
- Patient form validation: risk of invalid data entering the system.
- Authentication flow: risk of login or user roles not working correctly.

**Medium risk:**
- User role management: risk of wrong role assigned, but fixable by Admin.

**Low risk:**
- Visit recording: risk of missing notes, but they can be re-entered.
- Layout and navigation: only UI issues which are easily fixable.

## 7. Responsibilities

- SQA Plan: Gustavo, Amaan, Shaheer.
- Test Design: Quentin, Alex, Shaheer.
- Unit test implementation:  Saumitra, Shaheer. 
- Integration test implementation: Quentin, Alex, Saumitra. 
- System test execution: Gustavo, Amaan. 
- CI pipeline maintenance: Shaheer. 

## 8. Conclusion

Software Quality Assurance is critical for MediTrack because the application deals with sensitive medical data. By adopting a Shift-Left approach and designing tests early, we reduce the cost of finding and fixing defects later in the cycle.

The combination of unit testing, integration testing, system testing and regression testing ensures the application is validated at every level. The tools we have chosen are Jasmine, Karma, ESLint, GitLab CI and Istanbul. Through continuous testing and code coverage monitoring, we aim to deliver a system with reliable prescription and medicine interaction logic, consistent patient data, and properly enforced access control.

## 9. References

- [1] TestCollab, “Software Testing Strategies: The Complete Guide for QA Teams,” 2026. [Online]. Available: https://testcollab.com/blog/software-testing-strategies. Accessed: Feb. 22, 2026. 
- [2] Angular, “Testing with Karma and Jasmine.” [Online]. Available: https://angular.dev/guide/testing/karma. Accessed: Feb. 22, 2026. 
- [3] IBM, “What is Integration Testing?” [Online]. Available: https://www.ibm.com/think/topics/integration-testing. Accessed: Feb. 22, 2026. 
- [4] IBM, “What is System Testing?” [Online]. Available: https://www.ibm.com/think/topics/system-testing. Accessed: Mar. 1, 2026. 
- [5] SmartBear, “What Is Unit Testing? Understanding Unit Testing in Software Testing.” [Online]. Available: https://smartbear.com/learn/automated-testing/what-is-unit-testing/. Accessed: Feb. 22, 2026. 
- [6] E. Carocci, “Mocking Third-Party Services in Integration Testing,” Medium (Geek Culture). [Online]. Available: https://medium.com/geekculture/mocking-third-party-services-in-integration-testing-7ded9ac1fe83. Accessed: Feb. 22, 2026. 
- [7] Angular, “Testing services.” [Online]. Available: https://angular.dev/guide/testing/services#angular-testbed. Accessed: Feb. 22, 2026. 
- [8] Jasmine, “Jasmine Documentation.” [Online]. Available: https://jasmine.github.io/index.html. Accessed: Feb. 22, 2026.

##  10. Declaration of Authorship and AI Non-Usage

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