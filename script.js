let currentPage = 0;
let storyData = [];
let musicRanges = [];
let currentMusicIndex = -1;
let bookmarks = [];
let isAudioMuted = false;
let currentChapter = 1;
let glossaryData = {};
const pageAudio = new Audio();
pageAudio.loop = false;
let currentChapterData = null;
let fromChapterSelect = false;
let creditsScrollTimeout;
let creditsMusic = null; 
let homescreenMusic = null;
let isHomescreenMusicPlaying = false;
let homescreenInteractionListeners = [];
let chapterSelectMusic = null;
let isChapterSelectMusicPlaying = false;
let pageViewCount = 0;
let volumeDebugLog = [];

const bgMusic = new Audio("MUSIC/NEUTRAL/storytelling.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1;
pageAudio.volume = 1;

let isPlaying = false;

let originalBgVolume = 0.2;
let originalNarrationVolume = 0.9;
let currentNarrationSpeed = 1.0; 
let originalSfxVolume = 0.9;

let currentLanguage = 'tl'; 

const translations = {
  en: {

    titleImage: "Cover_Thumbnails/CoverPage/ENG Title.png", 
    backgroundGif: "Cover_Thumbnails/CoverPage/Cover-Page-Motion.gif", 

    startNow: "Start Now",
    chapterSelect: "Chapter Select",

    introTitle: "To the little ones,",
    introSubtitle: "seek your power and wield it,",
    beginStory: "Begin Story",

    dedTitle: "Hello there, dear reader!",
    dedSubtitle: "We courteously invite you to walk with us through the winding streets of the city, where three different children with hidden powers lived. Their strengths kept secret to themselves, unbeknownst to them. Read and choose how they go about their journeys, discovering their incredible abilities along the way and see how their stories intertwine. Who knows? Maybe in the end... You will find your superpowers too.",
    dedButton: "Continue",

    chapterSelectTitle: "Chapter Select",
    chapterSelectSubtitle: "Select a chapter to begin your adventure",
    chapter1Title: "Chapter 1:",
    chapter1Subtitle: "Lukas' Lightbulb",
    chapter2Title: "Chapter 2:",
    chapter2Subtitle: "Bea's Bubbles",
    chapter3Title: "Chapter 3:",
    chapter3Subtitle: "Sarah's Super Strength",
    backToMain: "Back to Main Menu",

    tutorialTitle: "Learn How to Use the Story",
    tutorialInstruction: "Hover over highlighted words to learn their meanings!",
    tutorialSampleText: "Welcome to the new interactive storybook tiled 'I Have Powers Too!'. Here we'll get to meet amazing characters and explore their incredibly rich stories.<br></br>To guide you on your journey, you can hover over the highlighted words to learn and understand <span class='glossary-word-highlight type-character' data-word='characters' data-definition='The people you will encounter throughout your journey, each with their own unique personalities.'>characters</span>, <span class='glossary-word-highlight type-location' data-word='locations' data-definition='The settings and places your characters will see and go.'>locations</span>, and <span class='glossary-word-highlight type-concept' data-word='concepts' data-definition='Tricky words that young readers might need a little help understanding.'>concepts</span>! Let these markers guide you as you embark on your journey!",
    tutorialHint: "✨ Try hovering over the colored words above! ✨",
    navigationTitle: "Story Navigation",
    navigationInstruction: "Hover over the icons to learn what they do!",
    tutorialIconsHint: "✨ Try hovering over the icons above! ✨",
    tutorialContinue: "Let's Go!",

    tooltipChapter: "Chapter Select - Choose a different chapter",
    tooltipHome: "Home - Return to the main menu",
    tooltipReplay: "Replay - Replay the Page Narration",
    tooltipBookmark: "Bookmark - Save your current page",
    tooltipInfo: "Information - Tutorial and Help details",
    tooltipSettings: "Settings - Adjust volume, font size, and more",
    tooltipAudio: "Audio Toggle - Turn sound on/off",

    settingsTitle: "Settings",
    informationTitle: "Information",
    bgMusicLabel: "Background Music Volume",
    narrationLabel: "Narration Volume",
    sfxLabel: "Sound Effects Volume",
    fontSizeLabel: "Font Size",
    autoplayLabel: "Autoplay Content",
    narrationSpeedLabel: "Narration Speed",
    languageLabel: "Language",
    clearBookmarksBtn: "Clear All Bookmarks",
    creditsBtn: "Show Credits",

    goToBookmarkBtn: "Go to Bookmark",
    bookmarksTitle: "My Bookmarks",
    addBookmarkBtn: "Add Current Page"
  },
  tl: {
    titleImage: "Cover_Thumbnails/CoverPage/FIL Title.png", 
    backgroundGif: "Cover_Thumbnails/CoverPage/Cover-Page-Motion.gif", 

    startNow: "Simulan Ngayon",
    chapterSelect: "Pumili ng Kabanata",

    introTitle: "Para sa mumunting mga bata",
    introSubtitle: "Hanapin niyo ang inyong lakas ng loob, tuklasin niyo ang inyong kapangyarihan,  at gamitin niyo ito para sa kabutihan.",
    beginStory: "Simulan ang Kuwento",

    dedTitle: "Kumusta, mahal naming mambabasa!",
    dedSubtitle: "Inaanyayahan ka naming maglakbay sa mga liku-likong kalsada ng barangay, kung saan may tatlong batang may natatagong kapangyarihan ang naninirahan. Lingid sa kanilang kaalaman, ang kanilang lakas ay lihim na itinatago maging sa kanilang sarili. Basahin at pumili kung paano nila tatahakin ang kanilang mga paglalakbay, tuklasin ang kanilang kahanga-hangang tapang, at saksihan kung paano nag-uugnay ang kanilang mga kuwento. Malay natin, baka sa huli, matuklasan mo rin ang iyong kapangyarihan!",
    dedButton: "Tumuloy",

    chapterSelectTitle: "Pumili ng Kabanata",
    chapterSelectSubtitle: "Pumili ng kabanata upang simulan ang inyong pakikipagsapalaran",
    chapter1Title: "Kabanata 1:",
    chapter1Subtitle: "Ang Bumbilya ni Lukas",
    chapter2Title: "Kabanata 2:",
    chapter2Subtitle: "Ang mga Bula ni Bea",
    chapter3Title: "Kabanata 3:",
    chapter3Subtitle: "Ang Matinding Lakas ni Sarah",
    backToMain: "Bumalik sa Pangunahing Menu",

    tutorialTitle: "Matutong Gamitin ang Kuwento",
    tutorialInstruction: "I-hover ang mga naka-highlight na salita para malaman ang kahulugan!",
    tutorialSampleText: "Maligayang pagdating sa interaktibong aklat na nagngangalang 'May Kapangyarihan din Ako!'. Dito makakakilala tayo ng mga kahanga-hangang mga tauhan at matutuklasan natin ang kanilang napakagandang mga kuwento.<br></br>Upang gabayan kayo sa inyong pagbabasa, maaari ninyong i-hover ang mga may kulay na salita upang matuto at maintindihan ang<span class='glossary-word-highlight type-character' data-word='mga karakter' data-definition='Ang mga taong makikilala niyo sa mga storya ay may kaniya-kaniyang ugali. Dito mo malalaman ang kanilang personalidad'>mga karakter</span>, <span class='glossary-word-highlight type-location' data-word='mga lugar' data-definition='Ang mga lugar na makikita niyo sa mga storya ay may iba’t ibang itsura. Dito mo malalaman ang mga ito.'>mga lugar</span>, at <span class='glossary-word-highlight type-concept' data-word='mga konsepto' data-definition='May mga konsepto o salita kayong makikita sa mga storya ay may iba’t ibang kahulugan na maaaring mahirap intindihin. Dito mo malalaman kung ano ang kahulugan ng mga ito.'>mga konsepto</span>! Hayaan ang mga markang ito na gabayan kayo sa inyong pagbabasa!",
    tutorialHint: "✨ Subukang Itapat ang mouse sa mga salitang may kulay sa itaas!✨",
    navigationTitle: "Pag gamit ng Aklat",
    navigationInstruction: "Itapat ang mouse sa mga maliliit na button para malaman kung ano ginagawa nila!",
    tutorialIconsHint: "✨ Subukang itapat ang mouse sa mga button sa itaas! ✨",
    tutorialContinue: "Tara Na!",

    tooltipChapter: "Kabanata - Piliin ang kabanata",
    tooltipHome: "Main Menu - Bumalik sa pangunahing menu",
    tooltipReplay: "Ulitin - Ulitin ang Pagbigkas ng Pahina",
    tooltipBookmark: "Bookmark - I-save ang kasalukuyang pahina",
    tooltipInfo: "Impormasyon - Paano gamitin ang aklat",
    tooltipSettings: "Settings - Lakas ng tunog, laki ng letra, at iba pa.",
    tooltipAudio: "Tunog - Buksan at isara ng tunog",

    settingsTitle: "Mga Settings",
    informationTitle: "Impormasyon",
    bgMusicLabel: "Volume ng Background Music",
    narrationLabel: "Volume ng Narration",
    sfxLabel: "Volume ng Sound Effects",
    fontSizeLabel: "Laki ng Font",
    autoplayLabel: "Autoplay Content",
    narrationSpeedLabel: "Bilis ng Narration",
    languageLabel: "Wika",
    clearBookmarksBtn: "Burahin Lahat ng mga Bookmark",
    creditsBtn: "Ipakita ang credits",
    goToBookmarkBtn: "Pumunta sa Bookmark",
    bookmarksTitle: "Aking mga Bookmark",
    addBookmarkBtn: "Idagdag ang Kasalukuyang Pahina"

  }
};

let tutorialContext = null;

function saveLanguagePreference(language) {
  localStorage.setItem('preferredLanguage', language);
  currentLanguage = language;
  console.log('Language preference saved:', language);
}

function loadLanguagePreference() {
  const saved = localStorage.getItem('preferredLanguage');
  currentLanguage = saved || 'tl'; 

  syncLanguageSelectors(currentLanguage);

  updateLanguageText(currentLanguage);

  console.log('Language preference loaded:', currentLanguage);
  return currentLanguage;
}

function syncLanguageSelectors(language) {
  const selectors = ['languageSelect', 'openingLanguageSelect'];

  selectors.forEach(selectorId => {
    const selector = document.getElementById(selectorId);
    if (selector && selector.value !== language) {
      selector.value = language;
    }
  });
}

function updateLanguageText(language) {
  const t = translations[language];
  if (!t) return;

  const translatableElements = {
    'start-now-btn': t.startNow,
    'chapter-select-btn': t.chapterSelect,
    'intro-title': t.introTitle,
    'intro-subtitle': t.introSubtitle,
    'ded-title': t.dedTitle,
    'ded-subtitle': t.dedSubtitle,
    'ded-button': t.dedButton,
    'begin-story-btn': t.beginStory,
    'chapter-select-title': t.chapterSelectTitle,
    'chapter-select-subtitle': t.chapterSelectSubtitle,
    'chapter-1-title': t.chapter1Title,
    'chapter-1-subtitle': t.chapter1Subtitle,
    'chapter-2-title': t.chapter2Title,
    'chapter-2-subtitle': t.chapter2Subtitle,
    'chapter-3-title': t.chapter3Title,
    'chapter-3-subtitle': t.chapter3Subtitle,
    'back-to-main-btn': t.backToMain,
    'tutorial-title': t.tutorialTitle,
    'tutorial-instruction-text': t.tutorialInstruction,
    'tutorial-hint-text': t.tutorialHint,
    'navigation-title': t.navigationTitle,
    'navigation-instruction-text': t.navigationInstruction,
    'tutorial-icons-hint': t.tutorialIconsHint,
    'tutorial-continue': t.tutorialContinue,
    'settings-title': t.settingsTitle,
    'information-title': t.informationTitle,
    'bg-music-label': t.bgMusicLabel,
    'narration-label': t.narrationLabel,
    'sfx-label': t.sfxLabel,
    'font-size-label': t.fontSizeLabel,
    'autoplay-label': t.autoplayLabel,
    'narration-speed-label': t.narrationSpeedLabel,
    'language-label': t.languageLabel,
    'clear-bookmarks-btn': t.clearBookmarksBtn,
    'credits-btn': t.creditsBtn,
    'bookmarks-title': t.bookmarksTitle,
    'add-bookmark-btn': t.addBookmarkBtn
  };

  const tooltipElements = {
    'tooltip-chapter': t.tooltipChapter,
    'tooltip-home': t.tooltipHome,
    'tooltip-replay': t.tooltipReplay,
    'tooltip-bookmark': t.tooltipBookmark,
    'tooltip-info': t.tooltipInfo,
    'tooltip-settings': t.tooltipSettings,
    'tooltip-audio': t.tooltipAudio,
    'info-tooltip-chapter': t.tooltipChapter,
    'info-tooltip-home': t.tooltipHome,
    'info-tooltip-replay': t.tooltipReplay,
    'info-tooltip-bookmark': t.tooltipBookmark,
    'info-tooltip-info': t.tooltipInfo,
    'info-tooltip-settings': t.tooltipSettings,
    'info-tooltip-audio': t.tooltipAudio
  };

  const tutorialSampleElements = {
    'tutorial-sample-text': t.tutorialSampleText,
    'info-tutorial-sample': t.tutorialSampleText
  };

  const informationElements = {
    'info-tutorial-title': t.tutorialTitle,
    'info-tutorial-instruction': t.tutorialInstruction,
    'info-tutorial-hint': t.tutorialHint,
    'info-navigation-title': t.navigationTitle,
    'info-navigation-instruction': t.navigationInstruction,
    'info-tutorial-icons-hint': t.tutorialIconsHint
  };

  Object.entries({...translatableElements, ...tooltipElements, ...informationElements}).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  });

  Object.entries(tutorialSampleElements).forEach(([id, html]) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = html;
    }
  });

  console.log('UI text updated to language:', language);
}

