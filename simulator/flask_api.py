# -*- coding: utf-8 -*-
"""
Created on Fri Feb 10 17:18:24 2023

@author: rahul
"""

import logging
import json
from flask import Flask, jsonify,request
import os

app = Flask(__name__)


@app.route('/status_value', methods=['GET']) 
def function1():
    response = None 
    try:
        my_resp ={"user_id": "ABC123",
					"wheelchair_id": "XYZ123",
                    "lock_status": "LOCKED"}
        if my_resp.empty:
            response = "Error while Sending data - error"
        else:
            print("Extracted")
    except Exception as err :
        print('Unexpected Error:', err)
        response = "Error while sending the Status!"    
    resp =None
    resp = jsonify(my_resp)
    return resp


@app.route('/receive_resp', methods=['POST']) 
def function2():
    data = request.get_json()
    print("Data:- ",data)
    logging.info(data)
    logging.info(data['status')
    response = {
        "status" : data['status']
        }
    return json.dumps(response)
        
if __name__ == '__main__':
    print("Working dir = ", os.path.abspath(os.getcwd()))
    app.run(host="127.0.0.1", port="5003", threaded=True)     
            

