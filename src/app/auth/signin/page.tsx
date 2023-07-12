"use client"

// app/auth/signin/page.tsx

/**
 * Styled sign In page for next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect, useSearchParams} from "next/navigation";
import {/*getCsrfToken,*/ signIn} from "next-auth/react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// Internal Modules ----------------------------------------------------------

import {Button} from "@/components/ui/button";
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

export default function SignIn() {

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            password: "",
            username: "",
        },
        mode: "onBlur",
        resolver: zodResolver(formSchema),
    });

    const searchParams = useSearchParams();
    let callbackUrl = "/";
    if (searchParams && searchParams.get("callbackUrl")) {
        // @ts-ignore
        callbackUrl = searchParams.get("callbackUrl");
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await signIn<"credentials">("credentials", {
            callbackUrl: callbackUrl,
            password: values.password,
            redirect: true,
            username: values.username,
        });
/* TODO - manually trying the redirect on successful login throws NEXT_REDIRECT error
        alert(JSON.stringify(result));
        if (result) {
            if (!result.error) {
                try {
                    return redirect(callbackUrl);
                } catch (error) {
                    alert(`Caught error ${JSON.stringify(error)}`);
                }
            } else {
                alert("Authentication failed.  Please try again");
            }
        }
*/
    }

    return (
        <Form {...form}>
            <form
                className="container mx-auto py-10 space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
            >
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
                                Enter your assigned username.
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
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your assigned password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Sign In</Button>
            </form>
        </Form>
    )

}

// Private Objects -----------------------------------------------------------

const formSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
});
