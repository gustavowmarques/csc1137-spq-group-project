import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { VisitService } from 'src/app/core/services/visit.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent implements OnInit {
  form!: FormGroup;
  patientId = '';
  visitId = '';
  isEdit = false;
  saving = false;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      visitDate: [this.today, [Validators.required, this.notFutureDate]],
      notes: ['', Validators.required]
    });

    this.visitId = this.route.snapshot.paramMap?.get('id') ?? '';
    this.isEdit = !!this.visitId;
    this.patientId = this.route.snapshot.queryParamMap?.get('patientId') ?? '';

    if (this.isEdit) {
      this.visitService.getById(this.visitId).pipe(take(1)).subscribe(visit => {
        if (!visit) {
          this.router.navigate(['/visits']);
          return;
        }

        this.patientId = this.patientId || visit.patientId;
        this.form.patchValue({
          visitDate: visit.visitDate ?? this.today,
          notes: visit.notes
        });
      });
      return;
    }

    if (!this.patientId) {
      this.router.navigate(['/patients']);
      return;
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
        await this.visitService.update(this.visitId, {
          visitDate: this.form.value.visitDate,
          notes: this.form.value.notes
        });
      } else {
        await this.visitService.create({
          patientId: this.patientId,
          visitDate: this.form.value.visitDate,
          notes: this.form.value.notes,
          createdBy: this.authService.currentUser?.uid ?? ''
        });
      }
      this.router.navigate(['/visits'], { queryParams: { patientId: this.patientId } });
    } catch (err) {
      console.error('Failed to save visit', err);
    } finally {
      this.saving = false;
    }
  }
}
