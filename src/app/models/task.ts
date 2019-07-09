

export interface Date {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
}

export interface Task {
    task_id: number;
	user_id: number;
	aavso_id: string; // not a real field (substituted by PHP)
    // scope_id: number;
    object: string;
    ra: number;
    decl: number;
    // descr: string;
    exposure: number;
    /* filter: string;
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
    comment: string; */
    state: number;

    /* imagename: string;
    created: Date;
    activated: Date;
    performed: Date;
    max_moon_phase: number;
    max_sun_alt: number;
    auto_center: boolean;
    calibrated: boolean;
    solved: boolean;
    sent: boolean; */
}
