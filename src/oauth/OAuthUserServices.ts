// OAuthUserServices ---------------------------------------------------------

// Services implementation for OAuthUser models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op, Order } from "sequelize";

// Internal Modules ----------------------------------------------------------

import OAuthAccessToken from "./OAuthAccessToken";
import OAuthRefreshToken from "./OAuthRefreshToken";
import OAuthUser from "./OAuthUser";
import Database from "../models/Database";
import AbstractServices from "../services/AbstractServices";
import { NotFound } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";

const OAuthAccessTokensOrder: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];
const OAuthRefreshTokensOrder: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];
const OAuthUsersOrder: Order = [
    [ "username", "ASC" ],
];

// Public Classes ------------------------------------------------------------

export class OAuthUserServices extends AbstractServices<OAuthUser> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<OAuthUser[]> {
        let options: FindOptions = appendQuery({
            order: OAuthUsersOrder
        }, query);
        return OAuthUser.findAll(options);
    }

    public async find(userId: number, query?: any): Promise<OAuthUser> {
        let options: FindOptions = appendQuery({
            where: { id: userId }
        }, query);
        let results = await OAuthUser.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `userId: Missing OAuthUser ${userId}`,
                "OAuthUserServices.find()");
        }
    }

    public async insert(user: OAuthUser): Promise<OAuthUser> {
        // TODO - hash the password!
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: OAuthUser = await OAuthUser.create(user, {
                fields: fields,
                transaction: transaction
            });
            await transaction.commit();
            return inserted;
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    public async remove(userId: number): Promise<OAuthUser> {
        let removed = await OAuthUser.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing OAuthUser ${userId}`,
                "OAuthUserServices.remove()");
        }
        let count = await OAuthUser.destroy({
            where: { id: userId }
        });
        if (count < 1) {
            throw new NotFound(
                `userId: Cannot remove OAuthUser ${userId}`,
                "OAuthUserServices.remove()");
        }
        return removed;
    }

    public async update(userId: number, user: OAuthUser): Promise<OAuthUser> {
        // TODO - disallow updating the password this way?
        let transaction;
        try {
            transaction = await Database.transaction();
            user.id = userId;
            let result: [number, OAuthUser[]] = await OAuthUser.update(user, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: userId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `userId: Cannot update OAuthUser ${userId}`,
                    "OAuthUserServices.update()");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(userId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** OAuthUser Lookups *****

    public async active(query?: any): Promise<OAuthUser[]> {
        let options: FindOptions = appendQuery({
            order: OAuthUsersOrder,
            where: {
                active: true
            }
        }, query);
        return OAuthUser.findAll(options);
    }

    // NOTE:  match against the "username" field
    public async exact(username: string, query?: any): Promise<OAuthUser> {
        let options: FindOptions = appendQuery({
            where: {
                username: username
            }
        }, query);
        let results = await OAuthUser.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing OAuthUser '${username}'`,
                "OAuthUserServices.exact()");
        }
        return results[0];
    }

    // NOTE: match against the "name" field
    public async name(name: string, query?: any): Promise<OAuthUser[]> {
        let options: FindOptions = appendQuery({
            order: OAuthUsersOrder,
            where: {
                name: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        return OAuthUser.findAll(options);
    }

    // ***** OAuthAccessToken Lookups *****

    public async accessTokensAll(userId: number, query?: any): Promise<OAuthAccessToken[]> {
        let user = await OAuthUser.findByPk(userId, {
            include: [ OAuthAccessToken ]
        });
        if (!user) {
            throw new NotFound(
                `userId: Missing OAuthUser ${userId}`,
                "OAuthUserServices.accessTokensAll()");
        }
        let options: FindOptions = appendQuery({
            order: OAuthAccessTokensOrder
        }, query);
        return user.$get("accessTokens", options);
    }

    // ***** OAuthRefreshToken Lookups *****

    public async refreshTokensAll(userId: number, query?: any): Promise<OAuthRefreshToken[]> {
        let user = await OAuthUser.findByPk(userId, {
            include: [ OAuthAccessToken ]
        });
        if (!user) {
            throw new NotFound(
                `userId: Missing OAuthUser ${userId}`,
                "OAuthUserServices.accessTokensAll()");
        }
        let options: FindOptions = appendQuery({
            order: OAuthRefreshTokensOrder
        }, query);
        return user.$get("refreshTokens", options);
    }

}

export default new OAuthUserServices();

// Private Objects -----------------------------------------------------------

let appendQuery = function(options: FindOptions, query?: any): FindOptions {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAccessTokens) {
        include.push(OAuthAccessToken);
    }
    if ("" === query.withRefreshTokens) {
        include.push(OAuthRefreshToken);
    }
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

let fields: string[] = [
    "active",
    "name",
    "password",
    "scope",
    "username",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

