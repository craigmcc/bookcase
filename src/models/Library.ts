// Library -------------------------------------------------------------------

// Model for an overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    HasMany,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import Story from "./Story";

// Public Modules ------------------------------------------------------------

@Table({
    comment: "Overall collection of authors, series, stories, and volumes.",
    tableName: "libraries",
/*  TODO - get name uniqueness validation to work correctly
    validate: {
        uniqueLibraryName: async (library: Library) => {
            if (library.name) {
                throw new HttpError.NotFound("name: Is required");
            }
            let options: FindOptions;
            if (library.id) {
                options = {
                    where: {
                        id: { [Op.ne]: library.id },
                        name: library.name
                    }
                }
            } else {
                options = {
                    where: {
                        name: library.name
                    }
                }
            }
            let count = await Library.count(options);
            if (count > 0) {
                throw new HttpError.NotUnique(`name: Name '${library.name}' is already in use`);
            }
            return true;
        }
    },
*/
})
export class Library extends AbstractModel<Library> {

    @Column({
        allowNull: false,
        comment: "Is this Library active?",
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    active!: boolean;

    @HasMany(() => Author)
    authors!: Author[];

    @Column({
        allowNull: false,
        comment: "Unique name of this Library.",
        field: "name",
        type: DataType.STRING,
        unique: "uniqueLibraryName",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
            // TODO - name uniqueness check
        }
    })
    name!: string;

    @Column({
        allowNull: true,
        comment: "General comments about this Library.",
        type: DataType.STRING
    })
    notes?: string;

/*
    @HasMany(() => Series)
    series!: Series[];
*/

    @HasMany(() => Story)
    stories!: Story[];

/*
    @HasMany(() => Volume)
    volumes!: Volume[];
*/

}

export interface LibraryAttributes {
    active: boolean;
    name: string;
    notes: string | null;
}

export default Library;
