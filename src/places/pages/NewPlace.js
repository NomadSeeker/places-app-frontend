import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            });
            history.push('/');
        }catch(err){}
    };

    return  (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
            <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input 
                    id='title'
                    label='Title' 
                    element='input'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title.'
                    onInput={inputHandler}
                />
                <Input 
                    id='description'
                    label='Description' 
                    element='textarea'
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description.'
                    onInput={inputHandler}
                />
                <Input 
                    id='address'
                    label='Address' 
                    element='input'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid address.'
                    onInput={inputHandler}
                />
                <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image."/>
                <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </>
    )
};

export default NewPlace;