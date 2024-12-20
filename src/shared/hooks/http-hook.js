import React, {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const activeHttpRequests = useRef([]);
    
    const sendRequest = useCallback(async (url, method='GET', body=null, headers={}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {method, body, headers, signal: httpAbortCtrl.signal});
            const data = await response.json();   

            if(!response.ok)
                throw new Error(data.message);
            setIsLoading(false);
            return data;
        }catch(err) {
            setError(err.message || 'Something went wrong, please try again.');
            setIsLoading(false);
            throw err;
        }
        
    }, []);

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        }
    }, []); 

    return {isLoading, error, sendRequest, clearError};
};