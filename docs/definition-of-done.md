# Definition of Done (DoD)

A user story is considered Done only when:

- Code is implemented according to acceptance criteria with healthcare-specific validations (e.g., allergy warnings, prescription conflicts)
- Role-based access control (RBAC) is correctly enforced for Doctor/Nurse/Admin permissions
- Unit tests are written and passing with adequate coverage of business logic and security rules
- Code builds successfully in the CI/CD pipeline (lint, test, build stages pass)
- Changes are merged via Merge Request with at least one peer review
- No critical security issues or data integrity violations remain
- Documentation is updated for user-facing features and API changes (if applicable)
- Patient data privacy considerations are verified and compliant
- Story is moved to "Done" on the project board