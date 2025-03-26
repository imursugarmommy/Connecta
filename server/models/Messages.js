module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define("Messages", {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Messages;
};
