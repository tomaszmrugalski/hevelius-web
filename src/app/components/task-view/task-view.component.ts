import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService, TaskRequest } from '../../services/task.service';
import { LoginService } from '../../services/login.service';
import { Task } from '../../models/task';
import { HttpErrorResponse } from '@angular/common/http';
import { TelescopeService, Telescope } from '../../services/telescope.service';

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
  telescopes: Telescope[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private loginService: LoginService,
    private telescopeService: TelescopeService,
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
    this.loadTelescopes();
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

  private loadTelescopes() {
    this.telescopeService.getTelescopes().subscribe({
      next: (telescopes) => {
        // Filter out inactive telescopes
        this.telescopes = telescopes.filter(t => t.active);

        // If we're in add mode and have active telescopes, set the default value
        if (this.mode === 'add' && this.telescopes.length > 0) {
          this.taskForm.patchValue({
            scope_id: this.telescopes[0].scope_id
          });
        }
      },
      error: (error) => {
        console.error('Error loading telescopes:', error);
        this.showMessage('Failed to load telescopes');
      }
    });
  }

  private initializeForm() {
    const skipBeforeDefault = new Date('2000-01-01T00:00:00');
    const skipAfterDefault = new Date('2099-12-31T23:59:59');

    this.taskForm = this.fb.group({
      scope_id: [null, [Validators.required]],
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

        this.taskService.updateTask(updateData).subscribe({
          next: (response) => {
            if (response.status) {
              this.showMessage('Task updated successfully');
              this.dialogRef.close(true);
            } else {
              this.showMessage(response.msg || 'Failed to update task');
            }
          },
          error: this.handleError.bind(this)
        });
      } else {
        // Add new task
        const taskData: TaskRequest = {
          user_id: user.user_id,
          ...formValue
        };

        this.taskService.addTask(taskData).subscribe({
          next: (response) => {
            if (response.status) {
              this.showMessage(`Task created successfully with ID: ${response.task_id}`);
              this.dialogRef.close(true);
            } else {
              this.showMessage(response.msg || 'Failed to create task');
            }
          },
          error: this.handleError.bind(this)
        });
      }
    } else {
      this.showMessage('Please correct the form errors before submitting');
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.showMessage('Server is unreachable');
    } else if (error.status === 500) {
      this.showMessage('Server error occurred');
    } else {
      this.showMessage(error.message || 'Error processing task');
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