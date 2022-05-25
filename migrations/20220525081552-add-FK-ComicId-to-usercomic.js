'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('User_Comics', 'ComicId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Comics',
        key: 'id'
      },
      onUpdate: "cascade",
      onDelete: "cascade"
    })
  },

  down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn("User_Comics", "ComicId")
  }
};
