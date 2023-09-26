"use client"

// components/stories/StoryCard.tsx

/**
 * Wrapper around StoryForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

import {usePathname, useSearchParams} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import StoryForm from "./StoryForm";
import StoryHeader from "./StoryHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {StoryPlus} from "@/types/models/Story";
import {Parent} from "@/types/types";
import {validateHref} from "@/util/ApplicationValidators";
import * as BreadcrumbUtils from "@/util/BreadcrumbUtils";

// Public Objects ------------------------------------------------------------

type StoryCardProps = {
    // Navigation route for Back button [/base/:libraryId/stories/:storyId]
    back?: string,
    // Navigation route after successful save [/base/:libraryId/stories/:storyId]
    dest?: string,
    // Parent object for this Story
    parent: Parent;
    // Story to be edited (id < 0 means adding)
    story: StoryPlus,
}

export default function StoryCard(props: StoryCardProps) {

    const adding = (props.story.id < 0);

    // Update breadcrumbs to include this destination (if necessary)
    const pathname = usePathname();
    if (BreadcrumbUtils.has(pathname)) {
        BreadcrumbUtils.trim(pathname);
    } else {
        BreadcrumbUtils.add({
            href: pathname,
            label: props.story.name,
        });
    }
    console.log("StoryCard.pathname", pathname);

    // Calculate relevant navigation hrefs
    const searchParams = useSearchParams();
    const back = searchParams.has("back") && validateHref(searchParams.get("back")!)
        ? searchParams.get("back")!
        : `/base/${props.story.libraryId}/stories/${props.story.id}`;
    const dest = searchParams.has("dest") && validateHref(searchParams.get("dest")!)
        ? searchParams.get("dest")!
        : `/base/${props.story.libraryId}/stories/${props.story.id}`;
    console.log("StoryCard.back", back);
    console.log("StoryCard.dest", dest);

    // Render the requested content
    return (
        <Card className="border-solid">
            <CardHeader>
                <CardTitle>
                    <StoryHeader
                        adding={adding}
                        back={back}
                        parent={props.parent}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StoryForm
                    dest={dest}
                    parent={props.parent}
                    showHeader={false}
                    story={props.story}
                />
            </CardContent>
        </Card>
    )

}
