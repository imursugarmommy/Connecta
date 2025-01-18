module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Comments;
};
