export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
}

export interface ProjectProps {
  id: string;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  componentId?: string;
}

export interface EventData {
  id: string;
  title: string;
  date?: string;
  description: string;
  images?: string[];
  details?: string[];
}

export interface WebsiteEmbedProps {
  url: string;
  title: string;
  isActive: boolean;
  allowScrolling?: boolean;
}

export interface RealEyesEventData {
  id: string;
  title: string;
  date?: string;
  location?: string;
  description: string;
  longDescription?: string;
  lineup?: string[];
  hardFacts?: Record<string, string>;
  highlights?: string[];
  links?: string[];
  bannerImage: string;
  hasGallery: boolean;
  hasVideo?: boolean;
  videoFile?: string;
  specialImages?: string[]; // For impression images in Real Eyes 9
  tabStructure: 'single' | 'double' | 'triple'; // single = just event, double = event + gallery, triple = event + gallery + video
}

// Real Eyes Events Data
export const REAL_EYES_EVENTS: RealEyesEventData[] = [
  {
    id: 'real-eyes-1',
    title: 'Real Eyes 1 - The First',
    date: 'June 16, 2017',
    location: 'Aux Gazelles Vienna',
    description: 'Our first real eyes event was proper ritual. We had a crazy line-up of artists.',
    longDescription: `In Collaboration with FOMP

Our first real eyes event was proper ritual. We had a crazy line-up of artists. Geo Popoff as a beatboxer, who went on to win countless beatbox world championships, or DemoLux and Selbstlaut, two underground rappers of Austria. Mieze Medusa, a genius poetry-slammer. We had Tehace, who now gigs more DnB events than I visited events, or Martin Schlemmer who went on to audiosupport numerous ears with techno at his own or hosted events. With EC who never released a track (still I believe) but has rocked numerous stages with or without the femme hip hip collective she participated in. Karim, my old friend who now is keeping our streets safe. All while my father doing the wardrobe, as having been one of the first rappers in the country. A wild mix of people. But that shows how much individual talent and histories our city has to offer.`,
    lineup: [
      'Karim Juma (Vinyl & Digital)',
      'Tehace (Vinyl & Digital)',
      'Martin Schlemmer (Digital)',
      'EC',
      'Rap H.',
      'ADMC (Host)',
      'Phii Lex',
      'Osiris',
      'Geo popoff (AUT Loop Champion 2017)',
      'DemoLux & Selbstlaut',
      'Fabian Navarro & Alice Reichmann',
      'Mieze Medusa (Host)',
    ],
    highlights: [
      '5 elements of hip hop (djing, mcing, bboying, graffiti, knowledge)',
      'Beatboxing',
      'Visual Show (360 degree)',
      'Food Packages',
      'Poetry Slam Special: Rappers VS Slammers',
    ],
    hardFacts: {
      Location: 'Rahlgasse 5, 1060 Wien (U2 MQ, U3 Volkstheater)',
      Age: 'Strictly 18+ (please take ID with you)',
      'Entry Poetry-Slam': '6€ (20-22h)',
      'Entry Poetry-Slam and Clubbing': '14€',
      'Entry Clubbing only': '10€',
      'Food Package': '12€ + entry fee (Moroccan Tajine Plate)',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 1/banner.jpg',
    hasGallery: true,
    tabStructure: 'double',
  },
  {
    id: 'real-eyes-2',
    title: 'Real Eyes 2 - Rap, Poetry & Burgers',
    date: 'June 20, 2017',
    location: 'Fluc Vienna',
    description:
      "The next edition wasn't that far away. Again partnering with FOMP, but this time more intense.",
    longDescription: `Again partnering with FOMP, but this time more intense. Again with our resident DJ Line Up of Karim, Tehace and Martin Schlemmer and Geo Popoff beatboxing. This time we featured then still younger talent Palavra, Abstract Dot, EC, Brix and Osiris, who I initially scouted at a rap showcase event at B72. And with a more veteran support of Selbstlaut and DemoLux. Who battled Alice Reichmann and Nano Miratus as poetry slammers. Rap vs Poetry Slam Battle V2. Hosted by Jonas Scheiner & Henrik Szanto.

"Sie stehen für Peace, Love und Unity und wehren sich gegen Hass, Sexismus, Rassismus, Bling Bling und Mumble Rap."
Wir mögen laut. Wir mögen deutlich. Ein bisschen alte Schule, ein bisschen Blick nach vorn und dazu Platten, die du noch nie gehört hast - das ist REAL EYES.
Wiens neueste Hip-Hop Partyreihe vereint diverse Ansprüche, die sich bündeln und vor allem eines hervorbringen: knowledge.

Bei der Summer-Session "Rap, Poetry & Burgers" brutzelten wir auf der Terrasse des Fluc knusprige Burger. Wir hatten Fleisch. Wir hatten Veggie. Wir hatten Greens. Garniert mit Coleslaw und Sonne.`,
    lineup: [
      'EC',
      'Abstract D.O.T',
      'Samira Dezaki',
      'Osiris Bandolero',
      'Palavra',
      'BRIX',
      'Selbstlaut',
      'DemoLux',
      'Alice Reichmann',
      'Nano Miratus',
      'Geo popoff (Austria Loop Champion 2017)',
      'Karim Juma (DJ-Set)',
      'Tehace (DJ-Set)',
      'Martin Schlemmer (DJ-Set)',
      'Henrik Szanto & Jonas Scheiner (Hosts)',
    ],
    hardFacts: {
      Location: 'Fluc (oben)',
      VVK: '6€ (wienXtra - Soundbase)',
      'Entry before 23:00': '6€',
      'Entry after 23:00': '8€',
      BBQ: 'Selbstgemachte Burger (carni, veggie, vegan)',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 2/banner.jpg',
    hasGallery: true,
    hasVideo: true,
    videoFile: '/projects/real-eyes-content/Real Eyes 2/Aftervideo/realeyes.mp4',
    tabStructure: 'triple',
  },
  {
    id: 'real-eyes-3',
    title: 'Real Eyes 3 - Relentless & Hech Rhymes',
    date: 'October 14, 2017',
    location: 'Prime Club Vienna',
    description: 'REAL EYES geht in die dritte Runde. Unser Motto: Back to the golden age!',
    longDescription: `REAL EYES geht in die dritte Runde. Unser Motto: Back to the golden age!
Dafür haben wir uns erlaubt 2 underrated MC's aus den USA zu holen, namely Relentless & Hech Rhymes.

Supporting an artistic endeavor to uphold the truth in our society, Relentless will greet you with a vivid and versatile repertoire; he is a Lynn, Massachusetts bred MC with plenty of vigor. Influenced by the golden era of hip hop, Relentless is a zealous and raw East Coast-based MC/producer powerhouse combo. His youth was spent immersed in the sounds of Wu-Tang, Rakim, Kool G Rap, Boot Camp Clik, A Tribe Called Quest, and TuPac.

Die Bostoner Rapperin Hech Rhymes: "Her slicing flows on the track remind me of watermelon being evenly julienned in a game of Fruit Ninja with the most pristine golden sword. Its refreshing to see an artist just have FUN on her tracks, singing and doing live breakdowns like on "Minimum Rage" and "Got Gifted"."`,
    lineup: [
      'Relentless (Massachusetts)',
      'Hech Rhymes (Boston)',
      'MC EC',
      'Rezurec (Brooklyn)',
      'Karim Juma (DJ)',
      'Tehace (DJ)',
    ],
    hardFacts: {
      Location: 'Prime Club, Salzgries 4, 1010 Wien',
      Date: '14.10.2017',
      Entry: '22:00',
      Show: '00:00',
      'Tickets AK': '12€ (Limitiert)',
    },
    links: [
      'https://relentlessthetangible1.bandcamp.com',
      'https://hechrhymes.bandcamp.com/releases',
    ],
    bannerImage: '/projects/real-eyes-content/Real Eyes 3/banner.jpg',
    hasGallery: true,
    tabStructure: 'double',
  },
  {
    id: 'real-eyes-4',
    title: 'Real Eyes 4 - Edo G',
    date: 'March 30, 2018',
    location: 'Opera Club Vienna',
    description:
      'Der legendäre Bostoner MC Edo G, oder Ed O.G. begann seine Karriere 1986, mit nur 15 Jahren.',
    longDescription: `Der legendäre Bostoner MC Edo G, oder Ed O.G. begann seine Karriere 1986, mit nur 15 Jahren. Wenige Jahre später veröffentlichte er sein erstes Album "Life of a kid in the Ghetto" mit der neu formierten Gruppe "Ed O.G. and Da Bulldogs".

Mittlerweile hat Edo G sechs Solo-Alben, 8 Collaborations-Alben und ist über 25 Jahre im Game - sein Status ist unumstritten. Einerseits wegen seinen treffenden sozialkritischen Kommentaren, realitätsnahen Texten und knackigen Rhymes, andererseits weil er großen Namen der Rap-Szene kooperiert hat wie: DJ Premiere, Pete Rock, RZA, KRS One, Common, Black Thought, Masta Ace, Guru, Sean Price, Reks, Sadat X (Brand Nubian), Marco Polo uvm.

In anderen Worten, er ist ein Urgestein der amerikanischen Rap-Szene und wird nicht grundlos auf medium.com mit den Worten: "the single-most impactful and respected hip-hop artist to ever represent Boston — and he's never left." beschrieben.`,
    lineup: [
      'EDO G (Boston)',
      'Fokis (New York)',
      'Bakari J.B. (Boston)',
      'Hamorabi (Lebanon/France)',
      'DJ Takonedoe',
      'DJ Karim Juma',
      'Martin Schlemmer',
    ],
    hardFacts: {
      Location: 'Opera Club, Mahlerstraße 11, 1010 Wien',
      Einlass: '21:00',
      AK: '15€',
    },
    links: ['http://ed-og.com/', 'https://en.wikipedia.org/wiki/Ed_O.G.'],
    bannerImage: '/projects/real-eyes-content/Real Eyes 4/banner.jpg',
    hasGallery: true,
    tabStructure: 'double',
  },
  {
    id: 'real-eyes-5',
    title: 'Real Eyes 5 - REKS & Lucky Dice',
    date: 'June 1, 2018',
    location: 'Opera Club Vienna',
    description: 'Corey Isiah Christie, better known by his stage name REKS is a Boston rapper.',
    longDescription: `Corey Isiah Christie, better known by his stage name REKS is a Boston rapper. His albums Along Came The Chosen (2001, Landspeed Records) and Grey Hairs (2008, Showoff Records) were both released to general acclaim in the hip hop community. His debut featured hip hop musicians including Young Zee, Ed OG, J-Live and 7L while his second album featured DJ Premier, Large Professor, Skyzoo, Big Shug, Termanology, Krumbsnatcha and was mostly produced by Statik Selektah.

Boston Hip-Hop mainstay Lucky Dice has been a force in his hometown's scene for more than two decades, dropping a slew of notable mixtapes, singles, and guest features. And with 'M.O.S.A. (Memoirs of a Starving Artist),' he channels his experience and discerning talents into a passionately crafted project that serves as his proper debut album.`,
    lineup: [
      'REKS (Boston)',
      'Lucky Dice (Boston)',
      'Huhn Mensch (Heiße Luft)',
      'HipHop Joshy (Heiße Luft)',
      'dj takonedoe (Lowtech Records)',
      'Karim Juma',
    ],
    hardFacts: {
      Date: '1.6.2018',
      Location: 'Opera Club, Mahlerstraße 11, 1010 Wien',
      Start: '22:00',
      VVK: '15€',
      AK: '18€',
    },
    links: [
      'https://open.spotify.com/artist/6Apw0ReFBi9C1QBultw8pn',
      'https://soundcloud.com/lucky-dice-music',
    ],
    bannerImage: '/projects/real-eyes-content/Real Eyes 5/banner.jpg',
    hasGallery: true,
    tabStructure: 'double',
  },
  {
    id: 'real-eyes-6',
    title: 'Real Eyes 6 - Recognize Your Power Tour',
    date: 'June 2019',
    location: 'Fluc Wanne Vienna',
    description:
      'EDO G (Boston, US), RAS KASS (Los Angeles, US), SHABAAM SAHDEEQ (NY, US), FOKIS (NY, US)',
    longDescription: `real eyes presents: RECOGNIZE YOUR POWER TOUR

EDO G (Boston, US) - Der legendäre Bostoner MC Edo G, oder Ed O.G. begann seine Karriere 1986, mit nur 15 Jahren. Mittlerweile hat Edo G sechs Solo-Alben, 8 Collaborations-Alben und ist über 25 Jahre im Game - sein Status ist unumstritten.

RAS KASS (Los Angeles, US) - Ras Kass ist nicht aus dem Hip-Hop Universum wegzudenken. Seit den 1990ern veröffentlicht er stetig neue Alben oder hat Guest Appearances und die Liste der Kollaborationen ist endlos: RZA, Dr. Dre, DJ Premier, Kendrick Lamar, Pete Rock, Talib Kweli, Nas, Lauryn Hill, Killah Priest, Nate Dogg, Easy Mo Bee, Canibus, Kurupt, Xzibit, Saafir, Chino XL, Organized Konfusion, Twista, Mack 10, Hi-Tek, Ice-T.

SHABAAM SAHDEEQ (NY, US) - Shabaam Sahdeeq erreichte Bekanntheit über seine Arbeit mit Rawkus Records, Baby Grande Records und mit Artists wie Eminem, Busta Rhymes, Mos Def, Common, Redman und Method Man, sowie mit seiner Gruppe "Polyrhythm Addicts".

FOKIS (NY, US) - Fokis ist ein Producer und Rapper aus Brooklyn New York. Er hat bereits für Artists wie Fat Joe, Slaughterhouse, Skyzoo, Torae, Dres, N.O.R.E, Kool G Rap, Brand Nubian, Chi-Ali, Mic Geranimo, Bubba Sparxx, Rahsaan Patterson, Edo G, Ras Kass und Shabaam Sahdeeq produziert.`,
    lineup: [
      'EDO G (Boston)',
      'RAS KASS (Los Angeles)',
      'SHABAAM SAHDEEQ (New York)',
      'FOKIS (New York)',
      'DJ Illegal (Snowgoons)',
      'DJ Rawmatik (Kriminal Beats)',
      'DJ Takonedoe (Lowtechrecords)',
      'Karim Juma',
      'Tehace',
    ],
    hardFacts: {
      Location: 'Fluc Wanne, Praterstern 5',
      VVK: '12€ bei wienXtra-jugendinfo, Babenbergerstraße 1',
      AK: '16€',
    },
    links: [
      'https://en.wikipedia.org/wiki/Ed_O.G.',
      'https://raskass.bandcamp.com/',
      'https://shabaamsahdeeq.bandcamp.com/',
    ],
    bannerImage: '/projects/real-eyes-content/Real Eyes 6/banner.jpg',
    hasGallery: true,
    tabStructure: 'double',
  },
  {
    id: 'real-eyes-7',
    title: 'Real Eyes 7 - A.G. & Chi Ali',
    date: 'April 2019',
    location: 'Fluc + Fluc Wanne Vienna',
    description:
      'Female MC Power aus Wien, welche wie direkt aus den USA importiert klingt und massenweise Eastcoast Rap in Form der Rapkoryphäe A.G (Showbiz & A.G.) aus der BRONX.',
    longDescription: `DJ/MC Soulcat E-Phife, real eyes und fluc + fluc wanne präsentieren:

Längst ist Wien in Österreich ein *Melting Pot* für Hip-Hop Connaisseure & -innen sowie internationale und nationale Rap Acts geworden. Daher lassen wir, sowie viele andere Veranstalter, keinen Monat vergehen an dem es nicht heißt: Graffiti, Breakdance, Rap & DJing! Im April laden wir euch deshalb zu einem Konzert ein, dass es in dieser Form selten zu sehen gibt - Female MC Power aus Wien, welche wie direkt aus den USA importiert klingt und massenweise Eastcoast Rap in Form der Rapkoryphäe A.G (Showbiz & A.G.) aus der BRONX, seinerseits Teil des New Yorker Hip Hop Kollektivs DITC (Diggin' in the Crates), welches auch klingende Namen wie Diamond Ditc (produzierte das zweite Fugees Album "The Score" mit), Lord Finesse oder den bereits verstorbenen "Devil's Son" Big L 139 beheimatet.

Zusätzlich beehrt uns US-Rapper Chi Ali (Native Tongues Mitglied, neben legendären Pionieren wie A Tribe Called Quest, De La Soul, Mos Def und Queen Latifah) - sein erster Besuch in Europa und Wien - mit im Gepäck für die "Back 4 Da First Time Tour" hat er Al Tejeda und Fokis.

Die routinierte Rapperin & DJ/Produzentin Soulcat E-Phife wird euch vor A.G's Live Band Champion Sound mit ihrer im April neu erscheinenden EP "Prepare for Warfare" einheizen, welche ihrem straighten, souligen, jedoch auch toughen und 90er-haften Sound allemal gerecht wird.`,
    lineup: [
      'AG (DITC) & Champion Sound',
      'DJ/MC Soulcat E-Phife (Soulcatmusiq) w/ DJane Duff Daddy (beide FEMME DMC)',
      'Chi Ali (Native Tongues Posse)',
      'Al Tejeda (Shadez Of Brooklyn)',
      'Fokis (Loyalty Digital Corp.)',
      'Rawmatik (DJ)',
    ],
    hardFacts: {
      Location: 'wienXtra-jugendinfo, 1. Babenbergerstraße 1/Ecke Burgring',
      Öffnungszeiten: 'Mo-Fr 14:30-18:30',
      Erreichbarkeit: 'Straßenbahn 1, 2, D (Station Burgring), U2 (Station Museumsquartier)',
      VVK: '13€',
      AK: '15€',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 7/banner.jpg',
    hasGallery: false,
    tabStructure: 'single',
  },
  {
    id: 'real-eyes-8',
    title: 'Real Eyes 8 - SMIF N WESSUN',
    date: '2019',
    location: 'Vienna',
    description: '808Factory proudly presents SMIF N WESSUN',
    longDescription: `808Factory proudly presents SMIF N WESSUN

Representing Brownsville & Bed Stuy Brooklyn, rap duo Smif-N-Wessun, Tek and Steele, first appeared on Black Moon's debut album Enta Da Stage in 1993. Adding relentless rhymes to tracks "U da Man" and "Black Smif N' Wessun," the pair paved the way for the Brooklyn Supergroup Boot Camp Clik.

Smif-N-Wessun released their classic debut Dah Shinin' January 10, 1995 on Nervous Records. The album was noted for its hardcore lyrical content and gritty production, handled by Da Beatminerz production crew and was selected as one of The Source's 100 Best Rap Albums of all time.

After receiving a cease and desist letter from Smith & Wesson firearm company, the duo rebranded themselves Cocoa Brovaz in 1996. Under this new moniker, they released their second album The Rude Awakening.

In late 2005 they reactivated their original moniker and released Smif-N-Wessun: Reloaded. They followed that with Smif-N-Wessun: The Album, two years later. In 2011, they collaborated with hip-hop legend Pete Rock on the album Monumental, which also featured guest spots from Styles P, Memphis Bleek, Raekwon, Bun B and others. In late 2013, they drew on their reggae influences for the EP Born and Raised that included contributions from Jahdan Blakkamoore and Junior Reid, among others. The duo's seventh album The ALL was released in 2019 produced by 9th Wonder & The Soul Council.`,
    hardFacts: {
      Doors: '19:00',
      Show: '20:30',
      VVK: '24€',
      AK: '30€',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 8/banner.jpg',
    hasGallery: false,
    tabStructure: 'single',
  },
  {
    id: 'real-eyes-9',
    title: 'Real Eyes 9 - REKS, FAYN & AYE-SIGHT',
    date: 'September 12, 2022',
    location: 'Fluc Vienna',
    description:
      'After thirteen albums and several mixtapes and singles under his belt, REKS has become one of the most consistent independent hip-hop artists internationally.',
    longDescription: `real eyes presents: REKS (USA), FAYN (USA), AYE-SIGHT (AT) live

After thirteen albums and several mixtapes and singles under his belt, REKS has become one of the most consistent independent hip-hop artists internationally. Since his debut two decades ago, he is renowned for creating high quality, sanitized rap music with his muscular vocal delivery, dexterous wordplay, and gritty street-oriented lyricism.

REKS is coming back to Vienna to cool our minds with rhymes at the end of summer. Make sure to get your limited tickets in time!

It is advised to arrive before 20:30. Out of respect to our guests who need to work on the next day, we are going to start the show strictly at 21:00 and close the event at 23:00.`,
    lineup: ['REKS (USA)', 'FAYN (USA)', 'AYE-SIGHT (AT)'],
    hardFacts: {
      Date: '12. September 2022',
      Location: 'Fluc Vienna, Praterstern 5, 1020',
      Entry: '20:00',
      Show: '21:00 (on time!)',
      End: '23:00',
      Presale: '17€',
      Doors: '20€',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 9/banner.jpg',
    hasGallery: false,
    specialImages: [
      '/projects/real-eyes-content/Real Eyes 9/1-impression.jpg',
      '/projects/real-eyes-content/Real Eyes 9/2-impression.jpg',
      '/projects/real-eyes-content/Real Eyes 9/3-impression.jpg',
      '/projects/real-eyes-content/Real Eyes 9/4-impression.jpg',
    ],
    tabStructure: 'single',
  },
  {
    id: 'real-eyes-10',
    title: 'Real Eyes 10 - Edo G Return',
    date: 'June 1, 2024',
    location: 'B72 Vienna',
    description:
      'Am Samstag 1.6 geht es weiter mit Rap am Bogen !! Da wir im Juni 1 Jahr alt werden, haben wir einen ganz besonderen Gast.',
    longDescription: `Am Samstag 1.6 geht es weiter mit Rap am Bogen !! Da wir im Juni 1 Jahr alt werden, haben wir einen ganz besonderen Gast.

Der legendäre Bostoner MC Edo G, oder Ed O.G. begann seine Karriere 1986, mit nur 15 Jahren. Wenige Jahre später veröffentlichte er sein erstes Album "Life of a kid in the Ghetto" mit der neu formierten Gruppe "Ed O.G. and Da Bulldogs".

Mittlerweile hat Edo G zahlreiche Solo-Alben und Collaborations-Alben veröffentlicht und ist seit bald 40 Jahren im Game - sein Status ist unumstritten. Einerseits wegen seinen treffenden sozialkritischen Kommentaren, realitätsnahen Texten und knackigen Rhymes, andererseits weil er großen Namen der Rap-Szene kooperiert hat wie: DJ Premiere, Pete Rock, RZA, KRS One, Common, Black Thought, Masta Ace, Guru, Sean Price, Reks, Sadat X (Brand Nubian), Marco Polo uvm.

In anderen Worten, er ist ein Urgestein der amerikanischen Rap-Szene und wird nicht grundlos auf medium.com mit den Worten: "the single-most impactful and respected hip-hop artist to ever represent Boston — and he's never left." beschrieben.`,
    lineup: ['Edo G (Boston)', 'Kitana', 'Mo-Cess', 'Franz Rasta', 'MC-Waked'],
    hardFacts: {
      Date: '1. Juni, Samstag',
      Location: 'B72, Hernalser Gürtel 72-73, 1080 Wien',
      Einlass: '19:00',
      Show: '20:00',
      Presale: '19€',
      Doors: '25€',
    },
    bannerImage: '/projects/real-eyes-content/Real Eyes 10/banner.jpg',
    hasGallery: false,
    tabStructure: 'single',
  },
];

// Site-specific loading and CSP configurations
export interface SiteCSPConfig {
  frameAncestors?: string[] | 'none' | 'self' | '*';
  allowedOrigins?: string[];
  bypassCSP?: boolean;
  useProxy?: boolean;
  proxyEndpoint?: string;
  customHeaders?: Record<string, string>;
}

export interface SiteLoadingStrategy {
  method: 'direct' | 'proxy' | 'fallback' | 'screenshot';
  timeout: number;
  retryCount: number;
  retryDelay: number;
  enablePreconnect: boolean;
  cacheBusting?: boolean;
  rateLimit?: {
    enabled: boolean;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
}

export interface SiteSandboxConfig {
  allowScripts: boolean;
  allowSameOrigin: boolean;
  allowForms: boolean;
  allowPopups: boolean;
  allowFullscreen: boolean;
  allowDownloads: boolean;
  allowModals: boolean;
  allowTopNavigation: boolean;
  strictMode: boolean;
}

export interface SiteConfig {
  url: string;
  title: string;
  csp: SiteCSPConfig;
  loading: SiteLoadingStrategy;
  sandbox: SiteSandboxConfig;
  fallbackContent?: {
    type: 'screenshot' | 'description' | 'redirect';
    content: string;
  };
}
