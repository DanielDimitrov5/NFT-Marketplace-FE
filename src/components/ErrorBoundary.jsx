import { useState, useEffect } from 'react';
import NotFound from './NotFound';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const errorHandler = (error) => {
            setHasError(true);
        };

        window.addEventListener('error', errorHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    if (hasError) {
        return <NotFound />
    }

    return children;
}

export default ErrorBoundary;