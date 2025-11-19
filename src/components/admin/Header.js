import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
    const { basicsIsModified, classesIsModified } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const optionsRef = useRef(null);
    const menuIconRef = useRef(null);

    const handleNavigation = (e, destination) => {
        const pathArray = location.pathname.split("/");
        const section = pathArray[pathArray.length - 1];
        let isModified;

        switch (section) {
            case "admin":
                isModified = basicsIsModified;
                break;
            case "classes":
                isModified = classesIsModified;
                break;
            default:
                isModified = false;
        }

        if (isModified) {
            e.preventDefault();
            const confirmLeave = window.confirm('If you leave now, you would lose your unsaved data.');
            if (confirmLeave) {
                navigate(destination);
                setMenuOpen(false);
            }
        } else {
            navigate(destination);
            setMenuOpen(false);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target) &&
                menuIconRef.current &&
                !menuIconRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const currentPage = ()=>{
        const pathArray = location.pathname.split("/");
        const index = pathArray.indexOf("admin");
        if (index === pathArray.length - 1) return "Basics";
        return pathArray[index + 1];
    }

    return (
        <div id='admin-header' className={menuOpen ? "open" : ""}>
            <div className='menu-bar'>
                <h2>{currentPage()}</h2>
                <ion-icon 
                    name="menu-outline" 
                    ref={menuIconRef}
                    onClick={() => setMenuOpen(true)}
                ></ion-icon>
            </div>

            <div className="options" ref={optionsRef}>
                <div className='top'>
                    <h3>Admin Panel</h3>
                    <ion-icon 
                        name="close-outline"
                        onClick={() => setMenuOpen(false)}
                    ></ion-icon>
                </div>

                <NavLink to='/admin' end onClick={(e)=>handleNavigation(e,'/admin')}><ion-icon name="home-outline"></ion-icon><span>Basics</span></NavLink>
                <NavLink to='/admin/classes' onClick={(e)=>handleNavigation(e,'/admin/classes')}><ion-icon name="book-outline"></ion-icon><span>Classes</span></NavLink>
                <NavLink to='/admin/students' onClick={(e)=>handleNavigation(e,'/admin/students')}><ion-icon name="people-outline"></ion-icon><span>Students</span></NavLink>
                <NavLink to='/admin/results' onClick={(e)=>handleNavigation(e,'/admin/results')}><ion-icon name="bar-chart-outline"></ion-icon><span>Results</span></NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default Header;
