import React, {useState, useCallback, useEffect} from 'react';

//keeps track of the token expiration time
let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);


    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        // Calculate the expiration time of the token
        //this variable can be called with the same name as the state variable because of scoping
        const tokenExpirationTime = expirationDate || new Date(new Date().getTime() + 1000*60*60);
        setTokenExpirationDate(tokenExpirationTime);
        // Store the token in the browser's local storage, so that the user remains logged in even after the page is refreshed or the browser is closed.
        //toISOString() converts the date to a string in the ISO format, which is a standard format for dates.
        localStorage.setItem('userData', JSON.stringify({userId: uid, token, expiration: tokenExpirationTime.toISOString()}));
        
      }, []);
    
      const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
      }, []);
    
      useEffect(() => {
        if(token && tokenExpirationDate) {
          const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
    
          logoutTimer = setTimeout(logout, remainingTime);
        }else {
          clearTimeout(logoutTimer);
        }
    
      }, [token, logout, tokenExpirationDate]);
    
      useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        
        //we validate the token by checking if it exists and if the expiration date is in the future.
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()) 
          login(storedData.userId, storedData.token, storedData.expiration, new Date(storedData.expiration));
    
      }, [login]);

      return {token, login, logout, userId};

};