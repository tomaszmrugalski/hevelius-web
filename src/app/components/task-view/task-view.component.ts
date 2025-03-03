import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskAddService, TaskAddRequest } from '../../services/task-add.service';
import { LoginService } from '../../services/login.service';
import { Task } from '../../models/task';

interface DialogData {
  task?: Task;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  taskForm: FormGroup;
  mode: 'add' | 'edit' = 'add';
  originalTask?: Task;

  constructor(
    private fb: FormBuilder,
    private taskAddService: TaskAddService,
    private loginService: LoginService,
    private dialogRef: MatDialogRef<TaskViewComponent>,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData | null
  ) {
    if (data) {
      this.mode = data.mode;
      this.originalTask = data.task;
    }
  }

  ngOnInit() {
    this.initializeForm();

    if (this.mode === 'edit' && this.originalTask) {
      // Convert date strings to Date objects for the form
      const taskData = {
        ...this.originalTask,
        skip_before: this.originalTask.skip_before ? new Date(this.originalTask.skip_before) : null,
        skip_after: this.originalTask.skip_after ? new Date(this.originalTask.skip_after) : null
      };
      this.taskForm.patchValue(taskData);
    }
  }

  private initializeForm() {
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

      if (this.mode === 'edit' && this.originalTask) {
        // Verify user can edit this task
        if (user.user_id !== this.originalTask.user_id) {
          this.showMessage('You cannot edit tasks that belong to other users');
          return;
        }

        if (![0, 1, 2].includes(this.originalTask.state)) {
          this.showMessage('This task cannot be modified in its current state');
          return;
        }

        const updateData = {
          task_id: this.originalTask.task_id,
          user_id: this.originalTask.user_id,
          ...formValue
        };

        // TODO: Add task update service call here
        this.showMessage('Task update functionality coming soon');
        this.dialogRef.close(true);
      } else {
        // Add new task
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
      }
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