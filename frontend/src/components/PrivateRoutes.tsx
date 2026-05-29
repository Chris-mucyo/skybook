import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;