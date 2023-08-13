"use client"

// components/libraries/LibraryForm.tsx

/**
 * Input form for adding or editing a Library.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {BackButton} from "@/components/shared/BackButton";
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

// Public Objects ------------------------------------------------------------

type LibraryFormProps = {
    // Handler to save the updated result
    handleSave: (library: Library) => void,
    // Library to be edited (id < 0 means adding)
    library: Library;
}

export default function LibraryForm(props: LibraryFormProps) {

    //console.log("LibraryForm.entry", JSON.stringify(props.library));

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            active: (typeof props.library.active === "boolean") ? props.library.active : true,
            name: props.library.name,
            notes: props.library.notes ? props.library.notes : "",
            scope: props.library.scope,

        },
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();

    function onSubmit(values: z.infer<typeof formSchema>) {
        const result: Library = {
            id: props.library.id,
            active: (typeof values.active === "undefined") ? null : values.active,
            name: values.name,
            notes: values.notes === "" ? null : values.notes,
            scope: values.scope,
        }
        console.log("ONSUBMIT", JSON.stringify(result));
        props.handleSave(result);
        router.push("/libraries");
    }

    const adding = (props.library.id < 0);

    return (
        <>

            <div className="grid grid-cols-3">
                <div>
                    <BackButton href="/libraries"/>
                </div>
                <div className="text-center">
                    <strong>
                        {(adding)? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;Library
                    </strong>
                </div>
                <div/>
            </div>

            <Form {...form}>
                <form
                    className="container mx-auto py-6 space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Name of this Library (must be unique).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scope"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scope:</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Permission scope for this Library (must be unique).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Miscellaneous notes about this Library.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 space-x-2">

                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            className="mr-2"
                                            onCheckedChange={() => field.onChange(!field.value)}
                                        />
                                    </FormControl>
                                    <FormLabel>Active Library?</FormLabel>
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

const formSchema = z.object({
    active: z.boolean().optional(),
    id: z.number(),
    name: z.string()
        .nonempty(),
    notes: z.string(),
    scope: z.string() // TODO: uniqueness check
        .nonempty()
        .refine((scope) => {
            return scope.match(/^[a-zA-Z0-9]+$/);
        },  {
            message: "Scope must contain only letters and digits",
        }),
}); // Remove semicolon when uncommenting the below
/* TODO - seems to cause save action to never work.
    .refine(async (library) => {
        console.log("GET RESPONSE", JSON.stringify(library));
        const response = await fetch(`/api/libraries/exact/${library.name}`);
        console.log("GOT RESPONSE", JSON.stringify(response));
        if (response.ok) {
            const result = await response.json();
            return (library.id === result.id);
        } else {
            return true; // Definitely unique
        }
    }, {
        message: "That name is already in use",
        path: [ "name" ],
    });
*/
