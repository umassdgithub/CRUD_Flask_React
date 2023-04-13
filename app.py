from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS, cross_origin


app = Flask(__name__)

# create the database first
@app.route('/createDB')
def index():
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE users
                      (id INTEGER PRIMARY KEY, name TEXT, email TEXT)''')
    conn.commit()
    conn.close()
    return 'Dabase Created'



# Route for creating a new user
@app.route('/api/users', methods=['POST'])
def create_user():
    name = request.json['name']
    email = request.json['email']
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    response = jsonify({'id': new_id, 'name': name, 'email': email}), 201
    return response

# Route for retrieving all users
@app.route('/api/users', methods=['GET'])
def get_users():

    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email FROM users')
    rows = cursor.fetchall()
    conn.close()
    users = [{'id': row[0], 'name': row[1], 'email': row[2]} for row in rows]
    return jsonify(users)

# Route for retrieving a single user by ID
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    print(user_id)
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email FROM users WHERE id=?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        user = {'id': row[0], 'name': row[1], 'email': row[2]}
        response = jsonify(user)
        return response
    else:
        response = jsonify({'error': 'User not found'})
        return response

# Route for updating an existing user by ID
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    name = request.json['name']
    email = request.json['email']
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET name=?, email=? WHERE id=?', (name, email, user_id))
    conn.commit()
    conn.close()
    response = jsonify({'message': 'User updated successfully'})
    return response

# Route for deleting a user by ID
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id=?', (user_id,))
    conn.commit()
    conn.close()
    response = jsonify({'message': 'User deleted successfully'})
    return response

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=5002)