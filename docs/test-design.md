# Black Box Test Design

## 1. High-Risk Modules

In the healthcare domain, even small errors can become critical, so we focused on the areas that could have the greatest impact.

The components with highest risk:

1. **Prescription safety**: We need to make sure that our app catches when two medicines cannot be taken together or when a patient is allergic to a medicine. Otherwise, a patient could receive a prescription that is unsafe.
2. **Role-based access control (RBAC)**: If RBAC fails, users can access features that they should not, which could cause data privacy and compliance issues.
3. **Personal data validation**: If validation is weak, incorrect data (like DOB) could be entered.
4. **Patient registration & identification**: Incorrect patient identity can lead to the wrong treatment or records being mixed.
5. **Authentication (Google OAuth flow)**: If login or session handling fails, users could be locked out of the system or have unauthorised access.

## 2. Equivalence Partitioning

### 2.1 Patient First Name

For now, the First Name field is the required field.

- EP-FN-1: name like "Sam" is accepted.
- EP-FN-2: hyphenated name "Aimee-Leigh" is accepted.
- EP-FN-3: empty string is rejected, required field error.

### 2.2 Date of Birth

The DOB field rejects any date after today.

- EP-DOB-1: a past date like "31-05-2001" is accepted.
- EP-DOB-2: today's date is accepted.
- EP-DOB-3: a future date like tomorrow's date is rejected.

### 2.3 Medicine Name for Prescription

When a prescription is being created, the medicine name is checked for potential conflicts with other medicines the patient is taking, and for any allergies the patient may have.

EP-MED-1: prescribed medicine has a known conflict with already taken medicine, then warning is given.
EP-MED-2: prescribed medicine has a known conflict but the patient is not taking the other medicine, then no warning.
EP-MED-3: prescribed medicine that matches a severe allergy for the patient, then prescription is blocked.
EP-MED-4: prescribed medicine that matches a low allergy for the patient is not blocked, but warned.

### 2.4 Patient Search Input

The search filters by matching the search term against first name and last name.

- EP-SEARCH-1: exact name match like "Alex" shows names containing Alex.
- EP-SEARCH-2: partial match shows the matching results.
- EP-SEARCH-3: no string match shows no results.
- EP-SEARCH-4: empty search shows all patients.

### 2.5 Google OAuth Login Flow

The Google OAuth can have various cases.

- EP-AUTH-1: user signs in with Google, so is redirected to dashboard.
- EP-AUTH-2: user cancels at the Google sign-in pop-up, so stays on login page.
- EP-AUTH-3: user denies consent on signing in with Google, so is not logged in.
- EP-AUTH-4: OAuth returns an error, so user is not logged in.
- EP-AUTH-5: network timeout during the redirect, so user is not logged in.
- EP-AUTH-6: user is already logged in and navigates to login page, so is redirected to dashboard.

### 2.6 User Account Type on Login

After a successful Google sign-in, the app checks Firestore to decide what to do with this user.

- EP-ACNT-1: returning user with a correct role, then correct dashboard shown.
- EP-ACNT-2: first-time sign-in, so default role of Nurse is assigned.
- EP-ACNT-3: user signs in but role is missing, so access is denied.

### 2.7 Appointment Date

- EP-APMT-DATE-1: date in valid format is accepted.
- EP-APMT-DATE-2: invalid date format shows error.
- EP-APMT-DATE-3: impossible date (e.g. 30 February) shows error.
- EP-APMT-DATE-4: date field left empty is required field error.

### 2.8 Appointment Time

- EP-APMT-TIME-1: valid time format and within working hours is accepted.
- EP-APMT-TIME-2: invalid time format shows error.
- EP-APMT-TIME-3: time field left empty is required field error.

### 2.9 Appointment Duration

- EP-APMT-DUR-1: duration within the allowed range is accepted.
- EP-APMT-DUR-2: duration of zero or negative shows error.
- EP-APMT-DUR-3: duration field left empty is required field error.

