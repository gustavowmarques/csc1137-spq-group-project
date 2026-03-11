import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from 'src/app/core/services/prescription.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.scss']
})
export class PrescriptionFormComponent implements OnInit {
  form!: FormGroup;
  patientId = '';
  saving = false;
  blockMessage = '';

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.queryParamMap.get('patientId') ?? '';
    if (!this.patientId) {
      this.router.navigate(['/patients']);
      return;
    }
    this.form = this.fb.group({
      drugName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: this.endDateAfterStartDate });
  }

  endDateAfterStartDate(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && end <= start) {
      return { endDateBeforeStart: true };
    }
    return null;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.blockMessage = '';
    this.saving = true;

    try {
      const drugName = this.form.value.drugName;

      const allergyBlock = await this.prescriptionService.checkAllergyBlock(this.patientId, drugName);
      if (allergyBlock) {
        this.blockMessage = `Cannot prescribe "${drugName}": patient has a SEVERE allergy to "${allergyBlock}".`;
        this.saving = false;
        return;
      }

      const conflicts = await this.prescriptionService.checkDrugConflicts(
        this.patientId,
        drugName,
        this.form.value.startDate,
        this.form.value.endDate
      );
      if (conflicts.length > 0) {
        this.blockMessage = `Cannot prescribe "${drugName}": conflicts with active prescription(s): ${conflicts.join(', ')}.`;
        this.saving = false;
        return;
      }

      await this.prescriptionService.create({
        patientId: this.patientId,
        drugName,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        createdBy: this.authService.currentUser?.uid ?? ''
      });

      this.router.navigate(['/prescriptions'], { queryParams: { patientId: this.patientId } });
    } catch (err) {
      console.error('Failed to save prescription', err);
    } finally {
      this.saving = false;
    }
  }
}
