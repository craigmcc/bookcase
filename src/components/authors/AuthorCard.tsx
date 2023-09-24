"use client"

// components/authors/AuthorCard.tsx

/**
 * Wrapper around AuthorForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

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
    const back = props.back ? props.back
        : `/base/${props.author.libraryId}/authors/${props.author.id}`;
    const dest = props.dest ? props.dest
        : `/base/${props.author.libraryId}/authors/${props.author.id}`;

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
