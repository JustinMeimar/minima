const blogs = [
  {
    title: 'Lazy Secrets with Nix',
    date: '2025-11-17',
    url: '/blog/lazy_secrets_nix',
    path: './blogs/lazy_secrets_nix.md'
  } 
]; 

const personalLinks = [
  {
    name: 'github',
    link: 'https://github.com/JustinMeimar',
  },
  {
    name: 'email',
    link: 'meimar@ualberta.ca',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/justin-meimar-dev/',
  },
  {
    name: 'resume',
    link: './static/resume.pdf',
  }
];

const projects = [ 
  {
    title: 'Dragon-Runner',
    date: '2024-09-20',
    desc: 'V2 of a custom toolchain and test runner for my universitys compiler class',
    link: 'https://github.com/JustinMeimar/Dragon-Runner',
    photo: './static/projects/dragon.png'
  },
  {
    title: 'Gazbolt',
    date: '2024-08-01',
    desc: 'A compiler-explorer for 415 assignments',
    link: 'https://github.com/JustinMeimar/gazbolt',
    photo: './static/projects/ce.png'
  },
  {
    title: 'Algo Trees',
    date: '2024-01-05',
    desc: 'Procedural tree generation from recurrence relations',
    link: 'https://justinmeimar.github.io/algo-trees/',
    photo: './static/projects/tree.png'
  },
  {
    title: 'Mini Regex Engine',
    date: '2023-03-01',
    desc: 'A mini regex engine built from NFA closure properties',
    link: 'https://github.com/JustinMeimar/nfa-regex',
    photo: './static/projects/nfa.png'
  }
];


function app() {

  return {
        currentPath: '/',
        isDarkMode: false,
        links: [
            { url: '/', text: 'Home' },
            { url: '/blog', text: 'Blog' },
            { url: '/projects', text: 'Projects' }
        ],
        personalLinks: personalLinks,
        blogs: blogs,
        projects: projects,
        navigate(path) {
            window.location.hash = path;
            this.currentPath = path;
        },
        toggleTheme() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem('darkMode', this.isDarkMode);
            this.updateTheme();
        },
        updateTheme() {
            if (this.isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        },
        initTheme() {
            const savedTheme = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme !== null) {
                this.isDarkMode = savedTheme === 'true';
            } else {
                this.isDarkMode = prefersDark;
            }

            this.updateTheme();
        },
        init() {
            const updatePath = () => {
                this.currentPath = window.location.hash.slice(1) || '/';
            };
            window.addEventListener('hashchange', updatePath);
            updatePath();
            this.initTheme();
        },
        getBlogByUrl(url) {
            return this.blogs.find(blog => blog.url === url);
        }, 
        async renderBlog(markdownPath) {
          try {
              const response = await fetch(markdownPath);
              const content = await response.text();
              
              // Configure marked options
              marked.setOptions({
                  highlight: function(code, lang) {
                      if (lang && hljs.getLanguage(lang)) {
                          return hljs.highlight(code, {language: lang}).value;
                      } else {
                          return hljs.highlightAuto(code).value;
                      }
                  },
                  langPrefix: 'hljs language-',
                  breaks: true,
                  gfm: true
              });
              setTimeout(() => hljs.highlightAll(), 0);
                  
              return { content: marked.parse(content) };
          } catch (error) {
              console.error('Error loading markdown:', error);
              return { content: '<p>Error loading blog content.</p>' };
          }
      }
    };
}
