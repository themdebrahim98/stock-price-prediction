import React, { useState } from "react";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "./prediction.css";
export default function Prediction() {
  const [stockCode, setstockCode] = useState("");
  const [originalClosingPrice, setoriginalClosingPrice] = useState([]);
  const [fututeData, setfututeData] = useState([]);

  const [pressSearch, setpressSearch] = useState(false);
  const [presstraining, setpresstraining] = useState(false);

  const options = {
    chart: {
      zoomType: "x",
    },
    xAxis: {
      minRange: 1,
    },
    title: {
      text: "Original Closing Price",
    },
    yAxis: {
      title: {
        text: "Price",
      },
    },
    xAxis: {
      title: {
        text: "Day",
      },
    },
    series: [
      {
        data: originalClosingPrice.length > 0 ? originalClosingPrice : [],
      },
    ],
  };

  const options2 = {
    chart: {
      zoomType: "x",
    },
    xAxis: {
      minRange: 1,
    },
    title: {
      text: "My chart",
    },
    series: [
      {
        data: fututeData.length > 0 ? fututeData : [],
      },
    ],
  };

  const handleInput = (e) => {
    setstockCode((prev) => e.target.value);
  };

  const fetchOriginlPrice = () => {};

  const handleTraining = async () => {
    if (originalClosingPrice.length > 0) {
      setfututeData([]);
      setpresstraining(true);
      try {
        let response = await axios.post("http://localhost:5000/futuredata", {
          stockData: originalClosingPrice,
        });
        console.log(response.data);
        setfututeData(response.data[0].predict_price);
        setpresstraining(false);
      } catch (error) {
        alert("Something went wrong!!");
      }
    } else {
      alert("Plese fetch stock price  before training!");
    }
  };

  const handleSubmit = async () => {
    try {
      if (stockCode != "") {
        setpressSearch(true);
        setfututeData([]);
        setoriginalClosingPrice([]);

        let reponse = await axios.post("http://localhost:5000/originaldata", {
          stock: stockCode,
        });

        console.log(reponse.data);
        setoriginalClosingPrice((prev) => reponse.data.data);
        setpressSearch(false);
      } else {
        alert("Please enter stock code!!");
      }
    } catch (error) {
      alert("Something went wrong!!");
    }
  };
  return (
    <>
      <div className="container p-5   ">
        <div class="input-group mb-3 mx-auto w-25 ">
          <input
            onChange={handleInput}
            type="text"
            class="form-control"
            placeholder="Enter Stock Code"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />

          <button
            onClick={handleSubmit}
            class="btn bg-primary   btn-outline-secondary"
            style={{ color: "white" }}
            type="button"
            id="button-addon2"
          >



            {pressSearch ? (
              <button class="btn btn-primary" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
            </button>
            ) : (
              "  Search"
            )}
          </button>
        </div>
        <div>
          <h2>Company:{stockCode} </h2>
        </div>
        <div
          className="closePrice  bg-secondary w-100  mx-auto mt-5"
          style={{ height: "400px" }}
        >

          {
            originalClosingPrice.length<=0 && pressSearch 
            ? 
            <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="sr-only">Loading...</span>
          </button>
            :null



          }


          {originalClosingPrice.length > 0 && (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </div>

       
        <div style={{marginTop:'45px'}}>
          <h2>Predicted Price: </h2>
        </div>

        
        <div
          className="futuredata  bg-secondary w-100   mt-5"
          style={{ height: "400px" }}
        >
          {fututeData.length <= 0 ? (
            <button 
              onClick={handleTraining}
              style={{textAlign:'center', margin:'0 auto'}}
              className="trainbutton btn bg-primary "
            >
              {presstraining ? 
              <button class="btn btn-primary" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
            </button>
               : 
                <p >Train model</p>
              }
            </button>
          ) : null}

          {fututeData.length > 0 && (
            <HighchartsReact   highcharts={Highcharts} options={options2} />
          )}
        </div>

        <div>
          <div className="result">
            <h2>Towday's {stockCode} close price:  {originalClosingPrice[0] && originalClosingPrice[originalClosingPrice.length-1].toFixed(2)}</h2>
            <h2>Tomorrow's {stockCode} close price will be : {fututeData[0] && fututeData[0].toFixed(2)}</h2>
            <h2>Accuracy: {}</h2>


            
          </div>
        </div>

       
      </div>
    </>
  );
}
