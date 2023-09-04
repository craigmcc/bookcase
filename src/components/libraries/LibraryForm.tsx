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
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Prisma, Library} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "@/actions/LibraryActionsShim";
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
import {LibraryPlus} from "@/types/models/Library";

// Public Objects ------------------------------------------------------------

type LibraryFormProps = {
    // Navigation destination after successful save operation [/libraries]
    destination?: string,
    // Library to be edited (id < 0 means adding)
    library: LibraryPlus;
    // Show the back button and header title? [true]
    showHeader?: boolean;
}

export default function LibraryForm(props: LibraryFormProps) {

    console.log("LibraryForm.entry", JSON.stringify(props.library));
    // @ts-ignore
    //console.log("LibraryForm._model", props.library._model);
    const form = useForm<Yup.InferType<typeof formSchema>>({
        defaultValues: {
            id: props.library.id,
            active: (typeof props.library.active === "boolean") ? props.library.active : true,
            name: props.library.name ? props.library.name : "",
            notes: props.library.notes ? props.library.notes : "",
            scope: props.library.scope ? props.library.scope : "",
        },
        mode: "onBlur",
        resolver: yupResolver(formSchema),
    });
    const router = useRouter();

    async function onSubmit(values: Yup.InferType<typeof formSchema>) {
        //console.log("VALUES", JSON.stringify(values));
        if (values.id && (values.id < 0)) {
            const input: Prisma.LibraryCreateInput = {
                ...values,
            }
            //console.log("INSERT INPUT", JSON.stringify(input));
            try {
                await LibraryActions.insert(input);
                router.push(props.destination ? props.destination : "/libraries");
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input: Prisma.LibraryUpdateInput = {
                ...values,
            }
            // console.log("UPDATE INPUT", JSON.stringify(input));
            try {
                await LibraryActions.update(props.library.id, input);
                router.push(props.destination ? props.destination : "/libraries");
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.library.id < 0);
    const showHeader = (props.showHeader !== undefined) ? props.showHeader : true;

    //console.log("LibraryForm.rendered", JSON.stringify(props.library));
    return (
        <>

            {(showHeader) ? (
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
            ) : null }

            <Form {...form}>
                <form
                    className="container mx-auto space-y-4"
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

                    <div className="grid grid-cols-2 space-x-4">

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

const SCOPE_REGEX = /^[a-zA-Z0-9]+$/;

const formSchema = Yup.object().shape({
    id: Yup.number()
        .required(),
    active: Yup.boolean()
        .default(true),
    name: Yup.string()
        .required("Name is required")
        .test("unique-name",
            "That name is already in use",
            async function (this) {
                const library = this.parent as Library;
                //console.log("unique-name on  " + JSON.stringify(library));
                try {
                    const result = await LibraryActions.exact(library.name);
                    //console.log("unique-name got " + JSON.stringify(result));
                    return (result.id === library.id);
                } catch (error) {
                    //console.log("unique-username definitely unique");
                    return true;            // Definitely unique
                }
            }),
    notes: Yup.string()
        .defined(),
    scope: Yup.string()                 // TODO - uniqueness check
        .required("Scope is required")
        .matches(SCOPE_REGEX, "Scope must contain only letters and digits"),
});
