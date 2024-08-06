import React from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import RangeInput from '@/components/RangeInput';

const exchange = () => {
    const router = useRouter(); // Initialize the useRouter hook
    return (
        <RangeInput></RangeInput>
    );
};

export default exchange;