function getCurrentLanguage() {
  return currentLanguage;
}

function getCurrentActiveScreen() {
  const screens = ['opening-screen', 'intro-screen', 'chapter-select', 'story-page', 'credits-screen', 'chapter-select'];

  for (const screenId of screens) {
    const screen = document.getElementById(screenId);
    if (screen && (screen.style.display === 'flex' || screen.style.display === 'block')) {
      return screenId;
    }
  }

  return 'opening-screen'; 
}

function initializeLanguageSystem() {

  loadLanguagePreference();

  const languageSelect = document.getElementById('languageSelect');
  const openingLanguageSelect = document.getElementById('openingLanguageSelect');

  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value, 'main-selector');
    });
  }

  if (openingLanguageSelect) {
    openingLanguageSelect.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value, 'opening-selector');
    });
  }

  console.log('Language system initialized with language:', currentLanguage);
}

(function() {

  const originalStartStory = window.startStory;
  const originalLoadChapter = window.loadChapter;

  window.startStory = function() {
    tutorialContext = { action: 'startStory' };
    showTutorial();
  };

  window.loadChapter = function(chapterNum) {
  fromChapterSelect = true; 
  tutorialContext = { action: 'loadChapter', chapter: chapterNum };

  stopHomescreenMusic();

  const fileName = getChapterFileName(chapterNum);

  Promise.all([
    fetch(fileName).then(res => res.json()),
    loadGlossaryData()
  ]).then(([storyDataResult]) => {
    currentChapterData = storyDataResult;
    storyData = storyDataResult.pages;
    musicRanges = storyDataResult.musicRanges || [];
    currentChapter = chapterNum;

    showChapterTitlePage();
  }).catch(err => {
    console.error("Error loading chapter:", err);

    showTutorial();
  });
};

  window.originalStartStory = originalStartStory;
  window.originalLoadChapter = originalLoadChapter;
})();

function logVolumeState(context) {
  const state = {
    pageViewCount: pageViewCount,
    context: context,
    isAudioMuted: isAudioMuted,
    originalNarrationVolume: originalNarrationVolume,
    pageAudioVolume: pageAudio.volume,
    sliderValue: document.getElementById('narrationSlider')?.value,
    currentPage: currentPage,
    timestamp: Date.now()
  };

  volumeDebugLog.push(state);
  console.log(`🔊 [${context}] Page ${pageViewCount}:`, state);

  if (volumeDebugLog.length > 20) {
    volumeDebugLog.shift();
  }

  return state;
}

function initializeSliderListeners() {
  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const narrationSlider = document.getElementById('narrationSlider');
  const sfxSlider = document.getElementById('sfxSlider');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const narrationSpeedSelect = document.getElementById('narrationSpeedSelect');

  const bgMusicDisplay = document.getElementById('bg-music-display');
  const narrationDisplay = document.getElementById('narration-display');
  const sfxDisplay = document.getElementById('sfx-display');
  const fontSizeDisplay = document.getElementById('font-size-display');

  if (narrationSlider && narrationDisplay) {
  narrationSlider.addEventListener('input', (e) => {
    const rawValue = parseFloat(e.target.value);
    const clampedValue = Math.min(Math.max(rawValue, 0), 1); 

    if (rawValue !== clampedValue) {
      e.target.value = clampedValue;
      console.warn(`⚠️ Slider value was ${rawValue}, clamped to ${clampedValue}`);
    }

    const displayValue = Math.round(clampedValue * 100);
    narrationDisplay.textContent = `(${displayValue}%)`;

    originalNarrationVolume = clampedValue;

    const actualVolume = isAudioMuted ? 0 : clampedValue;

    try {
      pageAudio.volume = actualVolume;
    } catch (error) {
      console.error(`❌ Error setting pageAudio volume to ${actualVolume}:`, error);

      pageAudio.volume = isAudioMuted ? 0 : 0.9;
      originalNarrationVolume = 0.9;
    }

    console.log(`🎚️ Narration slider changed: originalNarrationVolume=${originalNarrationVolume}, actual volume=${pageAudio.volume}, muted=${isAudioMuted}`);
    logVolumeState('slider-change');
  });
}

  if (bgMusicSlider && bgMusicDisplay) {
    bgMusicSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      bgMusicDisplay.textContent = `(${value}%)`;
      originalBgVolume = parseFloat(e.target.value);
      bgMusic.volume = isAudioMuted ? 0 : originalBgVolume;

      if (homescreenMusic && isHomescreenMusicPlaying) {
        homescreenMusic.volume = isAudioMuted ? 0 : (originalBgVolume * 0.75);
      }
      if (chapterSelectMusic && isChapterSelectMusicPlaying) {
        chapterSelectMusic.volume = isAudioMuted ? 0 : (originalBgVolume * 0.75);
      }
      if (creditsMusic && !creditsMusic.paused) {
        creditsMusic.volume = isAudioMuted ? 0 : originalBgVolume;
      }
    });
  }

  if (sfxSlider && sfxDisplay) {
    sfxSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      sfxDisplay.textContent = `(${value}%)`;
      originalSfxVolume = parseFloat(e.target.value);
    });
  }

  if (narrationSpeedSelect) {
    narrationSpeedSelect.addEventListener('change', (e) => {
      const speed = parseFloat(e.target.value);
      saveNarrationSpeedPreference(speed);
      if (pageAudio.src && !pageAudio.paused) {
        applyNarrationSpeed();
      }
    });
  }

  if (fontSizeSlider && fontSizeDisplay) {
    fontSizeSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      fontSizeDisplay.textContent = `(${value}%)`;
      const dialogueBoxes = document.querySelectorAll('.dialogue-box');
      dialogueBoxes.forEach(box => {
        box.style.fontSize = `${e.target.value}rem`;
      });
    });
  }
}

function initializeHomescreenMusic() {
  if (!homescreenMusic) {
    homescreenMusic = new Audio("MUSIC/HAPPY.mp3"); 
    homescreenMusic.loop = true;
    homescreenMusic.volume = 0.15; 

    homescreenMusic.addEventListener('error', (e) => {
      console.error("Homescreen music error:", e);
      console.error("Failed to load:", homescreenMusic.src);
    });

    console.log("Homescreen music initialized");
  }
}

