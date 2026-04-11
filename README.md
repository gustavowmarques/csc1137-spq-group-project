# CSC1137 – Software Process Quality  

## Project Overview

This repository contains the semester-long group project for the module  
**CSC1137 – Software Process Quality**.

The objective of this project is to design and implement a software application while
demonstrating:
- Agile development methodologies (Scrum / XP)
- Software Quality Assurance (SQA)
- Test-driven and shift-left testing approaches
- Continuous Integration (CI)
- Code reviews and quality metrics


---

## Team Information
 
- Gustavo: Project Leader and Documentation Lead
- Shaheer Imran: System Architect and Developer
- Saumitra Bhosle: Developer and Tester
- Quentin L. : Black Box Tester
- Amaan: Scrum Master
- Alexis Roi Pechon: Tester and Documenter

---

## Project Domain

**Selected Project:** Option B - *MediTrack* (Patient Management System)

The project is a healthcare-oriented application designed to support the management of patient records, visits, prescriptions, and allergies.

This project was selected following a team vote and was chosen due to its strong alignment
with the module’s focus on **software quality assurance**, particularly in areas such as
decision-table testing, data integrity, and role-based access control.

The MediTrack project is live at: https://csc1137-spq-meditrack.web.app

---

## Development Approach

The project follows an **Agile, incremental development lifecycle**:

- 14 days Sprint-based delivery with sprint planning, sprint retrospective and mid-sprint syncup.
- User Stories with conformance to Definition of Ready (DoR) and Definition of Done (DoD)
- Continuous Integration using GitLab CI.
- Mandatory code reviews via Pull Requests

---

## Repository Structure

```
.
├── docs/                   # Project documentation (proposal, QA plan, testing, meeting minutes)
├── Angular/                # Angular project (source code and configuration)
│   ├── src/                # Application source code
│   ├── dist/               # Build output (ignored in git)
│   └── angular.json
├── .gitlab-ci.yml          # GitLab CI/CD pipeline configuration
└── README.md               # Project overview (this file)
```
---

## Quality Assurance Focus

Quality is designed **from the start**, not added at the end.

Our testing activities include:

- Black Box Testing  
  - Equivalence Partitioning  
  - Boundary Value Analysis  
  - Decision Tables  
  
  
- White Box Testing  
- Unit tests with coverage targets  
- Continuous Regression Testing  
- Static Code Analysis  
- Basic Security Testing

---

## Continuous Integration

A CI pipeline is configured to:

- Automatically build the project on each merge to main and develop branches
- Run automated tests on each commit
- Enforce baseline quality checks through SonarQube

This pipeline was expanded in phase 4 to include:
- Coverage reporting
- Static analysis

---

## Project Phases

| Phase | Focus Area | Duration |
|------|-----------|----------|
| Phase 1 | Inception & Agile Setup | Weeks 1–4 |
| Phase 2 | Test Strategy & Design | Weeks 5–8 |
| Phase 3 | Technical Review & Demo | Week 11 |
| Phase 4 | Implementation & Verification | Week 12 |

---

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