### 2.10 Appointment Overlap

Two appointments should not conflict with each other.

- EP-APMT-O-1: no overlap with any existing appointment is accepted.
- EP-APMT-O-2: new appointment overlapping with old one gives error.

## 3. Boundary Value Analysis

### 3.1 Date of Birth

- BVA-DOB-1: yesterday's date is accepted.
- BVA-DOB-2: today's date is accepted.
- BVA-DOB-3: tomorrow's date is invalid.

### 3.2 Prescription End Date

We filter for active prescriptions to check for conflicts with new prescriptions. If this boundary is wrong, it could give a false warning or an active prescription could be missed.

- BVA-END-1: end date is yesterday so no conflict.
- BVA-END-2: end date is today so there can be potential conflict.
- BVA-END-3: end date is tomorrow so there can be potential conflict.

### 3.3 Appointment Time

Appointments can only be scheduled within working hours.

- BVA-TIME-1: one minute before opening hour is rejected.
- BVA-TIME-2: one minute after closing hour is rejected.
- BVA-TIME-3: exactly at opening hour is accepted.
- BVA-TIME-4: exactly at closing hour is accepted.

### 3.4 Scheduling Time Boundary

Appointment time must be in the future because the boundary is the current time.

- BVA-SCHED-1: appointment time one minute before now is rejected.
- BVA-SCHED-2: appointment time equal to now is rejected.
- BVA-SCHED-3: appointment time one minute after now is accepted.

## 4. Decision Tables

### 4.1 Medicine Interaction Warning

The known conflict pairs in our system are:
- warfarin conflicts with aspirin and ibuprofen.
- aspirin conflicts with warfarin.
- ibuprofen conflicts with warfarin.

Test cases:
- DT-MED-1: prescribing Warfarin, patient is on Aspirin is warning.
- DT-MED-2: prescribing Warfarin, patient is on Ibuprofen is warning.
- DT-MED-3: prescribing Aspirin, patient is on Warfarin is warning.
- DT-MED-4: prescribing Aspirin, patient is on Ibuprofen is no warning.
- DT-MED-5: prescribing any medicine that has no conflict is no warning.
- DT-MED-6: prescribing conflicting medicine but with expired prescriptions is no warning.

### 4.2 Allergy Block

Tests the patient's allergies against prescribed medicine.

- DT-ALLERGY-1: patient has severe xyz medicine allergy, prescribing xyz is blocked.
- DT-ALLERGY-2: patient has  mild xyz medicine allergy, prescribing xyz is allowed.
- DT-ALLERGY-3: patient has xyz medicine allergy, prescribing other than xyz is allowed.
- DT-ALLERGY-4: patient has no allergies, prescribing xyz is allowed.

### 4.3 Role-Based Access Control

This covers the behaviour of all route guards.

Doctor logged in:
- DT-RBAC-1: patients page is allowed.
- DT-RBAC-2: new patient page is allowed.
- DT-RBAC-3: patient detail page is allowed.
- DT-RBAC-4: edit patient page is allowed.
- DT-RBAC-5: users page is blocked, redirected to patients page.

Nurse logged in:
- DT-RBAC-6: patients page is allowed.
- DT-RBAC-7: new patient page is blocked, redirected to patients page.
- DT-RBAC-8: patient detail page is allowed.
- DT-RBAC-9: edit patient page is blocked, redirected to patients page.
- DT-RBAC-10: users page is blocked, redirected to patients page.

Admin logged in:
- DT-RBAC-11: patients page is blocked, redirected to users page.
- DT-RBAC-12: users page is allowed.

Not logged in:
- DT-RBAC-13: all pages other than login page are blocked, redirected to login page.
- DT-RBAC-14: login page is allowed.

Already logged in:
- DT-RBAC-15: login page is blocked, redirected to respective landing page.