/* ==========================================================================
   HannahOS — Content & configuration
   --------------------------------------------------------------------------
   Every screen (desktop, mobile, HR Mode, Terminal, résumé) reads from this
   one file. Edit text, links and projects here; no other file needs to change.
   ========================================================================== */

window.HOS_DATA = {
  /* ---- Personal links: replace the empty strings with your real URLs ---- */
  links: {
    github: '',            // e.g. 'https://github.com/your-username'
    linkedin: 'https://www.linkedin.com/in/hannahlynsantiago/',
    facebook: 'https://www.facebook.com/hannahlynsantiago26',
    resume: 'assets/resume/Hannah-Lyn-Santiago-Resume.pdf',
    // Optional: a free form endpoint (Formspree, Getform, Basin…).
    // Leave empty to send messages through the visitor's email client.
    formEndpoint: ''
  },

  profile: {
    name: 'Hannah Lyn T. Santiago',
    shortName: 'Hannah',
    initials: 'HS',
    title: 'Computer Engineer · Embedded Systems · Software · QA',
    role: 'Computer Engineer',
    tagline: 'I build it, wire it, and break it before users do.',
    location: 'Cebu City, Philippines',
    timezone: 'Asia/Manila',
    email: 'santiagohannahlyn1126@gmail.com',
    schoolEmail: 'hannahlyn.santiago.22@usjr.edu.ph',
    photo: 'assets/img/hannah.jpg',
    photoAlt: 'assets/img/hannah-formal.jpg',   // second portrait, shown when the skills card flips
    status: 'Available for opportunities',
    // Rotating "Right now I'm…" line in Overview
    doing: ['wiring up an ESP32', 'shipping React + PHP apps', 'writing test cases', 'designing PCBs', 'building .NET MAUI apps', 'breaking things before users do'],
    about: 'Computer Engineer trained at University of San Jose–Recoletos. ' +
      'I work across the full stack, from microcontrollers and PCBs to web, desktop and mobile apps, ' +
      'with a QA mindset that catches issues early.'
  },

  stats: [
    { value: 4,  suffix: '+', label: 'Years as working scholar', sub: 'READS Working Scholar · 2022–2026' },
    { value: 9,  suffix: '',  label: 'Projects built',        sub: 'Hardware and software' },
    { value: 15, suffix: '+', label: 'Languages & tools',     sub: 'Firmware to front-end' },
    { text: 'High Honors',    label: 'Senior High',           sub: 'Academic Scholar' }
  ],

  /* "Why hire her?" — three reasons, shown on About, HR Mode and the résumé */
  why: [
    { icon: 'layers',  title: 'Full-stack range', text: 'Ships firmware, circuit boards and web, desktop and mobile apps.',
      proof: '9 projects, from ESP32 firmware and PCBs to React, PHP and .NET MAUI apps.', cta: 'See projects', go: 'projects' },
    { icon: 'shield',  title: 'QA instinct',      text: 'Tests business rules and edge cases before users ever see them.',
      proof: 'QA lead on the Xeleqt inventory system: stock rules, edge cases and data validation.', cta: 'Open Xeleqt', project: 'xeleqt' },
    { icon: 'clock',   title: 'Proven reliability', text: '4 years supporting a busy office while studying engineering full-time.',
      proof: 'READS Working Scholar at the Office of the Registrar, 2022 – 2026.', cta: 'See experience', go: 'experience' }
  ],

  experience: [
    {
      role: 'READS Working Scholar',
      org: 'Office of the Registrar · University of San Jose–Recoletos',
      period: '2022 – 2026',
      status: 'ACTIVE',
      badge: 'Final term · 2026',
      points: [
        'Ran the front desk, welcoming and serving students, alumni and walk-in clients',
        'Assessed requests for transcripts, certifications and other school documents, checking requirements before processing',
        'Gave clear information on registrar procedures, requirements and release schedules',
        'Troubleshot office computers, printers and software to keep the front desk running',
        'Managed and validated digital records, and supported other Office of the Registrar tasks',
        'Served 4 years, 2022 to 2026, alongside full-time engineering studies'
      ],
      // Shorter version for the 1-page résumé PDF
      cv: [
        'Front desk: served students, alumni and walk-in clients, and explained registrar procedures and requirements',
        'Assessed requests for transcripts, certifications and other school documents before processing',
        'Troubleshot office computers, printers and software; managed and validated digital records'
      ]
    },
    {
      role: 'Public Information Officer',
      org: 'Computer Engineering Society',
      period: '2024 – 2025',
      status: 'DONE',
      points: ['Managed public communications for the Computer Engineering Society']
    },
    {
      role: 'Immersion Program Facilitator',
      org: 'Senior High Immersion Program',
      period: '',                 // add dates when ready, e.g. '2023'
      status: 'DONE',
      points: ['Taught Senior High students C programming and digital logic design']
    }
  ],

  /* ---- Education feature: school card + journey timeline ---- */
  school: {
    name: 'University of San Jose–Recoletos',
    short: 'USJ-R',
    city: 'Cebu City, Philippines',
    degree: 'Bachelor of Science in Computer Engineering',
    dept: 'School of Engineering · Computer Engineering Department',
    years: '2022 – 2026',
    motto: ['Caritas', 'Scientia'],
    logo: 'assets/img/usjr/usjr-logo.webp',
    photo: 'assets/img/usjr/usjr-campus.webp',
    highlights: [
      ['file', 'Approved', 'Undergraduate thesis', 'research'],
      ['briefcase', '4 yrs', 'READS Working Scholar', 'experience'],
      ['message', 'PIO', 'Computer Engineering Society', 'experience'],
      ['folder', '9', 'Projects built', 'projects']
    ],
    focus: ['Embedded Systems', 'Microcontrollers', 'Digital Logic & FPGA', 'PCB Design', 'Software Development', 'Software Testing', 'Research Methods'],
    journey: [
      ['Before', 'award', 'Senior High, With High Honors', 'Graduated as an Academic Scholar, then chose Computer Engineering.'],
      ['2022', 'cap', 'Started BS Computer Engineering', 'Enrolled at USJ-R and joined the READS Working Scholar program at the Office of the Registrar.'],
      ['2024', 'message', 'Public Information Officer', 'Ran public communications for the Computer Engineering Society (2024 – 2025).'],
      ['2026', 'file', 'Thesis approved', 'A study of how traffic investigators read hand-drawn collision sketches, with a digital fix.'],
      ['2026', 'checkCircle', 'Final term as Working Scholar', 'Completed four years at the Office of the Registrar alongside full-time studies.']
    ]
  },

  education: [
    { title: 'BS Computer Engineering', org: 'University of San Jose–Recoletos · Cebu City', note: 'READS Working Scholar · 2022 – 2026' },
    { title: 'Senior High School', org: 'With High Honors', note: 'Academic Scholar' }
  ],

  /* ---- Research: approved undergraduate thesis -----------------------------
     Public-safe summary only. Withheld on purpose: investigator identities and
     IDs, case records, scene sketches, locations, interview transcripts,
     consent forms and the full manuscript.
     ------------------------------------------------------------------------ */
  research: {
    title: "Assessing Manual Investigation Challenges Affecting the TEU Investigator's Interpretation of Traffic Collision Scene Diagrams",
    short: 'Same sketch, different stories',
    kind: 'Undergraduate thesis · BS Computer Engineering · USJ-R',
    year: '2026',
    status: 'Approved',
    team: '3-member research team',
    lead: 'How police investigators read hand-drawn crash sketches, and a digital tool to close the gaps.',
    pitch: 'When police investigators read the same hand-drawn crash sketch, do they reach the same conclusion? We measured it and found where manual diagrams break down. Then we specified a digital tool to fix it.',
    headline: [
      ['67.6%', 'of interpretation problems trace to two causes: blurry sketches and missing measurements'],
      ['25–100%', 'investigator agreement, depending on how complete the sketch was'],
      ['8 × 6', 'investigators × archived collision scenarios, read independently']
    ],
    questions: [
      'How consistently do investigators interpret the same manual sketch?',
      'What ambiguities and discrepancies do they find?',
      'What challenges limit the interpretation process?',
      'How could technology improve consistency, reliability and efficiency?'
    ],
    method: [
      ['layers', 'Design', 'Descriptive-evaluative, mixed methods'],
      ['user', 'Respondents', '8 active traffic investigators: 3 novice, 5 experienced (purposive, stratified)'],
      ['file', 'Instrument', '6 archived collision sketches read independently, plus an operational interview'],
      ['chart', 'Analysis', 'Consensus levels, coded ambiguity frequencies and Pareto analysis']
    ],
    theories: ['Human Error Theory', 'Spatial Cognition Theory', 'Technology Acceptance Model'],
    /* Share of investigators who reached the dominant interpretation (n = 8) */
    consensus: [
      ['B.1', 'Car to car', 100, 'Clear rear-end collision. Every investigator agreed.'],
      ['B.2', 'Car to car', 25, 'Lateral impact with an ambiguous sketch. Readings split into rear-end, counterflow and right-of-way stories.'],
      ['B.3', 'Motorcycle to car', 100, 'Simple lane encroachment. Every investigator agreed.'],
      ['B.4', 'Motorcycle to car', 63, 'Overtaking sideswipe. Missing lane detail split the readings.'],
      ['B.5', 'Motorcycle to motorcycle', 38, 'Unclear lane order and impact points. Who was ahead could not be settled.'],
      ['B.6', 'Motorcycle to motorcycle', 88, 'Most agreed, but experienced readers flagged missing measurements.']
    ],
    /* % of responses citing each barrier (novice n = 18, experienced n = 30) */
    barriers: [
      ['Missing or incomplete measurements', 55.56, 60.0],
      ['Unclear vehicle positioning / trajectory', 16.67, 46.67],
      ['Ambiguous lane or road markings', 22.22, 36.67],
      ['Unclear damage indication', 33.33, 30.0]
    ],
    vitalFew: '67.6%',   // as reported in the paper (35.3% + 32.4% before rounding)
    /* The "vital few" from the Pareto analysis → what the proposed system does about each */
    fixes: [
      ['image', 35.3, 'Visual clarity / blur', 'Vector-based rendering keeps lines, lanes and damage marks sharp at any zoom, from field tablet to courtroom screen.'],
      ['sliders', 32.4, 'Missing measurements', 'Dimensioning constraints block submission until key distances such as gaps and skid marks are filled in.']
    ],
    solution: {
      name: 'ATADS · Automated Traffic Accident Diagramming System',
      points: [
        'Step-by-step sketch protocol: orientation, roadway, vehicles, evidence, validation',
        'Controlled vocabularies aligned with RA 4136 replace free-text slang',
        'Drag-and-drop, to-scale symbols, including local vehicles such as jeepneys',
        'Planned GIS overlays to anchor diagrams to real coordinates'
      ]
    },
    conclusion: 'Consistency depends on how complete the sketch is, not on seniority. Manual sketches work for simple cases. Complex scenes need digital tools that enforce measurements and standard terms.',
    privacy: 'Public summary only. Investigator identities, case records, scene sketches, locations and interview transcripts are withheld under the study\'s ethics protocol. The full manuscript is not shared publicly.'
  },

  /* ---- Projects -----------------------------------------------------------
     cat:   'software' | 'embedded'      qa: true adds it to the QA filter
     tech:  skill ids (see `skills` below) → logo badges + logo filtering
     tags:  extra plain-text tags without a logo
     demo / github: '' shows a "coming soon" note; paste a URL to activate
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: 'xeleqt', cat: 'software', qa: true, kind: 'web', hue: 262, glyph: 'box',
      title: 'Xeleqt Inventory Monitoring System',
      pitch: 'Delivered one traceable system that connects Finance, Hardware and Admin, from purchase order to finished-product delivery.',
      points: [
        'Built role-based workspaces for Admin, Finance and Hardware, each showing only its permitted modules',
        'Automated purchase-order and BOM intake with OCR, Excel import and barcode scanning',
        'Validated stock rules: deduct only confirmed output, per-part backup POs, no partial deductions'
      ],
      tech: ['react', 'typescript', 'php', 'mysql', 'xampp', 'functional', 'validation'],
      tags: ['Vite', 'Tailwind CSS', 'Electron'], demo: '', github: '',
      // Extra detail shown in the project sheet (public-safe: no part numbers, suppliers, prices or emails)
      client: 'Built for Xeleqt Technology Innovations Inc. · Web + Windows desktop app',
      flow: [
        ['Finance', 'Creates or uploads purchase orders and compares supplier prices'],
        ['Hardware', 'Receives, places and traces stock, then records finished output'],
        ['Admin', 'Approves production targets and manages user accounts'],
        ['Delivery', 'Ships finished products and tracks every unit after delivery']
      ],
      features: [
        ['shield', 'Role-based access'], ['upload', 'PO upload with OCR'], ['layers', 'BOM verification & matching'],
        ['scan', 'Barcode scanning'], ['chart', 'Supplier price comparison'], ['box', 'Manufacturing batches'],
        ['truck', 'Delivery & unit tracking'], ['log', 'Reports, XLSX export & audit history']
      ],
      cover: 'assets/projects/xeleqt/components.webp',
      shots: [
        ['login', 'Secure sign-in with role-based routing'],
        ['components', 'Component inventory with search, filters and barcode scanning'],
        ['component-details', 'Full traceability record for every component'],
        ['bom-details', 'BOM details with automatic inventory matching'],
        ['price-comparison', 'Supplier price, stock and lead-time comparison'],
        ['manufacturing', 'Manufacturing batch with shortage detection and backup POs'],
        ['upload-po', 'Purchase-order upload with OCR extraction and review']
      ]
    },
    {
      id: 'internship', cat: 'software', kind: 'web', hue: 205, glyph: 'briefcase',
      title: 'Online Internship Placement & Monitoring System',
      pitch: 'Moved the whole OJT lifecycle online for USJ-R Computer Engineering, from placement to logbooks to completion certificates.',
      points: [
        'Built four role-based workspaces for Admin, Adviser, Company and Student with approval-gated sign-up',
        'Designed a real-time digital logbook that unlocks only after a student is deployed',
        'Validated grading weights to total exactly 100% and load-tested the API with 50 concurrent users'
      ],
      tech: ['react', 'typescript', 'php', 'mysql', 'functional', 'system', 'validation'],
      tags: ['Vite', 'Tailwind CSS', 'jsPDF', 'Vercel'],
      demo: 'https://ojt-placement-monitoring-system.vercel.app/login', github: '',
      client: 'Built for the USJ-R Computer Engineering Department · Live on the web',
      flow: [
        ['Admin', 'Approves adviser and company accounts and manages user status'],
        ['Company', 'Posts OJT listings with grading weights, reviews applicants and evaluates interns'],
        ['Adviser', 'Approves enrollments and listings, then monitors logbooks and evaluations'],
        ['Student', 'Applies to listings, logs daily hours and downloads a completion certificate']
      ],
      features: [
        ['shield', 'Approval-gated registration'], ['briefcase', 'OJT listings & job board'],
        ['upload', 'Applications with validated uploads'], ['clock', 'Real-time time-in / time-out logbook'],
        ['checkCircle', 'Logbook review & approval'], ['award', 'Star-rated company evaluations'],
        ['pdf', 'PDF completion certificates'], ['lock', 'Temporary-password resets']
      ],
      cover: 'assets/projects/internship/login.webp',
      shots: [
        ['login', 'Live sign-in page with role-based registration'],
        ['admin-overview', 'Admin overview of users, placements and pending work'],
        ['adviser-dashboard', 'Adviser command center for deployment and approvals'],
        ['student-hub', 'Student hub tracking hours, applications and tasks'],
        ['company-listings', 'Company OJT listings with grading criteria'],
        ['grading-weights', 'Grading weights validated to total exactly 100%'],
        ['logbook', 'Digital logbook with live time-in'],
      ],
      shotsNote: 'Screens from the live system and its user manual. Names and company details are blurred.'
    },
    {
      id: 'jeepney', cat: 'software', kind: 'mobile', hue: 174, glyph: 'map',
      title: "Cebu Jeepney Commuters' Guide",
      pitch: 'Shows Cebu commuters the right jeepney route and the fare before they ride.',
      points: [
        'Built jeep-code search and an interactive OpenStreetMap view of Cebu',
        'Designed a fare calculator with distance, travel time and a 20% student, senior and PWD discount',
        'Built admin tools to manage routes, stops and vehicle types'
      ],
      tech: ['maui', 'csharp', 'xaml', 'android', 'visualstudio'],
      tags: ['MVVM', 'OpenStreetMap', 'JSON data'], demo: '', github: '',
      client: 'Android app built with .NET MAUI · Commuter and Admin roles',
      cover: 'assets/projects/jeepney/fare-routes.webp',
      shots: [
        ['search', 'Search a jeep code to see its route, stops and fare'],
        ['fare-routes', 'Fare calculator with discounts, and the active routes directory'],
        ['admin-menu', 'Admin tools for routes, stops and vehicle types'],
        ['map-mvvm', 'Live Cebu map running in the emulator, with the MVVM project structure']
      ],
      shotsNote: 'Screens from the Android app running in the emulator.'
    },
    {
      id: 'trades', cat: 'software', kind: 'mobile', hue: 32, glyph: 'wrench',
      title: 'Industrial Trade Jobs App',
      pitch: 'Connects skilled trade workers and clients, from job post to payment, in one app.',
      points: [
        'Built job posting with rate negotiation',
        'Integrated time tracking and payments',
        'Designed two-way ratings and an MVVM-based negotiation flow'
      ],
      tech: ['maui', 'csharp', 'xaml', 'android'],
      tags: ['MVVM', 'Figma'], demo: '', github: 'https://github.com/santi1126/Industrial-Trade-Jobs---San',
      client: 'CPE SD 1 project · 2-person team · Designed in Figma, built in .NET MAUI',
      flow: [
        ['Employer', 'Posts a job request with rate, skillset and location'],
        ['Worker', 'Browses jobs by skillset and negotiates a rate'],
        ['Employer', 'Accepts the rate and approves the applicant'],
        ['Worker', 'Finishes the job and records the time spent']
      ],
      features: [
        ['briefcase', 'Job requests by skillset'], ['message', 'Rate negotiation chat'],
        ['user', 'Applicant review & hiring'], ['clock', 'Time tracking on job finish'],
        ['bug', 'Worker reporting'], ['shield', 'HR worker accounts & activation'],
        ['chart', 'HR demand & labor-rate dashboard'], ['layers', 'Three roles: Employer, Worker, HR']
      ],
      cover: 'assets/projects/trades/job-board.webp',
      shots: [
        ['login', 'Sign-in and sign-up for every role'],
        ['job-board', 'Worker job board filtered by skillset'],
        ['job-request', 'Employer job request with rate, skillset and applicants'],
        ['negotiation', 'Rate negotiation chat between employer and worker'],
        ['applicants', 'Applicant list with negotiated rates and hiring status'],
        ['worker-profile', 'HR tool to update and activate worker profiles'],
        ['hr-dashboard', 'HR dashboard for skill demand and labor rates']
      ],
      shotsNote: 'Figma wireframes from the project documentation. Names and photos are sample data; a sample email is blurred.'
    },
    {
      id: 'smarthome', cat: 'embedded', kind: 'board', hue: 168, glyph: 'home',
      title: 'Smart Home City',
      pitch: 'A voice-controlled smart city model that reacts to motion, light and commands in real time.',
      points: [
        'Automated gates and smart streetlights with ESP32',
        'Streamed PIR motion alerts to Adafruit IO and an OLED display',
        'Integrated Google Assistant voice control'
      ],
      tech: ['esp32', 'micropython', 'adafruit', 'googleassistant'],
      tags: ['PIR sensors', 'OLED'], demo: '', github: '',
      client: 'Team build · USJ-R Computer Engineering',
      cover: 'assets/projects/smarthome/model-front.webp',
      shots: [
        ['model-front', 'The smart home model: house, gate, trees and street'],
        ['model-top', 'Assembling the model and placing the sensor modules']
      ],
      shotsNote: 'Photos from the build.'
    },
    {
      id: 'ballsort', cat: 'embedded', kind: 'board', hue: 340, glyph: 'palette',
      title: 'Ball Color Sorting Robot',
      pitch: 'A line-following robot that detects and sorts red, green and blue balls on its own.',
      points: [
        'Programmed a PIC16F877A in MPLAB for color detection',
        'Built line-following navigation',
        'Automated sorting from detection to drop-off'
      ],
      tech: ['pic', 'mplab', 'embeddedc'],
      tags: ['RGB sensing', 'L298N motor driver', '18650 Li-ion pack', '4WD chassis'], demo: '', github: '',
      client: 'Team build · USJ-R Computer Engineering',
      cover: 'assets/projects/ballsort/assembly.webp',
      shots: [
        ['team', 'The finished color-sorting robot with the team'],
        ['assembly', 'Wiring the 4WD base: motor driver, battery pack and PIC controller'],
        ['chassis', 'Chassis with sorting bays, battery pack and power switch'],
        ['wiring', 'Motor driver, breadboard controller and power modules']
      ],
      shotsNote: 'Photos from the build and the final demo.'
    },
    {
      id: 'sumobot', cat: 'embedded', kind: 'board', hue: 12, glyph: 'bot',
      title: 'Sumobot & Line-Follower Robots',
      pitch: 'Competition robots that sense, decide and react in real time.',
      points: [
        'Built real-time sensor and actuator control',
        'Designed line-tracking and opponent-detection logic',
        'Tested and tuned behavior on the physical robots'
      ],
      tech: ['embeddedc'],
      tags: ['Sensors', 'Actuators'], demo: '', github: ''
    },
    {
      id: 'fpga', cat: 'embedded', kind: 'board', hue: 230, glyph: 'grid',
      title: 'FPGA Designs',
      pitch: 'Hardware-level logic, from LED systems to a working digital alarm clock.',
      points: [
        'Designed a digital alarm clock in VHDL',
        'Built LED control systems on FPGA',
        'Validated logic behavior on real hardware'
      ],
      tech: ['vhdl', 'fpga'],
      tags: [], demo: '', github: ''
    },
    {
      id: 'pcb', cat: 'embedded', kind: 'board', hue: 145, glyph: 'music',
      title: 'PCB Design',
      pitch: 'Custom circuit boards, including a playable piano circuit.',
      points: [
        'Designed a custom piano circuit board',
        'Laid out boards for embedded projects',
        'Took designs from schematic to physical board'
      ],
      tech: ['pcb'],
      tags: [], demo: '', github: ''
    }
  ],

  /* ---- Skills -------------------------------------------------------------
     logo:  file in assets/icons/brands (official Devicon / Simple Icons SVG)
     glyph: custom line icon (js/icons.js) for items with no official logo
     dark:  logo is dark → gets a light backing in dark mode
     brand: glow color on hover
     note:  "where I used it" when no project lists the skill
     rel:   extra project ids the skill relates to (for logo → project filter)
     ------------------------------------------------------------------------ */
  skillCategories: [
    { id: 'lang',  name: 'Languages',          icon: 'code' },
    { id: 'web',   name: 'Frameworks & Web',   icon: 'layout' },
    { id: 'db',    name: 'Databases',          icon: 'database' },
    { id: 'hw',    name: 'Hardware & IoT',     icon: 'chip' },
    { id: 'plat',  name: 'Mobile & Platforms', icon: 'phone' },
    { id: 'tools', name: 'Tools',              icon: 'wrench' },
    { id: 'qa',    name: 'QA',                 icon: 'shield' },
    { id: 'soft',  name: 'Soft Skills',        icon: 'message' }
  ],

  skills: [
    // Languages
    { id: 'c',          name: 'C',           cat: 'lang', logo: 'c',          brand: '#5C8DBC', note: 'Taught C to Senior High students' },
    { id: 'cpp',        name: 'C++',         cat: 'lang', logo: 'cplusplus',  brand: '#00599C', note: 'Engineering coursework' },
    { id: 'csharp',     name: 'C#',          cat: 'lang', logo: 'csharp',     brand: '#9B4F96' },
    { id: 'typescript', name: 'TypeScript',  cat: 'lang', logo: 'typescript', brand: '#3178C6' },
    { id: 'javascript', name: 'JavaScript',  cat: 'lang', logo: 'javascript', brand: '#F7DF1E', note: 'Web front-ends', rel: ['xeleqt'] },
    { id: 'python',     name: 'Python',      cat: 'lang', logo: 'python',     brand: '#3776AB', note: 'Scripting and IoT logic', rel: ['smarthome'] },
    { id: 'micropython',name: 'MicroPython', cat: 'lang', logo: 'micropython',brand: '#7B8794', dark: true },
    { id: 'embeddedc',  name: 'Embedded C',  cat: 'lang', glyph: 'chipC' },
    { id: 'vhdl',       name: 'VHDL',        cat: 'lang', glyph: 'gate' },
    { id: 'sql',        name: 'SQL',         cat: 'lang', glyph: 'database', rel: ['xeleqt'] },

    // Frameworks & web
    { id: 'react',  name: 'React',          cat: 'web', logo: 'react',  brand: '#61DAFB' },
    { id: 'nextjs', name: 'Next.js',        cat: 'web', logo: 'nextjs', brand: '#FFFFFF', dark: true },
    { id: 'maui',   name: '.NET / .NET MAUI', cat: 'web', logo: 'dotnet', brand: '#512BD4' },
    { id: 'php',    name: 'PHP',            cat: 'web', logo: 'php',    brand: '#777BB4' },
    { id: 'html5',  name: 'HTML5',          cat: 'web', logo: 'html5',  brand: '#E34F26' },
    { id: 'css3',   name: 'CSS3',           cat: 'web', logo: 'css3',   brand: '#1572B6', note: 'Every web UI, including this site', rel: ['xeleqt', 'internship'] },
    { id: 'xaml',   name: 'XAML',           cat: 'web', glyph: 'xaml' },

    // Databases
    { id: 'mysql',      name: 'MySQL',      cat: 'db', logo: 'mysql',      brand: '#4479A1', dark: true },
    { id: 'mongodb',    name: 'MongoDB',    cat: 'db', logo: 'mongodb',    brand: '#47A248' },
    { id: 'phpmyadmin', name: 'phpMyAdmin', cat: 'db', logo: 'phpmyadmin', brand: '#6C78AF', note: 'MySQL administration', rel: ['xeleqt'] },

    // Hardware & IoT
    { id: 'esp32',           name: 'ESP32',           cat: 'hw', logo: 'espressif',       brand: '#E7352C' },
    { id: 'pic',             name: 'PIC16F877A',      cat: 'hw', glyph: 'dip' },
    { id: 'arduino',         name: 'Arduino',         cat: 'hw', logo: 'arduino',         brand: '#00979D', note: 'Robotics and sensor prototyping' },
    { id: 'adafruit',        name: 'Adafruit IO',     cat: 'hw', logo: 'adafruit',        brand: '#C9C9C9', dark: true },
    { id: 'googleassistant', name: 'Google Assistant',cat: 'hw', logo: 'googleassistant', brand: '#4285F4' },
    { id: 'fpga',            name: 'FPGA',            cat: 'hw', glyph: 'fpga' },
    { id: 'pcb',             name: 'PCB Design',      cat: 'hw', glyph: 'pcb' },

    // Mobile & platforms
    { id: 'android', name: 'Android', cat: 'plat', logo: 'android', brand: '#3DDC84' },
    { id: 'windows', name: 'Windows', cat: 'plat', logo: 'windows', brand: '#0078D4', note: "Frontline support at the Registrar's Office", rel: ['internship'] },

    // Tools
    { id: 'git',          name: 'Git',           cat: 'tools', logo: 'git',          brand: '#F05032', note: 'Version control across software projects' },
    { id: 'github',       name: 'GitHub',        cat: 'tools', logo: 'github',       brand: '#FFFFFF', dark: true, note: 'Code hosting and collaboration' },
    { id: 'vscode',       name: 'VS Code',       cat: 'tools', logo: 'vscode',       brand: '#007ACC', note: 'Web and firmware development', rel: ['xeleqt', 'smarthome'] },
    { id: 'visualstudio', name: 'Visual Studio', cat: 'tools', logo: 'visualstudio', brand: '#5C2D91', note: '.NET MAUI app development', rel: ['internship', 'jeepney', 'trades'] },
    { id: 'mplab',        name: 'MPLAB',         cat: 'tools', glyph: 'mplab', rel: ['ballsort'] },
    { id: 'arduinoide',   name: 'Arduino IDE',   cat: 'tools', logo: 'arduino',      brand: '#00979D', note: 'Robotics and sensor prototyping' },
    { id: 'matlab',       name: 'MATLAB',        cat: 'tools', logo: 'matlab',       brand: '#E16737', note: 'Engineering coursework' },
    { id: 'xampp',        name: 'XAMPP',         cat: 'tools', logo: 'xampp',        brand: '#FB7A24', note: 'Local PHP and MySQL stack', rel: ['xeleqt'] },
    { id: 'word',         name: 'Microsoft Word',  cat: 'tools', logo: 'word',       brand: '#2B579A', note: "Registrar's Office documents" },
    { id: 'excel',        name: 'Microsoft Excel', cat: 'tools', logo: 'excel',      brand: '#217346', note: "Registrar's Office records and data checks" },

    // QA
    { id: 'functional', name: 'Functional Testing', cat: 'qa', glyph: 'checkCircle' },
    { id: 'system',     name: 'System Testing',     cat: 'qa', glyph: 'layers', rel: ['xeleqt'] },
    { id: 'defects',    name: 'Defect Reporting',   cat: 'qa', glyph: 'bug', rel: ['xeleqt'] },
    { id: 'validation', name: 'Validation',         cat: 'qa', glyph: 'shield' },

    // Soft skills
    { id: 'communication', name: 'Client Communication', cat: 'soft', glyph: 'message', note: "Explaining tech fixes to Registrar's Office staff and clients" },
    { id: 'time',          name: 'Time Management',      cat: 'soft', glyph: 'clock',   note: '4+ years of work alongside full-time studies' },
    { id: 'detail',        name: 'Attention to Detail',  cat: 'soft', glyph: 'zoom',    note: 'Data validation and QA testing', rel: ['xeleqt'] },
    { id: 'research',      name: 'Research & Analysis',  cat: 'soft', glyph: 'chart',   note: 'Approved thesis: mixed-methods study with consensus and Pareto analysis' }
  ],

  /* Easter egg: Recycle Bin → bugs_i_fixed.txt */
  bugs: [
    ['FIXED',   'BUG-001', 'Office printer "offline". Root cause: unplugged. Time to fix: 4 seconds.'],
    ['FIXED',   'BUG-002', 'Robot sorted every ball as red. Recalibrated the color sensor thresholds.'],
    ['FIXED',   'BUG-003', 'Smart streetlights switched on at noon. Inverted light threshold.'],
    ['FIXED',   'BUG-004', 'Alarm clock counted to 60 minutes and 1 second. Off-by-one in the counter.'],
    ['FIXED',   'BUG-005', 'Sumobot fled the ring instead of pushing. Swapped motor polarity.'],
    ['FIXED',   'BUG-006', 'Form accepted a date of 31 February. Added validation.'],
    ['WONTFIX', 'BUG-007', 'Coffee supply runs out during finals week.'],
    ['OPEN',    'BUG-008', 'Not yet hired by your team. Workaround: open Contact.mail.']
  ]
};
