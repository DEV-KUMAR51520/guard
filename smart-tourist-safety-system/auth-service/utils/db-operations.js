const db = require('./db');

const dbOperations = {
  // Create a new tourist user in the database
  createUser: async (user) => {
    const { name, phone, email, password_hash, emergency_contact, entry_point, trip_duration, profile_picture } = user;
    const query = `
      INSERT INTO tourists (
        name, phone, email, password_hash, emergency_contact, entry_point, trip_duration, profile_picture
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, phone, email
    `;
    const values = [name, phone, email, password_hash, emergency_contact, entry_point, trip_duration, profile_picture];
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Find a user by their phone number for login
  findUserByPhone: async (phone) => {
    const query = 'SELECT * FROM tourists WHERE phone = $1';
    try {
      const result = await db.query(query, [phone]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by phone:', error);
      throw error;
    }
  },
  
  // Find a user by their ID
  findUserById: async (id) => {
    const query = 'SELECT id, name, phone, email, status, blockchain_id FROM tourists WHERE id = $1';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  },
};

module.exports = dbOperations;