// api/auth/signin.tsx

/**
 * Credentials sign-in page for next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import {getCsrfToken} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <form method="post" action="/api/auth/callback/credentials">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
            <label>
                Username:
                <input name="username" type="text"/>
            </label>
            <label>
                Password:
                <input name="password" type="password"/>
            </label>
            <button type="submit">Sign In</button>
        </form>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}

