import mysql from 'mysql2/promise';

// Database connection function
export const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

// Execute a database query with automatic connection handling
export const executeQuery = async (query, params = []) => {
  const connection = await connectToDatabase();

  try {
    const [result] = await connection.execute(query, params);
    return result;
  } finally {
    await connection.end();
  }
};

// Execute a stored procedure with automatic connection handling
export const executeStoredProcedure = async (procedure, params = []) => {
  const connection = await connectToDatabase();

  try {
    // Replace any undefined values with null to avoid database errors
    const sanitizedParams = params.map(param => (param === undefined ? null : param));

    // When calling stored procedures with OUT parameters, we need to use a different approach
    if (procedure === 'admin_create_player' || procedure === 'admin_update_player' || procedure === 'admin_delete_player') {
      // For these procedures, we need to get the player ID after insertion/update
      const paramPlaceholders = sanitizedParams.map(() => '?').join(',');
      const query = `CALL ${procedure}(${paramPlaceholders}, @result)`;
      await connection.execute(query, sanitizedParams);

      // Get the last inserted ID
      const [rows] = await connection.execute('SELECT LAST_INSERT_ID() as player_id');
      return [[rows]]; // Format to match the expected output
    } else {
      // Normal case for other stored procedures
      const [result] = await connection.execute(
        `CALL ${procedure}(${sanitizedParams.map(() => '?').join(',')})`,
        sanitizedParams
      );
      return result;
    }
  } finally {
    await connection.end();
  }
};

// Send WebSocket message to notify clients about updates
export const notifyClients = (type = 'player_update') => {
  global.wss?.clients?.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({ type }));
    }
  });
}; 