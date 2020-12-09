// Author --------------------------------------------------------------------

// Model for one author of zero or more series, stories, or volumes.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import AuthorStory from "./AuthorStory";
import Library from "./Library";
import Story from "./Story";

// Public Modules ------------------------------------------------------------

// TODO - Many-to-many relationship with Series, Story, Volume

@Table({
    comment: "One author of zero or more series, stories, or volumes.",
    tableName: "authors",
    validate: { }, // TODO - class level validations (libraryId+name uniqueness)
})
export class Author extends AbstractModel<Author> {

    // Columns for uniqueAuthorName index ------------------------------------

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        comment: "Primary key of owning Library",
        field: "library_id",
        type: DataType.BIGINT,
        unique: "uniqueAuthorName",
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            },
            // TODO - is valid (unless built in to unique libraryId+name check)
        },
    })
    libraryId!: number;

    @Column({
        allowNull: false,
        comment: "Unique (within Library) last name of this Author.",
        field: "last_name",
        type: DataType.STRING,
        unique: "uniqueAuthorName",
        validate: {
            notNull: {
                msg: "lastName: Is required"
            },
        },
    })
    lastName!: string;

    @Column({
        allowNull: false,
        comment: "Unique (within Library) first name of this Author.",
        field: "first_name",
        type: DataType.STRING,
        unique: "uniqueAuthorName",
        validate: {
            notNull: {
                msg: "firstName: Is required"
            },
        },
    })
    firstName!: string;

    // General Columns -------------------------------------------------------

    @Column({
        allowNull: false,
        comment: "Is this Author active?",
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

    @BelongsTo(() => Library)
    library!: Library;

    @Column({
        allowNull: true,
        comment: "General comments about this Author.",
        type: DataType.STRING
    })
    notes?: string;

    @BelongsToMany(() => Story, () => AuthorStory)
    stories!: Array<Story & {AuthorStory: AuthorStory}>;

}

export interface AuthorAttributes {
    active: boolean;
    firstName: string;
    lastName: string;
    libraryId: number;
    notes: string | null;
}

export default Author;
