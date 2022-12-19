describe('Add/Delete Team', () => {
  before(() => {
    cy.visit('http://localhost:3000');
  });

  it('Add Team', () => {
    cy.wait(1000);
    cy.get('.ant-tree-list').rightclick();
    cy.contains('Add Team').click();
    // input name + description
    cy.get('#team-info_name').type('Transacation');
    cy.get('#team-info_description').type('Transacation Data');
    cy.contains('OK').click();

    // antd has a hidden one
    // assert, new team has been created
    cy.get('.ant-tree-treenode').should('have.length', 3);
    

    cy.get('.ant-tree-treenode').last().rightclick();
    cy.contains('Add Flow').click();
    cy.get('.toolbar-container').find('.tab').should('exist');
    cy.get('.view-lines').find('div').should('have.length', 10);

    // delete flow 
    cy.get('.ant-tree-switcher').last().click()
    cy.get('.gnomon-tree-node').last().rightclick();
    cy.contains('Delete').click();
    cy.contains('Do you want to delete this flow').parent().next().get('.ant-btn').last().click()

    // delete team
    cy.get('.ant-tree-treenode').last().rightclick();
    cy.contains('Delete').click();
    cy.contains('Do you want to delete this team').parent().next().get('.ant-btn').last().click()

    // assert, new team has been deleted
    cy.get('.ant-tree-treenode').should('have.length', 2);
  });

})