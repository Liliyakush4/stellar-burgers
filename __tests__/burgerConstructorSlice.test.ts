import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../src/services/slices/burgerConstructorSlice';
import type { TConstructorIngredient, TIngredient } from '../src/utils/types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 15,
  calories: 200,
  price: 100,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png'
};

const filling: TIngredient = {
  _id: 'main-id',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 80,
  image: 'https://example.com/main.png',
  image_large: 'https://example.com/main-large.png',
  image_mobile: 'https://example.com/main-mobile.png'
};

describe('burgerConstructorSlice', () => {
  it('Добавляет булку и начинку в конструктор бургера', () => {
    const bunState = reducer(undefined, addIngredient(bun));

    expect(bunState.bun).toEqual(expect.objectContaining(bun));
    expect(bunState.bun?.id).toEqual(expect.any(String));
    expect(bunState.ingredients).toHaveLength(0);

    const fillingState = reducer(bunState, addIngredient(filling));

    expect(fillingState.ingredients).toHaveLength(1);
    expect(fillingState.ingredients[0]).toEqual(
      expect.objectContaining(filling)
    );
    expect(fillingState.ingredients[0].id).toEqual(expect.any(String));
  });

  it('Удаляет начинку по id', () => {
    const first: TConstructorIngredient = { ...filling, id: 'first-id' };
    const second: TConstructorIngredient = { ...filling, id: 'second-id' };

    const state = reducer(
      {
        bun: null,
        ingredients: [first, second]
      },
      removeIngredient('first-id')
    );

    expect(state.ingredients).toEqual([second]);
  });

  it('Перемещает ингредиент по индексу', () => {
    const first: TConstructorIngredient = { ...filling, id: 'first-id' };
    const second: TConstructorIngredient = { ...filling, id: 'second-id' };
    const third: TConstructorIngredient = { ...filling, id: 'third-id' };

    const state = reducer(
      {
        bun: null,
        ingredients: [first, second, third]
      },
      moveIngredient({ dragIndex: 0, hoverIndex: 2 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second-id',
      'third-id',
      'first-id'
    ]);
  });
});
