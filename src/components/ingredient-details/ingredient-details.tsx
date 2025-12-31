import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((ing) => ing._id === id); // поиск в массиве ингридиентов ингредиент с id совпадающим с id из URL

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  // отображение найденого ингредиента, передает данные в UI-компонент
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
