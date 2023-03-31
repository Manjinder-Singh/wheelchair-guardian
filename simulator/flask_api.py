# -*- coding: utf-8 -*-s
import logging
import json
from flask import Flask, jsonify,request
import os
from flask_socketio import SocketIO, send
from flask import render_template

app = Flask(__name__, template_folder='templates', static_folder='staticFiles')
app.config['SECRET_KEY'] = 'secret!'

# Set initial status to locked
status = 'LOCKED'

socketio = SocketIO(app)
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

@app.route('/')
def home():
    global status
    return render_template("home.html", status=status)

@socketio.on('message')
def handle_message(data):
    # Handle incoming messages from clients
    print('received message:', data)

@app.route('/send_status_value', methods=['POST'])
def function1():
    global status
    val = request.json.get('uv')
    socketio.emit('uvInput', {'uv': val})
    return jsonify({'uv': val})

@app.route('/status_value', methods=['GET'])
def function3():
    global status
    return jsonify({'lock_status': status})
        
@app.route('/receive_resp', methods=['POST'])
def function2():
    global status
    new_status = request.json.get('status')
    if new_status not in ['LOCKED', 'UNLOCKED']:
        return jsonify({'error': 'Invalid status'}), 400
    status = new_status
    return jsonify({'lock_status': status})

@app.route('/reset_simulator', methods=['POST'])
def function4():
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
            
