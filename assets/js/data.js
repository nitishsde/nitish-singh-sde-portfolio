/* ==========================================================
   Site content. Edit here, or use manage.html to add items.

   Items added from manage.html are saved in your own browser.
   To show them to every visitor, click "Export" in manage.html
   and paste the result into the `custom` block at the bottom.
   ========================================================== */
(function () {
  var dev = function (n) { return 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/' + n + '/' + n + '-original.svg'; };
  var goog = function (d) { return 'https://www.google.com/s2/favicons?domain=' + d + '&sz=128'; };

  window.SITE_DATA = {
    site: {
      name: 'Nitish Singh',
      email: 'mrnitishsingh15@gmail.com',
      phone: '+91 90057 35437',
      github: 'https://github.com/nitishsde',
      linkedin: 'https://www.linkedin.com/in/nitishsde',
      form: 'https://formspree.io/f/mqagozea'
    },

    /* cat decides the ring and the group: lang, backend, frontend, data, ai, tool */
    skills: [
      { id: 's-java', name: 'Java', cat: 'lang', logo: dev('java'), core: true },
      { id: 's-spring', name: 'Spring Boot', cat: 'backend', logo: dev('spring'), ring: 1 },
      { id: 's-mysql', name: 'MySQL', cat: 'data', logo: dev('mysql'), ring: 1 },
      { id: 's-python', name: 'Python', cat: 'lang', logo: dev('python'), ring: 1 },
      { id: 's-git', name: 'Git', cat: 'tool', logo: dev('git'), ring: 1 },
      { id: 's-js', name: 'JavaScript', cat: 'lang', logo: dev('javascript'), ring: 2 },
      { id: 's-react', name: 'React', cat: 'frontend', logo: dev('react'), ring: 2 },
      { id: 's-html', name: 'HTML5', cat: 'frontend', logo: dev('html5'), ring: 2 },
      { id: 's-css', name: 'CSS3', cat: 'frontend', logo: dev('css3'), ring: 2 },
      { id: 's-bs', name: 'Bootstrap', cat: 'frontend', logo: dev('bootstrap'), ring: 2 },
      { id: 's-claude', name: 'Claude', cat: 'ai', logo: goog('claude.ai'), ring: 3 },
      { id: 's-chatgpt', name: 'ChatGPT', cat: 'ai', logo: goog('chatgpt.com'), ring: 3 },
      { id: 's-gemini', name: 'Gemini', cat: 'ai', logo: goog('gemini.google.com'), ring: 3 },
      { id: 's-copilot', name: 'GitHub Copilot', cat: 'ai', logo: goog('github.com'), ring: 3 },
      { id: 's-android', name: 'Android', cat: 'tool', logo: dev('android'), ring: 3 },
      { id: 's-node', name: 'Node.js', cat: 'backend', logo: dev('nodejs'), ring: 3 },
      { id: 's-mongo', name: 'MongoDB', cat: 'data', logo: dev('mongodb'), ring: 3 },
      { id: 's-php', name: 'PHP', cat: 'lang', logo: dev('php'), ring: 3 },
      { id: 's-github', name: 'GitHub', cat: 'tool', logo: dev('github'), ring: 3 }
    ],

    exp: [
      {
        id: 'e-codesquadz', role: 'Java Full Stack Intern', company: 'CodeSquadz',
        period: '6 months', location: 'Noida, Uttar Pradesh', url: 'https://www.codesquadz.com/',
        logo: goog('codesquadz.com'), type: 'Internship',
        details: 'Six month Java full stack internship at CodeSquadz, Noida. Worked across the stack with Java, Spring Boot, MySQL and a web front end, building and testing features in a team setting.',
        tags: ['Java', 'Spring Boot', 'MySQL', 'Full stack']
      },
      {
        id: 'e-softpro', role: 'Java Development Summer Intern', company: 'SoftPro India Pvt. Ltd.',
        period: 'Jun 2024 to Aug 2024', location: '', url: '', logo: '', type: 'Summer internship',
        details: 'Summer internship with full stack live projects in HTML, CSS, JavaScript, MySQL, Spring Boot and Python, including IIMM Ayodhya and the Nalanda Open University portal built with Java Spring Boot.',
        tags: ['Spring Boot', 'MySQL', 'JavaScript', 'Python']
      }
    ],

    edu: [
      { id: 'd-btech', title: 'B.Tech, Computer Science and Engineering', place: 'Delhi Institute of Engineering and Technology, Meerut', period: '2025 to 2028', details: '' },
      { id: 'd-diploma', title: 'Diploma, Computer Science and Engineering', place: 'Government Polytechnic, Gonda (Board of Technical Education, Uttar Pradesh)', period: '2022 to 2025', details: '' },
      { id: 'd-adca', title: 'ADCA, Advanced Diploma in Computer Applications', place: 'MDEG, Delhi branch', period: '', details: '' },
      { id: 'd-12', title: 'Intermediate (12th), Science with PCM', place: 'Ram Naresh Buddhisagar P.C. Adarsh Inter College, Sant Kabir Nagar', period: '2021 to 2022', details: '' },
      { id: 'd-10', title: 'High School (10th)', place: 'U.B.A.I.C. Adarsh Inter College, Sant Kabir Nagar', period: '2019 to 2020', details: '' }
    ],

    /* cats: space separated, used by the filter (java, web, android) */
    proj: [
      { id: 'p-resumgo', name: 'ResumGo', url: 'https://autoresume.netlify.app/', cats: 'web', featured: true,
        desc: 'Resume builder with a multi-step form, a live ATS score check and one-click PDF or DOC download.',
        tags: ['HTML', 'CSS', 'JavaScript'] },
      { id: 'p-genfidai', name: 'GENFIDAI Platform', url: 'https://genfidai.netlify.app/', cats: 'web', featured: true,
        desc: 'Platform for developers with learning resources, career guidance and tools. Designed, built and run by me.',
        tags: ['React JS', 'Bootstrap', 'JavaScript'] },
      { id: 'p-uppcl', name: 'UPPCL Bill Generator', url: '', cats: 'java', featured: true,
        desc: 'Electricity bill generator with tariff based calculations, bill history and PDF export.',
        tags: ['Java', 'MySQL'] },
      { id: 'p-nou', name: 'Nalanda Open University portal', url: '', cats: 'java web',
        desc: 'Student portal built on Spring Boot as a live project during my SoftPro India summer internship.',
        tags: ['Java', 'Spring Boot', 'MySQL'] },
      { id: 'p-vezify', name: 'Vezify Mart', url: '', cats: 'web',
        desc: 'E-commerce website with an admin dashboard, cart and a secure checkout flow.',
        tags: ['PHP', 'MySQL', 'Bootstrap'] },
      { id: 'p-android', name: 'Android E-commerce app', url: '', cats: 'android java',
        desc: 'Mobile shopping app with sign in, product catalogue and cart.',
        tags: ['Android', 'Java', 'XML'] },
      { id: 'p-sde', name: 'SDE Insights', url: '', cats: 'web java',
        desc: 'Learning platform for software engineering topics, coding practice and interview preparation.',
        tags: ['Java', 'MERN'] },
      { id: 'p-clones', name: 'Spotify and Google clones', url: '', cats: 'web',
        desc: 'Front end clones built during my internship to practise layout, responsive design and JavaScript.',
        tags: ['HTML', 'CSS', 'JavaScript'] }
    ],

    /* Paste the exported JSON from manage.html here to publish your additions. */
    custom: { skills: [], exp: [], edu: [], proj: [] }
  };
})();
