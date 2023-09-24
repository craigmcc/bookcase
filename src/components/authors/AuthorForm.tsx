"use client"

// components/authors/AuthorForm.tsx

/**
 * Input form for adding or editing an Author.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Prisma, Author} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import AuthorHeader from "./AuthorHeader";
import * as AuthorActions from "@/actions/AuthorActionsShim";
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
import {AuthorPlus} from "@/types/models/Author";
import {Parent} from "@/types/types";

// Public Objects ------------------------------------------------------------

type AuthorFormProps = {
    // Navigation route after back button [Not rendered]
    back?: string;
    // Navigation route after successful save operation
    dest: string;
    // Parent object for this Author
    parent: Parent;
    // Show the back button and header title? [true]
    showHeader?: boolean;
    // Author to be edited (id < 0 means adding)
    author: AuthorPlus;
}

export default function AuthorForm(props: AuthorFormProps) {

    console.log("AuthorForm.entry", JSON.stringify(props.author));
    const form = useForm<Yup.InferType<typeof formSchema>>({
        defaultValues: {
            id: props.author.id,
            active: (typeof props.author.active === "boolean" ? props.author.active : true),
            firstName: props.author.firstName ? props.author.firstName : "",
            lastName: props.author.lastName ? props.author.lastName : "",
            libraryId: props.author.libraryId,
            notes: props.author.notes ? props.author.notes : "",
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
            const input: Prisma.AuthorUncheckedCreateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await AuthorActions.insert(props.author.libraryId, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON INSERT: " + JSON.stringify(error));
            }
        } else {
            const input : Prisma.AuthorUpdateInput = {
                ...values,
                // TODO - "" -> null for optional values?
            }
            try {
                await AuthorActions.update(props.author.libraryId, values.id, input);
                router.push(props.dest);
            } catch (error) {
                // TODO: something more graceful would be better
                alert("ERROR ON UPDATE: " + JSON.stringify(error));
            }
        }
    }

    const adding = (props.author.id < 0);
    const showHeader = (props.showHeader !== undefined) ? props.showHeader : true;

    return (
        <>

            {(showHeader) ? (
                <AuthorHeader
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

                    <div className="grid grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Name of this Author (must be unique within a Library)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name:</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Name of this Author (must be unique within a Library)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Notes:</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Miscellaneous notes about this Author
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
                                    <FormLabel>Active Author?</FormLabel>
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
    firstName: Yup.string()
        .required("First Name is required"),
    lastName: Yup.string()
        .required("Last Name is required")
        .test("unique-name",
            "That name is already in use",
            async function (this) {
                const author = this.parent as Author;
                try {
                    const result = await AuthorActions.exact(author.libraryId, author.firstName, author.lastName);
                    return (result.id === author.id);
                } catch (error) {
                    return true;        // Definitely unique
                }
            }),
    libraryId: Yup.number()
        .required("Library ID is required"),
    notes: Yup.string()
        .defined(),
});