function startHomescreenMusic() {
  console.log("=== startHomescreenMusic() called ===");
  console.log("Current state - isHomescreenMusicPlaying:", isHomescreenMusicPlaying);
  console.log("homescreenMusic exists:", !!homescreenMusic);
  console.log("homescreenMusic paused:", homescreenMusic ? homescreenMusic.paused : "no music object");
  console.log("Current screen:", getCurrentActiveScreen());

  if (homescreenMusic && !homescreenMusic.paused && isHomescreenMusicPlaying) {
    console.log("⚠️ Homescreen music already playing, BLOCKING restart to prevent overlap");
    return;
  }

  const currentScreen = getCurrentActiveScreen();
  if (currentScreen !== 'opening-screen') {
    console.log(`⚠️ Not on opening screen (${currentScreen}), BLOCKING homescreen music start`);
    return;
  }

  removeHomescreenInteractionListeners();

  initializeHomescreenMusic();

  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const volume = bgMusicSlider ? parseFloat(bgMusicSlider.value) * 0.75 : 0.15; 
  homescreenMusic.volume = isAudioMuted ? 0 : volume;

  if (!isAudioMuted && homescreenMusic.volume > 0) {
    const playPromise = homescreenMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isHomescreenMusicPlaying = true;
        console.log("✅ Homescreen music started successfully");
      }).catch(err => {
        console.warn("❌ Homescreen music autoplay blocked:", err.message);
        isHomescreenMusicPlaying = false;

        const startOnInteraction = () => {
          if (homescreenMusic && homescreenMusic.paused && !isAudioMuted && getCurrentActiveScreen() === 'opening-screen') {
            homescreenMusic.play().then(() => {
              isHomescreenMusicPlaying = true;
              console.log("✅ Homescreen music started after user interaction");

              removeHomescreenInteractionListeners();
            }).catch(e => {
              console.warn("❌ Still couldn't start homescreen music:", e.message);
            });
          } else {

            removeHomescreenInteractionListeners();
          }
        };

        homescreenInteractionListeners.push({ event: 'click', handler: startOnInteraction });
        homescreenInteractionListeners.push({ event: 'keydown', handler: startOnInteraction });

        document.addEventListener('click', startOnInteraction, { once: false });
        document.addEventListener('keydown', startOnInteraction, { once: false });

        console.log("Homescreen music will start after user interaction");
      });
    }
  } else {
    console.log("Homescreen music not started - audio muted or volume 0");
  }
}

function initializeChapterSelectMusic() {
  if (!chapterSelectMusic) {
    chapterSelectMusic = new Audio("MUSIC/HAPPY.mp3");
    chapterSelectMusic.loop = true;
    chapterSelectMusic.volume = 0.15;

    chapterSelectMusic.addEventListener('error', (e) => {
      console.error("Chapter select music error:", e);
      console.error("Failed to load:", chapterSelectMusic.src);
    });

    console.log("Chapter select music initialized");
  }
}

function startChapterSelectMusic() {
  console.log("=== startChapterSelectMusic() called ===");

  if (chapterSelectMusic && !chapterSelectMusic.paused && isChapterSelectMusicPlaying) {
    console.log("⚠️ Chapter select music already playing, blocking restart");
    return;
  }

  const currentScreen = getCurrentActiveScreen();
  if (currentScreen !== 'chapter-select') {
    console.log(`⚠️ Not on chapter select screen (${currentScreen}), blocking music start`);
    return;
  }

  initializeChapterSelectMusic();

  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const volume = bgMusicSlider ? parseFloat(bgMusicSlider.value) * 0.75 : 0.15;
  chapterSelectMusic.volume = isAudioMuted ? 0 : volume;

  if (!isAudioMuted && chapterSelectMusic.volume > 0) {
    const playPromise = chapterSelectMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isChapterSelectMusicPlaying = true;
        console.log("✅ Chapter select music started successfully");
      }).catch(err => {
        console.warn("❌ Chapter select music autoplay blocked:", err.message);
        isChapterSelectMusicPlaying = false;

        const startOnInteraction = () => {
          if (chapterSelectMusic && chapterSelectMusic.paused && !isAudioMuted && getCurrentActiveScreen() === 'chapter-select') {
            chapterSelectMusic.play().then(() => {
              isChapterSelectMusicPlaying = true;
              console.log("✅ Chapter select music started after user interaction");
              document.removeEventListener('click', startOnInteraction);
              document.removeEventListener('keydown', startOnInteraction);
            }).catch(e => {
              console.warn("❌ Still couldn't start chapter select music:", e.message);
            });
          }
        };

        document.addEventListener('click', startOnInteraction, { once: false });
        document.addEventListener('keydown', startOnInteraction, { once: false });
      });
    }
  }
}

function stopChapterSelectMusic() {
  if (chapterSelectMusic && !chapterSelectMusic.paused) {
    chapterSelectMusic.pause();
    chapterSelectMusic.currentTime = 0;
    isChapterSelectMusicPlaying = false;
    console.log("Chapter select music stopped");
  } else if (chapterSelectMusic) {
    isChapterSelectMusicPlaying = false;
  }
}

function stopHomescreenMusic() {
  if (homescreenMusic && !homescreenMusic.paused) {
    homescreenMusic.pause();
    homescreenMusic.currentTime = 0;
    isHomescreenMusicPlaying = false;
    console.log("Homescreen music stopped");
  } else if (homescreenMusic) {

    isHomescreenMusicPlaying = false;
  }
}

function removeHomescreenInteractionListeners() {

  console.log("removeHomescreenInteractionListeners called");
  homescreenInteractionListeners.forEach(({ event, handler }) => {
    document.removeEventListener(event, handler);
  });
  homescreenInteractionListeners = [];
}

function resetHomescreenMusicState() {
  console.log("🔄 Resetting homescreen music state");

  if (homescreenMusic) {
    homescreenMusic.pause();
    homescreenMusic.currentTime = 0;
  }

  isHomescreenMusicPlaying = false;
  removeHomescreenInteractionListeners();

  console.log("✅ Homescreen music state reset complete");
}

function updateOpeningScreenContent(language) {
  const config = translations[language]; 
  if (!config) return;

  const titleImage = document.getElementById('title-image');
  if (titleImage && config.titleImage) {
    titleImage.src = config.titleImage;
    console.log(`Updated title image to: ${config.titleImage}`);
  }

  const bgGif = document.getElementById('bg-gif');
  if (bgGif && config.backgroundGif) {
    bgGif.src = config.backgroundGif;
  }
}

function handleLanguageChange(newLanguage, fromSelector = null) {
  const oldLanguage = currentLanguage;
  currentLanguage = newLanguage;

  console.log(`Language change: ${oldLanguage} -> ${newLanguage} (from: ${fromSelector})`);

  saveLanguagePreference(newLanguage);
  syncLanguageSelectors(newLanguage);
  updateLanguageText(newLanguage);

  const currentScreen = getCurrentActiveScreen();
  console.log(`Current screen: ${currentScreen}`);

  updateOpeningScreenContent(newLanguage);

  if (currentScreen === 'opening-screen') {
    console.log("On opening screen - managing homescreen music for language change");

    resetHomescreenMusicState();

    setTimeout(() => {
      startHomescreenMusic();
    }, 200);
  } else {
    console.log("Not on opening screen - skipping homescreen music management");
  }

  const storyPage = document.getElementById('story-page');
  if (storyPage && storyPage.style.display === 'block' && oldLanguage !== newLanguage) {

    loadChapterWithPagePreservation(currentChapter);
  }
}

function initializeLanguageSystem() {

  loadLanguagePreference();

  const languageSelect = document.getElementById('languageSelect');
  const openingLanguageSelect = document.getElementById('openingLanguageSelect');

  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value, 'main-selector');
    });
  }

  if (openingLanguageSelect) {
    openingLanguageSelect.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value, 'opening-selector');
    });
  }

  updateOpeningScreenContent(currentLanguage);

  console.log('Language system initialized with language:', currentLanguage);
}

function showChapterTitlePage() {

  stopHomescreenMusic();

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";
  document.getElementById("tutorial-screen").style.display = "none";

  document.getElementById("chapter-title-screen").style.display = "flex";

  const titleText = document.getElementById("chapter-title-text");
  const titleBg = document.getElementById("chapter-title-bg");

  if (currentChapterData && currentChapterData.titlePage) {
    if (currentLanguage === 'tl') {

      const filipinoTitle = currentChapterData.titlePage.titleFil || currentChapterData.titlePage.title;
      titleText.textContent = filipinoTitle;
    } else {
      titleText.textContent = currentChapterData.titlePage.title;
    }

    if (currentChapterData.titlePage.backgroundImage) {
      titleBg.style.backgroundImage = `url(${currentChapterData.titlePage.backgroundImage})`;
    }
  } else {

    const fallbackTitle = currentLanguage === 'tl' ? 
      `Kabanata ${currentChapter}` : 
      `Chapter ${currentChapter}`;
    titleText.textContent = fallbackTitle;
  }

  const beginBtn = document.getElementById("begin-journey-btn");
  beginBtn.textContent = currentLanguage === 'tl' ? 
    'Simulan ang Inyong Paglalakbay' : 
    'Begin Your Journey';
}

function beginChapterStory() {
  stopChapterSelectMusic();
  document.getElementById("chapter-title-screen").style.display = "none";
  document.getElementById("story-page").style.display = "block";
  document.getElementById("top-nav").style.display = "flex";

  currentPage = 0;
  startBackgroundMusic();
  showPage(currentPage);
}

function showTutorial() {

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";

  document.getElementById('tutorial-screen').style.display = 'flex';

  updateLanguageText(currentLanguage);

  setTimeout(initializeTutorialGlossary, 100);
}

function proceedToStory() {
  document.getElementById('tutorial-screen').style.display = 'none';

  if (tutorialContext) {
    if (tutorialContext.action === 'startStory') {

      originalStartStory.call(window);
    } else if (tutorialContext.action === 'loadChapter') {

      fromChapterSelect = false; 
      beginChapterStory();
    }

    tutorialContext = null;
  } else {

    originalStartStory.call(window);
  }
}

function initializeTutorialGlossary() {
  console.log('Initializing tutorial glossary...');

  const tutorialWords = document.querySelectorAll('#tutorial-screen .glossary-word-highlight, #information-overlay .glossary-word-highlight');
  console.log('Found tutorial words:', tutorialWords.length);

  tutorialWords.forEach(word => {
    word.addEventListener('mouseenter', function(e) {
      showTutorialGlossaryPopup(e.target);
    });

    word.addEventListener('mouseleave', function(e) {
      hideTutorialGlossaryPopup();
    });
  });
}

function showTutorialGlossaryPopup(element) {
  const popup = document.getElementById('glossary-popup');
  if (!popup) return;

  const wordElement = popup.querySelector('.glossary-word');
  const definitionElement = popup.querySelector('.glossary-definition');

  const word = element.getAttribute('data-word');
  const definition = element.getAttribute('data-definition');

  if (word && definition && wordElement && definitionElement) {
    wordElement.textContent = word;
    definitionElement.textContent = definition;

    const rect = element.getBoundingClientRect();

    popup.style.display = 'block';
    popup.style.opacity = '0';

    const popupRect = popup.getBoundingClientRect();

    const centerX = rect.left + (rect.width / 2);
    let left = centerX - (popupRect.width / 2);

    const margin = 10;
    if (left < margin) {
      left = margin;
    } else if (left + popupRect.width > window.innerWidth - margin) {
      left = window.innerWidth - popupRect.width - margin;
    }

    let top = rect.top - popupRect.height - 15; 

    if (top < margin) {
      top = rect.bottom + 15;
      popup.classList.add('popup-below');
    } else {
      popup.classList.remove('popup-below');
    }

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.opacity = '1';

    setTimeout(() => {
      popup.classList.add('show');
    }, 10);
  }
}

