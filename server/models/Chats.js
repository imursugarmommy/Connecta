module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define("Chats", {
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Chats;
};
