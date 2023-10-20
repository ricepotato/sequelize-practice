const { Sequelize, Model, DataTypes } = require("sequelize");

// const sequelize = new Sequelize("sqlite::memory:", {
//   define: {
//     // will create a model named User pointing to a table also named User.
//     freezeTableName: true,
//   },
//});

// save sqlite file to disk
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "normal",
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: true, // By default, Sequelize automatically adds the fields createdAt and updatedAt to every model
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return true;
  } catch (e) {
    console.error("Unable to connect to the database:", e);
    return false;
  }
};

const createTables = async () => {
  await sequelize.sync({ force: true });
  console.log("The table for the User model was just (re)created!");
  return true;
};

const dropTables = async () => {
  await sequelize.drop();
  console.log("All tables dropped!");
  return true;
};

const insertUser = async (
  firstName,
  lastName = null,
  age = null,
  type = "normal"
) => {
  const user = await User.create({ firstName, lastName, age, type });
  console.log(user.firstName, "was saved to the database!");
  return user.id;
};

const getUserByFirstName = async (firstName) => {
  const users = await User.findAll({ where: { firstName } });
  return users;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

module.exports = {
  testConnection,
  createTables,
  dropTables,
  insertUser,
  getUserById,
  getUserByFirstName,
  User,
};
