"use client"

// components/stories/StoryForm.tsx

/**
 * Input form for adding or editing a Story.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Prisma, Story} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import StoryHeader from "./StoryHeader";
import * as StoryActions from "@/actions/StoryActionsShim";
import {SaveButton} from "@/components/shared/SaveButton";
import {Checkbox} from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {StoryPlus} from "@/types/models/Story";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type StoryFormProps = {
    // Navigation destination after back button [Not rendered]
    back?: string;
    // Navigation destination after successful save operation
    destination?: string;
    // Parent object for this Story
    parent: Parent;
    // Show the back button and header title? [true]
    showHeader?: boolean;
    // Story to be edited (id < 0 means adding)
    story: StoryPlus;
}

export default function StoryForm(props: StoryFormProps) {

    console.log("StoryForm.entry", JSON.stringify(props.story));
    const form = useForm<Yup.InferType<typeof formSchema>>({
        defaultValues: {
            id: props.story.id,
            active: (typeof props.story.active === "boolean" ? props.story.active : true),
            copyright: props.story.copyright ? props.story.copyright : "",
            libraryId: props.story.libraryId,
            name: props.story.name ? props.story.name : "",
            notes: props.story.notes ? props.story.notes : "",
            // TODO: _ordinal?
        },
        mode: "onBlur",
        resolver: yupResolver(formSchema),
    });
    const router = useRouter();


    /**
     * Handle a validated form submit.
     */
    async function onSubmit(values: Yup.InferType<typeof formSchema>) {
        if (values.id && (values.id < 0)) {
            const input: Prisma.StoryUncheckedCreateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await StoryActions.insert(props.story.libraryId, input);
                router.push(destination);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input : Prisma.StoryUpdateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await StoryActions.update(props.story.libraryId, values.id, input);
                router.push(destination);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.story.id < 0);
    const destination = props.destination
        ? props.destination
        : `/base/${props.story.libraryId}/stories/${props.story.id}`;
    const showHeader = (props.showHeader !== undefined) ? props.showHeader : true;

    return (
        <>

            {(showHeader) ? (
                <StoryHeader
                    adding={adding}
                    back={props.back}
                    parent={props.parent}
                />
            ) : null }

            <Form {...form}>
                <form
                    className="container mx-auto space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >

                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Name of this Story (must be unique within a Library)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {/*TODO: ordinal?*/}
                    </div>

                    <div className="grid grid-cols-3`">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Notes:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Miscellaneous notes about this Story
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="copyright"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Copyright:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Copyright Year (YYYY) of this Story
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            className="mr-2"
                                            onCheckedChange={() => field.onChange(!field.value)}
                                        />
                                    </FormControl>
                                    <FormLabel>Active Story?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SaveButton/>
                    </div>

                </form>

            </Form>

        </>
    )

}

// Private Objects -----------------------------------------------------------

const formSchema = Yup.object().shape({
    id: Yup.number()
        .required(),
    active: Yup.boolean()
        .default(true),
    copyright: Yup.string()
        .defined(),
    libraryId: Yup.number()
        .required("Library ID is required"),
    name: Yup.string()
        .required("Name is required")
        .test("unique-name",
            "That name is already in use",
            async function (this) {
                const story = this.parent as Story;
                try {
                    const result = await StoryActions.exact(story.libraryId, story.name);
                    return (result.id === story.id);
                } catch (error) {
                    return true;        // Definitely unique
                }
            }),
    notes: Yup.string()
        .defined(),
});
