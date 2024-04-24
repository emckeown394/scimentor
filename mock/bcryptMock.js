const hashSync = jest.fn((password, saltRounds) => `hashed_${password}`);
module.exports = { hashSync };