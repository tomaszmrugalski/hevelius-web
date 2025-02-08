import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAddService, TaskAddRequest } from '../../services/task-add.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskAddService: TaskAddService,
    private loginService: LoginService,
    private dialogRef: MatDialogRef<TaskAddComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const skipBeforeDefault = new Date('2000-01-01T00:00:00');
    const skipAfterDefault = new Date('2099-12-31T23:59:59');

    this.taskForm = this.fb.group({
      scope_id: ['1', [Validators.required]],
      object: ['', [Validators.maxLength(64)]],
      ra: ['12.34', [Validators.required, Validators.min(0), Validators.max(24)]],
      decl: ['56.78', [Validators.required, Validators.min(-90), Validators.max(90)]],
      exposure: ['60', [Validators.min(0)]],
      descr: ['', [Validators.maxLength(1024)]],
      filter: ['CV', [Validators.maxLength(16)]],
      binning: [1, [Validators.min(1), Validators.max(4)]],
      guiding: [true],
      dither: [false],
      calibrate: [true],
      solve: [true],
      other_cmd: ['', [Validators.maxLength(512)]],
      min_alt: [30],
      moon_distance: [60],
      skip_before: [skipBeforeDefault],
      skip_after: [skipAfterDefault],
      min_interval: [0],
      comment: [''],
      max_moon_phase: [100],
      max_sun_alt: [-12]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = { ...this.taskForm.value };

      // Convert dates to ISO string format
      if (formValue.skip_before) {
        formValue.skip_before = formValue.skip_before.toISOString();
      }
      if (formValue.skip_after) {
        formValue.skip_after = formValue.skip_after.toISOString();
      }

      const user = this.loginService.getUser();
      if (!user) {
        this.showMessage('User not logged in');
        return;
      }

      const taskData: TaskAddRequest = {
        user_id: user.user_id,
        ...formValue
      };

      this.taskAddService.addTask(taskData).subscribe({
        next: (response) => {
          if (response.status) {
            this.showMessage(`Task created successfully with ID: ${response.task_id}`);
            this.dialogRef.close(true);
          } else {
            this.showMessage(response.msg || 'Failed to create task');
          }
        },
        error: (error) => {
          if (error.status === 0) {
            this.showMessage('Server is unreachable');
          } else if (error.status === 500) {
            this.showMessage('Server error occurred');
          } else {
            this.showMessage(error.message || 'Error creating task');
          }
        }
      });
    } else {
      this.showMessage('Please correct the form errors before submitting');
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}