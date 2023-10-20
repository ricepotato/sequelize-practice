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

const init = async () => {
  //await User.sync({ force: true });
  await testConnection();
  await sequelize.sync({ force: true });
  console.log("The table for the User model was just (re)created!");
  const id = await bulildAndSaveJane();
  console.log("Jane's id is: ", id);
  await saveSomeFields();
  await destroyJane();
  await createAda();

  await createUser("sukjun", "sagong", 20, "admin");
  const users = await getUsers();
  console.log(users);
  await getCountUser();
  const user1 = await getUserByFirstName("sukjun");
  console.log(user1);
};

const drop = async () => {
  //await User.drop();
  await sequelize.drop();
  console.log("All tables dropped!");
};

const bulildAndSaveJane = async () => {
  const jane = User.build({ firstName: "Jane" });
  // the code above does not communicate with the database at all (note that it is not even asynchronous)!
  // This is because the build method only creates an object that represents data that can be mapped to a database.
  await jane.save();
  console.log(jane.toJSON());
  console.log("Jane was saved to the database!");
  return jane.id;
};

const createAda = async () => {
  const ada = await User.create({ firstName: "Ada", lastName: "Lovelace" });
  console.log(ada.firstName, "was saved to the database!");
};

const destroyJane = async () => {
  const jane = await User.findOne({ where: { firstName: "Jane" } });
  await jane.destroy();
  console.log("Jane was destroyed!");
};

const createUser = async (
  firstName,
  lastName = null,
  age = null,
  type = "normal"
) => {
  const user = await User.create({ firstName, lastName, age, type });
  console.log(user.firstName, "was saved to the database!");
  return user.id;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  console.log(user.toJSON());
};

const getUserByFirstName = async (firstName) => {
  const user = await User.findOne({ where: { firstName } });
  //console.log(user.toJSON());
  return user;
};

const getUsers = async () => {
  // select firstName, lastName from users;
  const users = await User.findAll({
    attributes: ["id", "firstName", "lastName", "age"],
  });
  return users;
};

const getCountUser = async () => {
  const count = await User.count();
  console.log(count);
};

init();
