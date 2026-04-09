import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AllergyService } from 'src/app/core/services/allergy.service';
import { AllergySeverity } from 'src/app/core/models/allergy.model';

@Component({
  selector: 'app-allergy-form',
  templateUrl: './allergy-form.component.html',
  styleUrls: ['./allergy-form.component.scss']
})
export class AllergyFormComponent implements OnInit {
  form!: FormGroup;
  patientId = '';
  allergyId = '';
  isEdit = false;
  saving = false;
  severities: AllergySeverity[] = ['Mild', 'Severe'];

  constructor(
    private fb: FormBuilder,
    private allergyService: AllergyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      allergen: ['', Validators.required],
      severity: ['Mild', Validators.required]
    });

    this.allergyId = this.route.snapshot.paramMap?.get('id') ?? '';
    this.isEdit = !!this.allergyId;
    this.patientId = this.route.snapshot.queryParamMap?.get('patientId') ?? '';

    if (this.isEdit) {
      this.allergyService.getById(this.allergyId).pipe(take(1)).subscribe(allergy => {
        if (!allergy) {
          this.router.navigate(['/allergies']);
          return;
        }

        this.patientId = this.patientId || allergy.patientId;
        this.form.patchValue({
          allergen: allergy.allergen,
          severity: allergy.severity
        });
      });
      return;
    }

    if (!this.patientId) {
      this.router.navigate(['/patients']);
      return;
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit) {
        await this.allergyService.update(this.allergyId, {
          patientId: this.patientId,
          allergen: this.form.value.allergen,
          severity: this.form.value.severity
        });
      } else {
        await this.allergyService.create({
          patientId: this.patientId,
          allergen: this.form.value.allergen,
          severity: this.form.value.severity
        });
      }
      this.router.navigate(['/allergies'], { queryParams: { patientId: this.patientId } });
    } catch (err) {
      console.error('Failed to save allergy', err);
    } finally {
      this.saving = false;
    }
  }
}
