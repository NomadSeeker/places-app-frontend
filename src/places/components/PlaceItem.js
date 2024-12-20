import React, {useState, useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/ErrorModal';
import {AuthContext} from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useHistory } from 'react-router-dom';
import './PlaceItem.css';

const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);  
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const history = useHistory();

    const openMapHandler = () => setShowMap(true); 
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => setShowConfirmModal(true);
    const cancelDeleteHandler = () => setShowConfirmModal(false);
    const confirmDeleteHandler = async () => {

        try {
            setShowConfirmModal(false);

            await sendRequest(`https://places-app-api.vercel.app/api/places/${props.id}`, 'DELETE', null, {
                Authorization: 'Bearer' + auth.token
            });
            
            props.onDelete(props.id);

            history.push(`/${auth.userId}/places`);
        }catch(err) {}
        
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.header} 
                contentClass="place-item__modal-content" 
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16}/>
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header='Are you sure?'
                footerClass='place-item__modal-actions'
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this place?</p>
            </Modal>
            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className='place-item__image'>
                        <img src={`https://places-app-api.vercel.app/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creatorId && (<><Button to={`/places/${props.id}`}>EDIT </Button>
                        <Button danger onClick={showDeleteWarningHandler}>DELETE</Button></>)}
                    </div>
                </Card>
            </li>
        </>
        
    );
};

export default PlaceItem;