const { Sequelize, Model, DataTypes } = require("sequelize");
const {
  testConnection,
  createTables,
  dropTables,
  insertUser,
  getUserById,
  getUserFirstnames,
  serachUsers,
  getCountUser,
  updateUser,
  insertAddress,
} = require("./repository");

beforeEach(async () => {
  console.log("beforeEach");
  await dropTables();
  await createTables();
});

test("testConnection", async () => {
  expect(await testConnection()).toBe(true);
});

test("creteTables", async () => {
  expect(await createTables()).toBe(true);
});

test("dropTables", async () => {
  expect(await dropTables()).toBe(true);
});

test("insertUserAndGetUserById", async () => {
  const userId = await insertUser("sukjun", "sagong", 20, "admin");
  expect(userId).toBeGreaterThan(0);
  const user = await getUserById(userId);
  const addressId = await insertAddress(userId, "home", "seoul");
  const userWithAddress = await getUserById(userId);

  const addresses1 = userWithAddress.addresses;
  expect(addresses1.length).toBe(1);

  expect(user.firstName).toBe("sukjun");
  const addresses2 = await user.getAddresses();
  expect(addresses2.length).toBe(1);
});

test("insertUserIncludeAddress", async () => {
  const userId = await insertUser("sukjun", "sagong", 20, "admin", [{name:"home", address:"seoul"}, {name:"office", address:"busan"}]);
  expect(userId).toBeGreaterThan(0);
  const user = await getUserById(userId);

  const addresses = await user.addresses;
  expect(addresses.length).toBe(2);
});

test("projection", async () => {
  await insertUser("sukjun", "sagong", 20, "admin");
  await insertUser("sukjun2", "sagong2", 20, "normal");

  // names === ["sukjun", "sukjun2"]
  const names = await getUserFirstnames();
  expect(names.length).toBe(2);
  expect(names).toContain("sukjun");
  expect(names).toContain("sukjun2");
});

test("searchUsers", async () => {
  await insertUser("sukjun", "sagong", 18, "admin");
  await insertUser("sukjun2", "sagong2", 25, "normal");
  await insertUser("sukjun3", "sagong3", 20, "normal");

  const where1 = {
    firstName: "sukjun",
  };
  result = await serachUsers(where1);
  expect(result.length).toBe(1);
  expect(result[0].firstName).toBe("sukjun");

  const where2 = {
    firstName: "sukjun2",
  };
  result = await serachUsers(where2);
  expect(result.length).toBe(1);
  expect(result[0].firstName).toBe("sukjun2");

  const where3 = {
    age: {
      [Sequelize.Op.gte]: 20,
    },
  };

  result = await serachUsers(where3);
  expect(result.length).toBe(2);
  expect(result[0].firstName).toBe("sukjun2");
  expect(result[1].firstName).toBe("sukjun3");

  const where4 = {
    age: {
      [Sequelize.Op.gte]: 20,
    },
    type: {
      [Sequelize.Op.eq]: "admin",
    },
  };
  result = await serachUsers(where4);
  expect(result.length).toBe(0);
});

test("countUsers", async () => {
  await insertUser("sukjun", "sagong", 18, "admin");
  await insertUser("sukjun2", "sagong2", 25, "normal");
  await insertUser("sukjun3", "sagong3", 20, "normal");

  const count = await getCountUser();
  expect(count).toBe(3);
});

test("updateUser", async () => {
  const userId = await insertUser("sukjun", "sagong", 18, "admin");
  await insertUser("sukjun2", "sagong2", 25, "normal");
  await insertUser("sukjun3", "sagong3", 20, "normal");

  const user = await getUserById(userId);
  user.age = 33;
  const updateResult = await updateUser(user);
  expect(updateResult[0]).toBe(1);

  const userAfterUpdate = await getUserById(userId);
  expect(userAfterUpdate.age).toBe(33);
});
