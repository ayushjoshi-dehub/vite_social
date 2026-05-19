import { useState, useCallback } from 'react';

// Custom hook for handling API calls with loading and error states
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const request = useCallback(async (apiCall) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiCall();
            
            if (result.success) {
                setData(result.data);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const errorMsg = err.message || "An error occurred";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);
    const clearData = useCallback(() => setData(null), []);

    return {
        loading,
        error,
        data,
        request,
        clearError,
        clearData,
        setData,
        setError
    };
};
