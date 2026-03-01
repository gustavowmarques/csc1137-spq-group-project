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
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  patientId = '';
  saving = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.notFutureDate]]
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

  notFutureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date().toISOString().split('T')[0];
    return control.value > today ? { futureDate: true } : null;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
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
