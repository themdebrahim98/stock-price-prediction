import React, { useState } from "react";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import LoadingButton from "@mui/lab/LoadingButton";
import "./prediction.css";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import backgroundImg from "./media/stock.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { Chip } from "@mui/material";

export default function Prediction() {
  const [stockCode, setstockCode] = useState("");
  const [originalClosingPrice, setoriginalClosingPrice] = useState([]);
  const [fututeData, setfututeData] = useState([]);
  const [isLoadingSearchButton, setisLoadingSearchButton] = useState(false);
  const [isLoadingTrainButton, setisLoadingTrainButton] = useState(false);

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
    yAxis: {
      title: {
        text: "Price",
      },
    },
    xAxis: {
      minRange: 1,
      title: {
        text: "Day",
      },
    },
    title: {
      text: "Future Data",
    },
    series: [
      {
        data: fututeData.length > 0 ? fututeData : [],
      },
    ],
  };

  const handleInput = (e) => {
    setstockCode(e.target.value);
  };

  const fetchOriginlPrice = () => { };

  const handleTraining = async () => {
    setfututeData([]);
    try {
      setisLoadingTrainButton(true);
      let response = await axios.post("http://localhost:5000/futuredata", {
        stock: stockCode,
      });
      console.log(response.data);
      if (response.data[0].predict_price.length > 0) {
        setfututeData(response.data[0].predict_price);
        setisLoadingTrainButton(false);
      }
    } catch (error) {
      console.log(error);
      setisLoadingTrainButton(false);
    }
  };

  const handleOriginalData = async () => {
    try {
      if (stockCode != "") {
        setisLoadingSearchButton(true);

        setfututeData([]);
        setoriginalClosingPrice([]);

        let reponse = await axios.post("http://localhost:5000/originaldata", {
          stock: stockCode,
        });

        console.log(reponse.data);
        if (reponse.data.data.length <= 0) {
          alert("No Data Found! Please Search Again");
          setisLoadingSearchButton(false);
          return;
        }
        setoriginalClosingPrice((prev) => reponse.data.data);
        setisLoadingSearchButton(false);
      } else {
        alert("Please enter stock code!!");
      }
    } catch (error) {
      alert("Something went wrong!!");
      setisLoadingSearchButton(false);
    }
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        p: "25px",
        display: "flex",
        justifyContent: "center",
        background: "rgb(34,193,195)",
        background:
          "linear-gradient(13deg, rgba(34,193,195,1) 42%, rgba(233,188,59,1) 96%, rgba(253,187,45,1) 100%)",
      }}
    >
      <Grid
        item
        xs={12}
        lg={10}
        sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <Grid xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            sx={{ bg: "transparent" }}
          >
            <TextField
              sx={{ color: "white" }}
              onChange={handleInput}
              placeholder="Enter Stock Code"
              value={stockCode}
            />
            <Button
              sx={{ width: "150px" }}
              disabled={isLoadingSearchButton}
              variant="contained"
              onClick={handleOriginalData}
            >
              {isLoadingSearchButton ? "Fetching.." : "Search"}
            </Button>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box
            sx={{
              background: "#ddd",
              minHeight: "350px",
              padding: "15px",
              width: "100%",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {originalClosingPrice.length > 0 ? (
              <Box sx={{ flex: "1" }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </Box>
            ) : null}

            {
              isLoadingSearchButton && (
                <Stack direction="row" spacing={2}>
                  <Button
                    sx={{ width: "150px" }}
                    variant="outlined"
                    startIcon={<CircularProgress size={20} />}
                  >
                    Fetching...
                  </Button>
                </Stack>
              )
              // isLoadingSearchButton && (<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
              //   <CircularProgress />
              // </Box>)
            }
          </Box>
        </Grid>
        <Grid xs={12}>
          <Box
            sx={{
              background: "#ddd",
              minHeight: "350px",
              padding: "15px",
              width: "100%",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {fututeData.length > 0 ? (
              <Box sx={{ flex: "1" }}>
                {" "}
                <HighchartsReact highcharts={Highcharts} options={options2} />
              </Box>
            ) : null}
            {isLoadingTrainButton == false && fututeData.length <= 0 && (
              <Button
                disabled={originalClosingPrice.length <= 0}
                onClick={handleTraining}
                variant="contained"
              >
                Train The Model
              </Button>
            )}

            {isLoadingTrainButton && (
              <Stack direction="row" spacing={2}>
                <Button
                  sx={{ width: "150px" }}
                  variant="outlined"
                  startIcon={<CircularProgress size={20} />}
                >
                  Training...
                </Button>
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid xs={12}>
          <Box
            sx={{
              background: "#ddd",
              minHeight: "150px",
              padding: "15px",
              width: "100%",
              borderRadius: "15px",
            }}
          >
            <Box className="result">
              <Typography>
                Towday's{" "}
                <Chip color="secondary" label={stockCode ? stockCode : "ABC"} color="primary" />{" "}
                close price:
                <Chip
                  color="secondary"
                  label={
                    originalClosingPrice.length > 0
                      ? originalClosingPrice[
                        originalClosingPrice.length - 1
                      ].toFixed(2)
                      : "XYZ"
                  }
                />
              </Typography>

              <Typography>
                Tomorrow's{" "}
                <Chip label={stockCode ? stockCode : "ABC"} color="primary" />{" "}
                close price will be :
                <Chip
                  color="secondary"
                  label={
                    fututeData.length > 0 ? fututeData[0].toFixed(2) : "XYZ"
                  }
                />
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
