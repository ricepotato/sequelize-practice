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
class Address extends Model {}

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

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "address",
  }
);

//User.hasMany(Address);
//Address.belongsTo(User);
Address.User = Address.belongsTo(User);
User.Addresses = User.hasMany(Address);

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
  type = "normal",
  addresses = []
) => {
  const user = await User.create({
    firstName,
    lastName,
    age,
    type,
    addresses
  }, {
    include: [User.Addresses]
  });
  console.log(user.firstName, "was saved to the database!");
  return user.id;
};

const insertAddress = async (userId, name, address) => {
  const user = await User.findByPk(userId);
  const result = await user.createAddress({ name, address });
  return result.id;
};

const getUserByFirstName = async (firstName) => {
  const users = await User.findAll({ where: { firstName } });
  return users;
};

const getUserById = async (id) => {
  return await User.findByPk(id, { include: Address });
};

const getUserFirstnames = async () => {
  const result = await User.findAll({ attributes: ["firstName"] });
  const names = result.map((user) => user.dataValues.firstName);
  return names;
};

const serachUsers = async (where) => {
  const result = await User.findAll({
    where,
  });
  return result;
};

const getCountUser = async (where = {}) => {
  return await User.count({ where });
};

const updateUser = async (user) => {
  const result = await User.update(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      type: user.type,
    },
    { where: { id: user.id } }
  );
  return result;
};

module.exports = {
  testConnection,
  createTables,
  dropTables,
  insertUser,
  getUserById,
  getUserByFirstName,
  getUserFirstnames,
  serachUsers,
  getCountUser,
  updateUser,
  insertAddress,
  User,
};
