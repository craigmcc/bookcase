// OAuthAccessToken ----------------------------------------------------------

// Model for an access token created via @craigmcc/basic-oauth2-server.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    ForeignKey,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "../models/AbstractModel";
import OAuthUser from "./OAuthUser";

// Public Modules ------------------------------------------------------------

@Table({
    comment: "Access tokens created via @craigmcc/basic-oauth-orchestration.",
    tableName: "oauth_access_tokens",
})
export class OAuthAccessToken extends AbstractModel<OAuthAccessToken> {

    @Column({
        allowNull: false,
        comment: "Date and time this access token expires.",
        field: "expires",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "expires: Is required"
            }
        }
    })
    expires!: Date;

    @Column({
        allowNull: false,
        comment: "Authorized scopes (space-separated if multiple) for this access token.",
        field: "scope",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "scope: Is required"
            }
        }
    })
    scope!: string;

    @Column({
        allowNull: false,
        comment: "Access token value for this access token",
        field: "token",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "token: Is required"
            }
        }
    })
    token!: string;

    @ForeignKey(() => OAuthUser)
    @Column({
        allowNull: false,
        comment: "Primary key of the owning OAuthUser",
        field: "user_id",
        type: DataType.BIGINT,
        validate: {
            notNull: {
                msg: "userId: Is required"
            }
        }
    })
    userId!: number;

}

export default OAuthAccessToken;
