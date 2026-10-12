export type Caption = { start: number; end: number; text: string; highlight?: string; serviceId?: string; automationIds?: number[]; emphasis?: string[] };
export type Chapter = { id: string; title: string; src: string; duration: number; offset: number; choiceAt?: number; captions: Caption[] };

// October 12 recording: spoken Continue/Skip instruction, then the intro choice popup.
export const CHAPTERS: Chapter[] = [
  {
    "id": "top",
    "title": "Introduction",
    "src": "/audio/laura/intro-with-choice-20261012.mp3",
    "duration": 12.009,
    "offset": 0,
    "captions": [
      {
        "text": "Hi, I’m Laura, Fahad’s virtual assistant.",
        "emphasis": [
          "Laura"
        ],
        "start": 0,
        "end": 3.78
      },
      {
        "text": "Let’s explore how we can help your business",
        "start": 3.78,
        "end": 5.58
      },
      {
        "text": "save time and attract more customers.",
        "emphasis": [
          "save time",
          "attract more customers"
        ],
        "start": 5.58,
        "end": 7.98
      },
      {
        "text": "Choose Continue tour for a quick look around,",
        "emphasis": [
          "Continue tour"
        ],
        "start": 7.98,
        "end": 10.109
      },
      {
        "text": "or Skip to explore on your own.",
        "emphasis": [
          "Skip"
        ],
        "start": 10.109,
        "end": 12.009
      }
    ]
  },
  {
    "id": "services",
    "title": "Services",
    "src": "/audio/laura/services-20261012.mp3",
    "duration": 20.392,
    "offset": 12.009,
    "captions": [
      {
        "text": "We build websites",
        "serviceId": "websites",
        "emphasis": [
          "websites"
        ],
        "start": 0,
        "end": 1.391
      },
      {
        "text": "and mobile apps",
        "serviceId": "apps",
        "emphasis": [
          "mobile apps"
        ],
        "start": 1.391,
        "end": 2.471
      },
      {
        "text": "that help turn visitors into customers.",
        "emphasis": [
          "visitors into customers"
        ],
        "start": 2.471,
        "end": 5.111
      },
      {
        "text": "Business automation",
        "serviceId": "automation",
        "emphasis": [
          "Business automation"
        ],
        "start": 5.111,
        "end": 5.851
      },
      {
        "text": "and custom CRM and ERP systems",
        "serviceId": "crm",
        "emphasis": [
          "CRM",
          "ERP"
        ],
        "start": 5.851,
        "end": 8.431
      },
      {
        "text": "make daily work easier.",
        "emphasis": [
          "daily work easier"
        ],
        "start": 8.431,
        "end": 11.311
      },
      {
        "text": "We also offer digital marketing,",
        "serviceId": "marketing",
        "emphasis": [
          "digital marketing"
        ],
        "start": 11.311,
        "end": 13.151
      },
      {
        "text": "UI and UX design,",
        "serviceId": "design",
        "emphasis": [
          "UI and UX design"
        ],
        "start": 13.151,
        "end": 14.791
      },
      {
        "text": "search engine optimization,",
        "serviceId": "seo",
        "emphasis": [
          "search engine optimization"
        ],
        "start": 14.791,
        "end": 15.751
      },
      {
        "text": "and website maintenance—",
        "serviceId": "maintenance",
        "emphasis": [
          "website maintenance"
        ],
        "start": 15.751,
        "end": 17.171
      },
      {
        "text": "to help your business grow and keep things running smoothly.",
        "emphasis": [
          "business grow",
          "running smoothly"
        ],
        "start": 17.171,
        "end": 20.392
      }
    ]
  },
  {
    "id": "work",
    "title": "Featured projects",
    "src": "/audio/laura/work-20261012.mp3",
    "duration": 27.926,
    "offset": 32.401,
    "captions": [
      {
        "text": "Before choosing someone to build for your business,",
        "start": 0,
        "end": 2.919
      },
      {
        "text": "you’ll want to see their work.",
        "start": 2.919,
        "end": 4.439
      },
      {
        "text": "Here are seven featured projects.",
        "emphasis": [
          "seven featured projects"
        ],
        "start": 4.439,
        "end": 6.759
      },
      {
        "text": "Infix Malta.",
        "highlight": "infix",
        "emphasis": [
          "Infix Malta"
        ],
        "start": 6.759,
        "end": 8.499
      },
      {
        "text": "Kendor Textiles.",
        "highlight": "kendor",
        "emphasis": [
          "Kendor Textiles"
        ],
        "start": 8.499,
        "end": 10.046
      },
      {
        "text": "ONREAL.",
        "highlight": "onereal",
        "emphasis": [
          "ONREAL"
        ],
        "start": 10.046,
        "end": 11.379
      },
      {
        "text": "Rent the Campbell.",
        "highlight": "campbell",
        "emphasis": [
          "Rent the Campbell"
        ],
        "start": 11.379,
        "end": 12.879
      },
      {
        "text": "Reliance Supermarket.",
        "highlight": "reliance",
        "emphasis": [
          "Reliance Supermarket"
        ],
        "start": 12.879,
        "end": 14.499
      },
      {
        "text": "Smiles Wallet.",
        "highlight": "smiles",
        "emphasis": [
          "Smiles Wallet"
        ],
        "start": 14.499,
        "end": 15.714
      },
      {
        "text": "And BD Property.",
        "highlight": "bdproperty",
        "emphasis": [
          "BD Property"
        ],
        "start": 15.714,
        "end": 17.679
      },
      {
        "text": "Explore the cards to see the work involved,",
        "start": 17.679,
        "end": 19.759
      },
      {
        "text": "then visit the websites yourself.",
        "emphasis": [
          "visit the websites"
        ],
        "start": 19.759,
        "end": 21.359
      },
      {
        "text": "You’ll find more projects under Explore more work.",
        "emphasis": [
          "Explore more work"
        ],
        "start": 21.359,
        "end": 24.839
      },
      {
        "text": "Take your time.",
        "start": 24.839,
        "end": 25.799
      },
      {
        "text": "Choose a partner whose work gives you confidence.",
        "emphasis": [
          "confidence"
        ],
        "start": 25.799,
        "end": 27.926
      }
    ]
  },
  {
    "id": "automation-examples",
    "title": "Business automation",
    "src": "/audio/laura/automation-20261012.mp3",
    "duration": 35.262,
    "offset": 60.327,
    "captions": [
      {
        "text": "Think about the tasks your team repeats every day.",
        "emphasis": [
          "tasks your team repeats"
        ],
        "start": 0,
        "end": 3.573
      },
      {
        "text": "Answering product questions.",
        "automationIds": [
          0,
          1
        ],
        "emphasis": [
          "product questions"
        ],
        "start": 3.573,
        "end": 5.373
      },
      {
        "text": "Collecting orders.",
        "automationIds": [
          2
        ],
        "emphasis": [
          "Collecting orders"
        ],
        "start": 5.373,
        "end": 6.493
      },
      {
        "text": "Following up with leads.",
        "automationIds": [
          3,
          4
        ],
        "emphasis": [
          "Following up with leads"
        ],
        "start": 6.493,
        "end": 7.793
      },
      {
        "text": "Booking appointments.",
        "automationIds": [
          5
        ],
        "emphasis": [
          "Booking appointments"
        ],
        "start": 7.793,
        "end": 9.093
      },
      {
        "text": "Sending quotations",
        "automationIds": [
          6
        ],
        "emphasis": [
          "quotations"
        ],
        "start": 9.093,
        "end": 9.613
      },
      {
        "text": "and payment reminders.",
        "automationIds": [
          7
        ],
        "emphasis": [
          "payment reminders"
        ],
        "start": 9.613,
        "end": 10.753
      },
      {
        "text": "These are opportunities to save time",
        "emphasis": [
          "save time"
        ],
        "start": 10.753,
        "end": 13.561
      },
      {
        "text": "and keep customers moving forward.",
        "start": 13.561,
        "end": 16.013
      },
      {
        "text": "Automation can also send order updates,",
        "automationIds": [
          8
        ],
        "emphasis": [
          "order updates"
        ],
        "start": 16.013,
        "end": 18.173
      },
      {
        "text": "flag low inventory,",
        "automationIds": [
          13
        ],
        "emphasis": [
          "low inventory"
        ],
        "start": 18.173,
        "end": 19.673
      },
      {
        "text": "assign tasks,",
        "automationIds": [
          14
        ],
        "emphasis": [
          "assign tasks"
        ],
        "start": 19.673,
        "end": 20.933
      },
      {
        "text": "organise documents,",
        "automationIds": [
          15
        ],
        "emphasis": [
          "organise documents"
        ],
        "start": 20.933,
        "end": 21.573
      },
      {
        "text": "and prepare daily reports.",
        "automationIds": [
          17
        ],
        "emphasis": [
          "daily reports"
        ],
        "start": 21.573,
        "end": 23.913
      },
      {
        "text": "With less manual work and more consistent follow-up,",
        "emphasis": [
          "less manual work",
          "consistent follow-up"
        ],
        "start": 23.913,
        "end": 26.893
      },
      {
        "text": "your team can focus on customers, service, and growth.",
        "emphasis": [
          "customers",
          "growth"
        ],
        "start": 26.893,
        "end": 30.333
      },
      {
        "text": "We start by understanding your workflow,",
        "start": 30.333,
        "end": 32.373
      },
      {
        "text": "then identify where automation can make a useful difference.",
        "emphasis": [
          "useful difference"
        ],
        "start": 32.373,
        "end": 35.262
      }
    ]
  },
  {
    "id": "about",
    "title": "About",
    "src": "/audio/laura/about-20261012.mp3",
    "duration": 27.201,
    "offset": 95.589,
    "captions": [
      {
        "text": "Good results start with understanding your business.",
        "emphasis": [
          "understanding your business"
        ],
        "start": 0,
        "end": 3.451
      },
      {
        "text": "Behind this portfolio is a developer and entrepreneur",
        "emphasis": [
          "developer and entrepreneur"
        ],
        "start": 3.451,
        "end": 5.471
      },
      {
        "text": "based in Malta, working with clients worldwide.",
        "emphasis": [
          "Malta",
          "worldwide"
        ],
        "start": 5.471,
        "end": 9.131
      },
      {
        "text": "The approach combines design, development, and business thinking,",
        "emphasis": [
          "design",
          "development",
          "business thinking"
        ],
        "start": 9.131,
        "end": 12.348
      },
      {
        "text": "from your first idea through launch and ongoing support.",
        "emphasis": [
          "launch",
          "ongoing support"
        ],
        "start": 12.348,
        "end": 15.611
      },
      {
        "text": "You can expect a clear discussion of your needs,",
        "start": 15.611,
        "end": 18.073
      },
      {
        "text": "an agreed scope, and updates along the way.",
        "emphasis": [
          "agreed scope",
          "updates"
        ],
        "start": 18.073,
        "end": 20.991
      },
      {
        "text": "The goal is to build something useful, reliable,",
        "emphasis": [
          "useful",
          "reliable"
        ],
        "start": 20.991,
        "end": 24.331
      },
      {
        "text": "and right for the way you work.",
        "start": 24.331,
        "end": 27.201
      }
    ]
  },
  {
    "id": "contact",
    "title": "Let’s talk",
    "src": "/audio/laura/contact-20261012.mp3",
    "duration": 26.13,
    "offset": 122.79,
    "captions": [
      {
        "text": "What would you like to improve in your business?",
        "emphasis": [
          "improve"
        ],
        "start": 0,
        "end": 2.81
      },
      {
        "text": "Perhaps you need a new website,",
        "emphasis": [
          "new website"
        ],
        "start": 2.81,
        "end": 4.55
      },
      {
        "text": "a better app,",
        "emphasis": [
          "better app"
        ],
        "start": 4.55,
        "end": 5.406
      },
      {
        "text": "or a simpler way to handle everyday tasks.",
        "emphasis": [
          "simpler way"
        ],
        "start": 5.406,
        "end": 7.83
      },
      {
        "text": "Start with the short conversation below.",
        "emphasis": [
          "short conversation"
        ],
        "start": 7.83,
        "end": 10.63
      },
      {
        "text": "It asks for your name,",
        "emphasis": [
          "name"
        ],
        "start": 10.63,
        "end": 11.97
      },
      {
        "text": "email,",
        "emphasis": [
          "email"
        ],
        "start": 11.97,
        "end": 12.71
      },
      {
        "text": "phone number,",
        "emphasis": [
          "phone number"
        ],
        "start": 12.71,
        "end": 13.53
      },
      {
        "text": "WhatsApp availability,",
        "emphasis": [
          "WhatsApp"
        ],
        "start": 13.53,
        "end": 14.29
      },
      {
        "text": "and a little about your project.",
        "emphasis": [
          "your project"
        ],
        "start": 14.29,
        "end": 17.07
      },
      {
        "text": "Review your answers,",
        "emphasis": [
          "Review your answers"
        ],
        "start": 17.07,
        "end": 18.27
      },
      {
        "text": "then send your message when you’re ready.",
        "emphasis": [
          "send your message"
        ],
        "start": 18.27,
        "end": 20.57
      },
      {
        "text": "You don’t need all the answers today.",
        "start": 20.57,
        "end": 22.67
      },
      {
        "text": "Share your idea,",
        "emphasis": [
          "Share your idea"
        ],
        "start": 22.67,
        "end": 23.35
      },
      {
        "text": "and let’s work out a practical next step together.",
        "emphasis": [
          "next step together"
        ],
        "start": 23.35,
        "end": 26.13
      }
    ]
  }
];
