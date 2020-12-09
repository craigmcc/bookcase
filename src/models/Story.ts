// Story ---------------------------------------------------------------------

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Index,
    Table,
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import AuthorStory from "./AuthorStory";
import Library from "./Library";
//import Series from "./Series";
//import Volume from "./Volume";

// Public Modules ------------------------------------------------------------

// TODO - Many-to-one relationship with Series
// TODO - Many-to-many relationship with Author, Volume

@Table({
    comment: "Individual Story written by one or more Authors.",
    tableName: "stories",
    validate: { }, // TODO - class level validations
})
export class Story extends AbstractModel<Story> {

    @Column({
        allowNull: false,
        comment: "Is this Story active?",
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

    // All of the zero or more Authors of this Story
    @BelongsToMany(() => Author, () => AuthorStory)
    authors!: Array<Author & {AuthorStory: AuthorStory}>;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        comment: "Primary key of owning Library",
        field: "library_id",
        type: DataType.BIGINT,
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            },
            // TODO - is valid check
        },
    })
//    @Index("library_story_index") // TODO - Sequelize tries to use "libraryId" column
    libraryId!: number;

    @Column({
        allowNull: false,
        comment: "Non-unique name of this Story.",
        field: "name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    @Index("library_story_index")
    name!: string;

    @Column({
        allowNull: true,
        comment: "General comments about this Story.",
        type: DataType.STRING
    })
    notes?: string;

}

export interface StoryAttributes {
    active: boolean;
    libraryId: number;
    name: string;
    notes: string | null;
}

export default Story;
