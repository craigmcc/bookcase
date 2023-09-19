// components/authors/AuthorHeader.tsx

/**
 * Header for either AuthorCard or AuthorForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {BackButton} from "@/components/shared/BackButton";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type AuthorHeaderProps = {
    // Are we adding a new Author?
    adding: boolean;
    // Navigation destination for the back button [Not rendered]
    back?: string;
    // Parent object for this Author
    parent: Parent;
}

export default function AuthorHeader(props: AuthorHeaderProps) {

    // @ts-ignore
    const parentModel = props.parent["_model"];
    let parentName: string;
    if (parentModel === "Author") {
        // @ts-ignore
        parentName = `${props.parent.lastName}, ${props.parent.firstName}`
    } else {
        // @ts-ignore
        parentName = props.parent.name;
    }

    return (
        <div className="grid grid-cols-3">
            <div>
                {(props.back) ? (
                    <BackButton href={props.back}/>
                ) : null }
            </div>
            <div className="col-span-2 flex items-center">
                <strong>
                    {(props.adding)? (
                        <span>Add New</span>
                    ) : (
                        <span>Edit Existing</span>
                    )}
                    &nbsp;Author for {parentModel}&nbsp;
                    <span className="text-info">
                        {parentName}
                    </span>
                </strong>
            </div>
        </div>
    )

}