function hideTutorialGlossaryPopup() {
  const popup = document.getElementById('glossary-popup');
  if (popup) {
    popup.classList.remove('show');

    setTimeout(() => {
      popup.style.display = 'none';
    }, 200);
  }
}

function getChapterFileName(chapterNum) {
  console.log(`Getting chapter file for language: ${currentLanguage}`);

  if (currentLanguage === 'tl') {
    return `fil-chapter${chapterNum}.json`;
  } else {
    return `chapter${chapterNum}.json`;
  }
}

function getGlossaryFileName() {
  console.log(`Getting glossary file for language: ${currentLanguage}`);

  if (currentLanguage === 'tl') {
    return `fil-glossary.json`;
  } else {
    return `glossary.json`;
  }
}

function loadGlossaryData() {
  const fileName = getGlossaryFileName();
  return fetch(fileName)
    .then(res => res.json())
    .then(data => {
      glossaryData = data;
      console.log('Glossary loaded:', fileName);
    })
    .catch(err => {
      console.warn("Could not load glossary:", err);
      glossaryData = {};
    });
}

function processTextWithGlossary(text) {
  if (!glossaryData || Object.keys(glossaryData).length === 0) {
    return text;
  }

  let processedText = text;

  const sortedTerms = Object.keys(glossaryData).sort((a, b) => b.length - a.length);

  sortedTerms.forEach(term => {
    const definition = glossaryData[term];
    const regex = new RegExp(`\\b${term}\\b`, 'gi');

    const replacement = `<span class="glossary-word-highlight ${definition.type ? 'type-' + definition.type : ''}" 
                          data-glossary-term="${term}" 
                          data-glossary-definition="${definition.definition || definition}"
                          onmouseenter="showGlossaryPopup(event, this)"
                          onmouseleave="hideGlossaryPopup()">$&</span>`;

    processedText = processedText.replace(regex, replacement);
  });

  return processedText;
}

function showGlossaryPopup(event, element) {
  const popup = document.getElementById('glossary-popup');
  const wordElement = popup.querySelector('.glossary-word');
  const definitionElement = popup.querySelector('.glossary-definition');

  const term = element.getAttribute('data-glossary-term');
  const definition = element.getAttribute('data-glossary-definition');

  wordElement.textContent = term;
  definitionElement.textContent = definition;

  popup.style.display = 'block';
  popup.style.opacity = '0';

  const rect = element.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();

  const centerX = rect.left + (rect.width / 2);
  let left = centerX - (popupRect.width / 2);

  const margin = 10;
  if (left < margin) {
    left = margin;
  } else if (left + popupRect.width > window.innerWidth - margin) {
    left = window.innerWidth - popupRect.width - margin;
  }

  let top = rect.top - popupRect.height - 15;

  if (top < margin) {
    top = rect.bottom + 15;
    popup.classList.add('popup-below');
  } else {
    popup.classList.remove('popup-below');
  }

  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.style.opacity = '1';

  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
}

function hideGlossaryPopup() {
  const popup = document.getElementById('glossary-popup');
  popup.classList.remove('show');

  setTimeout(() => {
    popup.style.display = 'none';
  }, 200);
}

function updateBackgroundMusic(pageIndex) {
  const newMusicIndex = musicRanges.findIndex(range => 
    pageIndex >= range.startPage && pageIndex <= range.endPage
  );

  if (newMusicIndex !== -1 && newMusicIndex !== currentMusicIndex) {
    currentMusicIndex = newMusicIndex;
    const newMusic = musicRanges[newMusicIndex].music;

    console.log(`Switching background music to: ${newMusic} for page ${pageIndex}`);

    if (bgMusic.src !== new URL(newMusic, window.location.href).href) {
      bgMusic.pause();
      bgMusic.src = newMusic;

      if (!isAudioMuted && bgMusic.volume > 0) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            isPlaying = true;
            console.log("Background music switched and playing:", newMusic);
          }).catch(err => {
            console.warn("Background music play failed:", err);
            isPlaying = false;
          });
        }
      }
    }
  } else if (newMusicIndex === -1) {
    console.log(`No background music defined for page ${pageIndex}`);
  }
}

function openSettings() {
  document.getElementById('settings-overlay').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settings-overlay').style.display = 'none';
}

function closeSettingsOnOverlay(event) {
  if (event.target === document.getElementById('settings-overlay')) {
    closeSettings();
  }
}

function openInformation() {
  document.getElementById('information-overlay').style.display = 'flex';

  setTimeout(() => {
    const infoContent = document.querySelector('#information-overlay .information-content');
    if (infoContent) {
      infoContent.scrollTop = 0;
    }
  }, 10);
}

function closeInformation() {
  document.getElementById('information-overlay').style.display = 'none';
}

function closeInformationOnOverlay(event) {
  if (event.target === document.getElementById('information-overlay')) {
    closeInformation();
  }
}

function getCurrentNarrationSpeed() {
  return currentNarrationSpeed;
}

function applyNarrationSpeed() {
  pageAudio.playbackRate = currentNarrationSpeed;
  console.log('Applied narration speed:', currentNarrationSpeed + 'x');
}

function saveNarrationSpeedPreference(speed) {
  localStorage.setItem('narrationSpeed', speed.toString());
  currentNarrationSpeed = speed;
  console.log('Saved narration speed preference:', speed + 'x');
}

function loadNarrationSpeedPreference() {
  const savedSpeed = localStorage.getItem('narrationSpeed');
  if (savedSpeed) {
    currentNarrationSpeed = parseFloat(savedSpeed);
    const narrationSpeedSelect = document.getElementById('narrationSpeedSelect');
    if (narrationSpeedSelect) {
      narrationSpeedSelect.value = savedSpeed;
    }
    console.log('Loaded narration speed preference:', currentNarrationSpeed + 'x');
  } else {
    currentNarrationSpeed = 1.0; 
  }
}

function initializeSliderListeners() {
  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const narrationSlider = document.getElementById('narrationSlider');
  const sfxSlider = document.getElementById('sfxSlider');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const narrationSpeedSelect = document.getElementById('narrationSpeedSelect');

  const bgMusicDisplay = document.getElementById('bg-music-display');
  const narrationDisplay = document.getElementById('narration-display');
  const sfxDisplay = document.getElementById('sfx-display');
  const fontSizeDisplay = document.getElementById('font-size-display');

  if (bgMusicSlider && bgMusicDisplay) {
    bgMusicSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      bgMusicDisplay.textContent = `(${value}%)`;

      originalBgVolume = parseFloat(e.target.value);

      bgMusic.volume = isAudioMuted ? 0 : originalBgVolume;

      if (homescreenMusic && isHomescreenMusicPlaying) {
        homescreenMusic.volume = isAudioMuted ? 0 : (originalBgVolume * 0.75);
      }

      if (chapterSelectMusic && isChapterSelectMusicPlaying) {
        chapterSelectMusic.volume = isAudioMuted ? 0 : (originalBgVolume * 0.75);
      }

      if (creditsMusic && !creditsMusic.paused) {
        creditsMusic.volume = isAudioMuted ? 0 : originalBgVolume;
      }
    });
  }

  if (narrationSlider && narrationDisplay) {
    narrationSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      narrationDisplay.textContent = `(${value}%)`;

      originalNarrationVolume = parseFloat(e.target.value);

      pageAudio.volume = isAudioMuted ? 0 : originalNarrationVolume;

      console.log(`Narration slider changed: originalNarrationVolume=${originalNarrationVolume}, actual volume=${pageAudio.volume}, muted=${isAudioMuted}`);
    });
  }

  if (sfxSlider && sfxDisplay) {
    sfxSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      sfxDisplay.textContent = `(${value}%)`;

      originalSfxVolume = parseFloat(e.target.value);
    });
  }

  if (narrationSpeedSelect) {
    narrationSpeedSelect.addEventListener('change', (e) => {
      const speed = parseFloat(e.target.value);
      saveNarrationSpeedPreference(speed);

      if (pageAudio.src && !pageAudio.paused) {
        applyNarrationSpeed();
      }

      console.log('Narration speed changed to:', speed + 'x');
    });
  }

  if (fontSizeSlider && fontSizeDisplay) {
    fontSizeSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      fontSizeDisplay.textContent = `(${value}%)`;
      const dialogueBoxes = document.querySelectorAll('.dialogue-box');
      dialogueBoxes.forEach(box => {
        box.style.fontSize = `${e.target.value}rem`;
      });
    });
  }
}

function loadChapterWithPagePreservation(chapterNum) {
  const savedPage = currentPage;

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "block";
  document.getElementById("top-nav").style.display = "flex";

  currentChapter = chapterNum;

  if (!isPlaying) {
    startBackgroundMusic();
  }

  const fileName = getChapterFileName(chapterNum);

  Promise.all([
    fetch(fileName).then(res => res.json()),
    loadGlossaryData()
  ]).then(([storyDataResult]) => {
    storyData = storyDataResult.pages;
    musicRanges = storyDataResult.musicRanges || [];

    if (savedPage < storyData.length) {
      currentPage = savedPage;
    } else {
      currentPage = storyData.length - 1;
    }

    showPage(currentPage);
    console.log(`Reloaded chapter ${chapterNum} in new language, staying on page ${currentPage}`);
  }).catch(err => {
    console.error("Error loading chapter:", err);
    loadGlossaryData().then(() => {
      storyData = [{
        dialogue: [`Welcome to Chapter ${chapterNum}! This is a test page since ${fileName} couldn't be loaded.`],
        image: null,
        video: null
      }];
      musicRanges = [];
      currentPage = 0;
      showPage(currentPage);
    });
  });
  stopChapterSelectMusic();
}

function loadBookmarks() {
  const saved = localStorage.getItem('storyBookmarks');
  if (saved) {
    bookmarks = JSON.parse(saved);
    console.log('Loaded bookmarks:', bookmarks.length);
  } else {
    bookmarks = [];
  }
}

function saveBookmarks() {
  localStorage.setItem('storyBookmarks', JSON.stringify(bookmarks));
  console.log('Bookmarks saved:', bookmarks.length);
}

function openBookmarksPopup() {
  const popup = document.getElementById('bookmarks-overlay');
  if (popup) {
    popup.style.display = 'flex';
    renderBookmarksList();
  }
}

function closeBookmarksPopup() {
  const popup = document.getElementById('bookmarks-overlay');
  if (popup) {
    popup.style.display = 'none';
  }
}

function closeBookmarksOnOverlay(event) {
  if (event.target === document.getElementById('bookmarks-overlay')) {
    closeBookmarksPopup();
  }
}

