const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
];
  
describe('New Todo', () => {
    beforeEach(() => {
        cy.visit('https://demo.playwright.dev/todomvc');
      });

    it('should allow me to add todo items', () => {
      // create a new todo locator
      const newTodo = cy.get('[placeholder="What needs to be done?"]');
  
      // Create 1st todo.
      newTodo.type(TODO_ITEMS[0] + '{enter}');
  
      // Make sure the list only has one todo item.
      cy.get('[data-testid="todo-title"]').should('have.text', TODO_ITEMS[0]);
  
      // Create 2nd todo.
      newTodo.type(TODO_ITEMS[1] + '{enter}');
  
      // Make sure the list now has two todo items.
      cy.get('[data-testid="todo-title"]').should('have.text', `${TODO_ITEMS[0]}${TODO_ITEMS[1]}`);
  
      cy.wrap(2).as('numberOfTodos');
      checkNumberOfTodosInLocalStorage(2);
    });
  
    it('should clear text input field when an item is added', () => {
      // create a new todo locator
      const newTodo = cy.get('[placeholder="What needs to be done?"]');
  
      // Create one todo item.
      newTodo.type(TODO_ITEMS[0] + '{enter}');
  
      // Check that input is empty.
      newTodo.should('be.empty');
    //   cy.wrap(1).as('numberOfTodos');
      checkNumberOfTodosInLocalStorage(1);
    });
  
    it('should append new items to the bottom of the list', () => {
      // Create 3 items.
      createDefaultTodos();
  
      // create a todo count locator
      const todoCount = cy.get('[data-testid="todo-count"]');
  
      // Check test using different methods.
      cy.contains('3 items left').should('be.visible');
      todoCount.should('have.text', '3 items left');
      todoCount.should('contain', '3');
    //   todoCount.should('match', /3/);
  
      // Check all items in one call.
      cy.get('[data-testid="todo-title"]').should('have.text', `${TODO_ITEMS[0]}${TODO_ITEMS[1]}${TODO_ITEMS[2]}`);
  
    //   cy.wrap(3).as('numberOfTodos');
      checkNumberOfTodosInLocalStorage(3);
    });
});
  
  
describe('Mark all as completed', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc');
      createDefaultTodos();
      checkNumberOfTodosInLocalStorage(3);
    });
  
    afterEach(() => {
      checkNumberOfTodosInLocalStorage(3);
    });
  
    it('should allow me to mark all items as completed', () => {
      // Complete all todos.
      cy.get('label[for="toggle-all"]').click();
  
      // Ensure all todos have 'completed' class.
      cy.get('.todo-list li').should('have.class', 'completed');
      checkNumberOfCompletedTodosInLocalStorage(3);
    });
  
    it('should allow me to clear the complete state of all items', () => {
      const toggleAll = cy.get('label[for="toggle-all"]');
  
      // Check and then immediately uncheck.
      toggleAll.click();
      toggleAll.click();
  
      // Should be no completed classes.
      cy.get('.todo-list li').should('not.have.class', 'completed');
    });
  
    it('complete all checkbox should update state when items are completed / cleared', () => {
      const toggleAll = cy.get('label[for="toggle-all"]');
      toggleAll.click();
      cy.get('.todo-list li:first-child').find('input[type="checkbox"]').uncheck();
      toggleAll.should('not.be.checked');
      cy.get('.todo-list li:first-child').find('input[type="checkbox"]').check();
      toggleAll.should('be.checked');
      checkNumberOfCompletedTodosInLocalStorage(3);
    });
});
  

describe('Item', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc')
    })
  
  
    it('should allow me to mark items as complete', () => {
      cy.get('[placeholder="What needs to be done?"]')
        .type(`${TODO_ITEMS[0]}{enter}`)
        .type(`${TODO_ITEMS[1]}{enter}`)
  
      cy.get('[data-testid="todo-item"]').eq(0)
        .find('[type="checkbox"]')
        .check()
      cy.get('[data-testid="todo-item"]').eq(0)
        .should('have.class', 'completed')
  
      cy.get('[data-testid="todo-item"]').eq(1)
        .should('not.have.class', 'completed')
        .find('[type="checkbox"]')
        .check()
  
      cy.get('[data-testid="todo-item"]').eq(0)
        .should('have.class', 'completed')
      cy.get('[data-testid="todo-item"]').eq(1)
        .should('have.class', 'completed')
    })
  
    it('should allow me to un-mark items as complete', () => {
      cy.get('[placeholder="What needs to be done?"]')
        .type(`${TODO_ITEMS[0]}{enter}`)
        .type(`${TODO_ITEMS[1]}{enter}`)
  
      cy.get('[data-testid="todo-item"]').eq(0)
        .find('[type="checkbox"]')
        .check()
        .should('be.checked')
      cy.get('[data-testid="todo-item"]').eq(0)
        .should('have.class', 'completed')
      cy.get('[data-testid="todo-item"]').eq(1)
        .should('not.have.class', 'completed')
  
      cy.get('[data-testid="todo-item"]').eq(0)
        .find('[type="checkbox"]')
        .uncheck()
        .should('not.be.checked')
      cy.get('[data-testid="todo-item"]').eq(0)
        .should('not.have.class', 'completed')
      cy.get('[data-testid="todo-item"]').eq(1)
        .should('not.have.class', 'completed')
    })
  
    it('should allow me to edit an item', () => {
        createDefaultTodos();
    
        cy.get('[data-testid="todo-item"]').eq(1)
          .dblclick()
        cy.get('[value="feed the cat"]')
          .dblclick()
          .clear()
          .type('buy some sausages')
          .type('{enter}')
    
        cy.get('[data-testid="todo-item"]')
          .should('have.length', 3)

        cy.get('[data-testid="todo-title"]').should('have.text', `${TODO_ITEMS[0]}buy some sausages${TODO_ITEMS[2]}`);
        
        checkTodosInLocalStorage('buy some sausages')
      })
});

