# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.


from dataclasses import dataclass
from flask import Flask, jsonify, request
import pandas_datareader as pdr
import datetime as dt

import model
from flask_cors import CORS


# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)


# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.


@app.route('/futuredata', methods=['POST'])
# ‘/’ URL is bound with hello_world() function.
def futuredata():
    userData = request.get_json()
    print(userData['stock'])
    return jsonify(model.model(userData['stock']))
    # return jsonify(userData)


@app.route('/originaldata', methods=['POST', "GET"])
def originaldata():
    userData = request.get_json()
    print(userData)
    start = dt.datetime(2020, 1, 1)
    end = dt.datetime.now()
    df = pdr.get_data_yahoo(userData['stock'], start, end)
    df1 = df.reset_index()['Close']
    print(list(df1))
    df2 = list(df1)

    return jsonify({"data": df2})


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    app.run(debug=True)
