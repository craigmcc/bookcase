// components/series/SeriesHeader.tsx

/**
 * Header for either SeriesCard or SeriesForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {BackButton} from "@/components/shared/BackButton";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type SeriesHeaderProps = {
    // Are we adding a new Series?
    adding: boolean;
    // Navigation destination for the back button [Not rendered]
    back?: string;
    // Parent object for this Series
    parent: Parent;
}

export default function SeriesHeader(props: SeriesHeaderProps) {

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
                    &nbsp;Series for {parentModel}&nbsp;
                    <span className="text-info">
                        {parentName}
                    </span>
                </strong>
            </div>
        </div>
    )

}
