import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  saving = false;

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
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
      notes: ['', Validators.required]
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      await this.visitService.create({
        patientId: this.patientId,
        notes: this.form.value.notes,
        createdBy: this.authService.currentUser?.uid ?? ''
      });
      this.router.navigate(['/visits'], { queryParams: { patientId: this.patientId } });
    } catch (err) {
      console.error('Failed to save visit', err);
    } finally {
      this.saving = false;
    }
  }
}
