// components/volumes/VolumeHeader.tsx

/**
 * Header for either VolumeCard or VolumeForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {BackButton} from "@/components/shared/BackButton";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type VolumeHeaderProps = {
    // Are we adding a new Volume?
    adding: boolean;
    // Navigation route for the back button [Not rendered]
    back?: string;
    // Parent object for this Volume
    parent: Parent;
}

export default function VolumeHeader(props: VolumeHeaderProps) {

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
                &nbsp;Volume for {parentModel}&nbsp;
                <span className="text-info">
                        {parentName}
                    </span>
            </div>
        </div>
    )

}
