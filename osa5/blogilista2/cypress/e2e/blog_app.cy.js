describe('Blog ', function () {
  beforeEach(function () {
    cy.request('POST', '/api/testing/reset');
    cy.visit('/');
  });

  it('front page can be opened', function () {
    cy.contains('blogs');
  });

  it('login form shown', function () {
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('button').contains('login');
  });

  describe('Login', function () {
    beforeEach(function () {
      cy.request('POST', '/api/users', {
        username: 'cypress',
        password: 'cypress',
        name: 'Cypress',
      });
      cy.visit('/');
    });

    it('works with correct user:pass', function () {
      cy.get('input[name="username"]').type('cypress');
      cy.get('input[name="password"]').type('cypress');
      cy.get('button').contains('login').click();

      cy.contains('Cypress logged in');
      cy.get('.feedback').contains('login succeeded');
    });

    it('fails with incorrect username', function () {
      cy.get('input[name="username"]').type('asdf');
      cy.get('input[name="password"]').type('cypress');
      cy.get('button').contains('login').click();

      cy.get('.feedback.error').contains('login failed: user not found');
    });

    it('fails with incorrect password', function () {
      cy.get('input[name="username"]').type('cypress');
      cy.get('input[name="password"]').type('asdf');
      cy.get('button').contains('login').click();

      cy.get('.feedback.error').contains('login failed: wrong password');
    });

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({
          username: 'cypress',
          password: 'cypress',
        });
      });

      it('user can create blog', function () {
        cy.contains('create new blog').click();
        cy.get('input').then(([title, author, url]) => {
          cy.wrap(title).type('cypress title');
          cy.wrap(author).type('cypress author');
          cy.wrap(url).type('cypress url');
        });
        cy.get('button').contains('create').click();

        cy.get('.feedback').contains('added "cypress title"');

        cy.get('li').contains('cypress title');
      });

      it('owner of blog can delete it', function () {
        cy.login({ username: 'root', password: 'toor' });
        cy.get('button.toggle').first().click();
        cy.get('button.remove').click();

        cy.get('.feedback').contains(
          'removed "Canonical string reduction" by Edsger W. Dijkstra'
        );

        cy.get('li').should('have.length', 5);
      });

      it('only the owner of blog can see its remove button', function () {
        cy.get('button.toggle').click({ multiple: true });
        cy.get('button.remove').should('have.length', 0);

        cy.login({ username: 'root', password: 'toor' });
        cy.get('button.toggle').click({ multiple: true });
        cy.get('button.remove').should('have.length', 6);
      });
    });
  });

  it('blog can be liked', function () {
    cy.get('button.toggle').first().click();
    cy.get('button').contains('like').as('likeButton');
    cy.get('@likeButton').click();

    cy.get('.feedback').contains('Canonical string reduction has 13 likes now');

    cy.get('@likeButton').parent().contains('likes 13');
  });

  it('blog can be liked', function () {
    cy.get('button.toggle').click({ multiple: true });
    cy.get('li li')
      .then((texts) =>
        Array.from(texts)
          .map(({ innerHTML: txt }) => {
            const extractedLikes = txt.match(/(?<=likes )\d+/);
            return extractedLikes ? parseInt(extractedLikes[0]) : null;
          })
          .filter((x) => x !== null)
      )
      .then((arr) => {
        const sorted = [...arr];
        sorted.sort((a, b) => b - a);
        console.log(arr);
        console.log(sorted);
        expect(sorted).to.deep.equal(arr);
      });
  });
});
