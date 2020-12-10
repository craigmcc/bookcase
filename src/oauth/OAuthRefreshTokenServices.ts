// OAuthRefreshTokenServices --------------------------------------------------

// Services implementation for OAuthRefreshToken models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op, Order } from "sequelize";

// Internal Modules -----------------------------------------------------------

import OAuthRefreshToken from "./OAuthRefreshToken";
import AbstractServices from "../services/AbstractServices";
import { NotFound } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import OAuthUser from "./OAuthUser";
import Database from "../models/Database";

const OAuthRefreshTokensOrder: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];

// Public Classes -------------------------------------------------------------

export class OAuthRefreshTokenServices extends AbstractServices<OAuthRefreshToken> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<OAuthRefreshToken[]> {
        let options: FindOptions = appendQuery({
            order: OAuthRefreshTokensOrder
        }, query);
        return OAuthRefreshToken.findAll(options);
    }

    public async find(tokenId: number, query?: any): Promise<OAuthRefreshToken> {
        let options: FindOptions = appendQuery({
            where: { id: tokenId }
        }, query);
        let results = await OAuthRefreshToken.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `tokenId: Missing OAuthRefreshToken ${tokenId}`,
                "OAuthRefreshTokenServices.find()");
        }
    }

    public async insert(user: OAuthRefreshToken): Promise<OAuthRefreshToken> {
        let transaction;
        try {
            transaction = await Database.transaction();
            let inserted: OAuthRefreshToken = await OAuthRefreshToken.create(user, {
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

    public async remove(tokenId: number): Promise<OAuthRefreshToken> {
        let removed = await OAuthRefreshToken.findByPk(tokenId);
        if (!removed) {
            throw new NotFound(
                `tokenId: Missing OAuthRefreshToken ${tokenId}`,
                "OAuthRefreshTokenServices.remove()");
        }
        let count = await OAuthRefreshToken.destroy({
            where: { id: tokenId }
        });
        if (count < 1) {
            throw new NotFound(
                `tokenId: Cannot remove OAuthRefreshToken ${tokenId}`,
                "OAuthRefreshTokenServices.remove()");
        }
        return removed;
    }

    public async update(tokenId: number, user: OAuthRefreshToken): Promise<OAuthRefreshToken> {
        let transaction;
        try {
            transaction = await Database.transaction();
            user.id = tokenId;
            let result: [number, OAuthRefreshToken[]] = await OAuthRefreshToken.update(user, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: tokenId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `tokenId: Cannot update OAuthRefreshToken ${tokenId}`,
                    "OAuthRefreshTokenServices.update()");
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

    public async exact(token: string, query?: any): Promise<OAuthRefreshToken> {
        let options: FindOptions = appendQuery({
            where: {
                token: token
            }
        }, query);
        let results = await OAuthRefreshToken.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing OAuthRefreshToken '${token}'`,
                "OAuthRefreshTokenServices.exact()");
        }
        return results[0];
    }

}

export default new OAuthRefreshTokenServices();

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
    "accessToken",
    "expires",
    "scope",
    "token",
    "userId",
];
let fieldsWithId: string[] = [
    ...fields,
    "id"
];

