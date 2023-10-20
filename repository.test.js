const {
  testConnection,
  createTables,
  dropTables,
  insertUser,
  getUserById,
} = require("./repository");

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
  await createTables();
  const userId = await insertUser("sukjun", "sagong", 20, "admin");
  expect(userId).toBeGreaterThan(0);
  const user = await getUserById(userId);
  expect(user.firstName).toBe("sukjun");
});
