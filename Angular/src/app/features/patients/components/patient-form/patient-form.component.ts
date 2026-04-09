import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { PatientService } from 'src/app/core/services/patient.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
// form for creating or editing a patient record
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  patientId = '';
  saving = false;
  genders = ['M', 'F', 'O'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // load patient data on init if in editing mode
  ngOnInit(): void {
    this.form = this.fb.group({
      ppsn: ['', [Validators.required, Validators.pattern(/^\d{7}[A-Za-z]{1,2}$/)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.notFutureDate]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d+$/)]],
      address: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^\+\d+$/)]]
    });

    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.patientId) {
      this.isEdit = true;
      this.patientService.getById(this.patientId).pipe(take(1)).subscribe(patient => {
        if (patient) {
          this.form.patchValue(patient);
        }
      });
    }
  }

  // prevent future dates for DOB
  notFutureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date().toISOString().split('T')[0];
    return control.value > today ? { futureDate: true } : null;
  }

  // create new or update exisiting record
  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const ppsnControl = this.form.get('ppsn');
    const ppsn = String(ppsnControl?.value ?? '').trim().toUpperCase();
    const isPpsnTaken = await this.patientService.isPpsnTaken(ppsn, this.isEdit ? this.patientId : undefined);
    if (isPpsnTaken) {
      ppsnControl?.setErrors({ ...(ppsnControl.errors ?? {}), duplicate: true });
      ppsnControl?.markAsTouched();
      return;
    }

    if (ppsnControl?.errors?.['duplicate']) {
      const rest = { ...ppsnControl.errors };
      delete rest['duplicate'];
      ppsnControl.setErrors(Object.keys(rest).length ? rest : null);
    }

    this.form.patchValue({ ppsn });

    this.saving = true;
    try {
      // update or create depending on wether we are in edit mode
      if (this.isEdit) {
        await this.patientService.update(this.patientId, this.form.value);
      } else {
        await this.patientService.create(this.form.value);
      }
      this.router.navigate(['/patients']);
    } catch (err) {
      console.error('Failed to save patient', err);
    } finally {
      this.saving = false;
    }
  }
}