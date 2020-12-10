// OAuthRefreshToken ---------------------------------------------------------

// Model for a refresh token created via @craigmcc/basic-oauth2-server.

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
    comment: "Refresh tokens created via @craigmcc.",
    tableName: "oauth_refresh_tokens",
})
export class OAuthRefreshToken extends AbstractModel<OAuthRefreshToken> {

    @Column({
        allowNull: false,
        comment: "Access token value to which this refresh token corresponds.",
        field: "access_token",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "accessToken: Is required"
            }
        }
    })
    accessToken!: string;

    @Column({
        allowNull: false,
        comment: "Date and time this refresh token expires.",
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
        comment: "Refresh token value for this refresh token",
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

export default OAuthRefreshToken;
