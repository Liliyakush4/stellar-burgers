import reducer, {
  getIngredients
} from '../src/services/slices/ingredientsSlice';
import type { TIngredient } from '../src/utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Тестовый ингредиент',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 50,
  image: 'https://example.com/sauce.png',
  image_large: 'https://example.com/sauce-large.png',
  image_mobile: 'https://example.com/sauce-mobile.png'
};

describe('ingredientsSlice', () => {
  it('Устанавливает состояние загрузки', () => {
    const state = reducer(
      undefined,
      getIngredients.pending('request', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('Хранит результат успешного запроса', () => {
    const state = reducer(
      undefined,
      getIngredients.fulfilled([ingredient], 'request', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([ingredient]);
  });

  it('Сохраняет состояние ошибки при сбое', () => {
    const state = reducer(
      undefined,
      getIngredients.rejected(new Error('fail'), 'request', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
  });
});
