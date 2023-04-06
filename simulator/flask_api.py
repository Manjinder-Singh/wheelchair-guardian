# -*- coding: utf-8 -*-s
"""
    import logging: This imports the logging module that provides flexible logging capabilities for the application.
    import json: This imports the json module that provides functionality to encode and decode JSON data.
    from flask import Flask, jsonify, request: This imports the Flask framework that helps build web applications, the jsonify method to convert Python objects into JSON format, and the request object to handle incoming requests.
    import os: This imports the os module that provides a way to interact with the underlying operating system.
    from flask_socketio import SocketIO, send: This imports the Flask-SocketIO extension that enables real-time communication between the client and server.
    from flask import render_template: This imports the render_template method that returns the rendered template string.
"""

# Importing important packages
import logging
import json
from flask import Flask, jsonify,request
import os
from flask_socketio import SocketIO, send
from flask import render_template

app = Flask(__name__, template_folder='templates', static_folder='staticFiles')
"""
created a new Flask web application instance with the __name__ argument and sets the template_folder 
and static_folder arguments to specify the directories for HTML templates and static files (e.g., CSS and JavaScript).
"""

app.config['SECRET_KEY'] = 'secret!'
"""
set a secret key for the Flask application, which is used for securely signing cookies and other data.
"""

# Set initial status to locked
status = 'LOCKED'

socketio = SocketIO(app)
"""
created a new SocketIO instance with the Flask application instance
"""
# # define a function to handle incoming messages
# @sio.on('message')
# def handle_message(sid, data):
#     print('received message:', data)
#     sio.emit('message', data)

# # define a function to handle new connections
# @sio.on('connect')
# def handle_connect(sid, environ):
#     print('connected')
#     sio.emit('message', 'A new client has connected.')

# # define a function to handle disconnections
# @sio.on('disconnect')
# def handle_disconnect(sid):
#     print('disconnected')

"""
defined a route for the home page of the web application using the @app.route() decorator
"""
@app.route('/')
def home():
    """
    defined a function to render the home page template using the render_template() function
    """
    global status
    return render_template("home.html", status=status)


"""
defined a function to handle incoming messages from clients using the @socketio.on() decorator.
"""
@socketio.on('message')
def handle_message(data):
    """
    defined a function to handle incoming messages from clients using the @socketio.on() decorator
    """
    # Handle incoming messages from clients
    print('received message:', data)

    
"""
defined a route for sending status values to clients using the @app.route() decorator with the methods argument set to "POST".
"""
@app.route('/send_status_value', methods=['POST'])
def function1():
    """
    defined this function to send status values to clients using the @app.route() decorator
    """
    global status
    val = request.json.get('uv')
    socketio.emit('uvInput', {'uv': val})
    return jsonify({'uv': val})


"""
defined a route for getting the current status value using the @app.route() decorator with the methods argument set to "GET"
"""
@app.route('/status_value', methods=['GET'])
def function3():
    """
    defined this function to get the current status value using the @app.route() decorator
    """
    global status
    return jsonify({'lock_status': status})
        
        
"""
defined a route for receiving responses from clients using the @app.route() decorator with the methods argument set to "POST"
"""
@app.route('/receive_resp', methods=['POST'])
def function2():
    """
    defined this function to receive responses from clients using the @app.route() decorator
    """
    global status
    new_status = request.json.get('status')
    if new_status not in ['LOCKED', 'UNLOCKED']:
        return jsonify({'error': 'Invalid status'}), 400
    status = new_status
    return jsonify({'lock_status': status})


"""
defined a route for resetting the simulator using the @app.route() decorator with the methods argument set to "POST"
"""
@app.route('/reset_simulator', methods=['POST'])
def function4():
    """
    defined this function to reset the simulator using the @app.route() decorator
    """
    global status
    new_status = request.json.get('reset')
    print("received", new_status)
    if new_status == "True":
        return jsonify({'error': 'Invalid status'}), 400
    status = "LOCKED"
    return jsonify({'message': "success"})

if __name__ == '__main__':
    print("Working dir = ", os.path.abspath(os.getcwd()))
    app.run(host="127.0.0.1", port="5003", threaded=True)
    socketio.run(app, debug=True)
            
