import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

const colors = d3.scaleOrdinal(d3.schemeTableau10);

function getDataFor(projectArray) {
  let rolledData = d3.rollups(projectArray, v => v.length, d => d.year);
  return rolledData.map(([year, count]) => ({ label: year, value: count }));
}

function renderPie(projectArray) {
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();

  const data = getDataFor(projectArray);
  if (data.length === 0) return; 

  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx));
  });

  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .classed('legend__item', true)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPie(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  let filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(query)
  );
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPie(filteredProjects);
});