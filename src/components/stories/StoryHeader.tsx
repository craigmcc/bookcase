// components/stories/StoryHeader.tsx

/**
 * Header for either StoryCard or StoryForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {BackButton} from "@/components/shared/BackButton";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type StoryHeaderProps = {
    // Are we adding a new Story?
    adding: boolean;
    // Navigation route for the back button [Not rendered]
    back?: string;
    // Parent object for this Story
    parent: Parent;
}

export default function StoryHeader(props: StoryHeaderProps) {

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
                {(props.adding)? (
                    <span>Add New</span>
                ) : (
                    <span>Edit Existing</span>
                )}
                &nbsp;Story for {parentModel}&nbsp;
                <span className="text-info">
                        {parentName}
                    </span>
            </div>
        </div>
    )

}