function addBookmark() {

  const storyPage = document.getElementById('story-page');
  if (!storyPage || storyPage.style.display !== 'block') {
    handleHomepageBookmarkAttempt();
    return;
  }

  if (bookmarks.length >= 5) {

    showOverwriteBookmarkPopup();
    return;
  }

  const page = storyData[currentPage];

  const bookmark = {
    id: Date.now(),
    page: currentPage,
    chapter: currentChapter,
    timestamp: new Date().toLocaleString(),
    image: page.image || null,
    video: page.video || null

  };

  bookmarks.push(bookmark);
  saveBookmarks();
  renderBookmarksList();

  const addBtn = document.querySelector('.add-bookmark-btn');
  if (addBtn) {
    const originalText = addBtn.textContent;
    const confirmText = currentLanguage === 'tl' ? 'Naidagdag na!' : 'Added!';
    addBtn.textContent = confirmText;
    addBtn.disabled = true;

    setTimeout(() => {
      addBtn.textContent = originalText;
      addBtn.disabled = false;
    }, 1000);
  }
}

function showOverwriteBookmarkPopup() {
  const message = currentLanguage === 'tl' ? 
    'Puno na ang mga bookmark (5/5). Piliin ang bookmark na papalitan:' :
    'Bookmarks are full (5/5). Choose a bookmark to overwrite:';

  const overwritePopup = document.createElement('div');
  overwritePopup.className = 'overwrite-bookmark-popup';
  overwritePopup.innerHTML = `
    <div class="overwrite-content">
      <h3>${message}</h3>
      <div class="overwrite-bookmarks-grid">
        ${bookmarks.map((bookmark, index) => `
          <div class="overwrite-bookmark-item" onclick="overwriteBookmark(${index})">
            <div class="bookmark-preview">
              ${bookmark.image ? `<img src="${bookmark.image}" alt="Bookmark">` : 
                bookmark.video ? `<video src="${bookmark.video}" muted></video>` : 
                '<div class="no-image">📖</div>'}
            </div>
            <div class="bookmark-info">
              <div class="bookmark-desc">${getBookmarkDescription(bookmark)}</div>
              <div class="bookmark-time">${bookmark.timestamp}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="cancel-overwrite-btn" onclick="cancelOverwrite()">${currentLanguage === 'tl' ? 'Kanselahin' : 'Cancel'}</button>
    </div>
  `;

  document.body.appendChild(overwritePopup);
}

function overwriteBookmark(index) {
  const page = storyData[currentPage];

  bookmarks[index] = {
    id: Date.now(),
    page: currentPage,
    chapter: currentChapter,
    timestamp: new Date().toLocaleString(),
    image: page.image || null,
    video: page.video || null

  };

  saveBookmarks();
  renderBookmarksList();
  cancelOverwrite();
}

function getBookmarkDescription(bookmark) {
  return currentLanguage === 'tl' ? 
    `Kabanata ${bookmark.chapter}, Pahina ${bookmark.page + 1}` :
    `Chapter ${bookmark.chapter}, Page ${bookmark.page + 1}`;
}

function cancelOverwrite() {
  const overwritePopup = document.querySelector('.overwrite-bookmark-popup');
  if (overwritePopup) {
    overwritePopup.remove();
  }
}

function renderBookmarksList() {
  const container = document.getElementById('bookmarks-list');

  if (!container) return;

  if (bookmarks.length === 0) {
    const emptyMessage = currentLanguage === 'tl' ? 
      'Walang mga bookmark pa. Magdagdag ng bookmark sa kasalukuyang pahina!' :
      'No bookmarks yet. Add a bookmark on the current page!';
    container.innerHTML = `<div class="no-bookmarks">${emptyMessage}</div>`;
    return;
  }

  container.innerHTML = bookmarks.map((bookmark, index) => `
    <div class="bookmark-item">
      <div class="bookmark-preview">
        ${bookmark.image ? `<img src="${bookmark.image}" alt="Bookmark ${index + 1}">` : 
          bookmark.video ? `<video src="${bookmark.video}" muted></video>` : 
          '<div class="no-image">📖</div>'}
      </div>
      <div class="bookmark-details">
        <div class="bookmark-description">${getBookmarkDescription(bookmark)}</div>
        <div class="bookmark-timestamp">${bookmark.timestamp}</div>
        <div class="bookmark-actions">
          <button class="goto-bookmark-btn" onclick="goToBookmark(${index})">
            ${currentLanguage === 'tl' ? 'Pumunta' : 'Go To'}
          </button>
          <button class="delete-bookmark-btn" onclick="deleteBookmark(${index})">
            ${currentLanguage === 'tl' ? 'Tanggalin' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function goToBookmark(index) {
  const bookmark = bookmarks[index];

  stopHomescreenMusic();

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("tutorial-screen").style.display = "none";
  document.getElementById("story-page").style.display = "block";
  document.getElementById("top-nav").style.display = "flex";

  if (bookmark.chapter !== currentChapter) {

    currentChapter = bookmark.chapter;

    const fileName = getChapterFileName(bookmark.chapter);
    console.log(`Loading chapter ${bookmark.chapter} for bookmark navigation in ${currentLanguage} (${fileName})...`);

    Promise.all([
      fetch(fileName).then(res => res.json()),
      loadGlossaryData()
    ]).then(([storyDataResult]) => {
      storyData = storyDataResult.pages;
      musicRanges = storyDataResult.musicRanges || [];

      if (bookmark.page < storyData.length) {
        currentPage = bookmark.page;

        console.log(`Starting background music for page ${currentPage}...`);

        bgMusic.pause();
        bgMusic.currentTime = 0;
        isPlaying = false;

        updateBackgroundMusic(currentPage);

        if (!bgMusic.src || bgMusic.src === '' || bgMusic.src.includes('about:blank')) {
          console.log("No music set by ranges, using default music");
          bgMusic.src = "MUSIC/NEUTRAL/storytelling.mp3";
        }

        if (!isAudioMuted && bgMusic.volume > 0) {
          console.log("Attempting to start background music:", bgMusic.src);
          const playPromise = bgMusic.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
              console.log("Background music started successfully for bookmark");
            }).catch(err => {
              console.warn("Background music play failed for bookmark:", err);
              isPlaying = false;
            });
          }
        }

        showPage(currentPage);
        closeBookmarksPopup();
        console.log(`Navigated to bookmarked page: Chapter ${bookmark.chapter}, Page ${bookmark.page} in ${currentLanguage}`);
      }
    }).catch(err => {
      console.error("Error loading chapter for bookmark:", err);
      closeBookmarksPopup();
    });
  } else {

    console.log(`Same chapter ${bookmark.chapter}, checking if language matches...`);

    const fileName = getChapterFileName(bookmark.chapter);
    console.log(`Reloading chapter ${bookmark.chapter} in current language ${currentLanguage} (${fileName})...`);

    Promise.all([
      fetch(fileName).then(res => res.json()),
      loadGlossaryData()
    ]).then(([storyDataResult]) => {
      storyData = storyDataResult.pages;
      musicRanges = storyDataResult.musicRanges || [];

      if (bookmark.page < storyData.length) {
        currentPage = bookmark.page;

        console.log(`Updating background music for page ${currentPage}...`);
        updateBackgroundMusic(currentPage);

        if (!isAudioMuted && bgMusic.volume > 0 && !isPlaying) {
          console.log("Restarting background music for same chapter bookmark");
          const playPromise = bgMusic.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
              console.log("Background music restarted for same chapter bookmark");
            }).catch(err => {
              console.warn("Background music restart failed:", err);
            });
          }
        }

        showPage(currentPage);
        closeBookmarksPopup();
        console.log(`Navigated to bookmarked page: Chapter ${bookmark.chapter}, Page ${bookmark.page} in ${currentLanguage}`);
      }
    }).catch(err => {
      console.error("Error reloading chapter for bookmark:", err);
      closeBookmarksPopup();
    });
  }
}

function deleteBookmark(index) {

  bookmarks.splice(index, 1);
  saveBookmarks();
  renderBookmarksList();
}

function handleHomepageBookmarkAttempt() {
  const alertMessage = currentLanguage === 'tl' ? 
    'Hindi mo ma-bookmark ang home screen!' :
    'You can\'t bookmark the home screen!';

  alert(alertMessage);
}

function bookmarkCurrentPage() {
  openBookmarksPopup();
}

function goToBookmarkedPage() {
  openBookmarksPopup();
}

function repeatPageNarration() {

  const storyPage = document.getElementById('story-page');
  if (!storyPage || storyPage.style.display !== 'block') {
    console.log('Not on story page, cannot repeat narration');
    return;
  }

  if (!storyData || !storyData[currentPage] || !storyData[currentPage].bgAudio) {
    console.log('Current page has no narration audio');

    const message = currentLanguage === 'tl' ? 
      'Walang narration audio sa pahinang ito' : 
      'No narration audio on this page';

    return;
  }

  if (!pageAudio.paused) {
    pageAudio.pause();
  }

  pageAudio.currentTime = 0;

  pageAudio.volume = isAudioMuted ? 0 : (document.getElementById('narrationSlider')?.value || originalNarrationVolume);
  applyNarrationSpeed();

  if (!isAudioMuted) {
    const audioPlayPromise = pageAudio.play();
    if (audioPlayPromise !== undefined) {
      audioPlayPromise.then(() => {
        console.log(`Page narration restarted at ${getCurrentNarrationSpeed()}x speed, volume: ${pageAudio.volume}`);
      }).catch(err => {
        console.warn("Page narration replay failed:", err);
      });
    }
  } else {
    console.log('Audio is muted, narration not played');
  }
}

function showChapterSelectFromStory() {
  localStorage.setItem('storyProgress', JSON.stringify({
    currentPage: currentPage,
    chapter: currentChapter,
    timestamp: Date.now()
  }));

  showChapterSelect();
}

function goHome() {
  localStorage.setItem('storyProgress', JSON.stringify({
    currentPage: currentPage,
    chapter: currentChapter,
    timestamp: Date.now()
  }));

  showOpening();
}

