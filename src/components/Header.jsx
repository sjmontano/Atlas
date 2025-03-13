import PropTypes from 'prop-types';
import Logo from '../../assets/logo-modal.png';


const Header = () => {
    return (
        <header className='header'>
            <a href="#">
                <img src={Logo} className='logo' />
            </a>
        </header>
    )
}

Header.propTypes = {
    toggleSidebar: PropTypes.func
}

export default Header