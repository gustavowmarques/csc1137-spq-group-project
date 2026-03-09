# Software Quality Assurance Plan  
## Project: MediTrack – Patient Management System  
Course: CSC1137 – Software Process Quality  
Project Phase: Phase 2 – Test Strategy, Design and Prototyping  
Team Name: Group 1
Date: 16/02/2026

---

# 1. Introduction

MediTrack is a patient management system designed to allow healthcare professionals to manage patient records, visits, prescriptions, and allergy information securely and efficiently.

Due to the sensitive nature of healthcare data and the potential medical risks associated with incorrect prescriptions or unauthorized access, software quality is critical. This Software Quality Assurance (SQA) Plan defines the testing strategy, risk management approach, and validation methods that will be applied during development.

This plan follows a Shift-Left Testing strategy, where testing is designed early in the lifecycle to prevent defects rather than detect them late.

---

# 2. Quality Objectives

The primary quality objectives for MediTrack are:

- Ensure patient safety through correct prescription and drug interaction logic.
- Protect patient privacy via robust role-based access control (RBAC).
- Maintain data integrity in patient records.
- Prevent system crashes or data corruption.
- Achieve high test coverage before final release.

Target Coverage for Phase 4:
- ≥ 80% statement coverage
- ≥ 70% branch coverage

---

# 3. Testing Strategy

Testing will be performed at multiple levels:

| Testing Level      | Objective | Tools | Responsible |
|-------------------|----------|-------|--------------|
| Unit Testing       | Test individual functions and business logic | PyTest | Backend Developers |
| Integration Testing| Validate interaction between API, services, and database | PyTest + Test Database | Development Team |
| System Testing     | Validate complete user workflows | Manual Testing | QA/Team |
| Acceptance Testing | Validate system against User Stories and acceptance criteria | Manual + Automated | Team |
| Regression Testing | Ensure new changes do not break existing features | CI Pipeline | DevOps |

---

# 4. Testing Types and Approach

## 4.1 Unit Testing

Unit tests will validate:
- Drug interaction logic
- Patient data validation
- Access control decisions
- Prescription creation logic

Tests will be automated using PyTest and executed through the CI pipeline.

---

## 4.2 Integration Testing

Integration testing will validate:
- API endpoints interacting with the database
- Authentication and authorization flows
- Data persistence and retrieval

Test databases will be used to isolate test data.

---

## 4.3 System Testing

System testing will validate:
- Patient registration workflow
- Prescription workflow
- Allergy recording
- User role restrictions (Doctor vs Nurse vs Admin)

This will simulate real-world usage scenarios.

---

## 4.4 Acceptance Testing

Each User Story in the backlog will be linked to one or more test cases.

Acceptance criteria defined in Phase 1 will be validated explicitly through structured test cases.

A Traceability Matrix will be maintained to ensure complete requirement coverage.

---

# 5. Black Box Testing Strategy

The following Black Box techniques will be applied:

## 5.1 Equivalence Partitioning

Used for:
- Patient age validation
- Input fields (e.g., email, phone number)
- Prescription dosage values

Example:
Age field partitions:
- Invalid: Age < 0
- Valid: 0 ≤ Age ≤ 120
- Invalid: Age > 120

---

## 5.2 Boundary Value Analysis

Used for:
- Dosage limits
- Field length restrictions
- Numeric validation ranges

Example:
If dosage limit = 100mg:
Test values:
- 99mg
- 100mg
- 101mg

---

## 5.3 Decision Table Testing

Applied to complex business logic:

### Drug Interaction Logic Example

| Patient Takes Drug A | Patient Takes Drug B | Warning Required |
|----------------------|----------------------|------------------|
| Yes                  | Yes                  | Yes              |
| Yes                  | No                   | No               |
| No                   | Yes                  | No               |
| No                   | No                   | No               |

Decision tables will be created for all high-risk conditional logic.

---

# 6. Risk-Based Testing

The following modules are classified as high risk:

| Module | Risk Level | Reason | Testing Focus |
|--------|------------|--------|---------------|
| Drug Interaction Engine | High | Patient safety impact | Decision Table + Unit Testing |
| Role-Based Access Control | High | Privacy & legal risk | Authorization testing |
| Patient Record Updates | High | Data integrity risk | Integration testing |
| Prescription Dosage Validation | Medium | Medical correctness | Boundary testing |
| User Authentication | Medium | Security risk | Integration + System testing |

High-risk modules will receive priority in test design and coverage.

---

# 7. Automation and Continuous Integration

Continuous Integration (CI) will:

- Automatically build the application
- Run all unit tests on every push
- Generate test coverage reports
- Fail the build if tests fail

Tools:
- GitHub Actions (CI)
- PyTest
- Coverage.py

This ensures early defect detection and supports DevOps best practices.

---

# 8. Traceability Strategy

A Requirements Traceability Matrix (RTM) will be maintained linking:

- User Stories
- Test Case IDs
- Test Results
- Coverage status

This ensures full requirement validation and transparency.

---

# 9. Prototype Validation Strategy

A skeletal implementation of core MediTrack modules will be developed to:

- Validate architectural decisions
- Confirm API structure
- Enable early unit testing

Full business logic implementation will follow only after test design completion.

---

# 10. Conclusion

This SQA Plan establishes a structured, risk-driven, and automation-focused testing strategy for MediTrack.

By designing testing strategies early and prioritizing high-risk modules, the team aims to:

- Reduce defect introduction
- Improve maintainability
- Ensure patient safety
- Achieve strong test coverage targets
- Align with industry best practices in Agile and DevOps environments