function toggleAllAudio() {
  const audioIcon = document.getElementById('audio-toggle');
  const audioImg = audioIcon ? audioIcon.querySelector('img') : null;

  if (!isAudioMuted) {

    originalBgVolume = document.getElementById('bgMusicSlider')?.value || 0.2;
    originalNarrationVolume = document.getElementById('narrationSlider')?.value || 1.0;
    originalSfxVolume = document.getElementById('sfxSlider')?.value || 1.0;

    bgMusic.volume = 0;
    pageAudio.volume = 0;
    if (creditsMusic) creditsMusic.volume = 0;
    if (homescreenMusic) homescreenMusic.volume = 0;

    isAudioMuted = true;

    if (audioImg) {
      audioImg.src = 'ICONS/mute icon.png';
      audioImg.alt = 'Audio Muted';
    }

    if (audioIcon) {
      const muteTitle = currentLanguage === 'tl' ? 
        'Audio Naka-mute - I-click para I-enable' :
        'Audio Muted - Click to Enable';
      audioIcon.title = muteTitle;
    }

    updateAudioSliders(0, 0, 0);
    console.log('All audio muted including SFX');

  } else {

    bgMusic.volume = originalBgVolume;
    pageAudio.volume = originalNarrationVolume;

    if (creditsMusic) {
      creditsMusic.volume = originalBgVolume;
    }
    if (homescreenMusic && isHomescreenMusicPlaying) {
      homescreenMusic.volume = originalBgVolume * 0.75;
    }

    isAudioMuted = false;

    if (audioImg) {
      audioImg.src = 'ICONS/sound icon.png';
      audioImg.alt = 'Toggle Audio';
    }

    if (audioIcon) {
      const toggleTitle = currentLanguage === 'tl' ? 
        'I-toggle ang Audio' :
        'Toggle Audio';
      audioIcon.title = toggleTitle;
    }

    updateAudioSliders(originalBgVolume, originalNarrationVolume, originalSfxVolume);
    applyNarrationSpeed();

    const currentScreen = getCurrentActiveScreen();

    if (currentScreen === 'opening-screen') {
      if (!isHomescreenMusicPlaying || (homescreenMusic && homescreenMusic.paused)) {
        setTimeout(() => {
          startHomescreenMusic();
        }, 100);
      }
    } else if (currentScreen === 'story-page' && !isPlaying && originalBgVolume > 0) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          console.log('Background music started after unmuting');
        }).catch(err => {
          console.warn('Could not start background music after unmuting:', err);
        });
      }
    } else if (currentScreen === 'credits-screen' && creditsMusic && creditsMusic.paused) {
      creditsMusic.play().catch(err => console.warn('Could not restart credits music:', err));
    }

    console.log('All audio unmuted');
  }
}

function initializeAudioSystem() {
  bgMusic.volume = originalBgVolume;
  pageAudio.volume = originalNarrationVolume;

  applyNarrationSpeed();

  const bgMusicDisplay = document.getElementById('bg-music-display');
  const narrationDisplay = document.getElementById('narration-display');

  if (bgMusicDisplay) bgMusicDisplay.textContent = `(${Math.round(originalBgVolume * 100)}%)`;
  if (narrationDisplay) narrationDisplay.textContent = `(${Math.round(originalNarrationVolume * 100)}%)`;

  startBackgroundMusic();
}

function clearAllBookmarks() {

  bookmarks = [];
  localStorage.removeItem('storyBookmarks');
  localStorage.removeItem('storyBookmark'); 
  localStorage.removeItem('storyProgress');
  console.log('All bookmarks and progress cleared');

  const container = document.getElementById('bookmarks-list');
  if (container) {
    renderBookmarksList();
  }

  if (event && event.target) {
    const clearBtn = event.target;
    const originalText = clearBtn.textContent;
    const clearedText = currentLanguage === 'tl' ? 'Na-clear na!' : 'Cleared!';
    clearBtn.textContent = clearedText;

    setTimeout(() => {
      clearBtn.textContent = originalText;
    }, 1000);
  }
}

function showOpening() {
  document.getElementById("opening-screen").style.display = "flex";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";
  document.getElementById("credits-screen").style.display = "none";

  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isPlaying = false;
  }
  if (pageAudio && !pageAudio.paused) {
    pageAudio.pause();
    pageAudio.currentTime = 0;
  }
  if (creditsMusic && !creditsMusic.paused) {
    creditsMusic.pause();
    creditsMusic.currentTime = 0;
  }

  closeSettings();

  console.log("🏠 Showing opening screen - resetting homescreen music state");
  resetHomescreenMusicState();

  setTimeout(() => {
    startHomescreenMusic();
  }, 300);
  stopChapterSelectMusic();
}
function restartHomescreenMusicSafely() {
  console.log("Safely restarting homescreen music...");

  stopHomescreenMusic();

  setTimeout(() => {
    startHomescreenMusic();
  }, 100);
}

function showIntro() {
  stopHomescreenMusic(); 

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "flex";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";
}

function showDedication() {
  stopHomescreenMusic(); 

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "flex";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";
}

function showChapterSelect() {
  stopHomescreenMusic();

  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isPlaying = false;
  }
  if (pageAudio && !pageAudio.paused) {
    pageAudio.pause();
    pageAudio.currentTime = 0;
  }

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "flex";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";

  setTimeout(() => {
    startChapterSelectMusic();
  }, 200);
}

function showChapterSelectFromStory() {
  localStorage.setItem('storyProgress', JSON.stringify({
    currentPage: currentPage,
    chapter: currentChapter,
    timestamp: Date.now()
  }));

  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isPlaying = false;
  }
  if (pageAudio && !pageAudio.paused) {
    pageAudio.pause();
    pageAudio.currentTime = 0;
  }

  showChapterSelect();
}

function goHome() {
  localStorage.setItem('storyProgress', JSON.stringify({
    currentPage: currentPage,
    chapter: currentChapter,
    timestamp: Date.now()
  }));

  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    isPlaying = false;
  }
  if (pageAudio && !pageAudio.paused) {
    pageAudio.pause();
    pageAudio.currentTime = 0;
  }

  showOpening();
}

function startStory() {
  stopHomescreenMusic(); 
  stopChapterSelectMusic();

  console.log("Starting story...");

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "block";
  document.getElementById("top-nav").style.display = "flex";

  currentPage = 0;
  currentChapter = 1;

  const fileName = getChapterFileName(1);
  console.log(`Loading file: ${fileName}`);

  Promise.all([
    fetch(fileName).then(res => res.json()),
    loadGlossaryData()
  ]).then(([storyDataResult]) => {
    storyData = storyDataResult.pages;
    musicRanges = storyDataResult.musicRanges || [];

    console.log(`Story loaded. Pages: ${storyData.length}, Music ranges:`, musicRanges);

    startBackgroundMusic(); 
    showPage(currentPage);
  }).catch(err => {
    console.error("Error loading story data:", err);
    loadGlossaryData().then(() => {
      storyData = [{
        dialogue: [`Welcome to the story! This is a test page since ${fileName} couldn't be loaded.`],
        image: null,
        video: null
      }];
      musicRanges = [];

      console.log("Using fallback data, starting background music");
      startBackgroundMusic();
      showPage(currentPage);
    });
  });
}

function loadChapter(chapterNum, callback) {
  console.log(`Loading chapter ${chapterNum}...`);

  fromChapterSelect = true;

  currentChapter = chapterNum;

  const fileName = getChapterFileName(chapterNum);
  console.log(`Loading file: ${fileName}`);

  Promise.all([
    fetch(fileName).then(res => res.json()),
    loadGlossaryData()
  ]).then(([storyDataResult]) => {
    currentChapterData = storyDataResult;
    storyData = storyDataResult.pages;
    musicRanges = storyDataResult.musicRanges || [];

    console.log(`Chapter loaded. Pages: ${storyData.length}, Music ranges:`, musicRanges);

    showChapterTitlePage();

    if (callback) callback();
  }).catch(err => {
    console.error("Error loading chapter:", err);
    loadGlossaryData().then(() => {
      currentChapterData = {
        chapter: chapterNum,
        title: `Chapter ${chapterNum}`,
        titlePage: {
          backgroundImage: null,
          title: `Chapter ${chapterNum}: Test Chapter`
        }
      };
      storyData = [{
        dialogue: [`Welcome to Chapter ${chapterNum}! This is a test page since ${fileName} couldn't be loaded.`],
        image: null,
        video: null
      }];
      musicRanges = [];

      showChapterTitlePage();
      if (callback) callback();
    });
  });
  stopChapterSelectMusic();
}

function startBackgroundMusic() {
  console.log("Starting background music system...");
  console.log("Current page:", currentPage);
  console.log("Music ranges:", musicRanges);
  console.log("Is audio muted:", isAudioMuted);
  console.log("BG Music volume:", bgMusic.volume);

  updateBackgroundMusic(currentPage);

  if (!bgMusic.src || bgMusic.src === '') {
    console.log("No music set by ranges, using default music");
    bgMusic.src = "MUSIC/NEUTRAL/storytelling.mp3";
  }

  if (!isAudioMuted && bgMusic.volume > 0) {
    console.log("Attempting to start background music:", bgMusic.src);

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        console.log("Background music started successfully:", bgMusic.src);
      }).catch(err => {
        console.warn("Auto-play blocked by browser:", err);
        isPlaying = false;

        const startMusicOnInteraction = () => {
          if (!isPlaying && bgMusic.volume > 0 && !isAudioMuted) {
            console.log("Attempting to start music after user interaction");
            bgMusic.play().then(() => {
              isPlaying = true;
              console.log("Background music started after user interaction");
              document.removeEventListener('click', startMusicOnInteraction);
              document.removeEventListener('keydown', startMusicOnInteraction);
            }).catch(e => {
              console.warn("Still couldn't start music after interaction:", e);
            });
          }
        };

        document.addEventListener('click', startMusicOnInteraction, { once: false });
        document.addEventListener('keydown', startMusicOnInteraction, { once: false });

        console.log("Music will start after first user interaction");
      });
    }
  } else {
    console.log("Background music not started - muted or volume is 0");
  }
}

function handleChoice(choiceIndex, button) {
  const page = storyData[currentPage];
  if (!page.choices || !page.choices[choiceIndex]) return;

  const choice = page.choices[choiceIndex];
  const isWrong = choice.isWrong || false;
  const isNeutral = choice.isNeutral || false;

  const allButtons = document.querySelectorAll('.choice-btn');
  allButtons.forEach(btn => btn.disabled = true);

  if (choice.soundEffect) {
    const choiceAudio = new Audio(choice.soundEffect);
    choiceAudio.volume = getCurrentSfxVolume(); 
    choiceAudio.play().catch(err => console.warn("Choice sound failed:", err));
  }

  if (choice.specialPage) {
    button.classList.add('correct');
    setTimeout(() => {
      handleSpecialPageNavigation(choice.specialPage, choice.specialData);
    }, 800);
    return;
  }

  if (isNeutral) {
    button.classList.add('neutral');
    setTimeout(() => {
      if (choice.jumpTo !== undefined) {
        currentPage = choice.jumpTo;
        showPage(currentPage);
      } else {
        nextPage();
      }
    }, 800);
  } else if (!isWrong) {
    button.classList.add('correct');
    setTimeout(() => {
      if (choice.jumpTo !== undefined) {
        currentPage = choice.jumpTo;
        showPage(currentPage);
      } else {
        nextPage();
      }
    }, 800);
  } else {
    button.classList.add('wrong');
    setTimeout(() => {
      if (choice.jumpTo !== undefined) {
        currentPage = choice.jumpTo;
        showPage(currentPage);
      } else {
        allButtons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('wrong');
        });
      }
    }, 800);
  }
}

