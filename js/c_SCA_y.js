// Importar D3.js desde CDN
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Función asincrónica para cargar y dibujar el gráfico
export async function c_SCA_y() {
    // Select watershed
    var watershed = "054"

    // Ruta para el archivo CSV
    var text_ini = "csv\\year\\SCA_y_BNA_"
    var text_end =  ".csv"

    var watershed_selected = text_ini.concat(watershed).concat(text_end)
    // Obtener los datos CSV
    const data = await d3.csv(watershed_selected);

    // Definir las dimensiones y márgenes del gráfico
    const margin = { top: 10, right: 30, bottom: 90, left: 50 };
    const width = 460 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Crear el elemento SVG
    var svg = d3.select("#Place1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Escala X
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Year))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Escala Y
    var y = d3.scaleLinear()
        .domain([0, 25]) //d3.max(data, d => d.SCA)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Barras
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Year))
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2")
        .attr("height", d => height - y(0))
        .attr("y", d => y(0));

    // Etiqueta del eje X
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("x", width / 2 + 15)
        .attr("y", height + margin.top + 35)
        .text("Años");

    // Etiqueta del eje Y
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - 50)
        .text("Cobertura de nieve (%)");

    // Animación
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.SCA))
        .attr("height", d => height - y(d.SCA))
        .delay((d, i) => i * 100);
}
