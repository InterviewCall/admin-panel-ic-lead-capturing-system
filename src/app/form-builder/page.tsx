'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import FormBuilder from '@/components/form-builder/FormBuilder';

export default function FormBuilderPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem('user-role');

        if (role !== 'ADMIN') {
            router.replace('/dashboard');
            return;
        }

        setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return <FormBuilder />;
}