function handleSpecialPageNavigation(specialPage, specialData = {}) {
  console.log(`Navigating to special page: ${specialPage}`, specialData);

  switch (specialPage) {
    case 'home':
      goHome();
      break;

    case 'credits':
      showCredits();
      break;

    case 'chapter':
      if (specialData.chapterNumber) {
        loadChapter(specialData.chapterNumber);
      } else {
        console.warn('Chapter number not specified for chapter navigation');
        showChapterSelect();
      }
      break;

    case 'chapterSelect':
      showChapterSelect();
      break;

    case 'intro':
      showIntro();
      break;

    default:
      console.warn(`Unknown special page: ${specialPage}`);

      goHome();
      break;
  }
}

function handleSpecialPageNavigation(specialPage, specialData = {}) {
  console.log(`Navigating to special page: ${specialPage}`, specialData);

  switch (specialPage) {
    case 'home':
      goHome();
      break;

    case 'credits':
      showCredits();
      break;

    case 'chapter':
      if (specialData.chapterNumber) {
        loadChapter(specialData.chapterNumber);
      } else {
        console.warn('Chapter number not specified for chapter navigation');
        showChapterSelect();
      }
      break;

    case 'chapterSelect':
      showChapterSelect();
      break;

    case 'intro':
      showIntro();
      break;

    default:
      console.warn(`Unknown special page: ${specialPage}`);

      goHome();
      break;
  }
}

function showPage(index) {
  pageViewCount++;
  console.log(`📄 === SHOWING PAGE ${pageViewCount} (index: ${index}) ===`);

  logVolumeState('page-start');

  const bg = document.getElementById("background");
  const container = document.getElementById("story-container");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  container.innerHTML = "";
  const oldVideos = bg.querySelectorAll("video.story-video");
  oldVideos.forEach(v => v.remove());
  bg.style.backgroundImage = "";

  const page = storyData[index];
  const imageEl = document.getElementById("page-image");

  if (page.video && page.video.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = page.video;
    video.className = "story-video";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("preload", "auto");
    bg.appendChild(video);
    imageEl.style.display = "none";
    imageEl.src = "";
  } 
  else if (page.image) {
    imageEl.src = page.image;
    imageEl.style.display = "block";
    bg.style.backgroundImage = "";
  }
  else {
    imageEl.style.display = "none";
    imageEl.src = "";
  }

  if (page.dialogueBoxes && page.dialogueBoxes.length > 0) {
    page.dialogueBoxes.forEach(dialogueData => {
      const dialogueBox = document.createElement("div");
      dialogueBox.className = `dialogue-box ${dialogueData.styleClass || ""}`;
      const fontSizeSlider = document.getElementById('fontSizeSlider');
      const fontSizeValue = fontSizeSlider ? fontSizeSlider.value : 1.2;
      dialogueBox.style.fontSize = `${fontSizeValue}rem`;
      const p = document.createElement("p");
      p.innerHTML = processTextWithGlossary(dialogueData.text);
      dialogueBox.appendChild(p);
      container.appendChild(dialogueBox);
    });
  }
  else if (page.dialogue && page.dialogue.length > 0) {
    const dialogueBox = document.createElement("div");
    dialogueBox.className = `dialogue-box ${page.styleClass || ""}`;
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = fontSizeSlider ? fontSizeSlider.value : 1.2;
    dialogueBox.style.fontSize = `${fontSizeValue}rem`;
    page.dialogue.forEach(line => {
      const p = document.createElement("p");
      p.innerHTML = processTextWithGlossary(line);
      dialogueBox.appendChild(p);
    });
    container.appendChild(dialogueBox);
  }

  if (page.choices && page.choices.length > 0) {
    const choiceContainer = document.createElement("div");
    choiceContainer.className = `choice-container`;
    if (page.choiceStyle) {
      choiceContainer.classList.add(page.choiceStyle);
    } else {
      choiceContainer.classList.add('choice-style-1');
    }

    const choiceDescription = document.createElement("div");
    choiceDescription.className = "choice-description";
    const defaultQuestion = currentLanguage === 'tl' ? "Ano ang dapat gawin?" : "What should you do?";
    choiceDescription.innerHTML = page.choiceQuestion || defaultQuestion;
    choiceContainer.appendChild(choiceDescription);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "choice-buttons-wrapper";

    page.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.textContent = choice.text;
      button.onclick = () => handleChoice(index, button);
      if (choice.isTranslucent) {
        button.classList.add('translucent');
      }
      buttonsWrapper.appendChild(button);
    });

    choiceContainer.appendChild(buttonsWrapper);
    container.appendChild(choiceContainer);

    prevBtn.style.display = currentPage > 0 ? "flex" : "none";
    nextBtn.style.display = "none";
  } else {
    const cameFromChoice = storyData.some((p, i) => 
      p.choices && p.choices.some(c => c.jumpTo === index)
    );

    if (cameFromChoice) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = currentPage > 0 ? "flex" : "none";
    }
    nextBtn.style.display = currentPage < storyData.length - 1 ? "flex" : "none";
  }

  updateBackgroundMusic(index);

  console.log(`🎵 Processing audio for page ${pageViewCount}...`);

  if (page.bgAudio) {
  console.log(`🎵 Page has bgAudio: ${page.bgAudio}`);

  logVolumeState('before-audio-setup');

  pageAudio.pause();
  pageAudio.src = page.bgAudio;

  const sliderValue = document.getElementById('narrationSlider')?.value || originalNarrationVolume;
  const clampedOriginalVolume = Math.min(Math.max(parseFloat(sliderValue), 0), 1);
  const calculatedVolume = isAudioMuted ? 0 : clampedOriginalVolume;

  originalNarrationVolume = clampedOriginalVolume;

  console.log(`🎵 Volume calculation for page ${pageViewCount}:`);
  console.log(`  isAudioMuted: ${isAudioMuted}`);
  console.log(`  sliderValue: ${sliderValue}`);
  console.log(`  clampedOriginalVolume: ${clampedOriginalVolume}`);
  console.log(`  calculatedVolume: ${calculatedVolume}`);

  try {
    pageAudio.volume = calculatedVolume;
    console.log(`🎵 Set pageAudio.volume to: ${pageAudio.volume}`);
  } catch (error) {
    console.error(`❌ Volume setting error: ${error.message}`);
    console.error(`  Attempted volume: ${calculatedVolume}`);

    pageAudio.volume = isAudioMuted ? 0 : 0.9;
    originalNarrationVolume = 0.9;
    console.log(`🎵 Fallback volume set to: ${pageAudio.volume}`);
  }

  logVolumeState('after-volume-set');

  applyNarrationSpeed();

  const autoplayCheckbox = document.getElementById('autoplayCheckbox');
  const autoplayEnabled = autoplayCheckbox ? autoplayCheckbox.checked : true;

  if (autoplayEnabled && !isAudioMuted && pageAudio.volume > 0) {
    console.log(`🎵 Attempting to play audio (volume: ${pageAudio.volume})`);
    const audioPlayPromise = pageAudio.play();
    if (audioPlayPromise !== undefined) {
      audioPlayPromise.then(() => {
        console.log(`✅ Page audio started successfully on page ${pageViewCount}`);
        logVolumeState('audio-playing');
      }).catch(err => {
        console.warn(`❌ Page audio failed on page ${pageViewCount}:`, err);
        logVolumeState('audio-failed');
      });
    }
  } else {
    console.log(`🔇 Audio not played - autoplay:${autoplayEnabled}, muted:${isAudioMuted}, vol:${pageAudio.volume}`);
    logVolumeState('audio-not-played');
  }
} else {
  console.log(`🔇 No bgAudio for page ${pageViewCount}`);
  pageAudio.pause();
  pageAudio.src = "";
  logVolumeState('no-audio');
}

  console.log(`📄 === END PAGE ${pageViewCount} ===`);
}

function dumpVolumeDebugLog() {
  console.log("=== COMPLETE VOLUME DEBUG LOG ===");
  volumeDebugLog.forEach((entry, i) => {
    console.log(`${i}: [${entry.context}] Page ${entry.pageViewCount}:`, entry);
  });
  console.log("=== END DEBUG LOG ===");

  return volumeDebugLog;
}

function debugVolumeState() {
  console.log('=== VOLUME DEBUG STATE ===');
  console.log('isAudioMuted:', isAudioMuted);
  console.log('originalNarrationVolume:', originalNarrationVolume);
  console.log('pageAudio.volume:', pageAudio.volume);
  console.log('narrationSlider.value:', document.getElementById('narrationSlider')?.value);
  console.log('========================');
}

