console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "",           title: "Home" },
  { url: "projects/",  title: "Projects" },
  { url: "contact/",   title: "Contact" },
  { url: "resume/",    title: "Resume" },
  { url: "meta/",     title: "Meta" },
  { url: "https://github.com/Siddhu-S", title: "GitHub" },
];

const BASE_PATH =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/"; 

const normalizePath = (p) => (p.endsWith("/") ? p : p + "/");

const nav = document.createElement("nav");
document.body.prepend(nav);

for (const p of pages) {
  const isExternal = p.url.startsWith("http");
  const fullUrl = isExternal ? p.url : BASE_PATH + p.url;

  const a = document.createElement("a");
  a.href = fullUrl;
  a.textContent = p.title;

  if (!isExternal) {
    const abs = new URL(a.href, location.origin);
    const isCurrent =
      abs.host === location.host &&
      normalizePath(abs.pathname) === normalizePath(location.pathname);
    a.classList.toggle("current", isCurrent);

    if (isCurrent) a.setAttribute("aria-current", "page");
  }

  a.toggleAttribute("target", isExternal);
  if (isExternal) {
    a.target = "_blank";
    a.rel = "noopener";
  }

  nav.append(a);
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!(containerElement instanceof Element)) {
    console.error('renderProjects: containerElement is invalid.');
    return;
  }

  containerElement.innerHTML = '';

  for (const project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      ${project.image ? `<img src="${project.image}" alt="${project.title}">` : ''}
      <div class="project-text">
        <p>${project.description}</p>
        ${project.year ? `<p class="project-year">${project.year}</p>` : ''}
      </div>
    `;

    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

export async function fetchGithubData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return null;
  }
}