// components/layout/SiteHeader.tsx

/**
 * Header bar for the overall site layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

//import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

//import {Icons} from "@/components/layout/Icons";
import {MainNav} from "@/components/layout/MainNav";
import {SignInButton} from "@/components/layout/SignInButton";
import {SignOutButton} from "@/components/layout/SignOutButton";
import {siteConfig} from "@/config/siteConfig";

// Public Objects ------------------------------------------------------------

export function SiteHeader() {
    const {data: session} = useSession();
    // NOTE: session?.user?.scope is available if the user is signed in
//    console.log("SiteHeader session", session);
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-indigo-50">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav items={siteConfig.mainNav}/>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="flex gap-2">
                        {session?.user ? (
                            <>
                                <p className="align-middle py-2 text-sm text-indigo-600"> {session.user.name}</p>
                                <SignOutButton onClick={() => signOut()}/>
                            </>
                        ) : (
                            <SignInButton onClick={() => signIn()}/>
                        )}
                    </div>
{/*
                    <nav className="flex items-center space-x-1">
                        <Link
                            href={siteConfig.links.github}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <Icons.Github className="h-5 w-5"/>
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </nav>
*/}
                </div>
            </div>
        </header>
    )
}
