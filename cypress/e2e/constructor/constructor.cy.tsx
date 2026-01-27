/// <reference types="cypress" />

const addIngredientByName = (name: string) => {
  cy.contains('li[data-cy^="ingredient-"]', name).contains('Добавить').click();
};

const openIngredientByName = (name: string) => {
  cy.contains('li[data-cy^="ingredient-"]', name).find('a').click();
};

const expectNoModals = () => {
  cy.get('#modals').children().should('have.length', 0);
};

describe('Burger constructor', () => {
  beforeEach(() => {
    cy.intercept('**/api/**', (req) => {
      throw new Error(`Unmocked API request: ${req.method} ${req.url}`);
    });

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавляет ингредиенты в конструктор', () => {
    addIngredientByName('Краторная булка N-200i');
    addIngredientByName('Соус Spicy-X');

    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
    cy.contains('[data-cy="constructor-fillings"]', 'Соус Spicy-X').should(
      'exist'
    );
  });

  it('Открывает и закрывает "Детали ингредиента"', () => {
    expectNoModals();

    openIngredientByName('Краторная булка N-200i');
    cy.get('#modals').contains('Краторная булка N-200i').should('exist');
    cy.get('#modals').contains('Детали ингредиента').should('exist');
    cy.get('#modals').find('[data-cy="modal-close"]').click({ force: true });
    expectNoModals();

    openIngredientByName('Соус Spicy-X');
    cy.get('#modals').contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Соус Spicy-X').should('exist');
    cy.get('#modals').find('[data-cy="modal-overlay"]').click({ force: true });
    expectNoModals();
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('**/api/**', (req) => {
      throw new Error(`Unmocked API request: ${req.method} ${req.url}`);
    });

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/', {
      onBeforeLoad(win) {
        win.document.cookie = 'accessToken=test-access';
        win.localStorage.setItem('refreshToken', 'test-refresh');
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Отправляет заказ, показывает правильный номер заказа, закрывает модальное окно, очищает конструктор', () => {
    addIngredientByName('Краторная булка N-200i');
    addIngredientByName('Биокотлета из марсианской Магнолии');

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains('[data-cy="order-number"]', '12345', { timeout: 10000 }).should(
      'exist'
    );

    cy.get('body').type('{esc}');
    cy.get('body').type('{esc}');
    expectNoModals();

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
