"use client"

// components/users/UserForm.tsx

/**
 * Input form for adding or editing a User.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@prisma/client";

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

type UserFormProps = {
    // Handler to save the updated result
    handleSave: (user: User) => void,
    // User to be edited (id < 0 means adding)
    user: User;
}

export default function UserForm(props: UserFormProps) {

    //console.log("UserForm.entry", JSON.stringify(props.user));

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            active: (typeof props.user.active === "boolean") ? props.user.active : true,
            google_books_api_key: props.user.google_books_api_key ? props.user.google_books_api_key : "",
            name: props.user.name ? props.user.name : "",
            password: props.user.password ? props.user.password : "",
            scope: props.user.scope ? props.user.scope : "",
            username: props.user.username ? props.user.username : "",
        },
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();

    function onSubmit(values: z.infer<typeof formSchema>) {
        const result: User = {
            id: props.user.id,
            active: (typeof values.active === "undefined") ? null : values.active,
            google_books_api_key: values.google_books_api_key ? values.google_books_api_key : null,
            name: values.name,
            password: values.password ? values.password : "",
            scope: values.scope,
            username: values.username,
        }
        props.handleSave(result);
        router.push("/users");
    }

    const adding = (props.user.id < 0);

    return (
        <>

            <div className="grid grid-cols-3">
                <div>
                    <BackButton href="/users"/>
                </div>
                <div className="text-center">
                    <strong>
                        {(adding)? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;User
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
                                        Name of this User.
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
                                        Space-separated scope(s) granted to this user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 space-x-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username:</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Sign in username of this User (must be unique).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password:</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Sign in password of this User (set this ONLY on new Users or if you wish to change the password for an existing User).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* TODO: more stuff for Library-specific scopes */}

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
                                    <FormLabel>Active User?</FormLabel>
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
    google_books_api_key: z.string().optional(),
    name: z.string(),
    password: z.string().optional(), // TODO: required on insert, optional on update
    scope: z.string(), // TODO: format validity, allowed scope?
    username: z.string(), // TODO: uniqueness check
});
