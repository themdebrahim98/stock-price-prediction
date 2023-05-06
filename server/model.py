import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM, Conv1D, MaxPooling1D, Flatten, Dropout
import datetime as dt
import yfinance as yfin
from pandas_datareader import data as pdr

def model(stock):

    start = dt.datetime(2020, 1, 1)
    end = dt.datetime.now()
    yfin.pdr_override()
    df = pdr.get_data_yahoo(stock, start,end )
    data = df[['Close']]
    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)
    # Define the sequence length
    sequence_length = 10

    # Create sequences of data
    X = []
    y = []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i, :])
        y.append(scaled_data[i, 0])

    # Convert the data to numpy arrays
    X = np.array(X)
    y = np.array(y)
    # Split the data into training and testing sets
    split_ratio = 0.8
    train_size = int(split_ratio * len(X))
    X_train = X[:train_size, :]
    X_test = X[train_size:, :]
    y_train = y[:train_size]
    y_test = y[train_size:]
    # Define the model architecture
    model = Sequential()
    model.add(Conv1D(filters=32, kernel_size=3, activation='relu', padding='same', input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(MaxPooling1D(pool_size=2))
    model.add(Conv1D(filters=64, kernel_size=3, activation='relu', padding='same'))
    model.add(MaxPooling1D(pool_size=2))
    model.add(Conv1D(filters=128, kernel_size=3, activation='relu', padding='same'))
    model.add(MaxPooling1D(pool_size=2))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Flatten())
    model.add(Dense(50, activation='relu'))
    model.add(Dense(1))
    # Compile the model
    model.compile(optimizer='adam', loss='mean_squared_error')
    # Train the model
    model.fit(X_train, y_train, epochs=100, batch_size=32)
    score = model.evaluate(X_test, y_test, batch_size=32)
    y_pred = model.predict(X_test)
    # Inverse transform the predictions and actual values
    y_pred = scaler.inverse_transform(np.concatenate((y_pred, X_test[:, -1, 1:]), axis=1))[:, 0]
    y_test = scaler.inverse_transform(np.concatenate((y_test.reshape(-1, 1), X_test[:, -1, 1:]), axis=1))[:, 0]
    rmse = np.sqrt(np.mean((y_pred - y_test)**2))
    print('Test RMSE:', rmse)
    future_days = 30

    # Initialize the last sequence with the last 10 days from the dataset
    last_sequence = scaled_data[-sequence_length:, :].reshape((1, sequence_length, scaled_data.shape[1]))
    last_sequence.shape

    temp = np.array(last_sequence)
    predicted_data = []


    future_days = 10
    for i in range(future_days):
        next_price = np.array(model.predict(temp)[0])
        next_price = np.expand_dims(next_price, axis=(0,2))
        predicted_data.append(next_price[0][0])
        temp = np.concatenate((temp, next_price), axis=1)
        temp = np.delete(temp, 0, axis=1)


    # Inverse transform the predicted prices
    predicted = scaler.inverse_transform(np.array(predicted_data).reshape(-1, 1)).squeeze()
    prediction_data = np.array(predicted)
    
    df1 = scaler.inverse_transform(data)
    df1 = list(df1.flatten())
    original_data =  np.array(data).flatten().tolist()
    print(original_data, "ok")





    db = [

        {
            "predict_price": prediction_data.tolist(),
            "original_closing_price":original_data
        }
    ]
    return db
