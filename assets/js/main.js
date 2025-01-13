chart_colors = ["#5B8E7D", "#BC4B51", "#F4A259", "#F4E285", "#8CB369"];
stripLines = [];
dates = weekly.Date;
prices = weekly.Price;
open = weekly.Open;
high = weekly.High;
low = weekly.Low;
changes = weekly.Change;
halving = [new Date("Jan 3, 2009")];
reward = 50;
chartPoints = []
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];



// GET HALVING DATES
for (j=0;j < Object.keys(halvings).length; j++) {
    halving.push(new Date(halvings[j]));
    reward = reward / 2;
    if (halving[j+1] <= Date.now()) {
        $(".info").append("<p class='halvings'>On " + months[halving[j+1].getMonth()] + " " + halving[j+1].getDate() + " " + halving[j+1].getFullYear() + " @ block height #" + (210000*(j+1)).toLocaleString("en-US") + " the reward dropped to " + reward + " BTC per mined block.</p>");
    } else {
        $(".info").append("<p class='halvings'>On ≈" + months[halving[j+1].getMonth()] + " " + halving[j+1].getDate() + " " + halving[j+1].getFullYear() + " @ block height #" + (210000*(j+1)).toLocaleString("en-US") + " the reward will be cut to " + reward + " BTC per mined block...</p><p>This keeps going until all 21 million BTC are issued.</p>");
    }
}

// CHART STRIPLINES CONFIG
for (l=1;l <= halving.length; l++) {
    stripLines.push({
        value: halving[l],
        color:"#adb5bd",
        label: "HALVING #" + l,
        labelFontFamily: "Arial",
        labelFontSize: 15,
        labelFontColor: "#adb5bd",
        labelAlign: "near",
        lineDashType: "dash"
    });
}

// POPULATE HTML
for (i=Object.keys(weekly.Date).length-2; i >= 0; i--) {

    // COLORIZE THESE VALUES
    change = changes[i].slice(0,-1);
    if (change > 0) {
        chcolor = "#4caf50";
        trend_symbol = "▲";
    }
    else if (change < 0) {
        chcolor = "#f23645";
        trend_symbol = "▼";
    }
    else {
        chcolor = "white";
        change = "-";
        trend_symbol = "";
    }

    date = new Date(dates[i]);
    $(".bitcoin_historical_prices").append(`<tr><td>${dates[i]} - ${dates[i+1]}</td><th>$${prices[i].toLocaleString("en-US")}</th><td>$${open[i].toLocaleString("en-US")}</td><td>$${high[i].toLocaleString("en-US")}</td><td>$${low[i].toLocaleString("en-US")}</td><th style='color: ${chcolor}'>${trend_symbol} ${changes[i].replace('-','')}</th></tr>`);
    

    for (k=Object.keys(halving).length-1; k >= 0; k--){
        if (date <= halving[k] && date > halving[k-1]){
            cycle_length = (halving[k] - halving[k-1]) / 86400000;
            quarter_cycle = cycle_length / 5;
            days_to_next_halving = (halving[k] - date) / 86400000;

            if (days_to_next_halving <= quarter_cycle) { color = chart_colors[0]; }
            else if (days_to_next_halving > quarter_cycle && days_to_next_halving <= quarter_cycle*2) { color = chart_colors[1]; }
            else if (days_to_next_halving > quarter_cycle*2 && days_to_next_halving <= quarter_cycle*3) { color = chart_colors[2]; }
            else if (days_to_next_halving > quarter_cycle*3 && days_to_next_halving <= quarter_cycle*4) { color = chart_colors[3]; }
            else if (days_to_next_halving > quarter_cycle*4 && days_to_next_halving <= quarter_cycle*5) { color = chart_colors[4]; }
        }
    }
    chartPoints.push({ x: date, y: Number(prices[i]), lineColor: color});
}

window.onload = function () {
    var options = {
        animationEnabled: false,  
        backgroundColor: "#212529",
        axisX: {
            gridColor: "#343a40",
            valueFormatString: "YYYY",
            labelFontFamily: "system-ui",
            labelFontSize: 16,
            labelFontColor: "#adb5bd",
            stripLines: stripLines,
            gridDashType: "dot"
        },
        axisY: {
            viewportMinimum: 0.1,
            gridColor: "#343a40",
            logarithmic: true,
            prefix: "$",
            labelFontFamily: "system-ui",
            labelFontSize: 16,
            labelFontColor: "#adb5bd",
            gridDashType: "line"
        },
        data: [{
            yValueFormatString: "$#,###.##0",
            xValueFormatString: "DD MMMM YYYY",
            type: "line",
            lineThickness: 3,
            dataPoints: chartPoints
        }],
        toolTip:{
            cornerRadius: 8,
        }
    };
    $(".chart").CanvasJSChart(options);
}
document.addEventListener("DOMContentLoaded", function(event){
    chart_width = $(".chart").width();
    chart_height = chart_width*0.5;
    $(".chart").height(chart_height);
    $(".chartwrapper").height(chart_height-10);
    $("div").width(chart_width);
});

    