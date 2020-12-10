// OAuthServerImpl -----------------------------------------------------------

// Implementation of server configuration and handlers for basic-oauth2-server.

// External Modules ----------------------------------------------------------

import {
    Identifier,
    AccessToken,
    RefreshToken,
    User,
    ServerConfig,
    AuthenticateUser,
    CreateAccessToken,
    CreateRefreshToken,
    RetrieveAccessToken,
    RetrieveRefreshToken,
    RevokeAccessToken,
    RevokeRefreshToken,
} from "@craigmcc/basic-oauth2-server";

// Internal Modules ----------------------------------------------------------

import OAuthAccessToken from "./OAuthAccessToken";
import OAuthRefreshToken from "./OAuthRefreshToken";
import OAuthUser from "./OAuthUser";
import { NotFound } from "../util/http-errors";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = (username: string, password: string): User | null =>
{
    OAuthUser.findOne({ where: { username: username } })
        .then((result: OAuthUser | null) => {
            if (!result) {
                return null;
            }
            // TODO - deal with hashed password
            if (password !== result.password) {
                return null;
            }
            const user: User = {
                scope: result.scope,
                userId: result.id ? result.id : 0 // Will never happen
            }
            return user;
        });
    return null;
}

const createAccessToken: CreateAccessToken
    = (expires: Date, scope: string, userId: Identifier): AccessToken =>
{
    let incomingId: number = 0;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<OAuthAccessToken> = {
        expires: expires,
        scope: scope,
        userId: incomingId
    }
    let outgoing: AccessToken = {
        expires: new Date(),
        scope: "",
        token: "",
        userId: 0,
    }
    OAuthAccessToken.create(incoming, {
        fields: ["expires", "scope", "userId" ]
    })
        .then((result: OAuthAccessToken) => {
            outgoing = {
                expires: result.expires,
                scope: result.scope,
                token: result.token,
                userId: result.id ? result.id : 0 // Will never happen
            }
        });
    return outgoing;
}

// @ts-ignore (return inside then() or thrown error)
const createRefreshToken: CreateRefreshToken
    = (accessToken: string, expires: Date, userId: Identifier): RefreshToken =>
{
    let incomingId: number = 0;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<OAuthRefreshToken> = {
        accessToken: accessToken,
        expires: expires,
        userId: incomingId
    }
    let outgoing: RefreshToken = {
        accessToken: "",
        expires: new Date(),
        token: "",
        userId: 0
    }
    OAuthRefreshToken.create(incoming, {
        fields: [ "accessToken", "expires", "userId"]})
        .then((result: OAuthRefreshToken) => {
            outgoing = {
                accessToken: result.accessToken,
                expires: result.expires,
                token: result.token,
                userId: result.id ? result.id : 0 // Will never happen
            }
        });
    return outgoing;
}

// @ts-ignore (return inside then() or thrown error)
const retrieveAccessToken: RetrieveAccessToken
    = (token: string): AccessToken =>
{
    let outgoing: AccessToken = {
        expires: new Date(),
        scope: "",
        token: "",
        userId: 0
    }
    OAuthAccessToken.findOne({ where: {token: token} })
        .then((result: OAuthAccessToken | null) => {
            if (!result) {
                return null;
            }
            outgoing = {
                expires: result.expires,
                scope: result.scope,
                token: result.token,
                userId: result.userId
            };
        });
    return outgoing;
}

// @ts-ignore (return inside then() or thrown error)
const retrieveRefreshToken: RetrieveRefreshToken
    = (token: string): RefreshToken =>
{
    let outgoing: RefreshToken = {
        accessToken: "",
        expires: new Date(),
        token: "",
        userId: 0
    }
    OAuthRefreshToken.findOne({ where: {token: token} })
        .then((result: OAuthRefreshToken | null) => {
            if (!result) {
                return null;
            }
            outgoing = {
                accessToken: result.accessToken,
                expires: result.expires,
                token: result.token,
                userId: result.userId
            };
        });
    return outgoing;
}

const revokeAccessToken: RevokeAccessToken
    = (token: string): void =>
{
    OAuthAccessToken.destroy({ where: {token: token} })
        .then((count: number) => {
            return;
        })
}

const revokeRefreshToken: RevokeRefreshToken
    = (token: string): void =>
{
    OAuthRefreshToken.destroy({ where: {token: token} })
        .then((count: number) => {
            return;
        })
}

// Public Objects ------------------------------------------------------------

export const OAuthServerConfig: ServerConfig = {
    authenticateUser: authenticateUser,
    createAccessToken: createAccessToken,
    createRefreshToken: createRefreshToken,
    retrieveAccessToken: retrieveAccessToken,
    retrieveRefreshToken: retrieveRefreshToken,
    revokeAccessToken: revokeAccessToken,
    revokeRefreshToken: revokeRefreshToken
}

