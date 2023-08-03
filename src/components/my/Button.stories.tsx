// components/my/Button.stories.tsx

/**
 * Storybook stories for the Button component.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type {Meta, StoryObj} from "@storybook/react";

// Internal Modules ----------------------------------------------------------

import {Button} from "./Button";

// Configuration Objects -----------------------------------------------------

const meta: Meta<typeof Button> = {
    component: Button,
    title: "MyUI/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story Objects -------------------------------------------------------------

export const Default: Story = {
    render: () => <Button>Default</Button>
}

export const Primary: Story = {
    render: () => <Button variant="primary">Primary</Button>
}

export const Secondary: Story = {
    render: () => <Button variant="secondary">Secondary</Button>
}

