import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'components/layout/layout';
import Dashboard from 'pages/dashboard/dashboard'
import Profile from 'pages/profile/Profile';



// Payment Transactions and Promo Code Management are stopped for now.

function PrivateRoutes() {
  // const { currentUser } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path='/'
          element={<Dashboard />}
        />
        <Route path='profile' element={<Profile />} />

        {/* Catch all route */}
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Routes>
  );
}

export { PrivateRoutes };
