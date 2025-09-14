import { Outlet } from 'react-router-dom';

import Container from 'components/core-ui/container/container';
import { HeaderPropsProvider } from 'components/core/use-header-props';

import ScrollToTop from 'helpers/scroll-to-top';

import WithSuspense from 'routes/with-suspense';

import Header from './components/header';
// import SidebarRoutes from './components/sidebar-routes';

function Layout() {
  return (
    <Container>
      <HeaderPropsProvider>
        <ScrollToTop />
        <WithSuspense>
          {/* <SidebarRoutes /> */}
          <Header />
          <main className='relative min-h-screen p-6 z-10 pt-32'>
            <Outlet />
          </main>
        </WithSuspense>
      </HeaderPropsProvider>
    </Container>
  );
}

export default Layout;
