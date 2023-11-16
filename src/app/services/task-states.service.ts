import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskStatesService {

	private states = {
		0: "templ",
		1: "new",
		2: "active",
		3: "queued",
		4: "exec'd",
        5: "done(prv)",
		6: "done"
	};

	public getState(state: number): string {
		return this.states[state];
	}
}
