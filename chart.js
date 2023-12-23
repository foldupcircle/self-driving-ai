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
            yaxis: {range: [0, 100], title: "Percentage of Training Completed"},
            title: "Y Distance Covered (Finish Line = 5100) vs # of Training Runs"
        };
    
        // Display using Plotly
        Plotly.newPlot("chartCanvas", data, layout);
    
    }
}
