import React, {useState, useContext} from 'react';

import {useForm} from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from '../../shared/util/validators';
import {AuthContext} from '../../shared/context/auth-context';	
import './Auth.css'

const Authenticate = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if(isLoginMode) {
        
           try {
                const responseData = await sendRequest('https://places-app-api.vercel.app/api/users/login', 'POST', 
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }); 

                auth.login(responseData.userId, responseData.token);
            }catch(err){}
               
        }else {
          try {
            const formData = new FormData();
            formData.append('email', formState.inputs.email.value);
            formData.append('name', formState.inputs.name.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value);
             const responseData = await sendRequest('https://places-app-api.vercel.app/api/users/signup', 
                'POST', 
                formData
            );  
                auth.login(responseData.userId, responseData.token);
            }catch(err) {}
        }
    };

    const switchModeHandler = () => {
        if(!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    return (
        <>
            <Card className='authentication'>
                <ErrorModal error={error} onClear={clearError}/>
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form className="place-form" onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <>
                            <Input 
                                element='input'
                                id='name'
                                type='text'
                                label='Your Name'
                                validators={[VALIDATOR_REQUIRE()] }
                                errorText='Please enter a name.'
                                onInput={inputHandler}
                            />
                            <ImageUpload id='image' onInput={inputHandler} center errorText="Please provide and image"/>
                        </>
                    )}
                    <Input 
                        id='email'
                        label='email' 
                        element='input'
                        type='email'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Please enter a valid email.'
                        onInput={inputHandler}
                    />
                    <Input 
                        id='password'
                        label='password' 
                        element='input'
                        type='password'
                        validators={[VALIDATOR_MINLENGTH(4)]}
                        errorText='Please enter a valid password. At least 4 characters.'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </>
        
    )
};

export default Authenticate;