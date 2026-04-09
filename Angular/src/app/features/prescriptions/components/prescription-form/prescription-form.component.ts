import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MEDICINE_OPTIONS, Prescription } from 'src/app/core/models/prescription.model';
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
  prescriptionId = '';
  isEditMode = false;
  saving = false;
  blockMessage = '';
  readonly todayDate = new Date().toISOString().split('T')[0];
  readonly medicineOptions = MEDICINE_OPTIONS;
  readonly durationOptions = [1, 2, 3, 4, 5, 6, 7];
  readonly dailyDosageOptions: Array<'Once' | 'Twice' | 'Thrice'> = ['Once', 'Twice', 'Thrice'];

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.patientId = this.route.snapshot.queryParamMap.get('patientId') ?? '';
    this.prescriptionId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEditMode = !!this.prescriptionId;

    this.form = this.fb.group({
      drugName: ['', Validators.required],
      startDate: ['', [Validators.required, this.notBeforeTodayValidator]],
      durationDays: [1, Validators.required],
      dailyDosage: ['Once', Validators.required]
    });

    if (this.isEditMode) {
      const prescription = await firstValueFrom(this.prescriptionService.getById(this.prescriptionId));
      if (!prescription) {
        this.router.navigate(['/prescriptions'], { queryParams: { patientId: this.patientId || null } });
        return;
      }

      this.patientId = prescription.patientId;
      this.form.patchValue({
        drugName: prescription.drugName,
        startDate: prescription.startDate,
        durationDays: prescription.durationDays ?? this.calculateDurationDays(prescription),
        dailyDosage: prescription.dailyDosage ?? 'Once'
      });
      return;
    }

    if (!this.patientId) {
      this.router.navigate(['/patients']);
    }
  }

  private calculateEndDate(startDate: string, durationDays: number): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + durationDays - 1);
    return date.toISOString().split('T')[0];
  }

  private calculateDurationDays(prescription: Prescription): number {
    if (!prescription.startDate || !prescription.endDate) {
      return 1;
    }
    const start = new Date(prescription.startDate);
    const end = new Date(prescription.endDate);
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(7, Math.max(1, diff));
  }

  private readonly notBeforeTodayValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }
    if (this.isEditMode) {
      return null;
    }
    return value < this.todayDate ? { beforeToday: true } : null;
  };

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.blockMessage = '';
    this.saving = true;

    try {
      const drugName = this.form.value.drugName?.trim();
      const durationDays = Number(this.form.value.durationDays);
      const endDate = this.calculateEndDate(this.form.value.startDate, durationDays);

      const allergyBlock = await this.prescriptionService.checkAllergyBlock(this.patientId, drugName);
      if (allergyBlock) {
        this.blockMessage = `Cannot prescribe "${drugName}" as the patient has a severe allergy to "${allergyBlock}".`;
        this.saving = false;
        return;
      }

      const conflicts = await this.prescriptionService.checkDrugConflicts(
        this.patientId,
        drugName,
        this.form.value.startDate,
        endDate,
        this.isEditMode ? this.prescriptionId : undefined
      );
      if (conflicts.length > 0) {
        this.blockMessage = `Cannot prescribe "${drugName}" because it conflicts with ${conflicts.join(', ')}.`;
        this.saving = false;
        return;
      }

      if (this.isEditMode) {
        await this.prescriptionService.update(this.prescriptionId, {
          patientId: this.patientId,
          drugName,
          startDate: this.form.value.startDate,
          endDate,
          durationDays,
          dailyDosage: this.form.value.dailyDosage
        });
      } else {
        await this.prescriptionService.create({
          patientId: this.patientId,
          drugName,
          startDate: this.form.value.startDate,
          endDate,
          durationDays,
          dailyDosage: this.form.value.dailyDosage,
          createdBy: this.authService.currentUser?.uid ?? ''
        });
      }

      this.router.navigate(['/prescriptions'], { queryParams: { patientId: this.patientId } });
    } catch (err) {
      console.error('Failed to save prescription', err);
    } finally {
      this.saving = false;
    }
  }
}
