// api/auth/[...nextauth]/route.ts

/**
 * Route definitions for next-auth (authentication and authorization).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

//import {NextApiRequest, NextApiResponse} from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Internal Modules ----------------------------------------------------------

import prisma from "@/prisma";
import * as UserActions from "@/actions/UserActions";
import {verifyPassword} from "@/oauth/OAuthUtils";
import logger from "@/util/ServerLogger";

// Public Objects ------------------------------------------------------------

const handler = NextAuth({

    callbacks: {

        async jwt({ token, user}) {
            logger.info({
                context: "jwt",
                token: token,
                user: user,
            })
            return { ...token, ...user }
        },

        async session({ session, token, user }) {
            logger.info({
                context: "session",
                session: session,
                token: token,
                user: user,
            })
            // @ts-ignore
            const scrubbed = user as UserActions.UserPlus;
            scrubbed.password = ""; // Redacted
            session.user = scrubbed;
            return session;
        }

    },

    providers: [

        /**
         * For our purposes, we will only use a credentials provider
         * because Users are in our database and contain scope values.
         */
        CredentialsProvider({
            async authorize(credentials, req) {
                logger.info({
                    context: "authorize",
                    credentials: credentials,
                    req: req,
                });
                try {
                    if (credentials) {
//                        const user = await UserActions.exact(credentials.username);
                        const user = await prisma.user.findUnique({
                            where: { username: credentials.username }
                        })
                        logger.info({
                            context: "authorize.validate",
                            user: user,
                        })
                        if (!user || !user.active) {
                            return null;
                        }
                        if (await verifyPassword(credentials.password, user.password)) {
                            logger.info({
                                context: "authorize.success",
                                user: user,
                            })
                            return user as any; // TODO - seems flaky
                        } else {
                            logger.info({
                                context: "authorize.failure",
                                user: user,
                            })
                            return null;
                        }
                    } else {
                        return null;
                    }
                } catch (error) {
                    logger.info({
                        context: "authorize.error",
                        error: error,
                    });
                    return null;
                }
            },
            credentials: {
                username: {label: "Username:", type: "text"},
                password: {label: "Password:", type: "password"},
            },
            name: "Your Credentials",
        }),

    ],

});

export { handler as GET, handler as POST }
