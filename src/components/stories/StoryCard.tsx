"use client"

// components/stories/StoryCard.tsx

/**
 * Wrapper around StoryForm with a Card presentation.
 *
 * @package Documentation
 */

// External Modules ----------------------------------------------------------

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

// Public Objects ------------------------------------------------------------

type StoryCardProps = {
    // Navigation destination for Back button [/base/:libraryId/stories/:storyId]
    back?: string,
    // Navigation destination after successful save [/base/:libraryId/stories/:storyId]
    destination?: string,
    // Parent object for this Story
    parent: Parent;
    // Story to be edited (id < 0 means adding)
    story: StoryPlus,
}

export default function StoryCard(props: StoryCardProps) {

    const adding = (props.story.id < 0);
    const back = props.back ? props.back
        : `/base/${props.story.libraryId}/stories/${props.story.id}`;
    const destination = props.destination ? props.destination
        : `/base/${props.story.libraryId}/stories/${props.story.id}`;

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
                    destination={destination}
                    parent={props.parent}
                    showHeader={false}
                    story={props.story}
                />
            </CardContent>
        </Card>
    )

}
