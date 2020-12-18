// Library -------------------------------------------------------------------

// An overall accumulation of Author, Series, Story, and Volume objects
// owned or administered by a specific set of people.

// Model Details -------------------------------------------------------------

export class Library {

    constructor (data: any = {}) {
        this.active = data.active || true;
        this.id = data.id || -1;
        this.name = data.name;
        this.notes = data.notes || null;
    }

    active!: boolean;
    id!: number;
    name!: string;
    notes?: string;

}

export default Library;
