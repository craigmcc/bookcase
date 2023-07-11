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

import * as UserActions from "@/actions/UserActions";
import {verifyPassword} from "@/oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

const handler = NextAuth({

    callbacks: {

        async jwt({ token, user}) {
            return { ...token, ...user }
        },

        async session({ session, token, user }) {
            // @ts-ignore
            session.user = user as UserActions.UserPlus;
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
                try {
                    if (credentials) {
                        const user = await UserActions.exact(credentials.username);
                        if (!user || !user.active) {
                            return null;
                        }
                        if (await verifyPassword(credentials.password, user.password)) {
                            return user as any; // TODO - seems flaky
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } catch (error) {
                    // TODO: log?
                    return null;
                }
            },
            credentials: {
                username: {label: "Username:", type: "text"},
                password: {label: "Password", type: "password"},
            },
            name: "Your Credentials",
        }),

    ],

});

export { handler as GET, handler as POST }
