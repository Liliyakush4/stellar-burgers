import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const isPage = !location.state?.background;

  const { id } = useParams<{ id: string }>();
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  const ingredientData = ingredients.find((ing) => ing._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <div className={styles.page}>
      {isPage && (
        <h1 className={`text text_type_main-large ${styles.title}`}>
          Детали ингредиента
        </h1>
      )}

      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
