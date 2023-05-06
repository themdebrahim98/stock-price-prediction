# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.


from dataclasses import dataclass
from flask import Flask, jsonify, request
from pandas_datareader import data as pdr
import datetime as dt
import yfinance as yfin
import model
from flask_cors import CORS
import time
import pandas as pd

import datetime
# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)


# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.


@app.route('/futuredata', methods=['GET', 'POST'])
# ‘/’ URL is bound with hello_world() function.
def futuredata():
    userData = request.get_json()
    data = model.model((userData['stock']))
    
    return jsonify(data)


@app.route('/originaldata', methods=['POST', "GET"])
def originaldata():
  

    userData = request.get_json()
    start = dt.datetime(2020, 1, 1)
    end = dt.datetime.now()
    yfin.pdr_override()
    df = pdr.get_data_yahoo(userData['stock'], start,end )
    df1 = df.reset_index()['Close']
    df2 = list(df1)

    return jsonify({"data": df2})


    


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    app.run(debug=True, port=5000)