describe('Editing', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc');
      createDefaultTodos();
      checkNumberOfTodosInLocalStorage(3);
    });
  
    it('should hide other controls when editing', () => {
        cy.get('[data-testid="todo-item"]').eq(1)
            .dblclick()
            .should('have.class', 'editing')
            .get('[type="checkbox"]')
            .should('not.be.visible')

        cy.get('[data-testid="todo-item"]').eq(1)
            .get('label')
            .contains(TODO_ITEMS[1])
            .should('not.be.visible')
    });
  
    it('should save edits on blur', () => {
        cy.get('[data-testid="todo-item"]').eq(1)
          .dblclick()
        cy.get('[value="feed the cat"]')
          .dblclick()
          .clear()  
          .type('buy some sausages')
          .blur()
      
        cy.get('[data-testid="todo-item"]').should('have.length', 3)
          .eq(1).should('have.text', 'buy some sausages')
        
        checkTodosInLocalStorage('buy some sausages')
      });
      
  
    it('should trim entered text', () => {
      cy.get('[data-testid="todo-item"]').eq(1)
        .dblclick()
    cy.get('[value="feed the cat"]')
        .dblclick()
        .clear()
        .type('    buy some sausages    ')
        .type('{enter}');
      cy.get('.todo-list li')
        .eq(1)
        .should('contain', 'buy some sausages');
      checkTodosInLocalStorage('buy some sausages');
    });
  
    it('should remove the item if an empty text string was entered', () => {
        cy.get('[data-testid="todo-item"]').eq(1).dblclick();
        cy.get('[value="feed the cat"]')
        .dblclick()
        .clear()
        .type('{enter}');
      cy.get('.todo-list li').should('have.length', 2);
      checkTodosInLocalStorage(TODO_ITEMS[0], TODO_ITEMS[2]);
    });
  
    it('should cancel edits on escape', () => {
        cy.get('[data-testid="todo-item"]').eq(1).dblclick();
        cy.get('[value="feed the cat"]')
        .dblclick()
        .clear()
        .type('buy some sausages')
        .type('{esc}');
      cy.get('.todo-list li').should('have.length', 3);
      checkTodosInLocalStorage(TODO_ITEMS[0], TODO_ITEMS[1], TODO_ITEMS[2]);
    });
});

describe('Counter', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc');
    });
  
    it('should display the current number of todo items', () => {
      cy.get('[placeholder="What needs to be done?"]')
        .type(TODO_ITEMS[0] + '{enter}');
      cy.get('.todo-count').should('contain', '1');
  
      cy.get('[placeholder="What needs to be done?"]')
        .type(TODO_ITEMS[1] + '{enter}');
      cy.get('.todo-count').should('contain', '2');
  
      checkNumberOfTodosInLocalStorage(2);
    });
});

describe('Clear completed button', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc');
      createDefaultTodos();
    });
  
    it('should display the correct text', () => {
      cy.get('.todo-list li .toggle').first().check();
      cy.contains('Clear completed').should('be.visible');
    });
  
    it('should remove completed items when clicked', () => {
      cy.get('[data-testid="todo-item"]')
        .eq(1).find('input[type="checkbox"]').check();
      
      cy.contains('Clear completed').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 2)
        .should('contain', TODO_ITEMS[0])
        .should('contain', TODO_ITEMS[2]);
    });
  
    it('should be hidden when there are no items that are completed', () => {
      cy.get('.todo-list li .toggle').first().check();
      cy.get('.clear-completed').click();
      cy.get('.clear-completed').should('not.exist');
    });
});
  
