const apiKey = "C5PWPQ0AG36SN6LV";
const formattedData = [];

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');


var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const timeSeriesData = data["Time Series (Daily)"];

    for (const date in timeSeriesData) {
      const timestamp = new Date(date).getTime();
      const prices = [
        parseFloat(timeSeriesData[date]["1. open"]),
        parseFloat(timeSeriesData[date]["2. high"]),
        parseFloat(timeSeriesData[date]["3. low"]),
        parseFloat(timeSeriesData[date]["4. close"]),
      ];

      formattedData.push({ x: timestamp, y: prices });
    }

    // Data received, render chart using ApexCharts
    const chartOptions = {
      series: [
        {
          data: formattedData,
        },
      ],
      chart: {
        type: "candlestick",
        height: 345,
      },
      toolbar: {
        show: false,
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#22b783",
            downward: "#ef4d56",
          },
          wick: {
            useFillColor: true,
          },
        },
      },
      xaxis: {
        type: "datetime",
        tickPlacement: "between",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#stock_chart"), chartOptions);
    chart.render();
  });

/// Fetch stock data from Alpha Vantage
fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=C5PWPQ0AG36SN6LV`)
  .then((response) => response.json())
  .then((data) => {
    // Extract the necessary information from the response
    const stockData = {
      name: data["Name"],
      description: data["Description"],
      Country: data["Country"],
      Sector: data["Sector"],
      Industry: data["Industry"],
      Address: data["Address"],
      Exchange: data["Exchange"],
      Currency: data["Currency"],
      High: data["52WeekHigh"],
      Low: data["52WeekLow"],
      ProfitMargin: data["ProfitMargin"],
      SharesOutstanding: data["SharesOutstanding"],
    };

    // Pass the stock data to a function to display it in HTML
    displayStockData(stockData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function displayStockData(stockData) {
  // <div class="col-md-2">
  //   <p class="mb-0 p-2 bg-soft-dark rounded"><b>Volume: </b>58,46,321</p>
  // </div>

  // <div class="col-md-2">
  //   <p class="mb-0 p-2 bg-soft-dark rounded"><b>Avg.Treaded: </b>144.50</p>
  // </div>

  const buttonBox = document.getElementById("infoButtons");

  const exchangeBtndiv = document.createElement("div");
  exchangeBtndiv.innerHTML = ` <div class="row"> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-dark rounded"><b>Exchange: </b>${stockData.Exchange}</p> </div> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-dark rounded"><b>Currency: </b>${stockData.Currency}</p> </div> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-success rounded"><b>Upper Circuit: </b>${stockData.High}</p> </div> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-danger rounded"><b>Lower Circuit: </b>${stockData.Low}</p> </div> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-dark rounded"><b>Profit Margin: </b>${stockData.ProfitMargin}</p> </div> 
    <div class="col-md-2"> <p class="mb-0 p-2 bg-soft-dark rounded"><b>Shares: </b>${stockData.SharesOutstanding}</p> </div> </div>
   </div>`;

  buttonBox.appendChild(exchangeBtndiv);

  const cardTitle = document.getElementById("cardTitle");
  // <h3 class="card-title">Apple Inc.</h3>
  const h3Title = document.createElement("h3");
  h3Title.textContent = stockData.name;
  cardTitle.appendChild(h3Title);

  const infoBox = document.getElementById("stockInfo");
  const paragraphElement = document.createElement("p");

  paragraphElement.innerHTML =
    "<h4> Stock Description: </h4>" +
    stockData.description +
    "<h4> Address: </h4>" +
    stockData.Address +
    "<h4> Country: </h4>" +
    stockData.Country +
    "<h4> Sector: </h4>" +
    stockData.Sector +
    "<h4> Industry: </h4>" +
    stockData.Industry;
  infoBox.appendChild(paragraphElement);
}
