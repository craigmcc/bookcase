// OAuthUser -----------------------------------------------------------------

// Model for a user authenticated via @craigmcc/basic-oauth2-server.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    HasMany,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "../models/AbstractModel";
import OAuthAccessToken from "./OAuthAccessToken";
import OAuthRefreshToken from "./OAuthRefreshToken";

// Public Modules ------------------------------------------------------------

@Table({
    comment: "Users authenticated via @craigmcc/basic-oauth2-server.",
    tableName: "oauth_users",
})
export class OAuthUser extends AbstractModel<OAuthUser> {

    @HasMany(() => OAuthAccessToken)
    accessTokens!: OAuthAccessToken[];

    @Column({
        allowNull: false,
        comment: "Is this user active?",
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

    @Column({
        allowNull: false,
        comment: "Name of this user.",
        field: "name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "name: Is required"
            }
        }
    })
    name!: string;

    @Column({
        allowNull: false,
        comment: "Hashed password for this user.",
        field: "password",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "password: Is required"
            }
        },
    })
    password!: string;

    @HasMany(() => OAuthRefreshToken)
    refreshTokens!: OAuthRefreshToken[];

    @Column({
        allowNull: false,
        comment: "Authorized scopes (space-separated if multiple) for this user.",
        field: "scope",
        type: DataType.STRING,
    })
    scope!: string;

    @Column({
        allowNull: false,
        comment: "Unique username for this user.",
        field: "username",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "username: Is required"
            }
        }
    })
    username!: string;

}

export default OAuthUser;