describe('Persistence', () => {
    beforeEach(() => {
      cy.visit('https://demo.playwright.dev/todomvc');
    //   createDefaultTodos();
    });
  
    it('should persist its data', () => {
        // create a new todo locator
        const newTodo = cy.get('[placeholder="What needs to be done?"]');
    
        TODO_ITEMS.slice(0, 2).forEach(async (item) => {
          await newTodo.type(`${item}{enter}`);
        });
    
        const todoItems = cy.get('[data-testid="todo-item"]');
        const firstTodoCheck = todoItems.eq(0).find('[type="checkbox"]');
        firstTodoCheck.check();
        cy.get('[data-testid="todo-item"]').should('have.text', `${TODO_ITEMS[0]}${TODO_ITEMS[1]}`);
        cy.get('[data-testid="todo-item"]').eq(0).find('[type="checkbox"]').should('be.checked');
        cy.get('[data-testid="todo-item"]').should('have.class', 'completed', '');
        
        // Ensure there is 1 completed item.
        checkNumberOfCompletedTodosInLocalStorage(1);
        
        // Now reload.
        cy.reload();
        cy.get('[data-testid="todo-item"]').should('have.text', `${TODO_ITEMS[0]}${TODO_ITEMS[1]}`);
        cy.get('[data-testid="todo-item"]').eq(0).find('[type="checkbox"]').should('be.checked');
        cy.get('[data-testid="todo-item"]').should('have.class', 'completed', '');
      });
     
});

describe('Routing', () => {
    beforeEach(() => {
        cy.visit('https://demo.playwright.dev/todomvc');
      createDefaultTodos();
      checkTodosInLocalStorage(TODO_ITEMS[0]);
    });
  
    it('should allow me to display active items', () => {
      cy.get('[data-testid="todo-item"]')
        .eq(1)
        .find('[type="checkbox"]')
        .check();
      
      checkNumberOfCompletedTodosInLocalStorage(1);
  
      cy.contains('Active').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 2)
        .should('contain', TODO_ITEMS[0])
        .should('contain', TODO_ITEMS[2]);
    });
  
    it('should respect the back button', () => {
      cy.get('[data-testid="todo-item"]')
        .eq(1)
        .find('[type="checkbox"]')
        .check();
      
      checkNumberOfCompletedTodosInLocalStorage(1);
  
      cy.contains('All').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 3);
  
      cy.contains('Active').click();
  
      cy.contains('Completed').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 1);
  
      cy.go('back');
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 2);
  
      cy.go('back');
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 3);
    });
  
    it('should allow me to display completed items', () => {
      cy.get('[data-testid="todo-item"]')
        .eq(1)
        .find('[type="checkbox"]')
        .check();
      
      checkNumberOfCompletedTodosInLocalStorage(1);
  
      cy.contains('Completed').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 1);
    });
  
    it('should allow me to display all items', () => {
      cy.get('[data-testid="todo-item"]')
        .eq(1)
        .find('[type="checkbox"]')
        .check();
      
      checkNumberOfCompletedTodosInLocalStorage(1);
  
      cy.contains('Active').click();
      cy.contains('Completed').click();
      cy.contains('All').click();
      cy.get('[data-testid="todo-item"]')
        .should('have.length', 3);
    });
  
    it('should highlight the currently applied filter', () => {
      cy.contains('All').should('have.class', 'selected');
  
      const activeLink = cy.contains('Active');
      const completedLink = cy.contains('Completed');
      activeLink.click();
  
      activeLink.should('have.class', 'selected');
      completedLink.click();
  
      completedLink.should('have.class', 'selected');
    });
  });
  

  
const createDefaultTodos = () => {
    const newTodo = cy.get('.new-todo');

    for (const item of TODO_ITEMS) {
    newTodo.type(`${item}{enter}`);
    }
};

const checkNumberOfTodosInLocalStorage = (expected) => {
    return cy.window().then((win) => {
    return cy.wrap(
        win.localStorage.getItem('react-todos')
    ).should((value) => {
        const todos = JSON.parse(value);
        expect(todos.length).to.equal(expected);
    });
    });
};

const checkNumberOfCompletedTodosInLocalStorage = (expected) => {
    return cy.window().then((win) => {
    return cy.wrap(
        win.localStorage.getItem('react-todos')
    ).should((value) => {
        const todos = JSON.parse(value);
        const completedTodos = todos.filter((todo) => todo.completed);
        expect(completedTodos.length).to.equal(expected);
    });
    });
};

const checkTodosInLocalStorage = (title) => {
    return cy.window().then((win) => {
    return cy.wrap(
        win.localStorage.getItem('react-todos')
    ).should((value) => {
        const todos = JSON.parse(value);
        const titles = todos.map((todo) => todo.title);
        expect(titles).to.include(title);
    });
    });
};

      
    
    