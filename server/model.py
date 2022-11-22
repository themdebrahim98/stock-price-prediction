from xmlrpc.client import DateTime
from numpy import array
from sklearn.metrics import mean_squared_error
import math
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Sequential
import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas_datareader as pdr
import datetime as dt

try:
    def model(input):

        start = dt.datetime(2021, 1, 1)
        end = dt.datetime.now()

        df = pdr.get_data_yahoo(input, start, end)
        df.tail()
        df1 = df.reset_index()['Close']
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler(feature_range=(0, 1))
        df1 = scaler.fit_transform(np.array(df1).reshape(-1, 1))
        # splitting dataset into train and test split
        training_size = int(len(df1)*0.65)
        test_size = len(df1)-training_size
        train_data, test_data = df1[0:training_size,
                                    :], df1[training_size:len(df1), :1]

        def create_dataset(dataset, time_step=1):
            dataX, dataY = [], []
            for i in range(len(dataset)-time_step-1):
                a = dataset[i:(i+time_step), 0]  # i=0, 0,1,2,3-----99   100
                dataX.append(a)
                dataY.append(dataset[i + time_step, 0])
            return np.array(dataX), np.array(dataY)

        # reshape into X=t,t+1,t+2,t+3 and Y=t+4
        time_step = 100
        X_train, y_train = create_dataset(train_data, time_step)
        X_test, ytest = create_dataset(test_data, time_step)
        # reshape input to be [samples, time steps, features] which is required for LSTM
        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

        # Create the Stacked LSTM model
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense
        from tensorflow.keras.layers import LSTM

        model = Sequential()
        model.add(LSTM(50, return_sequences=True, input_shape=(100, 1)))
        model.add(LSTM(50, return_sequences=False))
        model.add(Dense(25))
        model.add(Dense(1))
        model.compile(loss='mse', optimizer='adam')
        model.fit(X_train, y_train,  epochs=100, batch_size=50,validation_split=0.2,verbose=0)

        # Lets Do the prediction and check performance metrics
        train_predict = model.predict(X_train)
        test_predict = model.predict(X_test)

        #accuracy check
        predictions = scaler.inverse_transform(test_predict)
        rmse = np.sqrt(np.mean(predictions-ytest)**2)

        print(rmse,"dasckhjaksbj")


        # Transformback to original form
        train_predict = scaler.inverse_transform(train_predict)
        test_predict = scaler.inverse_transform(test_predict)

        # Calculate RMSE performance metrics
        import math
        from sklearn.metrics import mean_squared_error
        math.sqrt(mean_squared_error(y_train, train_predict))
        math.sqrt(mean_squared_error(ytest, test_predict))


        start_point = len(test_data)-100
        x_input = test_data[start_point:].reshape(1, -1)
        temp_input = list(x_input)
        temp_input = temp_input[0].tolist()

        # demonstrate prediction for next 10 days
        from numpy import array

        lst_output = []
        n_steps = 100
        i = 0
        while (i < 30):

            if (len(temp_input) > 100):
                # print(temp_input)
                x_input = np.array(temp_input[1:])
                print("{} day input {}".format(i, x_input))
                x_input = x_input.reshape(1, -1)
                x_input = x_input.reshape((1, n_steps, 1))
                # print(x_input)
                yhat = model.predict(x_input, verbose=0)
                print("{} day output {}".format(i, yhat))
                temp_input.extend(yhat[0].tolist())
                temp_input = temp_input[1:]
                # print(temp_input)
                lst_output.extend(yhat.tolist())
                i = i+1
            else:
                x_input = x_input.reshape((1, n_steps, 1))
                yhat = model.predict(x_input, verbose=0)
                print(yhat[0])
                temp_input.extend(yhat[0].tolist())
                print(len(temp_input))
                lst_output.extend(yhat.tolist())
                i = i+1

        day_new = np.arange(1, 101)  # last 100 day
        day_pred = np.arange(101, 131)  # predict 30 day
        prevStartPos = len(df1) - 100
        lastPrev_100_data = scaler.inverse_transform(df1[prevStartPos:])
        predict_30_day_data = scaler.inverse_transform(lst_output)
        predict_30_day_data = list(predict_30_day_data.flatten())
        df1 = scaler.inverse_transform(df1)
        df1 = list(df1.flatten())

        print(df1)

        db = [

            {
                "predict_price": predict_30_day_data,
                "original_closing_price": df1
            }
        ]
        return db
except:
    pass
