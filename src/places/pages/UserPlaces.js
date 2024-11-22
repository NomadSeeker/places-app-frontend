import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';


const UserPlaces = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId = useParams().userId;
    const [userPlaces, setUserPlaces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await sendRequest(`https://places-app-api.vercel.app/api/places/user/${userId}`);

                setUserPlaces(data.places);
                
            }catch(err) {}
        };
        fetchData();
    },[sendRequest, userId]);

    const deletePlaceHandler = (placeId) => {
        setUserPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId));
    };

   return (
        <>  
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && (<div className="center">
                    <LoadingSpinner />
                </div>)}
           {!isLoading && userPlaces && <PlaceList items={userPlaces} onDeletePlace={deletePlaceHandler}/>}
        </>
   );

};

export default UserPlaces;