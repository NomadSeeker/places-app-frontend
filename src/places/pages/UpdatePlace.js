import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {useForm} from '../../shared/hooks/form-hook';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


const UpdatePlace = () => {
    const placeId = useParams().placeId;
    const [loadedPlace, setLoadedPlace] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: true
        },
        description: {
            value: '',
            isValid: true
        }
    }, true);

    const placeUpdateSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await sendRequest(`https://places-app-frontend-ten.vercel.app/api/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }), 
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            });
            history.push(`/${auth.userId}/places`);
        }catch(err) {}
        
    };

    useEffect(() => {

        const fetchPlace = async () => {
            try {
                const data = await sendRequest(`https://places-app-frontend-ten.vercel.app/api/places/${placeId}`);     
                let placeFound = data.place;         
                setLoadedPlace(placeFound);

                setFormData({
                    title: {
                        value: placeFound.title,
                        isValid: true
                    },
                    description: {
                        value: placeFound.description,
                        isValid: true
                    }
                    },
                    true
                );

            }catch(err){}
        }
        fetchPlace();
        
        
    }, [sendRequest, setFormData, placeId]);

    if(isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if(!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    if(isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    return (

        <>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlace &&
            (<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input 
                    id="title" 
                    element="input"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    value={loadedPlace.title}
                    valid={true}
                />
                <Input 
                    id="description" 
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description."
                    onInput={inputHandler}
                    value={loadedPlace.description}
                    valid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
                <Button to={`/${auth.userId}/places`}>CANCEL</Button>
            </form>)}
        </>
        
    )
};


export default UpdatePlace;
