"use client"

// components/authors/AuthorCard.tsx

/**
 * Wrapper around AuthorForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

import {usePathname, useSearchParams} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import AuthorForm from "./AuthorForm";
import AuthorHeader from "./AuthorHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {AuthorPlus} from "@/types/models/Author";
import {Parent} from "@/types/types";
import {validateHref} from "@/util/ApplicationValidators";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type AuthorCardProps = {
    // Navigation destination for Back button [/base/:libraryId/authors/:authorId]
    back?: string,
    // Navigation destination after successful save [/base/:libraryId/authors/:authorId]
    dest?: string,
    // Parent object for this Author
    parent: Parent;
    // Author to be edited (id < 0 means adding)
    author: AuthorPlus,
}

export default function AuthorCard(props: AuthorCardProps) {

    const adding = (props.author.id < 0);

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.author.lastName + ", " + props.author.firstName,
        });
    }
    console.log("AuthorCard.pathname", pathname);

    // Calculate relevant navigation hrefs
    const searchParams = useSearchParams();
    const back = searchParams.has("back") && validateHref(searchParams.get("back")!)
        ? searchParams.get("back")!
        : `/base/${props.author.libraryId}/authors/${props.author.id}`;
    const dest = searchParams.has("dest") && validateHref(searchParams.get("dest")!)
        ? searchParams.get("dest")!
        : `/base/${props.author.libraryId}/authors/${props.author.id}`;
    console.log("AuthorCard.back", back);
    console.log("AuthorCard.dest", dest);

    // Render the requested content
    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <AuthorHeader
                        adding={adding}
                        back={back}
                        parent={props.parent}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AuthorForm
                    dest={dest}
                    parent={props.parent}
                    showHeader={false}
                    author={props.author}
                />
            </CardContent>
        </Card>
    )

}
