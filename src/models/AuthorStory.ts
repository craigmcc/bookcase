// AuthorStory ---------------------------------------------------------------

// Join table between author and story models.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Story from "./Story";

// Public Classes ------------------------------------------------------------

@Table({
    comment: "Many-to-many relationship between Author and Story.",
    tableName: "authors_stories",
})
export class AuthorStory extends Model<AuthorStory> {

    @Column({
        allowNull: false,
        comment: "Primary key of this Author for this Story",
        field: "author_id",
        type: DataType.BIGINT
    })
    @ForeignKey(() => Author)
    authorId!: number;

    @Column({
        allowNull: false,
        comment: "Is this the primary Author of this Story?",
        defaultValue: false,
        field: "primary",
        type: DataType.BOOLEAN,
    })
    primary!: boolean;

    @Column({
        allowNull: false,
        comment: "Primary key of this Story for this Author",
        field: "story_id",
        type: new DataType.BIGINT
    })
    @ForeignKey(() => Story)
    storyId!: number;

}

export interface AuthorStoryAttributes {
    authorId: number;
    primary: boolean;
    storyId: number;
}

export default AuthorStory;
