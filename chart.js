class Chart {
    static drawChart(runData) {

        // Define Data
        const data = [{
            x: runData.x,
            y: runData.y,
            mode: 'lines + markers'
        }];
    
        // Define Layout
        const layout = {
            xaxis: {range: [1, runData.x.length + 1], title: "Number of Training Runs"},
            yaxis: {range: [0, 4200], title: "Distance Covered"},
            title: "Y Distance Covered (Finish Line = 4200) vs # of Training Runs"
        };
    
        // Display using Plotly
        Plotly.newPlot("chartCanvas", data, layout);
    
    }
}
