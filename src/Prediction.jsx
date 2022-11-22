import React, { useState } from 'react'
import axios from 'axios'
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official'


export default function Prediction() {

    const [stockCode, setstockCode] = useState('')
    const [originalClosingPrice, setoriginalClosingPrice] = useState([])
    const [fututeData, setfututeData] = useState([])

    const [pressSearch, setpressSearch] = useState(false)
    const [presstraining, setpresstraining] = useState(false)



    const options = {
        chart: {
            zoomType: "x"
        },
        xAxis: {
            minRange: 1
        },
        title: {
            text: 'Original Closing Price'
        },
        yAxis: {
            title: {
                text: 'Price'
            }
        },
        xAxis: {
            title: {
                text: 'Day'
            }
        },
        series: [{
            data: originalClosingPrice.length > 0 ? originalClosingPrice : []
        }]
    }

    const options2 = {
        chart: {
            zoomType: "x"
        },
        xAxis: {
            minRange: 1
        },
        title: {
            text: 'My chart'
        },
        series: [{
            data: fututeData.length > 0 ? fututeData : []
        }]
    }


    const handleInput = (e) => {
        setstockCode((prev) => e.target.value)

    }

    const fetchOriginlPrice = () => {

    }

    const handleTraining = async () => {
        setpresstraining(true)
        let response = await axios.post("http://localhost:5000/futuredata", {
            "stock": stockCode
        })
        console.log(response.data)
        setfututeData(response.data[0].predict_price)
        setpresstraining(false)
    }

    const handleSubmit = async () => {

        setpressSearch(true)

        let reponse = await axios.post("http://localhost:5000/originaldata", {
            stock: stockCode
        })

        console.log(reponse.data)
        setoriginalClosingPrice((prev) => reponse.data.data)
        setpressSearch(false)



    }
    return (
        <>
            <div className="container h-100 mx-auto w-75 ">
                <div class="input-group mb-3 mx-auto w-25 mt-5" >
                    <input onChange={handleInput} type="text" class="form-control" placeholder="Enter Stock Code" aria-label="Recipient's username" aria-describedby="button-addon2" />
                    {
                        (pressSearch == true) ?
                            <h1>loading</h1>
                            :
                            <button onClick={handleSubmit} class="btn bg-primary text-danger  btn-outline-secondary" type="button" id="button-addon2" >Search</button>

                    }


                </div>
                <div className="closePrice bg-warning w-100  mx-auto mt-5" style={{ height: "400px" }}>

                    {originalClosingPrice.length > 0 && (<HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />)}


                </div>

                <div className="closePrice  w-100  d-flex mx-auto mt-5" style={{ height: "40px" }}>



                    {


                        presstraining ? <h1>Loading...</h1> : <button onClick={handleTraining} className='btn bg-primary justify-connent-center align-items-center mx-auto'>Training</button>
                    }



                </div>
                <div className="closePrice bg-warning w-100  mx-auto mt-5" style={{ height: "400px" }}>

                    {fututeData.length > 0 && (<HighchartsReact
                        highcharts={Highcharts}
                        options={options2}
                    />)}


                </div>
                <div className="training mx-auto ">
                    <button class="btn bg-primary mt-2 "> Training Data</button>
                </div>
                <div className="training mx-auto ">
                    <button class="btn bg-warning mt-2 "> Predict Price</button>
                </div>

            </div>


        </>
    )
}
