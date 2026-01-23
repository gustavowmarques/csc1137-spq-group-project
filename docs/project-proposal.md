# CSC1137 – Software Process Quality  
## Phase 1: Project Proposal

---

## 1. Project Identification

**Project Title:**  
MediTrack – Patient Management System

**Module:** CSC1137 – Software Process Quality  
**Team Size:** 6  
**Semester:** Spring 2026
---

## 2. Project Overview

This project involves the development of **MediTrack**, a patient management system designed to support healthcare professionals in managing patient information in a structured and reliable manner.

The primary objective of this project is not only to deliver a functional software application, but to demonstrate the application of software process quality principles, including Agile planning, early test design, continuous integration, and structured quality assurance practices.

The system will be developed incrementally across four defined project phases, with a strong emphasis on process quality, traceability, and verification rather than feature volume.

---

## 3. Project Domain and Problem Statement

**Domain:** Healthcare

Healthcare systems rely heavily on accurate, consistent, and secure handling of patient data. Errors in patient records, prescriptions, or allergy information can lead to serious consequences and therefore demand robust validation, decision logic, and access control.

The MediTrack system aims to address these challenges by providing a controlled
environment for managing patient records, visits, prescriptions, and llergies, while placing strong emphasis on correctness, data integrity, and role-based access control.

---

## 4. Target Users and Stakeholders

The system is intended for the following user roles:

- **Doctors:**  
  Responsible for recording patient visits, prescriptions, and reviewing medical history.

- **Nurses:**  
  Responsible for viewing patient information and supporting clinical workflows within
  defined access permissions.

- **System Administrators (if applicable):**  
  Responsible for managing user accounts and access roles.

These distinct roles provide a clear basis for access control and security testing in
later project phases.

---

## 5. High-Level Functional Scope

At a high level, the MediTrack system will support the following functionality:

- Creation and management of patient records  
- Recording of patient visits and prescriptions  
- Management of patient allergy information  
- Validation of prescription rules and potential conflicts  
- Enforcement of role-based access control  

These features are intentionally defined at a high level and will be refined into detailed User Stories during backlog creation.

---

## 6. Quality and Testing Focus

From the outset, the project adopts a **shift-left testing approach**, where quality assurance considerations are addressed early in the development lifecycle.

Key quality concerns for this system include:

- Correct handling of business decision logic (e.g. prescription constraints)
- Validation of user input and boundary conditions
- Protection of patient data through access control
- Data consistency and integrity
- Maintainability and testability of the codebase

These concerns will directly inform the testing strategy and test design activities undertaken in Phase 2.

---

## 7. Agile Process and Planning Approach

The project will follow an **Agile development approach**, using short, iterative cycles to plan, implement, and review work.

Key Agile practices include:

- A prioritised backlog of User Stories with acceptance criteria  
- Clearly defined Definition of Ready (DoR) and Definition of Done (DoD)
- Task tracking using a GitHub Projects board  
- Regular reviews of progress and process  

This approach supports continuous feedback and incremental improvement throughout the project lifecycle.

---

## 8. Initial Infrastructure Setup

To support collaborative development and quality assurance, the following infrastructure is established during Phase 1:

- **Version Control:** GitHub repository used as the single source of truth  
- **Branching Strategy:**  
  - `main` branch for stable code  
  - `develop` branch for ongoing development  
- **Continuous Integration:**  
  - Automated CI pipeline using GitHub Actions  
- **Issue Tracking:**  
  - GitHub Issues linked to the project board and backlog  

This setup reflects standard industry practices typically established during an initial “Sprint 0”.

---

## 9. Expected Outcomes of Phase 1

By the end of Phase 1, the project will have:

- A clearly defined project scope and domain  
- An initial Agile backlog and workflow  
- Defined process rules (DoR and DoD)  
- A functioning project board and CI pipeline  
- Documented evidence of planning and collaboration  

These outcomes establish a solid foundation for the design and testing activities in subsequent phases.

---

## 10. Declaration of Authorship and AI Non-Usage

This section will be completed and signed by all team members prior to final submission, in accordance with the module’s academic integrity requirements.
