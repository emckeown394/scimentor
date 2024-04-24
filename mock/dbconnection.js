const query = jest.fn();
const connect = jest.fn();
const end = jest.fn();
const queryAsync = jest.fn().mockImplementation(() => Promise.resolve([{ name: 'John Doe', email: 'john@example.com', image: 'profile.jpg' }]));
module.exports = {
    queryAsync,
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
};

query.mockImplementation((sql, params, callback) => {
    console.log(`SQL: ${sql}`, `Params: ${params}`);
    if (sql.includes('SELECT')) {
      callback(null, []); // Simulating no results found
    } else if (sql.includes('INSERT')) {
      callback(null, { affectedRows: 1 });
    } else {
      callback(new Error('Unmatched SQL Query'), null); // This will help catch unexpected queries
    }
  });
  

queryAsync.mockImplementation((sql) => {
  return new Promise((resolve, reject) => {
    if (sql.includes("SELECT")) {
      resolve([{ name: 'John Doe', email: 'john@example.com', image: 'profile.jpg' }]);
    } else {
      reject(new Error('Database error'));
    }
  });
});

queryAsync.mockImplementationOnce((sql, params) => {
    if (sql.includes('SELECT')) {
      // Simulate no existing score
      return Promise.resolve([]);
    } else if (sql.includes('INSERT')) {
      // Simulate a successful insertion
      return Promise.resolve({ affectedRows: 1 });
    }
    return Promise.reject(new Error("Query not handled in mock"));
  });


// Mock implementations for connect and end, if needed
connect.mockImplementation((callback) => {
    callback(null);  // Simulate a successful connection
});

end.mockImplementation(() => {
    // Optionally simulate cleanup tasks
});

module.exports = { queryAsync, query, connect, end };