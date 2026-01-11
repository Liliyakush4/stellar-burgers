import { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';

import { AppHeader } from '@components';
import {
  ConstructorPage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  Feed,
  OrderDetails,
  NotFound404
} from '@pages';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import styles from './app.module.css';
import '../../index.css';

type BackgroundState = {
  background?: Location;
};

const App: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as BackgroundState | null;
  const background = state?.background;

  const { isLoading, hasError } = useSelector((s) => s.ingredients);
  const { isAuthChecked } = useSelector((s) => s.user);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = () => navigate(-1);

  const isAppLoading = isLoading;

  const page = (node: React.ReactNode) => (
    <div className={styles.pageCenter}>{node}</div>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      {hasError ? (
        <main className={styles.content}>
          <div>Ошибка загрузки данных</div>
        </main>
      ) : isAppLoading ? (
        <main className={styles.content}>
          <Preloader />
        </main>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route path='/feed/:number' element={page(<OrderInfo />)} />
            <Route
              path='/order/:number'
              element={
                <ProtectedRoute>
                  <div className={styles.content}>
                    <OrderDetails />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path='/ingredients/:id'
              element={page(<IngredientDetails />)}
            />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <div className={styles.pageCenter}>
                    <OrderInfo />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal title='' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/order/:number'
                element={
                  <Modal title='' onClose={handleModalClose}>
                    <OrderDetails />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
