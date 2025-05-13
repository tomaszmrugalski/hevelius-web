import { Component, OnInit } from '@angular/core';
import { NightPlanService } from '../../services/night-plan.service';
import { CoordsFormatterService } from '../../services/coords-formatter.service';

@Component({
    selector: 'app-night-plan',
    templateUrl: './night-plan.component.html',
    styleUrls: ['./night-plan.component.css'],
    standalone: false
})
export class NightPlanComponent implements OnInit {
    dataSource: NightPlanService;
    displayedColumns: string[] = ['task_id', 'user_id', 'state', 'object', 'ra', 'decl', 'exposure'];
    taskCount = 0;

    constructor(
        private nightPlanService: NightPlanService,
        private coordFormatter: CoordsFormatterService
    ) {
        this.dataSource = nightPlanService;
    }

    ngOnInit() {
        this.loadNightPlan();
        this.dataSource.connect().subscribe(tasks => {
            this.taskCount = tasks.length;
        });
    }

    loadNightPlan() {
        this.dataSource.loadNightPlan();
    }

    formatRA(ra: number): string {
        return this.coordFormatter.formatRA(ra);
    }

    formatDec(dec: number): string {
        return this.coordFormatter.formatDec(dec);
    }
}
