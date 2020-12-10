// OAuthAccessTokenServices --------------------------------------------------

// Services implementation for OAuthAccessToken models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op, Order } from "sequelize";

// Internal Modules -----------------------------------------------------------

import OAuthAccessToken from "./OAuthAccessToken";
import AbstractServices from "../services/AbstractServices";
import { NotFound } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import OAuthUser from "./OAuthUser";
import Database from "../models/Database";
import OAuthRefreshToken from "./OAuthRefreshToken";

const OAuthAccessTokensOrder: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];

// Public Classes -------------------------------------------------------------

export class OAuthAccessTokenServices extends AbstractServices<OAuthAccessToken> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<OAuthAccessToken[]> {
        let options: FindOptions = appendQuery({
            order: OAuthAccessTokensOrder
        }, query);
        return OAuthAccessToken.findAll(options);
    }

    public async find(tokenId: number, query?: any): Promise<OAuthAccessToken> {
        let options: FindOptions = appendQuery({
            where: { id: tokenId }
        }, query);
        let results = await OAuthAccessToken.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `tokenId: Missing OAuthAccessToken ${tokenId}`,
                "OAuthAccessTokenServices.find()");
        }
    }

    public async insert(user: OAuthAccessToken): Promise<OAuthAccessToken> {
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: OAuthAccessToken = await OAuthAccessToken.create(user, {
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

    public async remove(tokenId: number): Promise<OAuthAccessToken> {
        let removed = await OAuthAccessToken.findByPk(tokenId);
        if (!removed) {
            throw new NotFound(
                `tokenId: Missing OAuthAccessToken ${tokenId}`,
                "OAuthAccessTokenServices.remove()");
        }
        let count = await OAuthAccessToken.destroy({
            where: { id: tokenId }
        });
        if (count < 1) {
            throw new NotFound(
                `tokenId: Cannot remove OAuthAccessToken ${tokenId}`,
                "OAuthAccessTokenServices.remove()");
        }
        return removed;
    }

    public async update(tokenId: number, user: OAuthAccessToken): Promise<OAuthAccessToken> {
        let transaction;
        try {
            transaction = await Database.transaction();
            user.id = tokenId;
            let result: [number, OAuthAccessToken[]] = await OAuthAccessToken.update(user, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: tokenId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `tokenId: Cannot update OAuthAccessToken ${tokenId}`,
                    "OAuthAccessTokenServices.update()");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(tokenId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

// Model-Specific Methods ------------------------------------------------

    public async exact(token: string, query?: any): Promise<OAuthUser> {
        let options: FindOptions = appendQuery({
            where: {
                token: token
            }
        }, query);
        let results = await OAuthUser.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing OAuthAccessToken '${token}'`,
                "OAuthAccessTokenServices.exact()");
        }
        return results[0];
    }

}

export default new OAuthAccessTokenServices();

// Private Objects -----------------------------------------------------------

let appendQuery = function(options: FindOptions, query?: any): FindOptions {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withUser) {
        include.push(OAuthUser);
    }

    return options;

}

let fields: string[] = [
    "expires",
    "scope",
    "token",
    "userId",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