function nextPage() {
  if (currentPage < storyData.length - 1) {
    currentPage++;
    showPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
}

document.getElementById("next")?.addEventListener("click", nextPage);
document.getElementById("prev")?.addEventListener("click", prevPage);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSettings();
    closeInformation();
    closeBookmarksPopup();
    cancelOverwrite();
  }
  if (e.key === 'b' || e.key === 'B') {
    if (document.getElementById("story-page")?.style.display === "block") {
      openBookmarksPopup();
    }
  }
  if (e.key === 'g' || e.key === 'G') {
    if (document.getElementById("story-page")?.style.display === "block") {
      openBookmarksPopup();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {

  initializeLanguageSystem();

  setTimeout(initializeTutorialGlossary, 500);

  loadNarrationSpeedPreference();
  loadBookmarks();
  initializeAudioSystem();
  initializeSliderListeners();

  initializeHomescreenMusic();

  setTimeout(() => {
    if (document.getElementById("opening-screen").style.display !== "none") {
      startHomescreenMusic();
    }
  }, 1000); 
});
let creditsLanguage = 'en';

function showCredits() {
  stopHomescreenMusic(); 

  console.log("Showing credits screen...");

  document.getElementById("opening-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("dedication-screen").style.display = "none";
  document.getElementById("chapter-select").style.display = "none";
  document.getElementById("story-page").style.display = "none";
  document.getElementById("top-nav").style.display = "none";

  document.getElementById("credits-screen").style.display = "flex";

  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    console.log("Paused background music for credits");
  }
  if (pageAudio && !pageAudio.paused) {
    pageAudio.pause();
    console.log("Paused page audio for credits");
  }

  startCreditsMusic();

  setTimeout(() => {
    startCreditsAnimation();
  }, 100);
}

function startCreditsMusic() {
  console.log("Starting credits music...");

  if (creditsMusic) {
    creditsMusic.pause();
    creditsMusic.currentTime = 0;
  }

  creditsMusic = new Audio("MUSIC/SINCERE.mp3"); 
  creditsMusic.loop = true;

  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const bgVolume = bgMusicSlider ? parseFloat(bgMusicSlider.value) : 0.3;
  creditsMusic.volume = isAudioMuted ? 0 : bgVolume;

  console.log(`Credits music volume set to: ${creditsMusic.volume}`);
  console.log(`Audio muted status: ${isAudioMuted}`);

  creditsMusic.addEventListener('loadstart', () => {
    console.log("Credits music started loading...");
  });

  creditsMusic.addEventListener('canplay', () => {
    console.log("Credits music can start playing");
  });

  creditsMusic.addEventListener('error', (e) => {
    console.error("Credits music error:", e);
    console.error("Failed to load:", creditsMusic.src);
  });

  if (!isAudioMuted && creditsMusic.volume > 0) {
    console.log("Attempting to play credits music...");

    const playPromise = creditsMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("✅ Credits music started successfully");
      }).catch(err => {
        console.warn("❌ Credits music autoplay blocked:", err.message);

        const startCreditsOnInteraction = (event) => {
    if (creditsMusic && creditsMusic.paused && !isAudioMuted) {
      creditsMusic.play().then(() => {
        console.log("✅ Credits music started after user interaction");

        removeInteractionListeners();
      }).catch(e => {
        console.warn("❌ Still couldn't start credits music:", e.message);
      });
    }
  };

  const removeInteractionListeners = () => {
    document.removeEventListener('click', startCreditsOnInteraction);
    document.removeEventListener('keydown', startCreditsOnInteraction);
    document.removeEventListener('touchstart', startCreditsOnInteraction);
    document.removeEventListener('mousemove', startCreditsOnInteraction);
  };

  document.addEventListener('click', startCreditsOnInteraction, { once: true });
  document.addEventListener('keydown', startCreditsOnInteraction, { once: true });

        console.log("Credits music will start after ANY user interaction");
      });
    }
  } else {
    console.log("Credits music not started - audio is muted or volume is 0");
    console.log(`Muted: ${isAudioMuted}, Volume: ${creditsMusic.volume}`);
  }
}

function toggleAllAudio() {
  const audioIcon = document.getElementById('audio-toggle');
  const audioImg = audioIcon ? audioIcon.querySelector('img') : null;

  if (!isAudioMuted) {

    originalBgVolume = document.getElementById('bgMusicSlider')?.value || 0.2;
    originalNarrationVolume = document.getElementById('narrationSlider')?.value || 1.0;

    bgMusic.volume = 0;
    pageAudio.volume = 0;
    if (creditsMusic) creditsMusic.volume = 0;
    if (homescreenMusic) homescreenMusic.volume = 0;
    if (chapterSelectMusic) chapterSelectMusic.volume = 0;

    isAudioMuted = true;

    if (audioImg) {
      audioImg.src = 'ICONS/mute icon.png'; 
      audioImg.alt = 'Audio Muted';
    }

    if (audioIcon) {
      const muteTitle = currentLanguage === 'tl' ? 
        'Audio Naka-mute - I-click para I-enable' :
        'Audio Muted - Click to Enable';
      audioIcon.title = muteTitle;
    }

    updateAudioSliders(0, 0);
    console.log('All audio muted including homescreen and chapter select music');

  } else {

    bgMusic.volume = originalBgVolume;
    pageAudio.volume = originalNarrationVolume;

    if (creditsMusic) {
      creditsMusic.volume = originalBgVolume;
    }
    if (homescreenMusic && isHomescreenMusicPlaying) {
      homescreenMusic.volume = originalBgVolume * 0.75;
    }
    if (chapterSelectMusic && isChapterSelectMusicPlaying) {
      chapterSelectMusic.volume = originalBgVolume * 0.75;
    }

    isAudioMuted = false;

    if (audioImg) {
      audioImg.src = 'ICONS/sound icon.png';
      audioImg.alt = 'Toggle Audio';
    }

    if (audioIcon) {
      const toggleTitle = currentLanguage === 'tl' ? 
        'I-toggle ang Audio' :
        'Toggle Audio';
      audioIcon.title = toggleTitle;
    }

    updateAudioSliders(originalBgVolume, originalNarrationVolume);
    applyNarrationSpeed();

    const currentScreen = getCurrentActiveScreen();

    if (currentScreen === 'opening-screen' && homescreenMusic && homescreenMusic.paused) {
      homescreenMusic.play().catch(err => console.warn('Could not restart homescreen music:', err));
    } else if (currentScreen === 'chapter-select' && chapterSelectMusic && chapterSelectMusic.paused) {
      chapterSelectMusic.play().catch(err => console.warn('Could not restart chapter select music:', err));
    } else if (currentScreen === 'story-page' && !isPlaying && originalBgVolume > 0) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          console.log('Background music started after unmuting');
        }).catch(err => {
          console.warn('Could not start background music after unmuting:', err);
        });
      }
    } else if (currentScreen === 'credits-screen' && creditsMusic && creditsMusic.paused) {
      creditsMusic.play().catch(err => console.warn('Could not restart credits music:', err));
    }

    console.log('All audio unmuted');
  }
}
function updateAudioSliders(bgVolume, narrationVolume, sfxVolume = null) {
  const bgMusicSlider = document.getElementById('bgMusicSlider');
  const narrationSlider = document.getElementById('narrationSlider');
  const sfxSlider = document.getElementById('sfxSlider');
  const bgMusicDisplay = document.getElementById('bg-music-display');
  const narrationDisplay = document.getElementById('narration-display');
  const sfxDisplay = document.getElementById('sfx-display');

  if (bgMusicSlider) bgMusicSlider.value = bgVolume;
  if (narrationSlider) narrationSlider.value = narrationVolume;
  if (sfxSlider && sfxVolume !== null) sfxSlider.value = sfxVolume;

  if (bgMusicDisplay) bgMusicDisplay.textContent = `(${Math.round(bgVolume * 100)}%)`;
  if (narrationDisplay) narrationDisplay.textContent = `(${Math.round(narrationVolume * 100)}%)`;
  if (sfxDisplay && sfxVolume !== null) sfxDisplay.textContent = `(${Math.round(sfxVolume * 100)}%)`;
}

function getCurrentSfxVolume() {
  if (isAudioMuted) return 0;
  const sfxSlider = document.getElementById('sfxSlider');
  return sfxSlider ? sfxSlider.value : 1.0;
}

    let debugTimer = 0;
    let debugInterval;

    function updateDebugInfo(status) {
      document.getElementById('debug-status').textContent = ``;
    }

    function startDebugTimer() {
      debugTimer = 0;
      if (debugInterval) clearInterval(debugInterval);

      debugInterval = setInterval(() => {
        debugTimer++;
        document.getElementById('debug-timer').textContent = ``;
      }, 1000);
    }

    function stopDebugTimer() {
      if (debugInterval) {
        clearInterval(debugInterval);
        debugInterval = null;
      }
    }

    function startCreditsAnimation() {
      updateDebugInfo('Starting animation...');
      startDebugTimer();

      const creditsContent = document.getElementById("credits-content");
      const homeBtn = document.getElementById("credits-home-btn");

      if (!creditsContent || !homeBtn) {
        updateDebugInfo('ERROR: Elements not found!');
        console.error("Credits elements not found");
        return;
      }

      if (creditsScrollTimeout) {
        clearTimeout(creditsScrollTimeout);
        updateDebugInfo('Cleared existing timeout');
      }

      creditsContent.style.transform = "translateY(0)";
      creditsContent.classList.remove("credits-scrolling");
      homeBtn.classList.remove("visible");
      homeBtn.style.display = "none";
      updateDebugInfo('Reset complete');

      creditsContent.offsetHeight;

      setTimeout(() => {
        creditsContent.classList.add("credits-scrolling");
        updateDebugInfo('Animation started - 30s duration');
        console.log("Credits scrolling animation started");

        creditsScrollTimeout = setTimeout(() => {
          homeBtn.style.display = "block";
          homeBtn.classList.add("visible");
          updateDebugInfo('Animation complete - button shown');
          stopDebugTimer();
          console.log("Credits scroll completed, showing home button");
        }, 29000); 
      }, 500);
    }

    function showHomeButton() {
      const homeBtn = document.getElementById("credits-home-btn");
      homeBtn.style.display = "block";
      homeBtn.classList.add("visible");
      updateDebugInfo('Home button shown manually');
    }

    function resetCredits() {
      const creditsContent = document.getElementById("credits-content");
      const homeBtn = document.getElementById("credits-home-btn");

      if (creditsScrollTimeout) {
        clearTimeout(creditsScrollTimeout);
        creditsScrollTimeout = null;
      }

      creditsContent.style.transform = "translateY(0)";
      creditsContent.classList.remove("credits-scrolling");
      homeBtn.classList.remove("visible");
      homeBtn.style.display = "none";

      updateDebugInfo('Credits reset');
      stopDebugTimer();
      debugTimer = 0;
      document.getElementById('debug-timer').textContent = ``;
    }

    function testScrollSpeed() {
      const creditsContent = document.getElementById("credits-content");

      resetCredits();

      setTimeout(() => {
        creditsContent.style.animation = "creditsScroll 3s linear forwards";
        updateDebugInfo('Fast scroll test (3s)');

        setTimeout(() => {
          showHomeButton();
          updateDebugInfo('Fast test complete');

          setTimeout(() => {
            creditsContent.style.animation = "";
            resetCredits();
          }, 1000);
        }, 3000);
      }, 100);
    }

    function goHomeFromCredits() {
      updateDebugInfo('Going home...');

      if (creditsScrollTimeout) {
        clearTimeout(creditsScrollTimeout);
        creditsScrollTimeout = null;
      }

      stopDebugTimer();

      alert('Would navigate back to home screen');

      resetCredits();
    }

    document.addEventListener('DOMContentLoaded', function() {
      updateDebugInfo('');
      console.log('Credits test page loaded');
    });

    document.addEventListener('keydown', function(e) {
      switch(e.key) {
        case ' ': 
          e.preventDefault();
          startCreditsAnimation();
          break;
        case 'r': 
          resetCredits();
          break;
        case 'h': 
          showHomeButton();
          break;
        case 't': 
          testScrollSpeed();
          break;
      }
    });