const { useState, useEffect, useMemo, useRef } = React;

/* ── Firebase 설정 ── */

// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS_LX_alM7yNEqFngVKUhKrGRGZFC14BQ",
  authDomain: "hwaso-3e4be.firebaseapp.com",
  databaseURL: "https://hwaso-3e4be-default-rtdb.firebaseio.com",
  projectId: "hwaso-3e4be",
  storageBucket: "hwaso-3e4be.firebasestorage.app",
  messagingSenderId: "551881565674",
  appId: "1:551881565674:web:092f3c862f18f221bdbe93",
  measurementId: "G-8LH4KDFC89"
};

// Initialize Firebase


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

/* ── Design System ── */
const ACCENT       = "#2ECC71";
const ACCENT_LIGHT = "#1a3a28";
const BORDER       = "#2e2e2e";

const globalStyle = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Pretendard', sans-serif; background: #1c1c1e; color: #f0f0f0; -webkit-font-smoothing: antialiased; }
    .scroll-container::-webkit-scrollbar { width: 3px; }
    .scroll-container::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
    
    header { border-bottom: 1px solid ${BORDER}; position: sticky; top: 0; z-index: 100; background: #1c1c1e; }
    .grid-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
    .grid-card { cursor: pointer; text-align: center; }
    .grid-img { width: 100%; aspect-ratio: 1/1; border-radius: 12px; object-fit: cover; border: 1px solid ${BORDER}; background: #2a2a2c; }
    
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; }
    .modal-content { background: #242426; width: 100%; max-width: 600px; margin: 0 auto; border-top-left-radius: 25px; border-top-right-radius: 25px; max-height: 94vh; overflow-y: auto; padding: 25px; }
    
    .section-label { font-size: 10px; color: #888; font-weight: 800; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .concept-card { padding: 20px; border: 1px solid ${BORDER}; border-radius: 12px; margin: 0 20px 10px; cursor: pointer; }
    .accordion { margin-top: 15px; background: #2a2a2c; padding: 20px; border-radius: 15px; line-height: 1.7; white-space: pre-wrap; font-size: 14px; }

    .search-container { padding: 15px 20px; background: #1c1c1e; border-bottom: 1px solid ${BORDER}; }
    .search-input { width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid ${BORDER}; background: #2a2a2c; outline: none; font-size: 14px; transition: all 0.2s; color: #f0f0f0; }
    .search-input:focus { border-color: ${ACCENT}; background: #333336; }
    .search-results { padding: 10px 20px; background: #242426; position: absolute; width: 100%; max-width: 720px; z-index: 90; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .search-item { padding: 12px 0; border-bottom: 1px solid #2e2e2e; cursor: pointer; }
    .search-tag { display: inline-block; font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${ACCENT_LIGHT}; color: ${ACCENT}; font-weight: 700; margin-right: 8px; vertical-align: middle; }

    .hashtag-link { color: ${ACCENT}; font-weight: 700; cursor: pointer; margin-right: 8px; text-decoration: none; }
    .hashtag-link:hover { text-decoration: underline; }
    .hashtag-group-title { font-size: 12px; font-weight: 800; color: #f0f0f0; margin: 25px 0 10px; padding-left: 10px; border-left: 3px solid ${ACCENT}; }

    /* 로그인 화면 */
    .login-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 40px 20px; }
    .login-btn { display: flex; align-items: center; gap: 12px; padding: 14px 28px; border: 1px solid ${BORDER}; border-radius: 12px; background: #242426; font-size: 15px; font-weight: 700; cursor: pointer; color: #f0f0f0; box-shadow: 0 2px 16px rgba(0,0,0,0.4); transition: box-shadow 0.2s; }
    .login-btn:hover { box-shadow: 0 4px 24px rgba(46,204,113,0.25); }
    .saving-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2ECC71; margin-left: 6px; vertical-align: middle; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    input::placeholder, textarea::placeholder { color: #555 !important; }
    input, textarea, select { color-scheme: dark; }
    * { -webkit-tap-highlight-color: transparent; }

    /* ── 페이지 전환 슬라이드 애니메이션 ── */
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes slideOutLeft {
        from { transform: translateX(0);    opacity: 1; }
        to   { transform: translateX(-100%); opacity: 0; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0);   opacity: 1; }
        to   { transform: translateX(100%); opacity: 0; }
    }
    .page-slide-in-right  { animation: slideInRight 0.42s cubic-bezier(0.32,0,0.12,1) both; }
    .page-slide-in-left   { animation: slideInLeft  0.42s cubic-bezier(0.32,0,0.12,1) both; }
    .page-slide-out-left  { animation: slideOutLeft  0.42s cubic-bezier(0.32,0,0.12,1) both; }
    .page-slide-out-right { animation: slideOutRight 0.42s cubic-bezier(0.32,0,0.12,1) both; }
    .page-container { position: relative; overflow: hidden; will-change: transform; }
`;

/* ── Data Schemas ── */
/* ── 영화 스키마 (EMPTY_FILM) ── */
const EMPTY_FILM = {
    id: null,
    poster: null,           // base64 이미지
    title: "",              // 제목
    watchDate: "",          // 감상일
    watchMethod: "",        // 감상 방식
    production: {           // 제작 세부항목 (카드 배열)
        연출: [], 시나리오: [], 촬영: [], 조명: [], 미술: [],
        음향: [], 편집: [], 연기: [], 제작사: [], 배급사: []
    },
    year: "",               // 제작 연도
    country: "",            // 국가
    review: "",             // 감상 (긴 텍스트)
    questions: "",          // 질문
    scraps: [],             // 스크랩 [{title, url}]
    impressions: [],        // 인상깊은 것 [{category, content}]
    hashtags: "",           // 해시태그
};
const EMPTY_MUSIC = EMPTY_FILM; // 하위 호환용 alias
/* ── 빛 분석 스키마 ── */
const EMPTY_LIGHT = {
    id: null,
    title: "",          // 제목
    analysisDate: "",   // 분석 날짜
    production: {       // 제작진 카드 배열
        감독: [], 촬영: [], 미술: [], 조명: [], 편집: [], 컬러그레이딩: []
    },
    hashtags: "",       // 전체 해시태그
    imageCards: [],     // [{still, sceneTitle, sceneUrl, context, texture, emotion,
                        //   time, space, artAndIcon, figureMove, cameraGaze,
                        //   lightAndLighting, symbolInner, symbolOuter, hashtags}]
};

/* ── 소리 분석 스키마 ── */
const EMPTY_SOUND = {
    id: null,
    title: "",
    analysisDate: "",
    production: { 감독:[], 음향:[], 음악:[], 편집:[], 믹싱:[], 기타:[] },
    hashtags: "",
    soundCards: [],  // [{still, sceneTitle, sceneUrl, space, time, dialogue,
                     //   music, sfx, breath, meaningInner, meaningOuter, hashtags}]
};

/* ── 시간 분석 스키마 ── */
const EMPTY_TIME = {
    id: null,
    title: "",
    analysisDate: "",
    production: { 연출:[], 배우:[], 기타:[] },
    material: "",       // 소재
    plot: "",           // 플롯
    story: "",          // 스토리
    hashtags: "",
    characterCards: [], // [{photo, scenes:[{title,url}], name, external, inner,
                        //   habitus, desire, lack, emotion, journey, meaning,
                        //   acting, scraps:[{title,url}]}]
};

const EMPTY_COMPOSER   = { id: null, name: "", photo: null, description: "", traits: "", workIds: [], anecdotes: "", scraps: "", hashtags: "" };
const EMPTY_GENRE      = { id: null, name: "", photo: null, summary: "", traits: "", anecdotes: "", scraps: "", hashtags: "" };
const EMPTY_INSTRUMENT = { id: null, name: "", photo: null, summary: "", detail: "", traits: "", usage: "", artist: "", anecdotes: "", scraps: "", hashtags: "" };
const EMPTY_CONCEPT    = { id: null, name: "", summary: "", detail: "", usage: "", anecdotes: "", scraps: "", hashtags: "" };

/* ── 맥락 분석 스키마 ── */
const EMPTY_CONTEXT = {
    id: null,
    coverImage: null,       // base64 대표 이미지
    name: "",               // 맥락명
    period: "",             // 시기
    scope: "",              // 범위
    overview: "",           // 개요
    meaning: "",            // 의미
    traits: [],             // 특징 카드 배열 [{category, content}]  category: 형식|상징|정서|환경|서사
    works: [],              // 대표 작품 [{title, year, director}]
    hashtags: "",           // 해시태그
};

/* ── 예술가 스키마 ── */
const EMPTY_ARTIST = {
    id: null,
    photo: null,          // base64 인물 이미지
    name: "",             // 이름
    nationality: "",      // 국적
    birth: "",            // 출생
    death: "",            // 사망
    occupation: "",       // 직업
    works: [],            // 작품 [{title, year, role}]
    description: "",      // 설명
    asHuman: "",          // 인간으로서
    asArtist: "",         // 예술가로서
    values: {             // 가치관
        human: "",        // 인간을 어떻게 이해하는가?
        world: "",        // 세계를 어떻게 이해하는가?
        self: "",         // 자신을 어떻게 이해하는가?
    },
    quotes: "",           // 어록
    scraps: [],           // 스크랩 [{title, url}]
    hashtags: "",         // 해시태그
};

function Polyphonic() {
    /* ── Auth & 로딩 상태 ── */
    const [user,        setUser]        = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [saving,      setSaving]      = useState(false);
    const syncEnabled = useRef(false);

    const [activeTab, setActiveTab] = useState("library");
    const [view, setView] = useState("list");
    const [slideClass, setSlideClass] = useState("");
    const slideTimer = useRef(null);

    // 방향을 고려한 뷰 전환 헬퍼
    // direction: 'forward' (오른쪽→왼쪽 슬라이드인) | 'back' (왼쪽→오른쪽 슬라이드인)
    const navigateTo = (nextView, direction = 'forward') => {
        if (slideTimer.current) clearTimeout(slideTimer.current);
        const inClass  = direction === 'forward' ? 'page-slide-in-right' : 'page-slide-in-left';
        setSlideClass(inClass);
        setView(nextView);
        slideTimer.current = setTimeout(() => setSlideClass(""), 460);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [targetHashtag, setTargetHashtag] = useState("");

    const [musics,      setMusics]      = useState([]);
    const [composers,   setComposers]   = useState([]);
    const [genres,      setGenres]      = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [concepts,    setConcepts]    = useState([]);
    const [lights,      setLights]      = useState([]);
    const [sounds,      setSounds]      = useState([]);
    const [times,       setTimes]       = useState([]);
    const [contexts,    setContexts]    = useState([]);
    const [artists,     setArtists]     = useState([]);

    useEffect(() => {
        // 5초 안에 auth 응답 없으면 강제로 로딩 해제 (네트워크 오류 대비)
        const fallbackTimer = setTimeout(() => {
            setAuthLoading(false);
        }, 5000);

        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            clearTimeout(fallbackTimer);
            setUser(u);
            if (u) {
                try {
                    const snap = await db.collection('users').doc(u.uid).get();
                    if (snap.exists) {
                        const d = snap.data();
                        if (d.musics)      setMusics(d.musics);
                        if (d.composers)   setComposers(d.composers);
                        if (d.genres)      setGenres(d.genres);
                        if (d.instruments) setInstruments(d.instruments);
                        if (d.concepts)    setConcepts(d.concepts);
                        if (d.lights)      setLights(d.lights);
                        if (d.sounds)      setSounds(d.sounds);
                        if (d.times)       setTimes(d.times);
                        if (d.contexts)    setContexts(d.contexts);
                        if (d.artists)     setArtists(d.artists);
                    }
                } catch (e) {
                    console.error("Firestore 로드 오류:", e);
                }
            } else {
                setMusics([]); setComposers([]); setGenres([]); setInstruments([]); setConcepts([]);
                setLights([]); setSounds([]); setTimes([]); setContexts([]); setArtists([]);
                syncEnabled.current = false;
            }
            syncEnabled.current = true;
            setAuthLoading(false);
        });
        return () => { clearTimeout(fallbackTimer); unsubscribe(); };
    }, []);

    useEffect(() => {
        if (!syncEnabled.current || !user) return;
        setSaving(true);
        const timer = setTimeout(() => {
            db.collection('users').doc(user.uid)
                .set({ musics, composers, genres, instruments, concepts, lights, sounds, times, contexts, artists })
                .then(() => setSaving(false))
                .catch(e => { console.error("저장 오류:", e); setSaving(false); });
        }, 800);
        return () => clearTimeout(timer);
    }, [musics, composers, genres, instruments, concepts, lights, sounds, times, contexts, artists]);

    const [showModal, setShowModal] = useState({ music: false, comp: false, genre: false, instrument: false, concept: false, light: false, sound: false, time: false, context: false, artist: false });
    const [forms, setForms] = useState({ music: EMPTY_MUSIC, comp: EMPTY_COMPOSER, genre: EMPTY_GENRE, instrument: EMPTY_INSTRUMENT, concept: EMPTY_CONCEPT, light: EMPTY_LIGHT, sound: EMPTY_SOUND, time: EMPTY_TIME, context: EMPTY_CONTEXT, artist: EMPTY_ARTIST });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showCompositionLayer, setShowCompositionLayer] = useState(false);
    const [searchMore, setSearchMore] = useState(false);          // more 검색 결과 표시
    const [searchExpandedSections, setSearchExpandedSections] = useState({});  // 섹션별 펼침 상태
    const [viewBeforeHashtag, setViewBeforeHashtag] = useState("list"); // 해시태그 페이지 이전 view

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return { hashtags: [], items: [] };
        const q = searchQuery.toLowerCase();
        const isHashtagQuery = searchQuery.trim().startsWith('#');

        // 해시태그 검색
        const allHashtags = new Set();
        const allData = [
            ...musics, ...lights, ...sounds, ...times, ...contexts, ...artists,
            ...composers, ...genres, ...instruments, ...concepts
        ];
        allData.forEach(item => {
            (item.hashtags||'').split(' ').filter(t=>t).forEach(t => {
                const tag = t.startsWith('#') ? t : '#'+t;
                if (tag.toLowerCase().includes(q) || (isHashtagQuery && tag.toLowerCase().includes(q.replace('#','')))) {
                    allHashtags.add(tag);
                }
            });
            // soundCards, imageCards, characterCards 해시태그도 수집
            [...(item.soundCards||[]), ...(item.imageCards||[]), ...(item.characterCards||[])].forEach(c => {
                (c.hashtags||'').split(' ').filter(t=>t).forEach(t => {
                    const tag = t.startsWith('#') ? t : '#'+t;
                    if (tag.toLowerCase().includes(q)) allHashtags.add(tag);
                });
            });
        });

        if (isHashtagQuery) {
            return { hashtags: Array.from(allHashtags).slice(0, 10), items: [] };
        }

        const matchText = (obj) => {
            return Object.values(obj).some(v => {
                if (typeof v === 'string' && !v.startsWith('data:image')) return v.toLowerCase().includes(q);
                if (Array.isArray(v)) return v.some(sub => typeof sub === 'object' && sub !== null && matchText(sub));
                if (typeof v === 'object' && v !== null) return matchText(v);
                return false;
            });
        };

        const results = [];

        // 1. 영화
        musics.forEach(m => {
            if (matchText(m)) results.push({ _section:'영화', _tab:'library', _tabType:'library', _title: m.title||'(제목 없음)', _img: m.poster, _item: m });
        });
        // 2. 예술가
        artists.forEach(a => {
            if (matchText(a)) results.push({ _section:'예술가', _tab:'composer', _tabType:'artist', _title: a.name||'(이름 없음)', _img: a.photo, _item: a });
        });
        // 3. 빛 (부모 카드)
        lights.forEach(l => {
            if (matchText(l)) results.push({ _section:'빛', _tab:'light', _tabType:'light', _title: l.title||'(제목 없음)', _img: (l.imageCards||[]).find(c=>c.still)?.still, _item: l });
        });
        // 4. 이미지 카드 (빛의 서브카드)
        lights.forEach(l => {
            (l.imageCards||[]).forEach((c,i) => {
                if (matchText(c)) results.push({ _section:'이미지 카드', _tab:'light', _tabType:'light', _title: c.sceneTitle||`이미지 카드 ${i+1}`, _img: c.still, _item: l, _subCard: true });
            });
        });
        // 5. 소리 (부모 카드)
        sounds.forEach(s => {
            if (matchText(s)) results.push({ _section:'소리', _tab:'instrument', _tabType:'sound', _title: s.title||'(제목 없음)', _img: (s.soundCards||[]).find(c=>c.still)?.still, _item: s });
        });
        // 6. 사운드 카드 (소리의 서브카드)
        sounds.forEach(s => {
            (s.soundCards||[]).forEach((c,i) => {
                if (matchText(c)) results.push({ _section:'사운드 카드', _tab:'instrument', _tabType:'sound', _title: c.sceneTitle||`사운드 카드 ${i+1}`, _img: c.still, _item: s, _subCard: true });
            });
        });
        // 7. 시간 (부모 카드)
        times.forEach(t => {
            if (matchText(t)) results.push({ _section:'시간', _tab:'concept', _tabType:'time', _title: t.title||'(제목 없음)', _img: (t.characterCards||[]).find(c=>c.photo)?.photo, _item: t });
        });
        // 8. 인물 카드 (시간의 서브카드)
        times.forEach(t => {
            (t.characterCards||[]).forEach((c,i) => {
                if (matchText(c)) results.push({ _section:'인물 카드', _tab:'concept', _tabType:'time', _title: c.name||`인물 ${i+1}`, _img: c.photo, _item: t, _subCard: true });
            });
        });
        // 9. 맥락
        contexts.forEach(ctx => {
            if (matchText(ctx)) results.push({ _section:'맥락', _tab:'context', _tabType:'context', _title: ctx.name||'(맥락명 없음)', _img: ctx.coverImage, _item: ctx });
        });

        return { hashtags: Array.from(allHashtags).slice(0, 5), items: results };
    }, [searchQuery, musics, lights, sounds, times, contexts, artists, composers, genres, instruments, concepts]);

    const hashtagFilteredData = useMemo(() => {
        if (!targetHashtag) return [];
        const norm = targetHashtag.startsWith('#') ? targetHashtag : '#'+targetHashtag;
        const check = (item) => (item.hashtags||'').split(' ').some(h => {
            const t = h.startsWith('#') ? h : '#'+h;
            return t === norm;
        });
        const checkSub = (cards) => cards.filter(c => (c.hashtags||'').split(' ').some(h => {
            const t = h.startsWith('#') ? h : '#'+h;
            return t === norm;
        }));

        const rows = [];
        // 영화
        musics.filter(check).forEach(m => rows.push({ _section:'영화', _tab:'library', _title: m.title||'(제목 없음)', _img: m.poster, _item: m }));
        // 예술가
        artists.filter(check).forEach(a => rows.push({ _section:'예술가', _tab:'composer', _title: a.name||'(이름 없음)', _img: a.photo, _item: a }));
        // 빛
        lights.filter(check).forEach(l => rows.push({ _section:'빛', _tab:'light', _title: l.title||'(제목 없음)', _img: (l.imageCards||[]).find(c=>c.still)?.still, _item: l }));
        // 이미지 카드
        lights.forEach(l => checkSub(l.imageCards||[]).forEach(c => rows.push({ _section:'이미지 카드', _tab:'light', _title: c.sceneTitle||'이미지 카드', _img: c.still, _item: l })));
        // 소리
        sounds.filter(check).forEach(s => rows.push({ _section:'소리', _tab:'instrument', _title: s.title||'(제목 없음)', _img: (s.soundCards||[]).find(c=>c.still)?.still, _item: s }));
        // 사운드 카드
        sounds.forEach(s => checkSub(s.soundCards||[]).forEach(c => rows.push({ _section:'사운드 카드', _tab:'instrument', _title: c.sceneTitle||'사운드 카드', _img: c.still, _item: s })));
        // 시간
        times.filter(check).forEach(t => rows.push({ _section:'시간', _tab:'concept', _title: t.title||'(제목 없음)', _img: (t.characterCards||[]).find(c=>c.photo)?.photo, _item: t }));
        // 인물 카드
        times.forEach(t => checkSub(t.characterCards||[]).forEach(c => rows.push({ _section:'인물 카드', _tab:'concept', _title: c.name||'인물', _img: c.photo, _item: t })));
        // 맥락
        contexts.filter(check).forEach(ctx => rows.push({ _section:'맥락', _tab:'context', _title: ctx.name||'(맥락명 없음)', _img: ctx.coverImage, _item: ctx }));

        return rows;
    }, [targetHashtag, musics, lights, sounds, times, contexts, artists, composers, genres, instruments, concepts]);

    const handleImgUrl = (url, type) => {
        setForms(prev => ({ ...prev, [type]: { ...prev[type], photo: url } }));
    };

    /* 탭 → 데이터 타입 매핑 */
    const tabToType = (tab) => {
        if (tab === 'library')    return 'library';
        if (tab === 'light')      return 'light';
        if (tab === 'instrument') return 'sound';
        if (tab === 'concept')    return 'time';
        if (tab === 'context')    return 'context';
        if (tab === 'composer')   return 'artist';
        return tab;
    };

    const openAddModal = () => {
        if (activeTab === 'light') {
            setForms(prev => ({ ...prev, light: { ...EMPTY_LIGHT } }));
            setShowModal(prev => ({ ...prev, light: true }));
            return;
        }
        if (activeTab === 'instrument') {
            setForms(prev => ({ ...prev, sound: { ...EMPTY_SOUND } }));
            setShowModal(prev => ({ ...prev, sound: true }));
            return;
        }
        if (activeTab === 'concept') {
            setForms(prev => ({ ...prev, time: { ...EMPTY_TIME } }));
            setShowModal(prev => ({ ...prev, time: true }));
            return;
        }
        if (activeTab === 'context') {
            setForms(prev => ({ ...prev, context: { ...EMPTY_CONTEXT } }));
            setShowModal(prev => ({ ...prev, context: true }));
            return;
        }
        if (activeTab === 'composer') {
            setForms(prev => ({ ...prev, artist: { ...EMPTY_ARTIST } }));
            setShowModal(prev => ({ ...prev, artist: true }));
            return;
        }
        const type     = tabToType(activeTab);
        const key      = type === 'library' ? 'music' : type === 'composer' ? 'comp' : type;
        const emptyVal = type === 'library' ? EMPTY_MUSIC : type === 'composer' ? EMPTY_COMPOSER : type === 'genre' ? EMPTY_GENRE : type === 'instrument' ? EMPTY_INSTRUMENT : EMPTY_CONCEPT;
        setForms(prev => ({ ...prev, [key]: emptyVal }));
        setShowModal(prev => ({ ...prev, [key]: true }));
    };

    if (authLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 24, color: "#4CD44A" }}>HWASO</div>
                <div style={{ fontSize: 13, color: '#666' }}>로딩 중...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <style>{globalStyle}</style>
                <div className="login-screen">
                    <div style={{ fontWeight: 900, fontSize: 36, marginBottom: 8, color: "#4CD44A" }}>HWASO</div>
                    <div style={{ fontSize: 14, color: '#888', marginBottom: 48 }}>영화 아카이빙 앱</div>
                    <button className="login-btn" onClick={() => auth.signInWithPopup(provider)}>
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                        Google로 로그인
                    </button>
                    <div style={{ marginTop: 24, fontSize: 12, color: '#555', textAlign: 'center', lineHeight: 1.8 }}>
                        로그인하면 모든 기기에서<br />데이터가 자동으로 동기화됩니다.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            <style>{globalStyle}</style>

            {/* ── 헤더 ── */}
            <header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 55 }}>
                    <div onClick={() => { setActiveTab("library"); navigateTo("list","back"); setSearchQuery(""); }} style={{ cursor: "pointer", fontWeight: 900, fontSize: 20 }}>
                        <span style={{ color:"#4CD44A" }}>HWASO</span>
                        {saving && <span className="saving-dot" title="저장 중..." />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {user.photoURL && <img src={user.photoURL} style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${BORDER}` }} />}
                            <button onClick={() => auth.signOut()} style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: '#888', cursor: 'pointer' }}>
                                로그아웃
                            </button>
                        </div>
                        <button onClick={openAddModal} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                            + 추가
                        </button>
                    </div>
                </div>
                <div className="search-container">
                    <input className="search-input" placeholder="무엇이든 검색하세요..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchMore(false); setSearchExpandedSections({}); }} />
                </div>
            </header>

            {/* ── 검색 결과 드롭다운 ── */}
            {searchQuery && !searchMore && (
                <div className="search-results scroll-container" style={{ maxHeight: '75vh', overflowY: 'auto', left: '50%', transform: 'translateX(-50%)' }}>
                    {/* 해시태그 제안 */}
                    {searchResults.hashtags.length > 0 && (
                        <div style={{ padding: '10px 0 4px' }}>
                            <div style={{ fontSize:10, fontWeight:800, color:'#555', letterSpacing:'0.5px', padding:'0 4px 6px' }}>해시태그</div>
                            {searchResults.hashtags.map((tag, i) => (
                                <div key={i} className="search-item" style={{ display:'flex', alignItems:'center', gap:8 }}
                                    onClick={() => {
                                        setTargetHashtag(tag);
                                        setViewBeforeHashtag(view);
                                        navigateTo('hashtagPage','forward');
                                        setSearchQuery('');
                                    }}>
                                    <span style={{ fontSize:18, lineHeight:1 }}>#</span>
                                    <span style={{ fontSize:15, fontWeight:700, color: ACCENT }}>{tag.replace('#','')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* 텍스트 검색 결과 — 최대 6개 */}
                    {searchResults.items.length > 0 && (
                        <div style={{ paddingTop: searchResults.hashtags.length > 0 ? 8 : 0 }}>
                            {searchResults.hashtags.length > 0 && <div style={{ height:1, background: BORDER, margin:'4px 0 8px' }} />}
                            <div style={{ fontSize:10, fontWeight:800, color:'#555', letterSpacing:'0.5px', padding:'0 4px 6px' }}>검색 결과</div>
                            {searchResults.items.slice(0, 6).map((r, idx) => (
                                <div key={idx} className="search-item" onClick={() => {
                                    setSelectedItem(r._item);
                                    setActiveTab(r._tab);
                                    navigateTo('detail','forward');
                                    setSearchQuery('');
                                    setSearchMore(false);
                                }} style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <span className="search-tag">{r._section}</span>
                                    <span style={{ fontSize:14, fontWeight:600, color:'#e0e0e0', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r._title}</span>
                                </div>
                            ))}
                            {searchResults.items.length > 6 && (
                                <div onClick={() => setSearchMore(true)}
                                    style={{ padding:'12px', textAlign:'center', fontSize:13, fontWeight:700, color: ACCENT, cursor:'pointer', borderTop:`1px solid ${BORDER}`, marginTop:4 }}>
                                    more ({searchResults.items.length - 6}개 더보기) →
                                </div>
                            )}
                        </div>
                    )}
                    {searchResults.hashtags.length === 0 && searchResults.items.length === 0 && (
                        <div style={{ padding:'20px', textAlign:'center', color:'#555', fontSize:13 }}>검색 결과가 없습니다.</div>
                    )}
                </div>
            )}

            {/* ── more 전체 검색 결과 페이지 ── */}
            {searchMore && searchQuery && (
                <div style={{ position:'fixed', inset:0, background:'#1c1c1e', zIndex:500, overflowY:'auto', paddingBottom:80 }}>
                    <div style={{ position:'sticky', top:0, background:'#1c1c1e', borderBottom:`1px solid ${BORDER}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, zIndex:10 }}>
                        <button onClick={() => setSearchMore(false)} style={{ background:'none', border:'none', color:ACCENT, fontWeight:700, fontSize:14, cursor:'pointer', flexShrink:0 }}>← 닫기</button>
                        <span style={{ fontSize:14, fontWeight:800, flex:1 }}>
                            <span style={{ color:ACCENT }}>"{searchQuery}"</span> 검색 결과 {searchResults.items.length}개
                        </span>
                    </div>
                    {/* 섹션별 그룹핑 — 6개 초과 시 우측 상단 더보기/접기 */}
                    {['영화','예술가','빛','이미지 카드','소리','사운드 카드','시간','인물 카드','맥락'].map(section => {
                        const sectionItems = searchResults.items.filter(r => r._section === section);
                        if (sectionItems.length === 0) return null;
                        const isExpSec = searchExpandedSections[section];
                        const visibleItems = isExpSec ? sectionItems : sectionItems.slice(0, 6);
                        const hasMoreItems = sectionItems.length > 6;
                        return (
                            <div key={section} style={{ padding:'20px 20px 0' }}>
                                {/* 소제목 + 더보기 버튼 (우측 상단) */}
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                                    <div style={{ fontSize:11, fontWeight:800, color:'#d0d0d0', paddingLeft:8, borderLeft:`3px solid ${ACCENT}`, letterSpacing:'0.4px' }}>
                                        {section.toUpperCase()}
                                        <span style={{ color:'#555', fontWeight:500, marginLeft:6 }}>({sectionItems.length})</span>
                                    </div>
                                    {hasMoreItems && (
                                        <button onClick={() => setSearchExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))}
                                            style={{ padding:'4px 12px', border:`1px solid ${BORDER}`, borderRadius:20,
                                                background:'#1c1c1e', color:ACCENT, fontWeight:700,
                                                fontSize:11, cursor:'pointer', flexShrink:0 }}>
                                            {isExpSec ? '▲ 접기' : `더보기 +${sectionItems.length - 6}`}
                                        </button>
                                    )}
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
                                    {visibleItems.map((r, idx) => (
                                        <div key={idx} onClick={() => {
                                            setSelectedItem(r._item);
                                            setActiveTab(r._tab);
                                            navigateTo('detail','forward');
                                            setSearchMore(false);
                                            setSearchQuery('');
                                        }} style={{ cursor:'pointer', borderRadius:10, overflow:'hidden', border:`1px solid ${BORDER}`, background:'#1c1c1e' }}>
                                            <div style={{ width:'100%', aspectRatio:'1/1', background:'#0d0d0d', overflow:'hidden', position:'relative' }}>
                                                {r._img
                                                    ? <img src={r._img} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaaaaa', fontSize:20 }}>
                                                        {section==='영화'?'🎬':section==='예술가'?'🎨':section==='빛'||section==='이미지 카드'?'🎞':section==='소리'||section==='사운드 카드'?'🎧':section==='시간'||section==='인물 카드'?'🎭':'🌐'}
                                                      </div>
                                                }
                                                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.65))', padding:'16px 7px 7px' }}>
                                                    <div style={{ fontSize:11, fontWeight:700, color:'#fff', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{r._title}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── 메인 ── */}
            <main className={slideClass} style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 80 }}>

                {view === "list" && (
                    <div>
                        {activeTab === "library" && (
                            musics.length === 0
                            ? <div style={{ padding: '60px 20px', textAlign: 'center', color: '#555', fontSize: 14 }}>아직 기록된 영화가 없습니다.<br/>상단 + 추가를 눌러 첫 영화를 기록해보세요.</div>
                            : musics.map(m => (
                                <div key={m.id} onClick={() => { setSelectedItem(m); navigateTo("detail","forward"); }}
                                    style={{ display: 'flex', gap: 14, padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', alignItems: 'flex-start' }}>
                                    {/* 포스터 */}
                                    <div style={{ flexShrink: 0, width: 60, aspectRatio: '2/3', borderRadius: 8, overflow: 'hidden', background: '#2a2a2c', border: `1px solid ${BORDER}` }}>
                                        {m.poster
                                            ? <img src={m.poster} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎬</div>
                                        }
                                    </div>
                                    {/* 텍스트 */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title || m.filmTitle || '(제목 없음)'}</div>
                                        <div style={{ fontSize: 12, color: '#777', marginBottom: 6 }}>{m.watchDate || ''}</div>
                                        {m.questions && <div style={{ fontSize: 13, color: '#aaaaaa', lineHeight: 1.5, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.questions}</div>}
                                        {m.hashtags && <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{m.hashtags.split(' ').slice(0,4).map(t => t.startsWith('#') ? t : '#'+t).join(' ')}</div>}
                                    </div>
                                </div>
                            ))
                        )}
                        {/* 빛 탭 — 전용 카드 */}
                        {activeTab === "light" && (
                            lights.length === 0
                            ? <div style={{ padding:'60px 20px', textAlign:'center', color:'#555', fontSize:14 }}>아직 분석된 빛이 없습니다.<br/>상단 + 추가를 눌러 첫 장면을 분석해보세요.</div>
                            : <div style={{ padding: '16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                                {lights.map(item => {
                                    const firstStill = (item.imageCards||[]).find(c => c.still);
                                    return (
                                        <div key={item.id} onClick={() => { setSelectedItem(item); navigateTo("detail","forward"); }}
                                            style={{ borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'pointer', background:'#1c1c1e' }}>
                                            {/* 대표 스틸컷 — 16:9 */}
                                            <div style={{ width:'100%', aspectRatio:'16/9', background:'#0d0d0d', overflow:'hidden' }}>
                                                {firstStill
                                                    ? <img src={firstStill.still} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:28 }}>🎞</div>
                                                }
                                            </div>
                                            {/* 대표 정보 */}
                                            <div style={{ padding:'12px 14px' }}>
                                                <div style={{ fontSize:16, fontWeight:800, marginBottom:3 }}>{item.title || '(제목 없음)'}</div>
                                                <div style={{ fontSize:12, color:'#777', marginBottom:6 }}>
                                                    {item.analysisDate && <span>{item.analysisDate}</span>}
                                                    {item.analysisDate && (item.imageCards||[]).length > 0 && <span style={{margin:'0 6px'}}>·</span>}
                                                    {(item.imageCards||[]).length > 0 && <span>이미지 {(item.imageCards||[]).length}장</span>}
                                                </div>
                                                {item.hashtags && <div style={{ fontSize:11, color:ACCENT, fontWeight:600 }}>{item.hashtags.split(' ').slice(0,5).map(t=>t.startsWith('#')?t:'#'+t).join(' ')}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                              </div>
                        )}

                        {/* 소리 탭 — 전용 카드 */}
                        {activeTab === "instrument" && (
                            sounds.length === 0
                            ? <div style={{ padding:'60px 20px', textAlign:'center', color:'#555', fontSize:14 }}>아직 분석된 소리가 없습니다.<br/>상단 + 추가를 눌러 첫 장면을 분석해보세요.</div>
                            : <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                                {sounds.map(item => {
                                    const firstStill = (item.soundCards||[]).find(c => c.still);
                                    return (
                                        <div key={item.id} onClick={() => { setSelectedItem(item); navigateTo("detail","forward"); }}
                                            style={{ borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'pointer', background:'#1c1c1e' }}>
                                            <div style={{ width:'100%', aspectRatio:'16/9', background:'#0d0d0d', overflow:'hidden' }}>
                                                {firstStill
                                                    ? <img src={firstStill.still} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:28 }}>🎧</div>
                                                }
                                            </div>
                                            <div style={{ padding:'12px 14px' }}>
                                                <div style={{ fontSize:16, fontWeight:800, marginBottom:3 }}>{item.title||'(제목 없음)'}</div>
                                                <div style={{ fontSize:12, color:'#777', marginBottom:6 }}>
                                                    {item.analysisDate && <span>{item.analysisDate}</span>}
                                                    {item.analysisDate && (item.soundCards||[]).length>0 && <span style={{margin:'0 6px'}}>·</span>}
                                                    {(item.soundCards||[]).length>0 && <span>사운드 {(item.soundCards||[]).length}장</span>}
                                                </div>
                                                {item.hashtags && <div style={{ fontSize:11, color:ACCENT, fontWeight:600 }}>{item.hashtags.split(' ').slice(0,5).map(t=>t.startsWith('#')?t:'#'+t).join(' ')}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                              </div>
                        )}

                        {/* 맥락 탭 — 전용 카드 */}
                        {activeTab === "context" && (
                            contexts.length === 0
                            ? <div style={{ padding:'60px 20px', textAlign:'center', color:'#555', fontSize:14 }}>아직 기록된 맥락이 없습니다.<br/>상단 + 추가를 눌러 첫 맥락을 기록해보세요.</div>
                            : <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                                {contexts.map(item => (
                                    <div key={item.id} onClick={() => { setSelectedItem(item); navigateTo("detail","forward"); }}
                                        style={{ borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'pointer', background:'#1c1c1e' }}>
                                        {/* 대표 이미지 — 16:9 */}
                                        <div style={{ width:'100%', aspectRatio:'16/9', background:'#0d0d0d', overflow:'hidden', position:'relative' }}>
                                            {item.coverImage
                                                ? <img src={item.coverImage} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:28 }}>🌐</div>
                                            }
                                            {/* 오버레이 정보 */}
                                            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'14px 16px' }}>
                                                <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:4, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{item.name||'(맥락명 없음)'}</div>
                                                <div style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center' }}>
                                                    {item.period && <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{item.period}</span>}
                                                    {item.period && item.scope && <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>·</span>}
                                                    {item.scope  && <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{item.scope}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 해시태그 */}
                                        {item.hashtags && (
                                            <div style={{ padding:'10px 14px' }}>
                                                <div style={{ fontSize:11, color:ACCENT, fontWeight:600 }}>{item.hashtags.split(' ').slice(0,5).map(t=>t.startsWith('#')?t:'#'+t).join(' ')}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                              </div>
                        )}
                        {/* 예술가 탭 — 1:1 오버레이 카드 */}
                        {activeTab === "composer" && (
                            artists.length === 0
                            ? <div style={{ padding:'60px 20px', textAlign:'center', color:'#555', fontSize:14 }}>아직 기록된 예술가가 없습니다.<br/>상단 + 추가를 눌러 첫 예술가를 기록해보세요.</div>
                            : <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                                {artists.map(item => (
                                    <div key={item.id} onClick={() => { setSelectedItem(item); navigateTo("detail","forward"); }}
                                        style={{ borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'pointer', background:'#1c1c1e' }}>
                                        {/* 1:1 이미지 + 오버레이 */}
                                        <div style={{ width:'100%', aspectRatio:'1/1', background:'#0d0d0d', overflow:'hidden', position:'relative' }}>
                                            {item.photo
                                                ? <img src={item.photo} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:36 }}>🎨</div>
                                            }
                                            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'18px 16px' }}>
                                                <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:5, textShadow:'0 2px 6px rgba(0,0,0,0.5)' }}>{item.name||'(이름 없음)'}</div>
                                                <div style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center' }}>
                                                    {item.nationality && <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'2px 8px', borderRadius:20 }}>{item.nationality}</span>}
                                                    {item.occupation  && <span style={{ fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'2px 8px', borderRadius:20 }}>{item.occupation}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 해시태그 */}
                                        {item.hashtags && (
                                            <div style={{ padding:'10px 14px' }}>
                                                <div style={{ fontSize:11, color:ACCENT, fontWeight:600 }}>{item.hashtags.split(' ').slice(0,5).map(t=>t.startsWith('#')?t:'#'+t).join(' ')}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                              </div>
                        )}
                        {activeTab === "concept" && (
                            times.length === 0
                            ? <div style={{ padding:'60px 20px', textAlign:'center', color:'#555', fontSize:14 }}>아직 분석된 시간이 없습니다.<br/>상단 + 추가를 눌러 첫 인물을 분석해보세요.</div>
                            : <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                                {times.map(item => {
                                    const firstPhoto = (item.characterCards||[]).find(c => c.photo);
                                    return (
                                        <div key={item.id} onClick={() => { setSelectedItem(item); navigateTo("detail","forward"); }}
                                            style={{ borderRadius:14, border:`1px solid ${BORDER}`, overflow:'hidden', cursor:'pointer', background:'#1c1c1e' }}>
                                            <div style={{ width:'100%', aspectRatio:'16/9', background:'#0d0d0d', overflow:'hidden' }}>
                                                {firstPhoto
                                                    ? <img src={firstPhoto.photo} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:28 }}>🎭</div>
                                                }
                                            </div>
                                            <div style={{ padding:'12px 14px' }}>
                                                <div style={{ fontSize:16, fontWeight:800, marginBottom:3 }}>{item.title||'(제목 없음)'}</div>
                                                <div style={{ fontSize:12, color:'#777', marginBottom:6 }}>
                                                    {item.analysisDate && <span>{item.analysisDate}</span>}
                                                    {item.analysisDate && (item.characterCards||[]).length>0 && <span style={{margin:'0 6px'}}>·</span>}
                                                    {(item.characterCards||[]).length>0 && <span>인물 {(item.characterCards||[]).length}명</span>}
                                                </div>
                                                {item.hashtags && <div style={{ fontSize:11, color:ACCENT, fontWeight:600 }}>{item.hashtags.split(' ').slice(0,5).map(t=>t.startsWith('#')?t:'#'+t).join(' ')}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                              </div>
                        )}
                    </div>
                )}

                {view === "detail" && (
                    <DetailView
                        type={tabToType(activeTab)} data={selectedItem} musics={musics}
                        onBack={() => navigateTo("list","back")}
                        onHashtagClick={(tag) => { setTargetHashtag(tag); setViewBeforeHashtag('detail'); navigateTo("hashtagPage","forward"); }}
                        onEdit={() => {
                            if (activeTab === 'light') {
                                setForms({ ...forms, light: selectedItem });
                                setShowModal({ ...showModal, light: true });
                                return;
                            }
                            if (activeTab === 'instrument') {
                                setForms({ ...forms, sound: selectedItem });
                                setShowModal({ ...showModal, sound: true });
                                return;
                            }
                            if (activeTab === 'concept') {
                                setForms({ ...forms, time: selectedItem });
                                setShowModal({ ...showModal, time: true });
                                return;
                            }
                            if (activeTab === 'context') {
                                setForms({ ...forms, context: selectedItem });
                                setShowModal({ ...showModal, context: true });
                                return;
                            }
                            if (activeTab === 'composer') {
                                setForms({ ...forms, artist: selectedItem });
                                setShowModal({ ...showModal, artist: true });
                                return;
                            }
                            const type = tabToType(activeTab);
                            const key  = type === 'library' ? 'music' : type === 'composer' ? 'comp' : type;
                            setForms({ ...forms, [key]: selectedItem });
                            setShowModal({ ...showModal, [key]: true });
                        }}
                        onDelete={() => {
                            if (confirm("삭제하시겠습니까?")) {
                                if      (activeTab === "light")      { setLights(lights.filter(x => x.id !== selectedItem.id)); navigateTo("list","back"); return; }
                            if      (activeTab === "instrument")  { setSounds(sounds.filter(x => x.id !== selectedItem.id)); navigateTo("list","back"); return; }
                            if      (activeTab === "concept")     { setTimes(times.filter(x => x.id !== selectedItem.id)); navigateTo("list","back"); return; }
                            if      (activeTab === "context")     { setContexts(contexts.filter(x => x.id !== selectedItem.id)); navigateTo("list","back"); return; }
                            if      (activeTab === "composer")    { setArtists(artists.filter(x => x.id !== selectedItem.id)); navigateTo("list","back"); return; }
                                const type = tabToType(activeTab);
                                if      (type === "library")    setMusics(musics.filter(x => x.id !== selectedItem.id));
                                else if (type === "composer")   setComposers(composers.filter(x => x.id !== selectedItem.id));
                                else if (type === "genre")      setGenres(genres.filter(x => x.id !== selectedItem.id));
                                else if (type === "instrument") setInstruments(instruments.filter(x => x.id !== selectedItem.id));
                                else if (type === "concept")    setConcepts(concepts.filter(x => x.id !== selectedItem.id));
                                navigateTo("list","back");
                            }
                        }}
                    />
                )}

                {view === "hashtagPage" && (
                    <HashtagPage
                        targetHashtag={targetHashtag}
                        hashtagFilteredData={hashtagFilteredData}
                        onBack={() => navigateTo(viewBeforeHashtag || 'list','back')}
                        onCardClick={(r) => {
                            setSelectedItem(r._item);
                            setActiveTab(r._tab);
                            setViewBeforeHashtag('hashtagPage');
                            navigateTo('detail','forward');
                        }}
                    />
                )}
            </main>

            {/* ── 하단 내비게이션 바 ── */}
            <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1c1c1e', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 52, zIndex: 200, maxWidth: 720, margin: '0 auto' }}>
                {[
                    { label: "영화",   key: "library" },
                    { label: "빛",     key: "light" },
                    { label: "소리",   key: "instrument" },
                    { label: "시간",   key: "concept" },
                    { label: "맥락",   key: "context" },
                    { label: "예술가", key: "composer" },
                ].map(t => {
                    const isActive = activeTab === t.key;
                    return (
                        <button key={t.key} onClick={() => { setActiveTab(t.key); navigateTo("list","back"); setSearchQuery(""); }}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: '4px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                            <span style={{
                                fontSize: 11,
                                fontWeight: isActive ? 800 : 400,
                                color: isActive ? ACCENT : "#555",
                                letterSpacing: '0.2px',
                                transition: 'all 0.2s',
                            }}>{t.label}</span>
                            <span style={{
                                display: 'block', width: 3, height: 3, borderRadius: '50%',
                                background: isActive ? ACCENT : 'transparent',
                                transition: 'all 0.2s',
                            }} />
                        </button>
                    );
                })}
            </nav>

            {/* ══ 모달: 영화 ══ */}
            {showModal.music && <FilmModal
                film={forms.music}
                onChange={v => setForms({ ...forms, music: v })}
                onSave={() => {
                    setMusics(forms.music.id
                        ? musics.map(m => m.id === forms.music.id ? forms.music : m)
                        : [{ ...forms.music, id: Date.now() }, ...musics]);
                    setShowModal({ ...showModal, music: false });
                }}
                onClose={() => setShowModal({ ...showModal, music: false })}
            />}

            {/* ══ 모달: 빛 ══ */}
            {showModal.light && <LightModal
                item={forms.light}
                onChange={v => setForms({ ...forms, light: v })}
                onSave={() => {
                    setLights(forms.light.id
                        ? lights.map(l => l.id === forms.light.id ? forms.light : l)
                        : [{ ...forms.light, id: Date.now() }, ...lights]);
                    setShowModal({ ...showModal, light: false });
                }}
                onClose={() => setShowModal({ ...showModal, light: false })}
            />}

            {/* ══ 모달: 소리 ══ */}
            {showModal.sound && <SoundModal
                item={forms.sound}
                onChange={v => setForms({ ...forms, sound: v })}
                onSave={() => {
                    setSounds(forms.sound.id
                        ? sounds.map(s => s.id === forms.sound.id ? forms.sound : s)
                        : [{ ...forms.sound, id: Date.now() }, ...sounds]);
                    setShowModal({ ...showModal, sound: false, time: false });
                }}
                onClose={() => setShowModal({ ...showModal, sound: false })}
            />}

            {/* ══ 모달: 시간 ══ */}
            {showModal.time && <TimeModal
                item={forms.time}
                onChange={v => setForms({ ...forms, time: v })}
                onSave={() => {
                    setTimes(forms.time.id
                        ? times.map(t => t.id === forms.time.id ? forms.time : t)
                        : [{ ...forms.time, id: Date.now() }, ...times]);
                    setShowModal({ ...showModal, time: false });
                }}
                onClose={() => setShowModal({ ...showModal, time: false })}
            />}

            {/* ══ 모달: 맥락 ══ */}
            {showModal.context && <ContextModal
                item={forms.context}
                onChange={v => setForms({ ...forms, context: v })}
                onSave={() => {
                    setContexts(forms.context.id
                        ? contexts.map(c => c.id === forms.context.id ? forms.context : c)
                        : [{ ...forms.context, id: Date.now() }, ...contexts]);
                    setShowModal({ ...showModal, context: false });
                }}
                onClose={() => setShowModal({ ...showModal, context: false })}
            />}

            {/* ══ 모달: 예술가 ══ */}
            {showModal.artist && <ArtistModal
                item={forms.artist}
                onChange={v => setForms({ ...forms, artist: v })}
                onSave={() => {
                    setArtists(forms.artist.id
                        ? artists.map(a => a.id === forms.artist.id ? forms.artist : a)
                        : [{ ...forms.artist, id: Date.now() }, ...artists]);
                    setShowModal({ ...showModal, artist: false });
                }}
                onClose={() => setShowModal({ ...showModal, artist: false })}
            />}

            {/* ══ 모달: 작곡가 ══ */}
            {showModal.comp && <div className="modal-overlay"><div className="modal-content scroll-container">
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>작곡가 등록</h2>
                <div style={{ marginBottom: 20 }}>
                    {forms.comp.photo && <img src={forms.comp.photo} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, marginBottom: 8, border: `1px solid ${BORDER}` }} onError={e => e.target.style.display='none'} />}
                    <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>사진 URL</label>
                    <input type="text" placeholder="이미지 주소를 붙여넣으세요" value={forms.comp.photo || ''} onChange={e => handleImgUrl(e.target.value, 'comp')} style={{ width: '100%', padding: 12, border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none', fontSize: 14 }} />
                </div>
                <Input label="이름"        value={forms.comp.name}        onChange={v => setForms({ ...forms, comp: { ...forms.comp, name: v } })} />
                <Input label="설명" isArea value={forms.comp.description} onChange={v => setForms({ ...forms, comp: { ...forms.comp, description: v } })} />
                <Input label="특징" isArea value={forms.comp.traits}      onChange={v => setForms({ ...forms, comp: { ...forms.comp, traits: v } })} />
                <SearchPicker label="참여 작품" list={musics} filterKey="musicTitle" selectedIds={forms.comp.workIds || []}
                    onSelect={id => setForms({ ...forms, comp: { ...forms.comp, workIds: forms.comp.workIds?.includes(id) ? forms.comp.workIds.filter(x => x !== id) : [...(forms.comp.workIds || []), id] } })} />
                <Input label="여담"  isArea value={forms.comp.anecdotes} onChange={v => setForms({ ...forms, comp: { ...forms.comp, anecdotes: v } })} />
                <Input label="스크랩"       value={forms.comp.scraps}    onChange={v => setForms({ ...forms, comp: { ...forms.comp, scraps: v } })} />
                <Input label="해시태그"     value={forms.comp.hashtags}  onChange={v => setForms({ ...forms, comp: { ...forms.comp, hashtags: v } })} />
                <button onClick={() => { setComposers(forms.comp.id ? composers.map(c => c.id === forms.comp.id ? forms.comp : c) : [{ ...forms.comp, id: Date.now() }, ...composers]); setShowModal({ ...showModal, comp: false }); }} style={{ width: '100%', padding: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>저장</button>
            </div></div>}

            {/* ══ 모달: 장르 ══ */}
            {showModal.genre && <div className="modal-overlay"><div className="modal-content scroll-container">
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>장르 등록</h2>
                <div style={{ marginBottom: 20 }}>
                    {forms.genre.photo && <img src={forms.genre.photo} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, marginBottom: 8, border: `1px solid ${BORDER}` }} onError={e => e.target.style.display='none'} />}
                    <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>사진 URL</label>
                    <input type="text" placeholder="이미지 주소를 붙여넣으세요" value={forms.genre.photo || ''} onChange={e => handleImgUrl(e.target.value, 'genre')} style={{ width: '100%', padding: 12, border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none', fontSize: 14 }} />
                </div>
                <Input label="이름"        value={forms.genre.name}      onChange={v => setForms({ ...forms, genre: { ...forms.genre, name: v } })} />
                <Input label="개요" isArea value={forms.genre.summary}   onChange={v => setForms({ ...forms, genre: { ...forms.genre, summary: v } })} />
                <Input label="특징" isArea value={forms.genre.traits}    onChange={v => setForms({ ...forms, genre: { ...forms.genre, traits: v } })} />
                <Input label="여담" isArea value={forms.genre.anecdotes} onChange={v => setForms({ ...forms, genre: { ...forms.genre, anecdotes: v } })} />
                <Input label="스크랩"       value={forms.genre.scraps}   onChange={v => setForms({ ...forms, genre: { ...forms.genre, scraps: v } })} />
                <Input label="해시태그"     value={forms.genre.hashtags} onChange={v => setForms({ ...forms, genre: { ...forms.genre, hashtags: v } })} />
                <button onClick={() => { setGenres(forms.genre.id ? genres.map(g => g.id === forms.genre.id ? forms.genre : g) : [{ ...forms.genre, id: Date.now() }, ...genres]); setShowModal({ ...showModal, genre: false }); }} style={{ width: '100%', padding: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>저장</button>
            </div></div>}

            {/* ══ 모달: 악기 ══ */}
            {showModal.instrument && <div className="modal-overlay"><div className="modal-content scroll-container">
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>악기 추가</h2>
                <div style={{ marginBottom: 20 }}>
                    {forms.instrument.photo && <img src={forms.instrument.photo} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, marginBottom: 8, border: `1px solid ${BORDER}` }} onError={e => e.target.style.display='none'} />}
                    <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>사진 URL</label>
                    <input type="text" placeholder="이미지 주소를 붙여넣으세요" value={forms.instrument.photo || ''} onChange={e => handleImgUrl(e.target.value, 'instrument')} style={{ width: '100%', padding: 12, border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none', fontSize: 14 }} />
                </div>
                <Input label="이름"           value={forms.instrument.name}      onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, name: v } })} />
                <Input label="개요"    isArea value={forms.instrument.summary}   onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, summary: v } })} />
                <Input label="상세"    isArea value={forms.instrument.detail}    onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, detail: v } })} />
                <Input label="특징"    isArea value={forms.instrument.traits}    onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, traits: v } })} />
                <Input label="활용"    isArea value={forms.instrument.usage}     onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, usage: v } })} />
                <Input label="주요 아티스트"  value={forms.instrument.artist}    onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, artist: v } })} />
                <Input label="여담"    isArea value={forms.instrument.anecdotes} onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, anecdotes: v } })} />
                <Input label="스크랩"         value={forms.instrument.scraps}    onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, scraps: v } })} />
                <Input label="해시태그"       value={forms.instrument.hashtags}  onChange={v => setForms({ ...forms, instrument: { ...forms.instrument, hashtags: v } })} />
                <button onClick={() => { setInstruments(forms.instrument.id ? instruments.map(i => i.id === forms.instrument.id ? forms.instrument : i) : [{ ...forms.instrument, id: Date.now() }, ...instruments]); setShowModal({ ...showModal, instrument: false }); }} style={{ width: '100%', padding: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>저장</button>
            </div></div>}

            {/* ══ 모달: 개념 ══ */}
            {showModal.concept && <div className="modal-overlay"><div className="modal-content scroll-container">
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>개념 추가</h2>
                <Input label="용어명"              value={forms.concept.name}      onChange={v => setForms({ ...forms, concept: { ...forms.concept, name: v } })} />
                <Input label="개요"        isArea value={forms.concept.summary}   onChange={v => setForms({ ...forms, concept: { ...forms.concept, summary: v } })} />
                <Input label="상세"        isArea value={forms.concept.detail}    onChange={v => setForms({ ...forms, concept: { ...forms.concept, detail: v } })} />
                <Input label="활용"        isArea value={forms.concept.usage}     onChange={v => setForms({ ...forms, concept: { ...forms.concept, usage: v } })} />
                <Input label="사례 및 여담" isArea value={forms.concept.anecdotes} onChange={v => setForms({ ...forms, concept: { ...forms.concept, anecdotes: v } })} />
                <Input label="스크랩"              value={forms.concept.scraps}   onChange={v => setForms({ ...forms, concept: { ...forms.concept, scraps: v } })} />
                <Input label="해시태그"            value={forms.concept.hashtags} onChange={v => setForms({ ...forms, concept: { ...forms.concept, hashtags: v } })} />
                <button onClick={() => { setConcepts(forms.concept.id ? concepts.map(c => c.id === forms.concept.id ? forms.concept : c) : [{ ...forms.concept, id: Date.now() }, ...concepts]); setShowModal({ ...showModal, concept: false }); }} style={{ width: '100%', padding: 18, background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>저장</button>
            </div></div>}

            {/* ══ 구성 분석 레이어 ══ */}
            {showCompositionLayer && <div className="modal-overlay" style={{ zIndex: 1100, alignItems: 'center' }}><div style={{ background: '#1c1c1e', width: '90%', maxWidth: 400, borderRadius: 20, padding: 25 }}>
                <h3 style={{ marginBottom: 20, color: ACCENT }}>구성 분석</h3>
                {['melody', 'harmony', 'rhythm', 'timbre', 'dynamics'].map(k => (
                    <div key={k} style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>{k.toUpperCase()}</label>
                        <textarea value={forms.music.composition[k]} onChange={e => setForms({ ...forms, music: { ...forms.music, composition: { ...forms.music.composition, [k]: e.target.value } } })} style={{ width: '100%', padding: 8, border: `1px solid ${BORDER}`, borderRadius: 8 }} rows={2} />
                    </div>
                ))}
                <button onClick={() => setShowCompositionLayer(false)} style={{ width: '100%', padding: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>완료</button>
            </div></div>}
        </div>
    );
}

/* ══════════════════════════════════════════════
   FilmModal — 영화 추가/수정 모달
══════════════════════════════════════════════ */
function FilmModal({ film, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...film, [key]: val });
    const setProd = (cat, val) => onChange({ ...film, production: { ...film.production, [cat]: val } });

    const PROD_CATS = ['연출','시나리오','촬영','조명','미술','음향','편집','연기','제작사','배급사'];
    const IMP_CATS  = ['빛','소리','시간','맥락','예술가'];

    const [openProd, setOpenProd] = React.useState(null); // 열린 제작 카테고리
    const [newProdVal, setNewProdVal] = React.useState('');
    const [newScrapTitle, setNewScrapTitle] = React.useState('');
    const [newScrapUrl,   setNewScrapUrl]   = React.useState('');
    const [impCat,   setImpCat]   = React.useState('빛');
    const [impText,  setImpText]  = React.useState('');

    const scraps     = film.scraps      || [];
    const imps       = film.impressions || [];
    const production = film.production  || {};

    const handlePosterUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => set('poster', ev.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            {/* 헤더 */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>영화 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 포스터 업로드 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">포스터</div>
                {film.poster
                    ? <div style={{ position:'relative', marginBottom: 8 }}>
                        <img src={film.poster} style={{ width:'100%', aspectRatio:'2/3', objectFit:'cover', borderRadius:12, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={() => set('poster', null)}
                            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:16, borderRadius:12, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        📷 이미지 파일 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handlePosterUpload} />
                      </label>
                }
            </div>

            {/* 제목 */}
            <FInput label="제목" value={film.title||''} onChange={v => set('title', v)} />

            {/* 감상일 */}
            <FInput label="감상일" value={film.watchDate||''} onChange={v => set('watchDate', v)} placeholder="예: 2025-06-01" />

            {/* 감상 방식 */}
            <FInput label="감상 방식" value={film.watchMethod||''} onChange={v => set('watchMethod', v)} placeholder="예: 극장, OTT, DVD..." />

            {/* 제작 — 카테고리별 카드 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">제작</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom: 10 }}>
                    {PROD_CATS.map(cat => (
                        <button key={cat} onClick={() => setOpenProd(openProd === cat ? null : cat)}
                            style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${openProd===cat ? ACCENT : BORDER}`,
                                background: openProd===cat ? ACCENT_LIGHT : '#242426',
                                color: openProd===cat ? ACCENT : '#555', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                            {(production[cat]||[]).length > 0 && <span style={{ marginLeft:4, background:ACCENT, color:'#fff', borderRadius:10, padding:'0 5px', fontSize:10 }}>{(production[cat]||[]).length}</span>}
                        </button>
                    ))}
                </div>
                {openProd && (
                    <div style={{ background:'#2a2a2c', borderRadius:12, padding:14 }}>
                        <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:ACCENT }}>{openProd}</div>
                        {(production[openProd]||[]).map((item, i) => (
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:'#1c1c1e', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                                <span style={{ fontSize:13 }}>{item}</span>
                                <button onClick={() => setProd(openProd, (production[openProd]||[]).filter((_,j)=>j!==i))}
                                    style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                            </div>
                        ))}
                        <div style={{ display:'flex', gap:6, marginTop:4 }}>
                            <input value={newProdVal} onChange={e=>setNewProdVal(e.target.value)}
                                onKeyDown={e=>{ if(e.key==='Enter'&&newProdVal.trim()){ setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]); setNewProdVal(''); }}}
                                placeholder={`${openProd} 추가...`}
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <button onClick={()=>{ if(newProdVal.trim()){ setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]); setNewProdVal(''); }}}
                                style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700 }}>+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 제작 연도 */}
            <FInput label="제작 연도" value={film.year||''} onChange={v => set('year', v)} placeholder="예: 1994" />

            {/* 국가 */}
            <FInput label="국가" value={film.country||''} onChange={v => set('country', v)} placeholder="예: 미국, 프랑스..." />

            {/* 감상 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">감상</div>
                <textarea value={film.review||''} onChange={e=>set('review',e.target.value)}
                    placeholder="영화를 보고 느낀 점을 자유롭게 적어보세요..."
                    style={{ width:'100%', minHeight:160, padding:14, border:`1px solid ${BORDER}`, borderRadius:12,
                        fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
            </div>

            {/* 질문 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">질문</div>
                <textarea value={film.questions||''} onChange={e=>set('questions',e.target.value)}
                    placeholder="이 영화에 대해 생긴 질문들..."
                    style={{ width:'100%', minHeight:80, padding:14, border:`1px solid ${BORDER}`, borderRadius:12,
                        fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
            </div>

            {/* 스크랩 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">스크랩</div>
                {scraps.map((s,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <a href={s.url} target="_blank" style={{ color:ACCENT, fontWeight:600, fontSize:13, textDecoration:'none' }}>{s.title||s.url}</a>
                        <button onClick={() => set('scraps', scraps.filter((_,j)=>j!==i))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                ))}
                <div style={{ display:'flex', flexDirection:'column', gap:6, padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <input value={newScrapTitle} onChange={e=>setNewScrapTitle(e.target.value)}
                        placeholder="제목 (클릭하면 링크로 이동)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <input value={newScrapUrl} onChange={e=>setNewScrapUrl(e.target.value)}
                        placeholder="URL (https://...)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={()=>{ if(newScrapTitle.trim()||newScrapUrl.trim()){ set('scraps',[...scraps,{title:newScrapTitle.trim(),url:newScrapUrl.trim()}]); setNewScrapTitle(''); setNewScrapUrl(''); }}}
                        style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 스크랩 추가</button>
                </div>
            </div>

            {/* 인상깊은 것 */}
            <div style={{ marginBottom: 24 }}>
                <div className="section-label">인상깊은 것</div>
                {/* 카테고리 선택 */}
                <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
                    {IMP_CATS.map(cat => (
                        <button key={cat} onClick={() => setImpCat(cat)}
                            style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${impCat===cat ? ACCENT : BORDER}`,
                                background: impCat===cat ? ACCENT_LIGHT : '#242426',
                                color: impCat===cat ? ACCENT : '#555', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                        </button>
                    ))}
                </div>
                {/* 해당 카테고리 카드 목록 */}
                {imps.filter(x=>x.category===impCat).map((imp,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <div>
                            <span style={{ fontSize:10, color:ACCENT, fontWeight:700 }}>{imp.category}</span>
                            <div style={{ fontSize:13, marginTop:2, lineHeight:1.6 }}>{imp.content}</div>
                        </div>
                        <button onClick={() => set('impressions', imps.filter(x=>!(x.category===imp.category&&x.content===imp.content)))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16, flexShrink:0 }}>×</button>
                    </div>
                ))}
                <div style={{ display:'flex', gap:6 }}>
                    <textarea value={impText} onChange={e=>setImpText(e.target.value)}
                        placeholder={`${impCat}에 대한 인상깊은 장면, 느낌...`}
                        style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0', resize:'none', minHeight:60, fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={()=>{ if(impText.trim()){ set('impressions',[...imps,{category:impCat,content:impText.trim()}]); setImpText(''); }}}
                        style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, alignSelf:'flex-end' }}>+</button>
                </div>
            </div>

            {/* 해시태그 */}
            <FInput label="해시태그 (스페이스로 구분, # 자동 적용)" value={film.hashtags||''} onChange={v => set('hashtags', v)} placeholder="#영화 #감상 ..." />

            {/* 저장 버튼 */}
            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer', marginTop:8 }}>
                저장
            </button>
          </div>
        </div>
    );
}

/* 모달용 간단 인풋 */
function FInput({ label, value, onChange, placeholder }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div className="section-label">{label}</div>
            <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||''}
                style={{ width:'100%', padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
        </div>
    );
}


/* ══════════════════════════════════════════════
   LightModal — 빛 분석 추가/수정 모달
══════════════════════════════════════════════ */
function LightModal({ item, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...item, [key]: val });
    const setProd = (cat, val) => onChange({ ...item, production: { ...item.production, [cat]: val } });

    const PROD_CATS = ['감독','촬영','미술','조명','편집','컬러그레이딩'];
    const production  = item.production  || {};
    const imageCards  = item.imageCards  || [];

    const [openProd,   setOpenProd]   = React.useState(null);
    const [newProdVal, setNewProdVal] = React.useState('');
    const [showImgSub, setShowImgSub] = React.useState(false);
    const [editingCard, setEditingCard] = React.useState(null); // null=new, idx=edit

    const EMPTY_IMGCARD = {
        still: null, sceneTitle:'', sceneUrl:'', context:'', texture:'',
        emotion:'', time:'', space:'', artAndIcon:'', figureMove:'',
        cameraGaze:'', lightAndLighting:'', symbolInner:'', symbolOuter:'', hashtags:''
    };
    const [draftCard, setDraftCard] = React.useState(EMPTY_IMGCARD);

    const openNewCard = () => { setDraftCard({...EMPTY_IMGCARD}); setEditingCard(null); setShowImgSub(true); };
    const openEditCard = (idx) => { setDraftCard({...imageCards[idx]}); setEditingCard(idx); setShowImgSub(true); };
    const saveCard = () => {
        const updated = editingCard !== null
            ? imageCards.map((c,i) => i===editingCard ? draftCard : c)
            : [...imageCards, draftCard];
        set('imageCards', updated);
        setShowImgSub(false);
    };
    const removeCard = (idx) => set('imageCards', imageCards.filter((_,i)=>i!==idx));

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            {/* 헤더 */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>빛 분석 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 제목 */}
            <FInput label="제목" value={item.title||''} onChange={v=>set('title',v)} placeholder="분석 대상 제목 (예: 영화명 · 장면명)" />

            {/* 분석 날짜 */}
            <FInput label="분석 날짜" value={item.analysisDate||''} onChange={v=>set('analysisDate',v)} placeholder="예: 2025-06-01" />

            {/* 제작 카테고리 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">제작</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {PROD_CATS.map(cat=>(
                        <button key={cat} onClick={()=>setOpenProd(openProd===cat?null:cat)}
                            style={{ padding:'5px 12px', borderRadius:20,
                                border:`1px solid ${openProd===cat?ACCENT:BORDER}`,
                                background:openProd===cat?ACCENT_LIGHT:'#242426',
                                color:openProd===cat?ACCENT:'#555', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                            {(production[cat]||[]).length>0 && <span style={{ marginLeft:4, background:ACCENT, color:'#fff', borderRadius:10, padding:'0 5px', fontSize:10 }}>{(production[cat]||[]).length}</span>}
                        </button>
                    ))}
                </div>
                {openProd && (
                    <div style={{ background:'#2a2a2c', borderRadius:12, padding:14 }}>
                        <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:ACCENT }}>{openProd}</div>
                        {(production[openProd]||[]).map((name,i)=>(
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', background:'#1c1c1e', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                                <span style={{ fontSize:13 }}>{name}</span>
                                <button onClick={()=>setProd(openProd,(production[openProd]||[]).filter((_,j)=>j!==i))}
                                    style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                            </div>
                        ))}
                        <div style={{ display:'flex', gap:6 }}>
                            <input value={newProdVal} onChange={e=>setNewProdVal(e.target.value)}
                                onKeyDown={e=>{if(e.key==='Enter'&&newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                placeholder={`${openProd} 추가...`}
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <button onClick={()=>{if(newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700 }}>+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 전체 해시태그 */}
            <FInput label="전체 해시태그" value={item.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#빛 #영화 ..." />

            {/* 이미지 카드 목록 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">이미지 카드 ({imageCards.length}장)</div>
                {imageCards.map((card,i)=>(
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:10, marginBottom:8, border:`1px solid ${BORDER}` }}>
                        <div style={{ width:52, height:30, borderRadius:6, overflow:'hidden', background:'#333336', flexShrink:0 }}>
                            {card.still
                                ? <img src={card.still} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🎞</div>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{card.sceneTitle||`카드 ${i+1}`}</div>
                            {card.hashtags && <div style={{ fontSize:11, color:ACCENT }}>{card.hashtags.split(' ').slice(0,3).join(' ')}</div>}
                        </div>
                        <button onClick={()=>openEditCard(i)} style={{ background:'none', border:'none', color:'#666', fontSize:12, cursor:'pointer', padding:'4px 6px' }}>수정</button>
                        <button onClick={()=>removeCard(i)}   style={{ background:'none', border:'none', color:'#E05555', fontSize:16, cursor:'pointer' }}>×</button>
                    </div>
                ))}
                <button onClick={openNewCard}
                    style={{ width:'100%', padding:12, border:`2px dashed ${BORDER}`, borderRadius:10, background:'none', color:ACCENT, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    + 이미지 카드 추가
                </button>
            </div>

            {/* 저장 */}
            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer' }}>
                저장
            </button>
          </div>

          {/* 이미지 카드 세부 서브모달 */}
          {showImgSub && (
            <ImageCardSubModal
                card={draftCard}
                onChange={setDraftCard}
                onSave={saveCard}
                onClose={()=>setShowImgSub(false)}
            />
          )}
        </div>
    );
}

/* ══════════════════════════════════════════════
   ImageCardSubModal — 스틸컷 세부 분석 서브모달
══════════════════════════════════════════════ */
function ImageCardSubModal({ card, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...card, [key]: val });

    const handleStillUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => set('still', ev.target.result);
        reader.readAsDataURL(file);
    };

    const FIELDS = [
        { key:'context',         label:'맥락' },
        { key:'texture',         label:'질감' },
        { key:'emotion',         label:'정서' },
        { key:'time',            label:'시간' },
        { key:'space',           label:'공간' },
        { key:'artAndIcon',      label:'미술과 도상' },
        { key:'figureMove',      label:'인물의 배치와 움직임' },
        { key:'cameraGaze',      label:'카메라의 시선과 움직임' },
        { key:'lightAndLighting',label:'빛과 조명' },
        { key:'symbolInner',     label:'상징 (내재적)' },
        { key:'symbolOuter',     label:'상징 (외재적)' },
    ];

    return (
        <div className="modal-overlay" style={{ zIndex:1100 }}>
          <div className="modal-content scroll-container" style={{ maxHeight:'92vh' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:800 }}>이미지 카드</h3>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 스틸컷 업로드 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">스틸컷</div>
                {card.still
                    ? <div style={{ position:'relative' }}>
                        <img src={card.still} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:10, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={()=>set('still',null)}
                            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:16, borderRadius:10, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        🖼 이미지 파일 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleStillUpload} />
                      </label>
                }
            </div>

            {/* 해당 장면 (하이퍼링크) */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">해당 장면</div>
                <input value={card.sceneTitle||''} onChange={e=>set('sceneTitle',e.target.value)}
                    placeholder="장면 제목 (클릭 시 링크로 이동)"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0', marginBottom:6, background:'#2a2a2c', color:'#f0f0f0' }} />
                <input value={card.sceneUrl||''} onChange={e=>set('sceneUrl',e.target.value)}
                    placeholder="URL (https://...)"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 분석 필드들 */}
            {FIELDS.map(f => (
                <div key={f.key} style={{ marginBottom:16 }}>
                    <div className="section-label">{f.label}</div>
                    <textarea value={card[f.key]||''} onChange={e=>set(f.key,e.target.value)}
                        placeholder={`${f.label}에 대한 분석...`}
                        style={{ width:'100%', minHeight:64, padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8,
                            fontSize:13, lineHeight:1.7, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
                </div>
            ))}

            {/* 세부 해시태그 */}
            <FInput label="세부 해시태그" value={card.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#장면 #조명 ..." />

            <button onClick={onSave}
                style={{ width:'100%', padding:16, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:'pointer', marginTop:4 }}>
                카드 저장
            </button>
          </div>
        </div>
    );
}


/* ══════════════════════════════════════════════
   SoundModal — 소리 분석 추가/수정 모달
══════════════════════════════════════════════ */
function SoundModal({ item, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...item, [key]: val });
    const setProd = (cat, val) => onChange({ ...item, production: { ...item.production, [cat]: val } });

    const PROD_CATS  = ['감독','음향','음악','편집','믹싱','기타'];
    const production = item.production || {};
    const soundCards = item.soundCards || [];

    const [openProd,    setOpenProd]    = React.useState(null);
    const [newProdVal,  setNewProdVal]  = React.useState('');
    const [showSub,     setShowSub]     = React.useState(false);
    const [editingCard, setEditingCard] = React.useState(null);

    const EMPTY_SC = {
        still:null, sceneTitle:'', sceneUrl:'', space:'', time:'',
        dialogue:'', music:'', sfx:'', breath:'',
        meaningInner:'', meaningOuter:'', hashtags:''
    };
    const [draftCard, setDraftCard] = React.useState(EMPTY_SC);

    const openNewCard  = () => { setDraftCard({...EMPTY_SC}); setEditingCard(null); setShowSub(true); };
    const openEditCard = (idx) => { setDraftCard({...soundCards[idx]}); setEditingCard(idx); setShowSub(true); };
    const saveCard = () => {
        const updated = editingCard !== null
            ? soundCards.map((c,i) => i===editingCard ? draftCard : c)
            : [...soundCards, draftCard];
        set('soundCards', updated);
        setShowSub(false);
    };
    const removeCard = (idx) => set('soundCards', soundCards.filter((_,i)=>i!==idx));

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>소리 분석 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            <FInput label="제목" value={item.title||''} onChange={v=>set('title',v)} placeholder="분석 대상 제목 (예: 영화명 · 장면명)" />
            <FInput label="분석 날짜" value={item.analysisDate||''} onChange={v=>set('analysisDate',v)} placeholder="예: 2025-06-01" />

            {/* 제작 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">제작</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {PROD_CATS.map(cat=>(
                        <button key={cat} onClick={()=>setOpenProd(openProd===cat?null:cat)}
                            style={{ padding:'5px 12px', borderRadius:20,
                                border:`1px solid ${openProd===cat?ACCENT:BORDER}`,
                                background:openProd===cat?ACCENT_LIGHT:'#242426',
                                color:openProd===cat?ACCENT:'#555', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                            {(production[cat]||[]).length>0 && <span style={{ marginLeft:4, background:ACCENT, color:'#fff', borderRadius:10, padding:'0 5px', fontSize:10 }}>{(production[cat]||[]).length}</span>}
                        </button>
                    ))}
                </div>
                {openProd && (
                    <div style={{ background:'#2a2a2c', borderRadius:12, padding:14 }}>
                        <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:ACCENT }}>{openProd}</div>
                        {(production[openProd]||[]).map((name,i)=>(
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', background:'#1c1c1e', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                                <span style={{ fontSize:13 }}>{name}</span>
                                <button onClick={()=>setProd(openProd,(production[openProd]||[]).filter((_,j)=>j!==i))}
                                    style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                            </div>
                        ))}
                        <div style={{ display:'flex', gap:6 }}>
                            <input value={newProdVal} onChange={e=>setNewProdVal(e.target.value)}
                                onKeyDown={e=>{if(e.key==='Enter'&&newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                placeholder={`${openProd} 추가...`}
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <button onClick={()=>{if(newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700 }}>+</button>
                        </div>
                    </div>
                )}
            </div>

            <FInput label="전체 해시태그" value={item.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#소리 #영화 ..." />

            {/* 사운드 카드 목록 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">사운드 카드 ({soundCards.length}장)</div>
                {soundCards.map((card,i)=>(
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:10, marginBottom:8, border:`1px solid ${BORDER}` }}>
                        <div style={{ width:52, height:30, borderRadius:6, overflow:'hidden', background:'#333336', flexShrink:0 }}>
                            {card.still
                                ? <img src={card.still} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🎧</div>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{card.sceneTitle||`카드 ${i+1}`}</div>
                            {card.hashtags && <div style={{ fontSize:11, color:ACCENT }}>{card.hashtags.split(' ').slice(0,3).join(' ')}</div>}
                        </div>
                        <button onClick={()=>openEditCard(i)} style={{ background:'none', border:'none', color:'#666', fontSize:12, cursor:'pointer', padding:'4px 6px' }}>수정</button>
                        <button onClick={()=>removeCard(i)}   style={{ background:'none', border:'none', color:'#E05555', fontSize:16, cursor:'pointer' }}>×</button>
                    </div>
                ))}
                <button onClick={openNewCard}
                    style={{ width:'100%', padding:12, border:`2px dashed ${BORDER}`, borderRadius:10, background:'none', color:ACCENT, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    + 사운드 카드 추가
                </button>
            </div>

            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer' }}>
                저장
            </button>
          </div>

          {showSub && (
            <SoundCardSubModal
                card={draftCard}
                onChange={setDraftCard}
                onSave={saveCard}
                onClose={()=>setShowSub(false)}
            />
          )}
        </div>
    );
}

/* ══════════════════════════════════════════════
   SoundCardSubModal — 사운드 세부 분석 서브모달
══════════════════════════════════════════════ */
function SoundCardSubModal({ card, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...card, [key]: val });

    const handleStillUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => set('still', ev.target.result);
        reader.readAsDataURL(file);
    };

    const FIELDS = [
        { key:'space',        label:'공간' },
        { key:'time',         label:'시간' },
        { key:'dialogue',     label:'대사' },
        { key:'music',        label:'음악' },
        { key:'sfx',          label:'효과음' },
        { key:'breath',       label:'호흡' },
        { key:'meaningInner', label:'의미 (내재적)' },
        { key:'meaningOuter', label:'의미 (외재적)' },
    ];

    return (
        <div className="modal-overlay" style={{ zIndex:1100 }}>
          <div className="modal-content scroll-container" style={{ maxHeight:'92vh' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:800 }}>사운드 카드</h3>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 스틸컷 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">스틸컷</div>
                {card.still
                    ? <div style={{ position:'relative' }}>
                        <img src={card.still} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:10, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={()=>set('still',null)}
                            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:16, borderRadius:10, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        🖼 이미지 파일 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleStillUpload} />
                      </label>
                }
            </div>

            {/* 해당 장면 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">해당 장면</div>
                <input value={card.sceneTitle||''} onChange={e=>set('sceneTitle',e.target.value)}
                    placeholder="장면 제목 (클릭 시 링크로 이동)"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0', marginBottom:6, background:'#2a2a2c', color:'#f0f0f0' }} />
                <input value={card.sceneUrl||''} onChange={e=>set('sceneUrl',e.target.value)}
                    placeholder="URL (https://...)"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 분석 필드 */}
            {FIELDS.map(f=>(
                <div key={f.key} style={{ marginBottom:16 }}>
                    <div className="section-label">{f.label}</div>
                    <textarea value={card[f.key]||''} onChange={e=>set(f.key,e.target.value)}
                        placeholder={`${f.label}에 대한 분석...`}
                        style={{ width:'100%', minHeight:64, padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8,
                            fontSize:13, lineHeight:1.7, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
                </div>
            ))}

            <FInput label="세부 해시태그" value={card.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#장면 #사운드 ..." />

            <button onClick={onSave}
                style={{ width:'100%', padding:16, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:'pointer', marginTop:4 }}>
                카드 저장
            </button>
          </div>
        </div>
    );
}


/* ══════════════════════════════════════════════
   TimeModal — 시간 분석 추가/수정 모달
══════════════════════════════════════════════ */
function TimeModal({ item, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...item, [key]: val });
    const setProd = (cat, val) => onChange({ ...item, production: { ...item.production, [cat]: val } });

    const PROD_CATS      = ['연출','배우','기타'];
    const production     = item.production     || {};
    const characterCards = item.characterCards || [];

    const [openProd,    setOpenProd]    = React.useState(null);
    const [newProdVal,  setNewProdVal]  = React.useState('');
    const [showSub,     setShowSub]     = React.useState(false);
    const [editingCard, setEditingCard] = React.useState(null);

    const EMPTY_CC = {
        photo:null, scenes:[], name:'', external:'', inner:'',
        habitus:'', desire:'', lack:'', emotion:'', journey:'',
        meaning:'', acting:'', scraps:[], hashtags:''
    };
    const [draftCard, setDraftCard] = React.useState(EMPTY_CC);

    const openNewCard  = () => { setDraftCard({...EMPTY_CC}); setEditingCard(null); setShowSub(true); };
    const openEditCard = (idx) => { setDraftCard({...characterCards[idx]}); setEditingCard(idx); setShowSub(true); };
    const saveCard = () => {
        const updated = editingCard !== null
            ? characterCards.map((c,i) => i===editingCard ? draftCard : c)
            : [...characterCards, draftCard];
        set('characterCards', updated);
        setShowSub(false);
    };
    const removeCard = (idx) => set('characterCards', characterCards.filter((_,i)=>i!==idx));

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>시간 분석 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            <FInput label="제목" value={item.title||''} onChange={v=>set('title',v)} placeholder="분석 대상 제목 (예: 영화명)" />
            <FInput label="분석 날짜" value={item.analysisDate||''} onChange={v=>set('analysisDate',v)} placeholder="예: 2025-06-01" />

            {/* 제작 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">제작</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {PROD_CATS.map(cat=>(
                        <button key={cat} onClick={()=>setOpenProd(openProd===cat?null:cat)}
                            style={{ padding:'5px 12px', borderRadius:20,
                                border:`1px solid ${openProd===cat?ACCENT:BORDER}`,
                                background:openProd===cat?ACCENT_LIGHT:'#242426',
                                color:openProd===cat?ACCENT:'#555', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                            {(production[cat]||[]).length>0 && <span style={{ marginLeft:4, background:ACCENT, color:'#fff', borderRadius:10, padding:'0 5px', fontSize:10 }}>{(production[cat]||[]).length}</span>}
                        </button>
                    ))}
                </div>
                {openProd && (
                    <div style={{ background:'#2a2a2c', borderRadius:12, padding:14 }}>
                        <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:ACCENT }}>{openProd}</div>
                        {(production[openProd]||[]).map((name,i)=>(
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', background:'#1c1c1e', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                                <span style={{ fontSize:13 }}>{name}</span>
                                <button onClick={()=>setProd(openProd,(production[openProd]||[]).filter((_,j)=>j!==i))}
                                    style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                            </div>
                        ))}
                        <div style={{ display:'flex', gap:6 }}>
                            <input value={newProdVal} onChange={e=>setNewProdVal(e.target.value)}
                                onKeyDown={e=>{if(e.key==='Enter'&&newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                placeholder={`${openProd} 추가...`}
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <button onClick={()=>{if(newProdVal.trim()){setProd(openProd,[...(production[openProd]||[]),newProdVal.trim()]);setNewProdVal('');}}}
                                style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700 }}>+</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 소재 / 플롯 / 스토리 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">소재</div>
                <textarea value={item.material||''} onChange={e=>set('material',e.target.value)}
                    placeholder="작품의 소재..."
                    style={{ width:'100%', minHeight:72, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>
            <div style={{ marginBottom:20 }}>
                <div className="section-label">플롯</div>
                <textarea value={item.plot||''} onChange={e=>set('plot',e.target.value)}
                    placeholder="인과 관계 중심의 사건 순서..."
                    style={{ width:'100%', minHeight:100, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>
            <div style={{ marginBottom:24 }}>
                <div className="section-label">스토리</div>
                <textarea value={item.story||''} onChange={e=>set('story',e.target.value)}
                    placeholder="시간 순서 중심의 이야기 전개..."
                    style={{ width:'100%', minHeight:100, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            <FInput label="전체 해시태그" value={item.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#시간 #인물 ..." />

            {/* 인물 카드 목록 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">인물 카드 ({characterCards.length}명)</div>
                {characterCards.map((card,i)=>(
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:10, marginBottom:8, border:`1px solid ${BORDER}` }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', background:'#333336', flexShrink:0 }}>
                            {card.photo
                                ? <img src={card.photo} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎭</div>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:700 }}>{card.name||`인물 ${i+1}`}</div>
                            {card.hashtags && <div style={{ fontSize:11, color:ACCENT }}>{card.hashtags}</div>}
                        </div>
                        <button onClick={()=>openEditCard(i)} style={{ background:'none', border:'none', color:'#666', fontSize:12, cursor:'pointer', padding:'4px 6px' }}>수정</button>
                        <button onClick={()=>removeCard(i)}   style={{ background:'none', border:'none', color:'#E05555', fontSize:16, cursor:'pointer' }}>×</button>
                    </div>
                ))}
                <button onClick={openNewCard}
                    style={{ width:'100%', padding:12, border:`2px dashed ${BORDER}`, borderRadius:10, background:'none', color:ACCENT, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    + 인물 카드 추가
                </button>
            </div>

            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer' }}>
                저장
            </button>
          </div>

          {showSub && (
            <CharacterCardSubModal
                card={draftCard}
                onChange={setDraftCard}
                onSave={saveCard}
                onClose={()=>setShowSub(false)}
            />
          )}
        </div>
    );
}

/* ══════════════════════════════════════════════
   CharacterCardSubModal — 인물 세부 분석 서브모달
══════════════════════════════════════════════ */
function CharacterCardSubModal({ card, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...card, [key]: val });
    const scenes = card.scenes || [];
    const scraps = card.scraps || [];

    const [newSceneTitle, setNewSceneTitle] = React.useState('');
    const [newSceneUrl,   setNewSceneUrl]   = React.useState('');
    const [newScrapTitle, setNewScrapTitle] = React.useState('');
    const [newScrapUrl,   setNewScrapUrl]   = React.useState('');

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => set('photo', ev.target.result);
        reader.readAsDataURL(file);
    };

    const FIELDS = [
        { key:'external', label:'외적 설정', hint:'나이, 외모, 체형, 능력, 언행 등' },
        { key:'inner',    label:'내면세계',  hint:'내면의 감정, 심리, 세계관...' },
        { key:'habitus',  label:'아비투스',  hint:'사회적·문화적으로 소속된 집단과 환경' },
        { key:'desire',   label:'욕망',      hint:'캐릭터가 원하는 것...' },
        { key:'lack',     label:'결핍',      hint:'캐릭터가 결여하고 있는 것...' },
        { key:'emotion',  label:'정서',      hint:'지배적인 감정 색채...' },
        { key:'journey',  label:'작중 행적', hint:'이야기 속 행동과 변화...' },
        { key:'meaning',  label:'의미',      hint:'이 인물이 작품에서 갖는 의미...' },
        { key:'acting',   label:'액팅',      hint:'배우의 연기에 대한 분석...' },
    ];

    return (
        <div className="modal-overlay" style={{ zIndex:1100 }}>
          <div className="modal-content scroll-container" style={{ maxHeight:'92vh' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:800 }}>인물 카드</h3>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 인물 사진 업로드 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">인물 사진</div>
                {card.photo
                    ? <div style={{ position:'relative', width:120, marginBottom:4 }}>
                        <img src={card.photo} style={{ width:120, height:120, objectFit:'cover', borderRadius:12, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={()=>set('photo',null)}
                            style={{ position:'absolute', top:4, right:4, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:5, padding:'2px 8px', fontSize:11, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:10, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        📷 사진 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoUpload} />
                      </label>
                }
            </div>

            {/* 이름 */}
            <FInput label="이름" value={card.name||''} onChange={v=>set('name',v)} placeholder="인물 이름 또는 역할명" />

            {/* 주요 장면 — 복수 링크 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">주요 장면</div>
                {scenes.map((s,i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <a href={s.url} target="_blank" style={{ color:'#5DD8F0', fontWeight:600, fontSize:13, textDecoration:'none', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title||s.url}</a>
                        <button onClick={()=>set('scenes',scenes.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16, flexShrink:0 }}>×</button>
                    </div>
                ))}
                <div style={{ display:'flex', flexDirection:'column', gap:6, padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <input value={newSceneTitle} onChange={e=>setNewSceneTitle(e.target.value)}
                        placeholder="장면 제목"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <input value={newSceneUrl} onChange={e=>setNewSceneUrl(e.target.value)}
                        placeholder="URL (https://...)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={()=>{ if(newSceneTitle.trim()||newSceneUrl.trim()){ set('scenes',[...scenes,{title:newSceneTitle.trim(),url:newSceneUrl.trim()}]); setNewSceneTitle(''); setNewSceneUrl(''); }}}
                        style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 장면 추가</button>
                </div>
            </div>

            {/* 분석 필드 */}
            {FIELDS.map(f=>(
                <div key={f.key} style={{ marginBottom:16 }}>
                    <div className="section-label">{f.label}</div>
                    <textarea value={card[f.key]||''} onChange={e=>set(f.key,e.target.value)}
                        placeholder={f.hint}
                        style={{ width:'100%', minHeight:72, padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8,
                            fontSize:13, lineHeight:1.7, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
                </div>
            ))}

            {/* 스크랩 — 복수 링크 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">스크랩</div>
                {scraps.map((s,i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <a href={s.url} target="_blank" style={{ color:'#5DD8F0', fontWeight:600, fontSize:13, textDecoration:'none', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title||s.url}</a>
                        <button onClick={()=>set('scraps',scraps.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16, flexShrink:0 }}>×</button>
                    </div>
                ))}
                <div style={{ display:'flex', flexDirection:'column', gap:6, padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <input value={newScrapTitle} onChange={e=>setNewScrapTitle(e.target.value)}
                        placeholder="스크랩 제목 (인터뷰, 기사 등)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <input value={newScrapUrl} onChange={e=>setNewScrapUrl(e.target.value)}
                        placeholder="URL (https://...)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={()=>{ if(newScrapTitle.trim()||newScrapUrl.trim()){ set('scraps',[...scraps,{title:newScrapTitle.trim(),url:newScrapUrl.trim()}]); setNewScrapTitle(''); setNewScrapUrl(''); }}}
                        style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 스크랩 추가</button>
                </div>
            </div>

            {/* 해시태그 */}
            <FInput label="해시태그 (스페이스로 구분)" value={card.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#인물 #주인공 ..." />

            <button onClick={onSave}
                style={{ width:'100%', padding:16, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:'pointer', marginTop:4 }}>
                카드 저장
            </button>
          </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   ContextModal — 맥락 추가/수정 모달
══════════════════════════════════════════════ */
function ContextModal({ item, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...item, [key]: val });

    const traits = item.traits || [];
    const works  = item.works  || [];

    const TRAIT_CATS = ['형식','상징','정서','환경','서사'];

    /* 특징 카드 관련 */
    const [traitCat,  setTraitCat]  = React.useState('형식');
    const [traitText, setTraitText] = React.useState('');

    /* 대표 작품 서브 입력 */
    const [workTitle,    setWorkTitle]    = React.useState('');
    const [workYear,     setWorkYear]     = React.useState('');
    const [workDirector, setWorkDirector] = React.useState('');

    /* 대표 이미지 업로드 */
    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => set('coverImage', ev.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            {/* 헤더 */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>맥락 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 대표 이미지 업로드 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">대표 이미지</div>
                {item.coverImage
                    ? <div style={{ position:'relative', marginBottom:8 }}>
                        <img src={item.coverImage} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:12, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={() => set('coverImage', null)}
                            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:16, borderRadius:12, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        🖼 이미지 파일 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleCoverUpload} />
                      </label>
                }
            </div>

            {/* 맥락명 */}
            <FInput label="맥락명  (사회•국가•시대•문화•사조 등)" value={item.name||''} onChange={v=>set('name',v)} placeholder="예: 프랑스 누벨바그, 냉전 시대, 표현주의..." />

            {/* 시기 */}
            <FInput label="시기" value={item.period||''} onChange={v=>set('period',v)} placeholder="예: 1950년대–1960년대" />

            {/* 범위 */}
            <FInput label="범위" value={item.scope||''} onChange={v=>set('scope',v)} placeholder="예: 프랑스, 서유럽 일대" />

            {/* 개요 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">개요</div>
                <textarea value={item.overview||''} onChange={e=>set('overview',e.target.value)}
                    placeholder="해당 맥락에 대한 전반적인 개요..."
                    style={{ width:'100%', minHeight:90, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 의미 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">의미</div>
                <textarea value={item.meaning||''} onChange={e=>set('meaning',e.target.value)}
                    placeholder="이 맥락이 지니는 의미와 중요성..."
                    style={{ width:'100%', minHeight:90, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 특징 — 카테고리 탭 + 카드 추가 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">특징</div>
                {/* 카테고리 선택 탭 */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {TRAIT_CATS.map(cat => (
                        <button key={cat} onClick={() => setTraitCat(cat)}
                            style={{ padding:'5px 12px', borderRadius:20,
                                border:`1px solid ${traitCat===cat ? ACCENT : BORDER}`,
                                background: traitCat===cat ? ACCENT_LIGHT : '#242426',
                                color: traitCat===cat ? ACCENT : '#aaa', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                            {cat}
                            {traits.filter(t=>t.category===cat).length > 0 && (
                                <span style={{ marginLeft:4, background:ACCENT, color:'#fff', borderRadius:10, padding:'0 5px', fontSize:10 }}>
                                    {traits.filter(t=>t.category===cat).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                {/* 해당 카테고리 카드 목록 */}
                {traits.filter(t=>t.category===traitCat).map((tr,i) => {
                    // 전체 traits 배열에서 이 카테고리의 i번째 항목의 실제 인덱스를 찾음
                    let catIdx = -1;
                    let count = 0;
                    let globalIdx = -1;
                    for (let k = 0; k < traits.length; k++) {
                        if (traits[k].category === traitCat) {
                            if (count === i) { globalIdx = k; break; }
                            count++;
                        }
                    }
                    return (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <div style={{ flex:1 }}>
                            <span style={{ fontSize:10, color:ACCENT, fontWeight:700 }}>{tr.category}</span>
                            <div style={{ fontSize:13, marginTop:3, lineHeight:1.65, whiteSpace:'pre-wrap' }}>{tr.content}</div>
                        </div>
                        <button onClick={() => set('traits', traits.filter((_,j) => j !== globalIdx))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16, flexShrink:0, marginLeft:8 }}>×</button>
                    </div>
                    );
                })}
                {/* 새 카드 입력 */}
                <div style={{ display:'flex', gap:6 }}>
                    <textarea value={traitText} onChange={e=>setTraitText(e.target.value)}
                        placeholder={`${traitCat}에 대한 특징...`}
                        style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0', resize:'none', minHeight:60, fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={() => {
                        if (traitText.trim()) {
                            set('traits', [...traits, { category: traitCat, content: traitText.trim() }]);
                            setTraitText('');
                        }
                    }} style={{ padding:'8px 14px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, alignSelf:'flex-end' }}>+</button>
                </div>
            </div>

            {/* 대표 작품 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">대표 작품</div>
                {works.map((w,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <div>
                            <div style={{ fontSize:13, fontWeight:700 }}>{w.title||'(작품명 없음)'}</div>
                            <div style={{ fontSize:11, color:'#777', marginTop:2 }}>{[w.year, w.director].filter(Boolean).join(' · ')}</div>
                        </div>
                        <button onClick={() => set('works', works.filter((_,j)=>j!==i))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                ))}
                {/* 새 작품 입력 */}
                <div style={{ padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        <input value={workTitle} onChange={e=>setWorkTitle(e.target.value)}
                            placeholder="작품명"
                            style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                        <div style={{ display:'flex', gap:6 }}>
                            <input value={workYear} onChange={e=>setWorkYear(e.target.value)}
                                placeholder="연도 (예: 1960)"
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <input value={workDirector} onChange={e=>setWorkDirector(e.target.value)}
                                placeholder="감독"
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                        </div>
                        <button onClick={() => {
                            if (workTitle.trim() || workYear.trim() || workDirector.trim()) {
                                set('works', [...works, { title: workTitle.trim(), year: workYear.trim(), director: workDirector.trim() }]);
                                setWorkTitle(''); setWorkYear(''); setWorkDirector('');
                            }
                        }} style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 작품 추가</button>
                    </div>
                </div>
            </div>

            {/* 해시태그 */}
            <FInput label="해시태그 (스페이스로 구분)" value={item.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#누벨바그 #시대 ..." />

            {/* 저장 */}
            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer', marginTop:8 }}>
                저장
            </button>
          </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   ArtistModal — 예술가 추가/수정 모달
══════════════════════════════════════════════ */
function ArtistModal({ item, onChange, onSave, onClose }) {
    const set = (key, val) => onChange({ ...item, [key]: val });
    const setVal = (group, key, val) => onChange({ ...item, [group]: { ...item[group], [key]: val } });

    const works  = item.works  || [];
    const scraps = item.scraps || [];
    const values = item.values || { human:'', world:'', self:'' };

    /* 작품 입력 임시 state */
    const [workTitle,    setWorkTitle]    = React.useState('');
    const [workYear,     setWorkYear]     = React.useState('');
    const [workRole,     setWorkRole]     = React.useState('');
    /* 스크랩 입력 임시 state */
    const [scrapTitle,   setScrapTitle]   = React.useState('');
    const [scrapUrl,     setScrapUrl]     = React.useState('');
    /* 가치관 섹션 열기 */
    const [valOpen, setValOpen] = React.useState(false);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => set('photo', ev.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal-overlay">
          <div className="modal-content scroll-container">
            {/* 헤더 */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:18, fontWeight:800 }}>예술가 기록</h2>
                <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#666' }}>✕</button>
            </div>

            {/* 인물 이미지 업로드 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">인물 이미지</div>
                {item.photo
                    ? <div style={{ position:'relative', marginBottom:8 }}>
                        <img src={item.photo} style={{ width:'100%', aspectRatio:'1/1', objectFit:'cover', borderRadius:12, border:`1px solid ${BORDER}`, display:'block' }} />
                        <button onClick={() => set('photo', null)}
                            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>삭제</button>
                      </div>
                    : <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:16, borderRadius:12, border:`2px dashed ${BORDER}`, cursor:'pointer', color:'#666', fontSize:13 }}>
                        🖼 이미지 파일 업로드
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoUpload} />
                      </label>
                }
            </div>

            {/* 기본 정보 */}
            <FInput label="이름" value={item.name||''} onChange={v=>set('name',v)} placeholder="예: 구로사와 아키라" />
            <FInput label="국적" value={item.nationality||''} onChange={v=>set('nationality',v)} placeholder="예: 일본" />
            <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                <div style={{ flex:1 }}>
                    <div className="section-label">출생</div>
                    <input value={item.birth||''} onChange={e=>set('birth',e.target.value)} placeholder="예: 1910.03.23"
                        style={{ width:'100%', padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
                </div>
                <div style={{ flex:1 }}>
                    <div className="section-label">사망</div>
                    <input value={item.death||''} onChange={e=>set('death',e.target.value)} placeholder="예: 1998.09.06"
                        style={{ width:'100%', padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
                </div>
            </div>
            <FInput label="직업" value={item.occupation||''} onChange={v=>set('occupation',v)} placeholder="예: 영화감독, 시나리오작가" />

            {/* 작품 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">작품</div>
                {works.map((w,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <div>
                            <div style={{ fontSize:13, fontWeight:700 }}>{w.title||'(작품명 없음)'}</div>
                            <div style={{ fontSize:11, color:'#777', marginTop:2 }}>{[w.year, w.role].filter(Boolean).join(' · ')}</div>
                        </div>
                        <button onClick={() => set('works', works.filter((_,j)=>j!==i))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                ))}
                <div style={{ padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        <input value={workTitle} onChange={e=>setWorkTitle(e.target.value)} placeholder="작품명"
                            style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                        <div style={{ display:'flex', gap:6 }}>
                            <input value={workYear} onChange={e=>setWorkYear(e.target.value)} placeholder="연도"
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                            <input value={workRole} onChange={e=>setWorkRole(e.target.value)} placeholder="역할 (예: 감독, 주연)"
                                style={{ flex:1, padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                        </div>
                        <button onClick={() => {
                            if (workTitle.trim()||workYear.trim()||workRole.trim()) {
                                set('works', [...works, { title:workTitle.trim(), year:workYear.trim(), role:workRole.trim() }]);
                                setWorkTitle(''); setWorkYear(''); setWorkRole('');
                            }
                        }} style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 작품 추가</button>
                    </div>
                </div>
            </div>

            {/* 설명 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">설명</div>
                <textarea value={item.description||''} onChange={e=>set('description',e.target.value)}
                    placeholder="이 예술가에 대한 전반적인 설명..."
                    style={{ width:'100%', minHeight:90, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 인간으로서 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">인간으로서</div>
                <textarea value={item.asHuman||''} onChange={e=>set('asHuman',e.target.value)}
                    placeholder="인간으로서의 면모, 삶의 태도..."
                    style={{ width:'100%', minHeight:80, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 예술가로서 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">예술가로서</div>
                <textarea value={item.asArtist||''} onChange={e=>set('asArtist',e.target.value)}
                    placeholder="예술가로서의 스타일, 미학적 특징..."
                    style={{ width:'100%', minHeight:80, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 가치관 — 토글 아코디언 */}
            <div style={{ marginBottom:24 }}>
                <div onClick={() => setValOpen(!valOpen)}
                    style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', padding:'10px 0', borderBottom:`1px solid ${BORDER}`, marginBottom: valOpen ? 16 : 0 }}>
                    <span className="section-label" style={{ marginBottom:0 }}>가치관</span>
                    <span style={{ fontSize:12, color:ACCENT }}>{valOpen ? '▲ 접기' : '▼ 열기'}</span>
                </div>
                {valOpen && (
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                        {[
                            { key:'human', label:'인간을 어떻게 이해하는가?' },
                            { key:'world', label:'세계를 어떻게 이해하는가?' },
                            { key:'self',  label:'자신을 어떻게 이해하는가?' },
                        ].map(f => (
                            <div key={f.key}>
                                <div style={{ fontSize:11, fontWeight:700, color:'#aaaaaa', marginBottom:6 }}>{f.label}</div>
                                <textarea value={values[f.key]||''} onChange={e=>setVal('values',f.key,e.target.value)}
                                    placeholder={f.label}
                                    style={{ width:'100%', minHeight:72, padding:'9px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, lineHeight:1.75, outline:'none', resize:'vertical', fontFamily:'inherit' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 어록 */}
            <div style={{ marginBottom:20 }}>
                <div className="section-label">어록</div>
                <textarea value={item.quotes||''} onChange={e=>set('quotes',e.target.value)}
                    placeholder={'"기억에 남는 말, 인터뷰 발언..."'}
                    style={{ width:'100%', minHeight:80, padding:'10px 14px', border:`1px solid ${BORDER}`, borderRadius:10, fontSize:14, lineHeight:1.8, outline:'none', resize:'vertical', fontFamily:'inherit', background:'#2a2a2c', color:'#f0f0f0' }} />
            </div>

            {/* 스크랩 — 복수 하이퍼링크 */}
            <div style={{ marginBottom:24 }}>
                <div className="section-label">스크랩</div>
                {scraps.map((s,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'#2a2a2c', borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                        <a href={s.url} target="_blank" style={{ color:'#5DD8F0', fontWeight:600, fontSize:13, textDecoration:'none', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title||s.url}</a>
                        <button onClick={() => set('scraps', scraps.filter((_,j)=>j!==i))}
                            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16, flexShrink:0, marginLeft:8 }}>×</button>
                    </div>
                ))}
                <div style={{ display:'flex', flexDirection:'column', gap:6, padding:12, background:'#242426', borderRadius:10, border:`1px dashed ${BORDER}` }}>
                    <input value={scrapTitle} onChange={e=>setScrapTitle(e.target.value)} placeholder="제목 (인터뷰, 기사 등)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <input value={scrapUrl} onChange={e=>setScrapUrl(e.target.value)} placeholder="URL (https://...)"
                        style={{ padding:'8px 12px', border:`1px solid ${BORDER}`, borderRadius:8, fontSize:13, outline:'none', background:'#2a2a2c', color:'#f0f0f0' }} />
                    <button onClick={() => {
                        if (scrapTitle.trim()||scrapUrl.trim()) {
                            set('scraps', [...scraps, { title:scrapTitle.trim(), url:scrapUrl.trim() }]);
                            setScrapTitle(''); setScrapUrl('');
                        }
                    }} style={{ padding:'8px', background:ACCENT, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 }}>+ 스크랩 추가</button>
                </div>
            </div>

            {/* 해시태그 */}
            <FInput label="해시태그 (스페이스로 구분)" value={item.hashtags||''} onChange={v=>set('hashtags',v)} placeholder="#감독 #일본영화 ..." />

            {/* 저장 */}
            <button onClick={onSave}
                style={{ width:'100%', padding:18, background:ACCENT, color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer', marginTop:8 }}>
                저장
            </button>
          </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   HashtagPage — 해시태그 결과 페이지 (섹션별 2열, 3개 초과 시 more)
══════════════════════════════════════════════ */
function HashtagPage({ targetHashtag, hashtagFilteredData, onBack, onCardClick }) {
    const SECTIONS = ['영화','예술가','빛','이미지 카드','소리','사운드 카드','시간','인물 카드','맥락'];
    const EMOJI = { '영화':'🎬','예술가':'🎨','빛':'🎞','이미지 카드':'🎞','소리':'🎧','사운드 카드':'🎧','시간':'🎭','인물 카드':'🎭','맥락':'🌐' };
    const RATIO = { '영화':'2/3','예술가':'1/1','빛':'16/9','이미지 카드':'16/9','소리':'16/9','사운드 카드':'16/9','시간':'1/1','인물 카드':'1/1','맥락':'16/9' };

    const [expandedSections, setExpandedSections] = useState({});
    const toggleSection = (s) => setExpandedSections(prev => ({ ...prev, [s]: !prev[s] }));

    return (
        <div style={{ paddingBottom: 80 }}>
            {/* 스티키 헤더 — 돌아가기 */}
            <div style={{ display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:`1px solid ${BORDER}`, position:'sticky', top:0, background:'#1c1c1e', zIndex:50 }}>
                <button onClick={onBack}
                    style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 돌아가기</button>
            </div>

            {/* 해시태그 제목 — 크게, 가운데 정렬 */}
            <div style={{ padding:'28px 20px 20px', textAlign:'center' }}>
                <div style={{ fontSize:30, fontWeight:900, color:ACCENT, wordBreak:'break-all' }}>
                    {targetHashtag.startsWith('#') ? targetHashtag : '#'+targetHashtag}
                </div>
                <div style={{ fontSize:12, color:'#666', marginTop:6 }}>
                    {hashtagFilteredData.length}개의 카드
                </div>
            </div>

            {/* 섹션별 2열 그리드 */}
            {hashtagFilteredData.length === 0
                ? <div style={{ padding:'40px 20px', textAlign:'center', color:'#555', fontSize:14 }}>해당 해시태그를 포함한 항목이 없습니다.</div>
                : SECTIONS.map(section => {
                    const rows = hashtagFilteredData.filter(r => r._section === section);
                    if (rows.length === 0) return null;
                    const isExpanded = expandedSections[section];
                    const visible = isExpanded ? rows : rows.slice(0, 2);
                    const hasMore = rows.length > 2;
                    return (
                        <div key={section} style={{ padding:'0 20px', marginBottom:28 }}>
                            {/* 섹션 소제목 + more/접기 버튼 (우측 상단) */}
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                                <div style={{ fontSize:11, fontWeight:800, color:'#d0d0d0',
                                    paddingLeft:8, borderLeft:`3px solid ${ACCENT}`, letterSpacing:'0.4px' }}>
                                    {section.toUpperCase()}
                                    <span style={{ color:'#555', fontWeight:500, marginLeft:6 }}>({rows.length})</span>
                                </div>
                                {hasMore && (
                                    <button onClick={() => toggleSection(section)}
                                        style={{ padding:'4px 12px', border:`1px solid ${BORDER}`,
                                            borderRadius:20, background:'#1c1c1e', color:ACCENT, fontWeight:700,
                                            fontSize:11, cursor:'pointer', flexShrink:0, letterSpacing:'0.2px' }}>
                                        {isExpanded ? '▲ 접기' : `more +${rows.length - 2}`}
                                    </button>
                                )}
                            </div>

                            {/* 2열 그리드 */}
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
                                {visible.map((r, idx) => (
                                    <div key={idx} onClick={() => onCardClick(r)}
                                        style={{ cursor:'pointer', borderRadius:12, overflow:'hidden',
                                            border:`1px solid ${BORDER}`, background:'#0d0d0d' }}>
                                        <div style={{ width:'100%', aspectRatio: RATIO[section]||'1/1',
                                            overflow:'hidden', position:'relative', background:'#111113' }}>
                                            {r._img
                                                ? <img src={r._img} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaaaaa', fontSize:26 }}>
                                                    {EMOJI[section]||'📄'}
                                                  </div>
                                            }
                                            <div style={{ position:'absolute', inset:0,
                                                background:'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 50%)',
                                                display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'10px 10px 10px' }}>
                                                <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.65)',
                                                    textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:3 }}>{section}</div>
                                                <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.3,
                                                    overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box',
                                                    WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{r._title}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

/* ── 상세 뷰 ── */
function DetailView({ type, data, musics, onBack, onEdit, onDelete, onHashtagClick }) {
    const [anOpen, setAnOpen] = useState(false);
    const tags = (data.hashtags || "").split(" ").filter(t => t.length > 0);
    const linkedWorks = musics.filter(m => data.workIds?.includes(m.id));

    /* 예술가 상세 전용 렌더 */
    if (type === 'artist') {
        const tags   = (data.hashtags||'').split(' ').filter(t=>t.length>0);
        const works  = data.works  || [];
        const scraps = data.scraps || [];
        const values = data.values || {};

        return (
            <div style={{ paddingBottom:60 }}>
                {/* 헤더 버튼 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777', fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                {/* 1:1 이미지 + 오버레이 */}
                <div style={{ width:'100%', aspectRatio:'1/1', background:'#0d0d0d', overflow:'hidden', position:'relative' }}>
                    {data.photo
                        ? <img src={data.photo} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:52 }}>🎨</div>
                    }
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 50%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'24px 22px' }}>
                        <div style={{ fontSize:30, fontWeight:900, color:'#fff', marginBottom:8, textShadow:'0 2px 8px rgba(0,0,0,0.5)', lineHeight:1.15 }}>{data.name||'(이름 없음)'}</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {data.nationality && <span style={{ fontSize:12, color:'rgba(255,255,255,0.9)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:20 }}>{data.nationality}</span>}
                            {data.occupation  && <span style={{ fontSize:12, color:'rgba(255,255,255,0.9)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:20 }}>{data.occupation}</span>}
                        </div>
                    </div>
                </div>

                <div style={{ padding:'0 20px' }}>
                    {/* 생몰년 */}
                    {(data.birth||data.death) && (
                        <div style={{ display:'flex', gap:8, padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
                            {data.birth && <span style={{ fontSize:13, color:'#999999' }}>🗓 {data.birth}</span>}
                            {data.birth && data.death && <span style={{ color:'#555' }}>—</span>}
                            {data.death && <span style={{ fontSize:13, color:'#999999' }}>{data.death}</span>}
                        </div>
                    )}

                    {/* 해시태그 */}
                    {tags.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'14px 0 4px' }}>
                            {tags.map((tag,i) => (
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={() => onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                    {tag.startsWith('#')?tag:'#'+tag}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* 작품 */}
                    {works.length > 0 && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">작품</div>
                            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
                                {works.map((w,i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'#242426', borderRadius:10, border:`1px solid ${BORDER}` }}>
                                        <div style={{ flexShrink:0, width:34, height:34, borderRadius:8, background:ACCENT_LIGHT, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🎬</div>
                                        <div>
                                            <div style={{ fontSize:15, fontWeight:700 }}>{w.title||'(작품명 없음)'}</div>
                                            <div style={{ fontSize:12, color:'#777', marginTop:2 }}>{[w.year,w.role].filter(Boolean).join(' · ')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 설명 */}
                    {data.description && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">설명</div>
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.description}</p>
                        </div>
                    )}

                    {/* 인간으로서 */}
                    {data.asHuman && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">인간으로서</div>
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.asHuman}</p>
                        </div>
                    )}

                    {/* 예술가로서 */}
                    {data.asArtist && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">예술가로서</div>
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.asArtist}</p>
                        </div>
                    )}

                    {/* 가치관 */}
                    {(values.human||values.world||values.self) && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">가치관</div>
                            <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:8 }}>
                                {[
                                    { key:'human', label:'인간을 어떻게 이해하는가?' },
                                    { key:'world', label:'세계를 어떻게 이해하는가?' },
                                    { key:'self',  label:'자신을 어떻게 이해하는가?' },
                                ].filter(f => values[f.key]).map(f => (
                                    <div key={f.key}>
                                        <div style={{ fontSize:11, fontWeight:800, color:ACCENT, marginBottom:7, borderLeft:`3px solid ${ACCENT}`, paddingLeft:8 }}>{f.label}</div>
                                        <p style={{ fontSize:14, lineHeight:1.85, whiteSpace:'pre-wrap', color:'#d0d0d0', margin:0 }}>{values[f.key]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 어록 */}
                    {data.quotes && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">어록</div>
                            <div style={{ background:'#242426', borderRadius:12, padding:'16px 18px', borderLeft:'4px solid #E05555', marginTop:4 }}>
                                <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#d0d0d0', fontStyle:'italic', margin:0 }}>{data.quotes}</p>
                            </div>
                        </div>
                    )}

                    {/* 스크랩 */}
                    {scraps.length > 0 && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">스크랩</div>
                            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
                                {scraps.map((s,i) => (
                                    <a key={i} href={s.url} target="_blank"
                                        style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'#242426', borderRadius:10, border:`1px solid ${BORDER}`, textDecoration:'none' }}>
                                        <span style={{ fontSize:14 }}>🔗</span>
                                        <span style={{ fontSize:14, color:ACCENT, fontWeight:600 }}>{s.title||s.url}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* 맥락 분석 상세 전용 렌더 */
    if (type === 'context') {
        const tags       = (data.hashtags||'').split(' ').filter(t=>t.length>0);
        const traits     = data.traits || [];
        const works      = data.works  || [];
        const TRAIT_CATS = ['형식','상징','정서','환경','서사'];

        return (
            <div style={{ paddingBottom: 60 }}>
                {/* 헤더 버튼 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777', fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                {/* 대표 이미지 16:9 */}
                <div style={{ width:'100%', aspectRatio:'16/9', background:'#0d0d0d', overflow:'hidden', position:'relative' }}>
                    {data.coverImage
                        ? <img src={data.coverImage} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:40 }}>🌐</div>
                    }
                    {/* 이미지 위 오버레이 — 맥락명·시기·범위 */}
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'20px 22px' }}>
                        <div style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:6, textShadow:'0 2px 6px rgba(0,0,0,0.5)', lineHeight:1.2 }}>{data.name||'(맥락명 없음)'}</div>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                            {data.period && <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'3px 9px', borderRadius:20 }}>{data.period}</span>}
                            {data.scope  && <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.15)', padding:'3px 9px', borderRadius:20 }}>{data.scope}</span>}
                        </div>
                    </div>
                </div>

                <div style={{ padding:'0 20px' }}>
                    {/* 해시태그 */}
                    {tags.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'16px 0 4px' }}>
                            {tags.map((tag,i) => (
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={() => onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                    {tag.startsWith('#')?tag:'#'+tag}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* 개요 */}
                    {data.overview && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">개요</div>
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.overview}</p>
                        </div>
                    )}

                    {/* 의미 */}
                    {data.meaning && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">의미</div>
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.meaning}</p>
                        </div>
                    )}

                    {/* 특징 — 카테고리별 카드 */}
                    {traits.length > 0 && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">특징</div>
                            {TRAIT_CATS.filter(cat => traits.some(t=>t.category===cat)).map(cat => (
                                <div key={cat} style={{ marginBottom:16 }}>
                                    <div style={{ fontSize:11, fontWeight:800, color:ACCENT, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px', borderLeft:`3px solid ${ACCENT}`, paddingLeft:8 }}>{cat}</div>
                                    {traits.filter(t=>t.category===cat).map((tr,i) => (
                                        <div key={i} style={{ padding:'12px 14px', background:'#242426', borderRadius:10, border:`1px solid ${BORDER}`, fontSize:14, lineHeight:1.75, color:'#d0d0d0', whiteSpace:'pre-wrap', marginBottom:6 }}>
                                            {tr.content}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 대표 작품 */}
                    {works.length > 0 && (
                        <div style={{ padding:'20px 0', borderBottom:`1px solid ${BORDER}` }}>
                            <div className="section-label">대표 작품</div>
                            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                                {works.map((w,i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#242426', borderRadius:10, border:`1px solid ${BORDER}` }}>
                                        <div style={{ flexShrink:0, width:36, height:36, borderRadius:8, background:ACCENT_LIGHT, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎬</div>
                                        <div>
                                            <div style={{ fontSize:15, fontWeight:700, color:'#f0f0f0' }}>{w.title||'(작품명 없음)'}</div>
                                            <div style={{ fontSize:12, color:'#777', marginTop:2 }}>
                                                {[w.year, w.director].filter(Boolean).join(' · ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* 시간 분석 상세 전용 렌더 */
    if (type === 'time') {
        const prod   = data.production     || {};
        const cards  = data.characterCards || [];
        const tags   = (data.hashtags||'').split(' ').filter(t=>t.length>0);
        const PROD_CATS  = ['연출','배우','기타'];
        const filledProd = PROD_CATS.filter(c=>(prod[c]||[]).length>0);
        const FIELDS = [
            { key:'external', label:'외적 설정' },
            { key:'inner',    label:'내면세계' },
            { key:'habitus',  label:'아비투스' },
            { key:'desire',   label:'욕망' },
            { key:'lack',     label:'결핍' },
            { key:'emotion',  label:'정서' },
            { key:'journey',  label:'작중 행적' },
            { key:'meaning',  label:'의미' },
            { key:'acting',   label:'액팅' },
        ];

        return (
            <div style={{ paddingBottom:40 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777', fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                <div style={{ padding:'0 20px' }}>
                    <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>{data.title||'(제목 없음)'}</h1>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                        {data.analysisDate && <Chip>{data.analysisDate}</Chip>}
                        {cards.length>0 && <Chip>인물 {cards.length}명</Chip>}
                    </div>
                    {tags.length>0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:20 }}>
                            {tags.map((tag,i)=>(
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={()=>onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                    {tag.startsWith('#')?tag:'#'+tag}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* 제작진 */}
                    {filledProd.length>0 && (
                        <Section label="제작">
                            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                                {filledProd.map(cat=>(
                                    <div key={cat}>
                                        <div style={{ fontSize:11, fontWeight:800, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{cat}</div>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {(prod[cat]||[]).map((name,i)=>(
                                                <span key={i} style={{ padding:'4px 12px', background:'#2e2e30', borderRadius:20, fontSize:13 }}>{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* 소재 / 플롯 / 스토리 */}
                    {data.material && <Section label="소재"><p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.material}</p></Section>}
                    {data.plot     && <Section label="플롯"><p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.plot}</p></Section>}
                    {data.story    && <Section label="스토리"><p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.story}</p></Section>}
                </div>

                {/* 인물 카드 */}
                {cards.length>0 && (
                    <div style={{ marginTop:8 }}>
                        <div style={{ padding:'0 20px 12px', fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px' }}>인물 카드</div>
                        {cards.map((card,i)=>{
                            const [open, setOpen] = React.useState(false);
                            const cardTags = (card.hashtags||'').split(' ').filter(t=>t.length>0);
                            return (
                            <div key={i} style={{ marginBottom:0, borderTop:`1px solid ${BORDER}` }}>
                                {/* 1:1 이미지 + 이름 오버레이 — 클릭으로 토글 */}
                                <div onClick={()=>setOpen(!open)}
                                    style={{ width:'100%', aspectRatio:'1/1', background:'#0d0d0d', overflow:'hidden', position:'relative', cursor:'pointer' }}>
                                    {card.photo
                                        ? <img src={card.photo} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a6a', fontSize:52 }}>🎭</div>
                                    }
                                    {/* 오버레이 */}
                                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 50%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'22px 20px' }}>
                                        <div style={{ fontSize:24, fontWeight:900, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,0.5)' }}>{card.name||`인물 ${i+1}`}</div>
                                        <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:4 }}>{open ? '▲ 접기' : '▼ 펼쳐보기'}</div>
                                    </div>
                                </div>

                                {/* 세부 내용 — 펼쳤을 때만 표시 */}
                                {open && (
                                    <div style={{ padding:'20px 20px', borderBottom:`1px solid ${BORDER}` }}>
                                        {/* 해시태그 */}
                                        {cardTags.length>0 && (
                                            <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:16 }}>
                                                {cardTags.map((tag,j)=>(
                                                    <a key={j} className="hashtag-link" style={{ fontSize:12 }}
                                                       onClick={e=>{e.stopPropagation(); onHashtagClick(tag.startsWith('#')?tag:'#'+tag);}}>
                                                        {tag.startsWith('#')?tag:'#'+tag}
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* 주요 장면 링크 */}
                                        {(card.scenes||[]).length>0 && (
                                            <div style={{ marginBottom:16 }}>
                                                <div style={{ fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>주요 장면</div>
                                                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                                    {card.scenes.map((s,j)=>(
                                                        <a key={j} href={s.url} target="_blank"
                                                            style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#5DD8F0', fontWeight:600, fontSize:14, textDecoration:'none' }}>
                                                            🎬 {s.title||s.url}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 분석 필드 */}
                                        {FIELDS.map(f=>card[f.key]&&(
                                            <div key={f.key} style={{ padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
                                                <div style={{ fontSize:10, fontWeight:800, color:'#666', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{f.label}</div>
                                                <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:'pre-wrap', color:'#d0d0d0' }}>{card[f.key]}</div>
                                            </div>
                                        ))}

                                        {/* 스크랩 */}
                                        {(card.scraps||[]).length>0 && (
                                            <div style={{ marginTop:14 }}>
                                                <div style={{ fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>스크랩</div>
                                                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                                    {card.scraps.map((s,j)=>(
                                                        <a key={j} href={s.url} target="_blank"
                                                            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#2a2a2c', borderRadius:10, border:`1px solid ${BORDER}`, color:'#5DD8F0', fontWeight:600, fontSize:14, textDecoration:'none' }}>
                                                            🔗 {s.title||s.url}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    /* 소리 분석 상세 전용 렌더 */
    if (type === 'sound') {
        const prod      = data.production || {};
        const cards     = data.soundCards || [];
        const tags      = (data.hashtags||'').split(' ').filter(t=>t.length>0);
        const PROD_CATS = ['감독','음향','음악','편집','믹싱','기타'];
        const filledProd = PROD_CATS.filter(c=>(prod[c]||[]).length>0);
        const FIELDS = [
            { key:'space',        label:'공간' },
            { key:'time',         label:'시간' },
            { key:'dialogue',     label:'대사' },
            { key:'music',        label:'음악' },
            { key:'sfx',          label:'효과음' },
            { key:'breath',       label:'호흡' },
            { key:'meaningInner', label:'의미 (내재적)' },
            { key:'meaningOuter', label:'의미 (외재적)' },
        ];

        return (
            <div style={{ paddingBottom:40 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777', fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                <div style={{ padding:'0 20px' }}>
                    <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>{data.title||'(제목 없음)'}</h1>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                        {data.analysisDate && <Chip>{data.analysisDate}</Chip>}
                        {cards.length>0 && <Chip>사운드 {cards.length}장</Chip>}
                    </div>
                    {tags.length>0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:20 }}>
                            {tags.map((tag,i)=>(
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={()=>onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                    {tag.startsWith('#')?tag:'#'+tag}
                                </a>
                            ))}
                        </div>
                    )}

                    {filledProd.length>0 && (
                        <Section label="제작">
                            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                                {filledProd.map(cat=>(
                                    <div key={cat}>
                                        <div style={{ fontSize:11, fontWeight:800, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{cat}</div>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {(prod[cat]||[]).map((name,i)=>(
                                                <span key={i} style={{ padding:'4px 12px', background:'#2e2e30', borderRadius:20, fontSize:13 }}>{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                {cards.length>0 && (
                    <div style={{ marginTop:8 }}>
                        <div style={{ padding:'0 20px 12px', fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px' }}>사운드 카드</div>
                        {cards.map((card,i)=>(
                            <div key={i} style={{ marginBottom:32, borderTop:i>0?`1px solid ${BORDER}`:'none', paddingTop:i>0?28:0 }}>
                                {card.still && (
                                    <div style={{ width:'100%', aspectRatio:'16/9', overflow:'hidden', background:'#0d0d0d', marginBottom:16 }}>
                                        <img src={card.still} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                    </div>
                                )}
                                <div style={{ padding:'0 20px' }}>
                                    {card.sceneTitle && (
                                        <div style={{ marginBottom:12 }}>
                                            <div style={{ fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>해당 장면</div>
                                            {card.sceneUrl
                                                ? <a href={card.sceneUrl} target="_blank" style={{ fontSize:15, fontWeight:700, color:'#5DD8F0', textDecoration:'none' }}>{card.sceneTitle} →</a>
                                                : <div style={{ fontSize:15, fontWeight:700 }}>{card.sceneTitle}</div>
                                            }
                                        </div>
                                    )}
                                    {FIELDS.map(f=>card[f.key]&&(
                                        <div key={f.key} style={{ padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
                                            <div style={{ fontSize:10, fontWeight:800, color:'#666', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{f.label}</div>
                                            <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:'pre-wrap', color:'#d0d0d0' }}>{card[f.key]}</div>
                                        </div>
                                    ))}
                                    {card.hashtags && (
                                        <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:4 }}>
                                            {card.hashtags.split(' ').filter(t=>t).map((tag,j)=>(
                                                <a key={j} className="hashtag-link" style={{ fontSize:11 }}
                                                   onClick={()=>onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                                    {tag.startsWith('#')?tag:'#'+tag}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    /* 빛 분석 상세 전용 렌더 */
    if (type === 'light') {
        const prod      = data.production  || {};
        const imgCards  = data.imageCards  || [];
        const tags      = (data.hashtags||'').split(' ').filter(t=>t.length>0);
        const PROD_CATS = ['감독','촬영','미술','조명','편집','컬러그레이딩'];
        const filledProd = PROD_CATS.filter(c=>(prod[c]||[]).length>0);
        const FIELDS = [
            { key:'context',         label:'맥락' },
            { key:'texture',         label:'질감' },
            { key:'emotion',         label:'정서' },
            { key:'time',            label:'시간' },
            { key:'space',           label:'공간' },
            { key:'artAndIcon',      label:'미술과 도상' },
            { key:'figureMove',      label:'인물의 배치와 움직임' },
            { key:'cameraGaze',      label:'카메라의 시선과 움직임' },
            { key:'lightAndLighting',label:'빛과 조명' },
            { key:'symbolInner',     label:'상징 (내재적)' },
            { key:'symbolOuter',     label:'상징 (외재적)' },
        ];

        return (
            <div style={{ paddingBottom:40 }}>
                {/* 액션 바 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777', fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                <div style={{ padding:'0 20px' }}>
                    {/* 제목 */}
                    <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>{data.title||'(제목 없음)'}</h1>

                    {/* 메타 칩 + 해시태그 */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                        {data.analysisDate && <Chip>{data.analysisDate}</Chip>}
                        {imgCards.length>0 && <Chip>이미지 {imgCards.length}장</Chip>}
                    </div>
                    {tags.length>0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:20 }}>
                            {tags.map((tag,i)=>(
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={()=>onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                    {tag.startsWith('#')?tag:'#'+tag}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* 제작진 */}
                    {filledProd.length>0 && (
                        <Section label="제작">
                            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                                {filledProd.map(cat=>(
                                    <div key={cat}>
                                        <div style={{ fontSize:11, fontWeight:800, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{cat}</div>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {(prod[cat]||[]).map((name,i)=>(
                                                <span key={i} style={{ padding:'4px 12px', background:'#2e2e30', borderRadius:20, fontSize:13 }}>{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                {/* 이미지 카드 목록 */}
                {imgCards.length>0 && (
                    <div style={{ marginTop:8 }}>
                        <div style={{ padding:'0 20px 12px', fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px' }}>이미지 카드</div>
                        {imgCards.map((card,i)=>(
                            <div key={i} style={{ marginBottom:32, borderTop: i>0 ? `1px solid ${BORDER}` : 'none', paddingTop: i>0 ? 28 : 0 }}>
                                {/* 스틸컷 */}
                                {card.still && (
                                    <div style={{ width:'100%', aspectRatio:'16/9', overflow:'hidden', background:'#0d0d0d', marginBottom:16 }}>
                                        <img src={card.still} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                    </div>
                                )}
                                <div style={{ padding:'0 20px' }}>
                                    {/* 장면 링크 */}
                                    {card.sceneTitle && (
                                        <div style={{ marginBottom:12 }}>
                                            <div style={{ fontSize:10, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>해당 장면</div>
                                            {card.sceneUrl
                                                ? <a href={card.sceneUrl} target="_blank" style={{ fontSize:15, fontWeight:700, color:'#5DD8F0', textDecoration:'none' }}>{card.sceneTitle} →</a>
                                                : <div style={{ fontSize:15, fontWeight:700 }}>{card.sceneTitle}</div>
                                            }
                                        </div>
                                    )}
                                    {/* 분석 필드 */}
                                    {FIELDS.map(f => card[f.key] && (
                                        <div key={f.key} style={{ padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
                                            <div style={{ fontSize:10, fontWeight:800, color:'#666', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{f.label}</div>
                                            <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:'pre-wrap', color:'#d0d0d0' }}>{card[f.key]}</div>
                                        </div>
                                    ))}
                                    {/* 세부 해시태그 */}
                                    {card.hashtags && (
                                        <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:4 }}>
                                            {card.hashtags.split(' ').filter(t=>t).map((tag,j)=>(
                                                <a key={j} className="hashtag-link" style={{ fontSize:11 }}
                                                   onClick={()=>onHashtagClick(tag.startsWith('#')?tag:'#'+tag)}>
                                                    {tag.startsWith('#')?tag:'#'+tag}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    /* 영화 상세 전용 렌더 */
    if (type === 'library') {
        const prod     = data.production || {};
        const scraps   = data.scraps     || [];
        const imps     = data.impressions|| [];
        const PROD_CATS = ['연출','시나리오','촬영','조명','미술','음향','편집','연기','제작사','배급사'];
        const IMP_CATS  = ['빛','소리','시간','맥락','예술가'];
        const filledProd = PROD_CATS.filter(c => (prod[c]||[]).length > 0);
        const filledImps = IMP_CATS.filter(c => imps.some(x => x.category === c));

        return (
            <div style={{ paddingBottom: 40 }}>
                {/* 상단 액션 바 */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
                    <button onClick={onBack} style={{ border:'none', background:'none', color:ACCENT, fontWeight:700, cursor:'pointer', fontSize:14 }}>← 목록으로</button>
                    <div style={{ display:'flex', gap:16 }}>
                        <button onClick={onEdit}   style={{ border:'none', background:'none', color:'#777',    fontSize:13, cursor:'pointer' }}>수정</button>
                        <button onClick={onDelete} style={{ border:'none', background:'none', color:'#E05555', fontSize:13, cursor:'pointer' }}>삭제</button>
                    </div>
                </div>

                {/* 포스터 — 원본 비율 그대로 표시 */}
                {data.poster && (
                    <div style={{ width:'100%', background:'#000', display:'flex', justifyContent:'center', alignItems:'center' }}>
                        <img src={data.poster} style={{ width:'100%', maxHeight:'85vh', objectFit:'contain', display:'block' }} />
                    </div>
                )}

                {/* 제목 + 기본 정보 */}
                <div style={{ padding:'24px 20px 0' }}>
                    <h1 style={{ fontSize:28, fontWeight:900, lineHeight:1.25, marginBottom:8 }}>{data.title || data.filmTitle || '(제목 없음)'}</h1>

                    {/* 메타 칩들 */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                        {data.watchDate   && <Chip>{data.watchDate}</Chip>}
                        {data.watchMethod && <Chip>{data.watchMethod}</Chip>}
                        {data.year        && <Chip>{data.year}</Chip>}
                        {data.country     && <Chip>{data.country}</Chip>}
                    </div>

                    {/* 해시태그 */}
                    {tags.length > 0 && (
                        <div style={{ marginBottom:20, display:'flex', flexWrap:'wrap', gap:4 }}>
                            {tags.map((tag,i) => (
                                <a key={i} className="hashtag-link" style={{ fontSize:13 }}
                                   onClick={() => onHashtagClick(tag.startsWith("#") ? tag : "#"+tag)}>
                                    {tag.startsWith("#") ? tag : "#"+tag}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding:'0 20px' }}>

                    {/* 감상 */}
                    {data.review && (
                        <Section label="감상">
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.review}</p>
                        </Section>
                    )}

                    {/* 질문 */}
                    {data.questions && (
                        <Section label="질문">
                            <p style={{ fontSize:15, lineHeight:1.9, whiteSpace:'pre-wrap', color:'#e0e0e0', margin:0 }}>{data.questions}</p>
                        </Section>
                    )}

                    {/* 제작 */}
                    {filledProd.length > 0 && (
                        <Section label="제작">
                            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
                                {filledProd.map(cat => (
                                    <div key={cat}>
                                        <div style={{ fontSize:11, fontWeight:800, color:'#666', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{cat}</div>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                            {(prod[cat]||[]).map((name,i) => (
                                                <span key={i} style={{ padding:'4px 12px', background:'#2e2e30', borderRadius:20, fontSize:13, color:'#d0d0d0' }}>{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* 스크랩 */}
                    {scraps.length > 0 && (
                        <Section label="스크랩">
                            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
                                {scraps.map((s,i) => (
                                    <a key={i} href={s.url} target="_blank"
                                        style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
                                            background:'#2a2a2c', borderRadius:10, border:`1px solid ${BORDER}`,
                                            color:'#5DD8F0', fontWeight:600, fontSize:14, textDecoration:'none' }}>
                                        <span style={{ fontSize:15 }}>🔗</span>
                                        <span>{s.title || s.url}</span>
                                    </a>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* 인상깊은 것 — 카테고리별 */}
                    {filledImps.length > 0 && (
                        <Section label="인상깊은 것">
                            <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:4 }}>
                                {filledImps.map(cat => (
                                    <div key={cat}>
                                        <div style={{ fontSize:11, fontWeight:800, color:ACCENT, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px', borderLeft:`3px solid ${ACCENT}`, paddingLeft:8 }}>{cat}</div>
                                        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                            {imps.filter(x=>x.category===cat).map((imp,i) => (
                                                <div key={i} style={{ padding:'12px 14px', background:'#242426', borderRadius:10, border:`1px solid ${BORDER}`, fontSize:14, lineHeight:1.7, color:'#d0d0d0', whiteSpace:'pre-wrap' }}>
                                                    {imp.content}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                </div>
            </div>
        );
    }

    /* 기존 타입(composer/genre/instrument/concept) 상세 */
    return (
        <div style={{ padding: "20px 25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
                <button onClick={onBack} style={{ border: "none", background: "none", color: ACCENT, fontWeight: 700, cursor: 'pointer' }}>← 목록으로</button>
                <div style={{ display: 'flex', gap: 15 }}>
                    <button onClick={onEdit}   style={{ border: "none", background: "none", color: "#666",    fontSize: 13, cursor: 'pointer' }}>수정</button>
                    <button onClick={onDelete} style={{ border: "none", background: "none", color: "#ff4d4f", fontSize: 13, cursor: 'pointer' }}>삭제</button>
                </div>
            </div>

            {data.photo && <img src={data.photo} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 20, objectFit: "cover", marginBottom: 30 }} />}
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 5 }}>{data.name}</h1>

            <div style={{ marginBottom: 30 }}>
                {tags.map((tag, i) => <a key={i} className="hashtag-link" onClick={() => onHashtagClick(tag.startsWith("#") ? tag : "#" + tag)}>{tag.startsWith("#") ? tag : "#" + tag}</a>)}
            </div>

            <div>
                {type === 'composer' && (<>
                    <Section label="설명"     content={data.description} />
                    <Section label="특징"     content={data.traits} />
                    <Section label="참여 작품">{linkedWorks.length > 0 ? linkedWorks.map(m => <div key={m.id}>• {m.musicTitle} ({m.filmTitle})</div>) : "-"}</Section>
                    <Section label="스크랩"   content={data.scraps} />
                </>)}
                {type === 'genre'      && (<><Section label="개요" content={data.summary} /><Section label="특징" content={data.traits} /><Section label="스크랩" content={data.scraps} /></>)}
                {type === 'instrument' && (<>
                    <Section label="개요"          content={data.summary} />
                    <Section label="상세"          content={data.detail} />
                    <Section label="특징"          content={data.traits} />
                    <Section label="활용"          content={data.usage} />
                    <Section label="주요 아티스트" content={data.artist} />
                    <Section label="스크랩"        content={data.scraps} />
                </>)}
                {type === 'concept' && (<><Section label="개요" content={data.summary} /><Section label="상세" content={data.detail} /><Section label="활용" content={data.usage} /><Section label="스크랩" content={data.scraps} /></>)}

                <div style={{ padding: '20px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <div onClick={() => setAnOpen(!anOpen)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}>
                        <span className="section-label" style={{ marginBottom: 0 }}>여담 및 실례</span>
                        <span style={{ fontSize: 12, color: ACCENT }}>{anOpen ? '▲ 접기' : '▼ 열기'}</span>
                    </div>
                    {anOpen && <div className="accordion">{data.anecdotes || '내용이 없습니다.'}</div>}
                </div>
            </div>
        </div>
    );
}

/* ── 작은 칩 컴포넌트 ── */
function Chip({ children }) {
    return (
        <span style={{ display:'inline-block', padding:'3px 10px', background:'#2e2e30', borderRadius:20,
            fontSize:12, color:'#aaaaaa', fontWeight:500 }}>{children}</span>
    );
}

/* ── 공통 컴포넌트 ── */
function Section({ label, content, children }) {
    return (
        <div style={{ padding: "22px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div className="section-label">{label}</div>
            <div style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#d0d0d0" }}>{content || children || "-"}</div>
        </div>
    );
}

function Input({ label, value, onChange, isArea }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>{label}</label>
            {isArea
                ? <textarea value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: 12, border: `1px solid ${BORDER}`, borderRadius: 12, minHeight: 100, outline: 'none', fontSize: 14, background:'#2a2a2c', color:'#f0f0f0' }} />
                : <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: 12, border: `1px solid ${BORDER}`, borderRadius: 12, outline: 'none', fontSize: 14, background:'#2a2a2c', color:'#f0f0f0' }} />
            }
        </div>
    );
}

function SearchPicker({ label, list, filterKey, selectedIds, onSelect }) {
    return (
        <div style={{ marginBottom: 22 }}>
            <label className="section-label">{label}</label>
            <div style={{ maxHeight: 100, overflowY: 'auto', border: `1px solid ${BORDER}`, marginTop: 8, borderRadius: 10, padding: 5, background:'#2a2a2c' }}>
                {list.map(i => (
                    <div key={i.id} onClick={() => onSelect(i.id)} style={{ padding: '8px 12px', fontSize: 12, background: selectedIds.includes(i.id) ? ACCENT_LIGHT : 'transparent', cursor: 'pointer', borderRadius: 8 }}>
                        {selectedIds.includes(i.id) ? '✓ ' : '+ '}{i[filterKey]}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 마운트 ── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Polyphonic />);
