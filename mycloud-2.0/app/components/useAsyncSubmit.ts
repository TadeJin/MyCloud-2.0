"use client";

import { useState } from "react";

export const useAsyncSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (action: () => Promise<unknown>) => {
        setIsSubmitting(true);

        try {
            await action();
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, submit };
};
