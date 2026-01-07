import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.main}>
    <aside className={styles.menu}>
      <ProfileMenu />
    </aside>

    <section className={styles.orders}>
      <OrdersList orders={orders} />
    </section>
  </main>
);
