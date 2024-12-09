const { Client } = require('pg');

// PostgreSQL connection link
const connectionString = 'postgres://user:password@localhost:5436/music_library';

// Create a PostgreSQL client
const client = new Client({
    connectionString: connectionString,
});

(async () => {
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Step 1: Create a demo table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS demo_table (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                age INT
            );
        `;
        await client.query(createTableQuery);
        console.log('Table created successfully.');

        // Step 2: Insert a tuple into the table
        const insertQuery = `
            INSERT INTO demo_table (name, age)
            VALUES ('Abhishek Singh', 25)
            RETURNING *;
        `;
        const insertResult = await client.query(insertQuery);
        console.log('Tuple inserted successfully:', insertResult.rows[0]);

        // Step 3: Retrieve and display the tuple
        const selectQuery = `
            SELECT * FROM demo_table;
        `;
        const selectResult = await client.query(selectQuery);
        console.log('Retrieved tuples:');
        console.table(selectResult.rows);
    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        // Close the database connection
        await client.end();
        console.log('Disconnected from PostgreSQL');
    }
})();
