"use client"

// components/series/SeriesForm.tsx

/**
 * Input form for adding or editing a Series.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Prisma, Series} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import SeriesHeader from "./SeriesHeader";
import * as SeriesActions from "@/actions/SeriesActionsShim";
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
import {SeriesPlus} from "@/types/models/Series";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type SeriesFormProps = {
    // Navigation route after back button [Not rendered]
    back?: string;
    // Navigation route after successful save operation
    dest: string;
    // Parent object for this Series
    parent: Parent;
    // Show the back button and header title? [true]
    showHeader?: boolean;
    // Series to be edited (id < 0 means adding)
    series: SeriesPlus;
}

export default function SeriesForm(props: SeriesFormProps) {

    console.log("SeriesForm.entry", JSON.stringify(props.series));
    const form = useForm<Yup.InferType<typeof formSchema>>({
        defaultValues: {
            id: props.series.id,
            active: (typeof props.series.active === "boolean" ? props.series.active : true),
            copyright: props.series.copyright ? props.series.copyright : "",
            libraryId: props.series.libraryId,
            name: props.series.name ? props.series.name : "",
            notes: props.series.notes ? props.series.notes : "",
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
            const input: Prisma.SeriesUncheckedCreateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await SeriesActions.insert(props.series.libraryId, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input : Prisma.SeriesUpdateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await SeriesActions.update(props.series.libraryId, values.id, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.series.id < 0);
    const showHeader = (props.showHeader !== undefined) ? props.showHeader : true;

    return (
        <>

            {(showHeader) ? (
                <SeriesHeader
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
                                        Name of this Series (must be unique within a Library)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 space-x-2">
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
                                        Miscellaneous notes about this Series
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
                                        Copyright Year (YYYY) of this Series
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
                                    <FormLabel>Active Series?</FormLabel>
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
                const series = this.parent as Series;
                try {
                    const result = await SeriesActions.exact(series.libraryId, series.name);
                    return (result.id === series.id);
                } catch (error) {
                    return true;        // Definitely unique
                }
            }),
    notes: Yup.string()
        .defined(),
});
