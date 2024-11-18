

// Represents a single date and time as returned by the backend.
export interface Date {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
}

// This structure represents a task as returned by the backend
// from /api/tasks endpoint. See tasks() in flask/app.py in the
// github.com/tomaszmrugala/hevelius-backend repository.
export interface Task {
    task_id: number;
	user_id: number;
	aavso_id: string; // not a real field (substituted by PHP)
    // scope_id: number;
    object: string;
    ra: number;
    decl: number;
    exposure: number;
    descr: string;
    filter: string;
    binning: number;
    guiding: boolean;
    dither: boolean;
    defocus: boolean;
    calibrate: boolean;
    solve: boolean;
    vphot: boolean;
    other_cmd: string;
    min_alt: number;
    moon_distance: number;
    skip_before: Date;
    skip_after: Date;
    min_interval: number;
    comment: string;
    state: number;
    imagename: string;
    created: Date;
    activated: Date;
    performed: Date;
    max_moon_phase: number;
    max_sun_alt: number;
    auto_center: boolean;
    calibrated: boolean;
    solved: boolean;
    sent: boolean;
}

// For an array of these observations:
export type TaskList = Task[];
