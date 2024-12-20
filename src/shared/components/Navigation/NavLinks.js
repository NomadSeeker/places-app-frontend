import React, {useContext} from 'react';
import { NavLink, Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';
 
const NavLinks = props => {
    const auth = useContext(AuthContext);

    return (
        <ul className='nav-links'>
            <li>
                <NavLink to='/' exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <Link to={`/${auth.userId}/places`}>My Places</Link>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to='/places/new'>Add Place</NavLink>
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to='/auth'>Authenticate</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to='/auth' onClick={auth.logout}>Logout</NavLink>    
            </li>}
        </ul>
    );
};


export default NavLinks;