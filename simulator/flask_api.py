# -*- coding: utf-8 -*-
"""
Created on Fri Feb 10 17:18:24 2023

@author: rahul
"""

import logging
import json
from flask import Flask, jsonify,request
import os
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
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

@app.route('/send', methods=['GET'])
def send_message():
    socketio.emit('response', {'data': 'This is a response from the server.'})
    response = {'message': 'This is an example response.'}
    return jsonify(response)

@socketio.on('message')
def handle_message(data):
    # Handle incoming messages from clients
    print('received message:', data)


@app.route('/status_value', methods=['GET']) 
def function1():
    response = None 
    try:
        # print("status ----"+ status)
        contents = ""
        my_resp ={"user_id": "ABC123",
					"wheelchair_id": "XYZ123",
                    "lock_status": "LOCKED"}
        with open("sample.txt", "r") as file:
            # Writing to the file
            contents = file.read()
            # print("file content "+ contents)
            my_resp["lock_status"] = contents
        # if not response:
        #     response = "Error while Sending data - error"
        # else:
        #     print("Extracted")
    except Exception as err :
        # print('Unexpected Error:', err)
        response = "Error while sending the Status!"    
    resp = None
    resp = jsonify(my_resp)
    # print(my_resp)
    return resp

@app.route('/receive_resp', methods=['POST']) 
def function2():
    data = request.get_json()
    # print("Data:- ",data)
    # logging.info(data)
    logging.info(data['status'])
    response = {
        "status" : ""
        }
    with open("sample.txt", "w") as file:
            # Writing to the file
            file.write(data['status'])
            response["status"] = data['status']
            print(data['status'])
    # print(response["status"])
    return json.dumps(response)
        
if __name__ == '__main__':
    print("Working dir = ", os.path.abspath(os.getcwd()))
    app.run(host="127.0.0.1", port="5003", threaded=True) 
    socketio.run(app, debug=True)    
            
