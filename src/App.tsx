/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { transportData, TransportEntry } from './data.ts';
import { Search, MapPin, Clock, Info, ExternalLink, Moon, Sun, Download, Languages, Zap, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'ja' | 'en';

const translations = {
  ja: {
    title: '搬出入先リスト',
    all: 'すべて',
    searchPlaceholder: '検索内容を入力...',
    matchesFound: '該当項目: {count} 件',
    highWayExit: '高速出口',
    receptionHours: '受付時間',
    remarks: '備考',
    openGoogleMaps: 'Google Mapで開く',
    noResults: '該当する項目が見つかりませんでした。',
    clearSearch: '検索をクリア',
    offlineTitle: 'オフライン完全版',
    downloadTooltip: 'オフライン用HTMLをダウンロード',
    changeLanguage: '言語切替 (EN)',
    addHub: '地点を追加',
    deleteHub: '削除',
    cancel: 'キャンセル',
    save: '保存',
    prefecture: '都道府県',
    area: 'エリア/IC',
    destination: '目的地名',
    mapLink: 'Google Mapsリンク',
    mapLinkHint: 'iPhone用推奨: https://maps.google.com/?q=緯度,経度',
    formHours: '受付時間 (任意)',
    formRemarks: '備考 (任意)',
    newHubAdded: '地点を追加しました',
    confirmDelete: 'この地点を削除しますか？',
    prefectures: {
      'すべて': 'すべて',
      '奈良県': '奈良県',
      '兵庫県': '兵庫県',
      '大阪府': '大阪府',
      '愛知県': '愛知県',
      '三重県': '三重県',
    },
    areas: {
      '奈良': '奈良',
      '摩耶ふ頭': '摩耶ふ頭',
      '新港東ふ頭': '新港東ふ頭',
      'ポートアイランド': 'ポートアイランド',
      '六甲アイランド': '六甲アイランド',
      '魚崎浜': '魚崎浜',
      '住吉浜': '住吉浜',
      '甲子園浜': '甲子園浜',
      '中島／尼崎東海岸': '中島／尼崎東海岸',
      '湾岸舞洲': '湾岸舞洲',
      'ユニバーサルシティ': 'ユニバーサルシティ',
      '松原IC': '松原IC',
      '泉大津人工島': '泉大津人工島',
      '泉大津IC': '泉大津IC',
      '泉大津汐見ふ頭': '泉大津汐見ふ頭',
      '貝塚人工島': '貝塚人工島',
      '愛知県弥富市': '愛知県弥富市',
      '愛知県海部郡蟹江町': '愛知県海部郡蟹江町',
      '愛知県飛島村': '愛知県飛島村',
      '愛知県東海市': '愛知県東海市',
      '名古屋市港区': '名古屋市港区',
      '三重県川越町': '三重県川越町',
    },
    phrases: {}
  },
  en: {
    title: 'Transport Hub List',
    all: 'All',
    searchPlaceholder: 'Search destinations...',
    matchesFound: '{count} hub(s) found',
    highWayExit: 'Exit',
    receptionHours: 'Hours',
    remarks: 'Notes',
    openGoogleMaps: 'Open in Google Maps',
    noResults: 'No hubs found.',
    clearSearch: 'Clear search',
    offlineTitle: 'Offline Complete Version',
    downloadTooltip: 'Download for Offline Use',
    changeLanguage: 'Change Language (JA)',
    addHub: 'Add Hub',
    deleteHub: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    prefecture: 'Prefecture',
    area: 'Area/IC',
    destination: 'Destination',
    mapLink: 'Google Maps Link',
    mapLinkHint: 'Recommended for iPhone: https://maps.google.com/?q=lat,lng',
    formHours: 'Hours (Optional)',
    formRemarks: 'Notes (Optional)',
    newHubAdded: 'New hub added',
    confirmDelete: 'Are you sure you want to delete this hub?',
    prefectures: {
      'すべて': 'All',
      '奈良県': 'Nara',
      '兵庫県': 'Hyogo',
      '大阪府': 'Osaka',
      '愛知県': 'Aichi',
      '三重県': 'Mie',
    },
    areas: {
      '奈良': 'Nara',
      '摩耶ふ頭': 'Maya hutou',
      '新港東ふ頭': 'Shinko hutou',
      'ポートアイランド': 'Port Island',
      '六甲アイランド': 'Rokko Island',
      '魚崎浜': 'Uozakihama',
      '住吉浜': 'Sumiyoshihama',
      '甲子園浜': 'Koshienhama',
      '中島／尼崎東海岸': 'Amagasaki East Coast',
      '湾岸舞洲': 'Maishima',
      'ユニバーサルシティ': 'Universal City',
      '松原IC': 'Matsubara IC',
      '泉大津人工島': 'Izumiotsu Island',
      '泉大津IC': 'Izumiotsu IC',
      '泉大津汐見ふ頭': 'Shiomi hutou',
      '貝塚人工島': 'Kaizuka Island',
      '愛知県弥富市': 'Yatomi, Aichi',
      '愛知県海部郡蟹江町': 'Kanie, Aichi',
      '愛知県飛島村': 'Tobishima, Aichi',
      '愛知県東海市': 'Tokai, Aichi',
      '名古屋市港区': 'Minato, Nagoya',
      '三重県川越町': 'Kawagoe, Mie',
    },
    phrases: {
      '三重県': 'Mie',
      '兵庫県': 'Hyogo',
      '大阪府': 'Osaka',
      '奈良県': 'Nara',
      '愛知県': 'Aichi',
      '搬出': 'Export',
      '搬入': 'Import/Delivery',
      '24h': '24h',
      '昼休み有': 'Lunch break',
      '休憩': 'Break',
      'USS神戸': 'USS Kobe',
      'JFA神戸': 'JFA Kobe',
      'ＪＦＡ神戸': 'JFA Kobe',
      'ケイヒン神戸': 'Keihin Kobe',
      'ジートランス第二ヤード': 'G-Trans 2nd Yard',
      'HAA神戸': 'HAA Kobe',
      'ホンダ関西': 'Honda Kansai',
      '上組ポートアイランド': 'Kamigumi Port Island',
      '神戸日本トランスポーアイヤード': 'Nippon Trans Port Island Yard (Kobe)',
      '日新神戸L11': 'Nissin Kobe L11',
      '神戸ECL': 'ECL Kobe',
      '神戸藤原オートセンター': 'Fujiwara Auto Center (Kobe)',
      'いすゞ神戸': 'Isuzu Kobe',
      '阪九フェリー神戸': 'Hankyu Ferry Kobe',
      'マハルヤード': 'Mahal Yard',
      'MIKYフロンティア': 'MIKY Frontier',
      'ORIX神戸': 'ORIX Kobe',
      'TAA兵庫': 'TAA Hyogo',
      'ZIP大阪': 'ZIP Osaka',
      'USS大阪': 'USS Osaka',
      'HS-3舞洲ヤード': 'HS-3 Maishima Yard',
      'TAA近畿': 'TAA Kinki',
      'ミライブ大阪': 'Mirive Osaka',
      'ECL泉北': 'ECL Senboku',
      '阪九フェリー泉大津': 'Hankyu Ferry Izumiotsu',
      '大王海運': 'Daio Kaiun',
      'バリューアップセンター大阪': 'Value Up Center Osaka',
      '日新大阪汐見ヤード': 'Nissin Osaka Shiomi Yard',
      'オートロジ泉大津': 'Auto Logi Izumiotsu',
      'IAA大阪': 'IAA Osaka',
      '日産プラザソル': 'Nissan Plaza Sol',
      '藤原オートセンター': 'Fujiwara Auto Center',
      '大阪日本ロジ': 'Nippon Logi Osaka',
      '郵船港運': 'Yusen Koun',
      '大運汐見ヤード': 'Daiun Shiomi Yard',
      '大運夕凪ヤード': 'Daiun Yunagi Yard',
      'ジートランス泉大津': 'G-Trans Izumiotsu',
      'キャリーゴール泉大津ヤード': 'Carry Goal Izumiotsu Yard',
      'アトラスシッピング貝塚': 'Atlas Shipping Kaizuka',
      'ジートランス弥富ヤード': 'G-Trans Yatomi Yard',
      '大協弥富ヤード': 'Daikyo Yatomi Yard',
      '弥富ワールドトレーディングヤード': 'Yatomi World Trading Yard',
      'BIZ JAPヤード': 'BIZ JAP Yard',
      'ミライブ愛知': 'Mirive Aichi',
      'ORIX愛知': 'ORIX Aichi',
      'SHトレーディング': 'SH Trading',
      'グローバルロジ弥富ヤード': 'Global Logi Yatomi Yard',
      'Haru トレーディング': 'Haru Trading',
      'RoRo ヤードm3ロジ': 'RoRo Yard m3 Logi',
      'RoRo ヤードm3ロジ 別ヤード': 'RoRo Yard m3 Logi Sub Yard',
      'RoRo ヤードm3ロジ メインヤード': 'RoRo Yard m3 Logi Main Yard',
      'ナシーブトレーディング': 'Naseeb Trading',
      'シンクロジ名古屋（繰出ヤード）': 'Sync Logi Nagoya (Delivery Yard)',
      '搬入～(木)15:00, 搬出～(火)15:00': 'Import/Delivery - (Thu) 15:00, Export - (Tue) 15:00',
      'カシミールヤード': 'Kashmir Yard',
      '弥富ALRAZA INTERNATIONAL': 'Yatomi ALRAZA INTERNATIONAL',
      'Quetta(クエタ) Trading': 'Quetta Trading',
      'カーケイドインターナショナル': 'Carcade International',
      'シンクロジ名古屋': 'Sync Logi Nagoya',
      'シンクロジ西末広': 'Sync Logi West Suehiro',
      'オートロジ名古屋': 'Auto Logi Nagoya',
      'シャリムトレーディング': 'Sharim Trading',
      'フラッシュライズ': 'Flash Rise',
      'SBT弥富西ヤード': 'SBT Yatomi West Yard',
      'サンフェニックス楠': 'Sun Phoenix Kusunoki',
      'サンフェニックス弥富': 'Sun Phoenix Yatomi',
      'ビンダルコーポレーション': 'Bindal Corp',
      'カナロアシッピング': 'Kanaloa Shipping',
      'JU愛知': 'JU Aichi',
      'オーマルトレーディング': 'Omar Trading',
      'USS名古屋': 'USS Nagoya',
      '東陽倉庫 稲永': 'Toyo Warehouse Inae',
      '旭運輸 稲永コンテナ': 'Asahi Unyu Inae Container',
      'フジトランス名古屋第2プール': 'Fujitrans Nagoya 2nd Pool',
      'TAA中部': 'TAA Chubu',
      'フラッシュライズ名古屋本社 メインヤード': 'Flash Rise Nagoya H.Q. Main Yard',
      'フラッシュライズカリブヤード': 'Flash Rise Carib Yard',
      'フラッシュライズコンテナヤード': 'Flash Rise Container Yard',
      'フラッシュライズ砂ヤード': 'Flash Rise Sand Yard',
      'フラッシュライズＡヤード': 'Flash Rise Yard A',
      'フラッシュライズＣヤード': 'Flash Rise Yard C',
      'フラッシュライズFヤード': 'Flash Rise Yard F',
      'フラッシュライズＧヤード': 'Flash Rise Yard G',
      'フラッシュライズＨヤード': 'Flash Rise Yard H',
      'フラッシュライズYヤード': 'Flash Rise Yard Y',
      'フラッシュライズオートワールド②': 'Flash Rise Auto World 2',
      'ミライブ愛知シーライン': 'Mirive Aichi Sealine',
      'TAA近畿 北港': 'TAA Kinki Hokko',
      'カナロアシッピング（飛島工場）': 'Kanaloa Shipping (Tobishima Factory)',
      '内': 'inside ',
      'にある': 'located ',
      '最奥': 'far end ',
      '奥': 'back ',
      '進む': 'proceed ',
      '番号': 'number ',
      'へ': 'to ',
      'まず': 'First ',
      'ここで': 'here ',
      'どこ': 'which ',
      '分': 'mins ',
      '事前伝票投入可': 'Advance slip submission available',
      '車搬入 8:30-17:00': 'Vehicle delivery 8:30-17:00',
      '月曜9:00～火曜いっぱいは出庫券印刷機が使えない': 'Release ticket printer unavailable from Mon 9:00 until end of Tue',
      'その時間帯は奥カウンターで手書き申請': 'Apply for manual release at the back counter during this time',
      '月曜9:00～火曜終了まで伝票用印刷機使えない': 'Slip printer unavailable from Mon 9:00 until end of Tue',
      '進入時エンジンを切らないこと': 'Keep engine running during entry',
      '搬入時エンジンを切らない。': 'Do not turn off engine during entry.',
      '伝票を渡す際': 'When handing over the slip',
      '「輸入アカウント」「扱い業者」を伝え': "Inform 'Import Account' and 'Handling Agent'",
      '「搬入名義」「扱い業者」を伝え': "Inform 'Import Account' and 'Handling Agent'",
      '搬入名義': 'Import account name',
      'ラミネートカード': 'Laminated card',
      '表に車台番号': 'Chassis number on front',
      '国産ハイフン前を上、後を下': 'Domestic: before hyphen on top, after on bottom',
      '外車左詰め': 'Imported car: left-aligned',
      '裏に日付・名義・向け地を記入': 'Write date, account, and destination on back',
      '当日着岸の場合は': 'If vessel berthing on the same day',
      '当日着岸の場合、朝早い車は搬出ができない場合あり。場合によっては午前中出せないことも。': 'If vessel berthing on the same day, early morning vehicles may not be released. Sometimes they cannot be released during the morning.',
      '朝早い車は出せないこともある': 'Early morning vehicles may not be released',
      '場合によっては午前中出せないこともあり': 'Sometimes cannot be released during the morning',
      'USS神戸の立駐６階エレベーター前受付あり': 'Reception available in front of 6th floor elevator of USS Kobe Parking Tower',
      '手書き出庫券を申請': 'Apply for manual exit slip',
      '受付場所から搬入先は離れている': 'Delivery location is separate from reception',
      '夕凪ヤード': 'Yunagi Yard',
      '３号ヤード': 'No.3 Yard',
      '５号ヤード': 'No.5 Yard',
      '日新大阪汐見夕凪ヤード隣': 'Next to Nissin Osaka Shiomi Yunagi Yard',
      '受付場所から離れたヤードを指定されることあり': 'You may be assigned a yard far from reception',
      'ジートラ所有区画': 'G-Trans owned section',
      '緑コーンの間': 'Between green cones',
      '泉大津における陣地': 'Base in Izumiotsu',
      'ただの空き地': 'Just an empty lot',
      'ただの空き地。鍵は奈良の事務所から持っていく。': 'Just an empty lot. Bring the keys from the Nara office.',
      '鍵は奈良の事務所から持っていくこと': 'Bring the keys from the Nara office',
      '朝8:20くらいから搬入できる': 'Delivery can start from around 8:20 AM',
      'ジートランス（ブライアント）奈良拠点': 'G-Trans (Bryant) Nara Hub',
      'タマし出し車綺麗戻すこと': 'Keep returned vehicles clean (Export process)',
      '弥富におけるジートランス拠点': 'G-Trans base in Yatomi',
      'ミライブ愛知内にある': 'Located inside Mirive Aichi',
      '受付でシーラインと伝え、最奥まで進む': 'Inform reception "Sealine" and proceed to the far end',
      'ゲートが閉まっていても、人を呼んでサインを貰えば良い': 'If gate is closed, call someone to get a signature',
      '白ナンバーは外さなくてよい': 'No need to remove white plates',
      '搬入前、これから搬入する旨連絡する必要あり': 'Must call before entry',
      '搬入前、これから搬入する旨連絡する必要あり。(約1h~30分前) 0567-69-5312。': 'Must call before entry (roughly 30-60 mins prior) 0567-69-5312.',
      'メインヤードがいっぱいの時にここに誘導される': 'Guided here when main yard is full',
      '人がいない場合、下記番号へ': 'If no one is there, call the number below',
      '他とは違って、搬入目的まで細かく聞かれるので注意': 'Be careful as they ask for delivery purpose in detail',
      'まずここで受付をして、適宜搬入ヤードを伝えられる': 'Check in here first to be assigned a yard',
      '北側からしか入れない': 'Enter from the North side only',
      '南側の道路からは入れない': 'No entry from the South road',
      'Googleマップ上では「旭運輸弥富」となっている': 'Shown as "Asahi Unyu Yatomi" on Google Maps',
      '10時、15時前後に10分～30分小休憩有': 'Short breaks (10-30m) around 10 AM and 3 PM',
      '16時頃までの搬入受付推奨': 'Delivery reception recommended by 4 PM',
      '1時間休憩有': '(1-hour break)',
      '土曜は午前中のみ。': 'Saturdays are morning only.',
      'ジャパンパートナー': 'Japan Partner',
      '。': '. ',
      '、': ', ',
      '〜': '- ',
      '～': '- ',
      'は': ' ',
      'を': ' ',
      'の': ' ',
      'に': ' ',
      'が': ' ',
      'と': ' ',
    }
  }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPref, setSelectedPref] = useState('すべて');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('ja');
  const [localHubs, setLocalHubs] = useState<TransportEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHub, setNewHub] = useState<Omit<TransportEntry, 'id'>>({
    prefecture: '奈良県',
    area: '',
    destination: '',
    mapLink: '',
    hours: '',
    remarks: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('localHubs');
    if (saved) {
      try {
        setLocalHubs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse local hubs', e);
      }
    }
  }, []);

  const saveLocalHubs = (hubs: TransportEntry[]) => {
    setLocalHubs(hubs);
    localStorage.setItem('localHubs', JSON.stringify(hubs));
  };

  const t = translations[lang];

  const allData = useMemo(() => {
    return [...transportData, ...localHubs].sort((a, b) => b.id - a.id);
  }, [localHubs]);

  // Sorted Japanese phrases for translation consistency (memoized)
  const sortedJpPhrasesJa = useMemo(() => {
    const phrases = translations.ja.phrases;
    return Object.keys(phrases).sort((a, b) => b.length - a.length);
  }, []);

  const sortedJpPhrasesEn = useMemo(() => {
    const phrases = translations.en.phrases;
    return Object.keys(phrases).sort((a, b) => b.length - a.length);
  }, []);

  const translateValue = (val: string, phrases: Record<string, string>) => {
    if (lang === 'ja' || !val) return val;
    let res = val;
    
    // Use the appropriate sorted list
    const sortedKeys = lang === 'en' ? sortedJpPhrasesEn : sortedJpPhrasesJa;
    
    sortedKeys.forEach((jp) => {
      // split/join is a safe fallback for replaceAll in older browsers
      if (res.indexOf(jp) !== -1) {
        res = res.split(jp).join(phrases[jp]);
      }
    });

    // Clean up extra spaces that might be introduced
    return res.replace(/\s+/g, ' ').trim();
  };

  const prefectures = useMemo(() => {
    const prefs = Array.from(new Set(allData.map((item) => item.prefecture)));
    return ['すべて', ...prefs];
  }, [allData]);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const matchesPref = selectedPref === 'すべて' || item.prefecture === selectedPref;
      const matchesSearch = 
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prefecture.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPref && matchesSearch;
    });
  }, [searchQuery, selectedPref]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDownload = () => {
    const currentT = translations[lang];
    
    // Group items by prefecture for static display
    const grouped = allData.reduce((acc, item) => {
      if (!acc[item.prefecture]) acc[item.prefecture] = [];
      acc[item.prefecture].push(item);
      return acc;
    }, {} as Record<string, typeof allData>);

    const sortedPrefs = Object.keys(grouped).sort();

    // Navigation links (static anchors)
    const navHtml = sortedPrefs.map(prefKey => {
      const displayPref = (currentT.prefectures as any)[prefKey] || prefKey;
      return `<a href="#pref-${prefKey}" class="tab">${displayPref}</a>`;
    }).join('');

    // Content sections
    const contentHtml = sortedPrefs.map(prefKey => {
      const items = grouped[prefKey];
      const displayPref = (currentT.prefectures as any)[prefKey] || prefKey;
      const itemsHtml = items.map(item => {
        const isIC = item.area.includes('IC');
        const displayArea = (currentT.areas as any)[item.area] || item.area;
        const displayDest = translateValue(item.destination, (currentT as any).phrases);
        const displayHours = translateValue(item.hours, (currentT as any).phrases);
        const displayRemarks = translateValue(item.remarks, (currentT as any).phrases);
        
        return `
        <div class="card">
            <div class="card-header">
                <span class="pref-tag">${displayPref}</span>
                <div class="${isIC ? 'ic-tag' : 'area-tag'}">
                    ${isIC ? '⚡' : '📍'} ${displayArea}
                </div>
            </div>
            <h2 class="card-title">${displayDest}</h2>
            <div class="card-body">
                ${displayHours ? `
                <div class="info-row">
                    <span class="info-val">${displayHours}</span>
                </div>` : ''}
                ${displayRemarks ? `
                <div class="note-box">${displayRemarks}</div>` : ''}
            </div>
            <a href="${item.mapLink}" class="btn" target="_blank" rel="noopener noreferrer">${currentT.openGoogleMaps}</a>
        </div>`;
      }).join('');

      return `
      <section id="pref-${prefKey}">
        <h2 class="section-title">${displayPref}</h2>
        <div class="grid">
            ${itemsHtml}
        </div>
      </section>`;
    }).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>${currentT.title} (${currentT.offlineTitle})</title>
    <style>
        :root { --p: #2563eb; --bg: #f8fafc; --c: #ffffff; --t: #1e293b; --st: #64748b; --b: #e2e8f0; --eb: #ecfdf5; --et: #065f46; --er: #d1fae5; }
        @media (prefers-color-scheme: dark) { :root { --bg: #020617; --c: #0f172a; --t: #f1f5f9; --st: #94a3b8; --b: #1e293b; --eb: #064e3b; --et: #34d399; --er: #065f46; } }
        html { scroll-behavior: smooth; }
        body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--t); margin: 0; padding: 0; line-height: 1.2; -webkit-text-size-adjust: 100%; }
        header { position: sticky; top: 0; background: var(--c); border-bottom: 1px solid var(--b); padding: 12px 16px; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        h1 { margin: 0 0 10px 0; font-size: 16px; font-weight: 900; letter-spacing: -0.02em; display: flex; justify-content: space-between; align-items: center; }
        .tabs-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -16px; padding: 0 16px; scrollbar-width: none; }
        .tabs-wrap::-webkit-scrollbar { display: none; }
        .tabs { display: flex; gap: 4px; min-width: max-content; padding-bottom: 4px; }
        .tab { white-space: nowrap; padding: 6px 14px; border-radius: 6px; font-weight: 800; font-size: 12px; background: var(--b); color: var(--st); text-decoration: none; transition: all 0.2s; }
        .tab:active { background: var(--p); color: #fff; }
        main { padding: 12px; max-width: 100%; margin: 0 auto; }
        .section-title { font-size: 11px; font-weight: 900; color: var(--st); text-transform: uppercase; letter-spacing: 0.1em; margin: 24px 0 12px 0; border-bottom: 1px solid var(--b); padding-bottom: 4px; }
        .grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 10px; }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1536px) { .grid { grid-template-columns: repeat(5, 1fr); } }
        .card { background: var(--c); border-radius: 12px; border: 1px solid var(--b); padding: 12px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 6px; }
        .pref-tag { font-size: 11px; font-weight: 900; background: var(--bg); padding: 2px 8px; border-radius: 4px; color: var(--st); text-transform: uppercase; }
        .area-tag { background: var(--eb); opacity: 0.8; color: var(--et); padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; border: 1px solid var(--er); }
        .ic-tag { background: var(--eb); color: var(--et); padding: 3px 10px; border-radius: 6px; font-size: 13px; font-weight: 900; border: 1px solid var(--er); box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1); }
        .card-title { font-size: 13px; font-weight: 900; margin: 0 0 8px 0; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .card-body { flex: 1; min-width: 0; }
        .info-val { font-size: 10px; font-weight: 600; color: var(--t); }
        .note-box { background: var(--bg); padding: 8px; border-radius: 8px; font-size: 10px; font-style: italic; opacity: 0.8; margin-top: 6px; border-left: 3px solid var(--b); }
        .btn { display: block; text-align: center; background: var(--p); color: #fff !important; padding: 8px; border-radius: 8px; text-decoration: none; font-weight: 900; font-size: 10px; margin-top: 12px; }
        footer { padding: 40px 16px; text-align: center; font-size: 10px; color: var(--st); opacity: 0.7; }
    </style>
</head>
<body>
    <header>
        <h1>${currentT.title}</h1>
        <div class="tabs-wrap">
            <div class="tabs">${navHtml}</div>
        </div>
    </header>
    <main>
        ${contentHtml}
    </main>
    <footer>&copy; 2026 ${currentT.title}<br>(Standard Offline Layout)</footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Direct download trigger
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentT.title}_Offline.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleAddHub = () => {
    const id = Date.now();
    const hubToAdd: TransportEntry = { ...newHub, id };
    saveLocalHubs([...localHubs, hubToAdd]);
    setIsModalOpen(false);
    setNewHub({
      prefecture: '奈良県',
      area: '',
      destination: '',
      mapLink: '',
      hours: '',
      remarks: ''
    });
  };

  const handleDeleteHub = (id: number) => {
    if (window.confirm(t.confirmDelete)) {
      saveLocalHubs(localHubs.filter(h => h.id !== id));
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 px-4 pt-3 pb-1 border-b transition-colors shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} backdrop-blur-md`}
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-bold tracking-tight">{t.title}</h1>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsModalOpen(true)}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-[9px] font-bold ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}
                title={t.addHub}
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-[9px] font-bold ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-slate-600'}`}
              >
                <Languages size={14} />
                <span>{lang.toUpperCase()}</span>
              </button>
              <button 
                onClick={handleDownload}
                className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-slate-600'}`}
              >
                <Download size={16} />
              </button>
              <button 
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-sm outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white focus:ring-1 focus:ring-blue-500/30' 
                    : 'bg-white border-slate-200 focus:border-blue-500 text-slate-900 focus:ring-1 focus:ring-blue-500/30'
                } shadow-sm`}
              />
            </div>

            {/* Prefecture Filter Tabs */}
            <div className="overflow-x-auto no-scrollbar pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-1 min-w-max">
                {prefectures.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setSelectedPref(pref)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedPref === pref
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {(t.prefectures as any)[pref] || pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none pb-1">
            {(t.prefectures as any)[selectedPref] || selectedPref} • {t.matchesFound.replace('{count}', filteredData.length.toString())}
          </p>
        </div>
      </header>

      <main className="px-2 py-4 max-w-7xl mx-auto min-h-[50vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 relative">
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.2, 
                    ease: "easeInOut",
                    opacity: { duration: 0.15 }
                  }}
                  className={`p-3 rounded-xl border flex flex-col transition-colors overflow-hidden ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-tighter shrink-0 ${
                          isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {(t.prefectures as any)[item.prefecture] || item.prefecture}
                        </span>
                        {localHubs.some(h => h.id === item.id) && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-bold border border-amber-500/30">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      <div className={`px-2 py-1 rounded-md flex items-center gap-1.5 shrink-0 ${
                        item.area.includes('IC')
                          ? (isDarkMode ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm')
                          : (isDarkMode ? 'bg-emerald-500/10 text-emerald-500/70 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
                      }`}>
                        {item.area.includes('IC') ? <Zap size={13} className="text-emerald-500 fill-emerald-500/20" /> : <MapPin size={12} />}
                        <span className="text-xs font-black tracking-tight">
                          {(t.areas as any)[item.area] || item.area}
                        </span>
                      </div>
                    </div>
                    
                    <h2 className="text-sm font-black leading-tight tracking-tight mb-2 truncate" title={item.destination}>
                      {translateValue(item.destination, (t as any).phrases)}
                    </h2>

                    <div className="space-y-1.5">
                      {item.hours && (
                        <div className="flex items-start gap-1.5">
                          <Clock className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} size={14} />
                          <p className="text-sm font-semibold leading-tight">{translateValue(item.hours, (t as any).phrases)}</p>
                        </div>
                      )}

                      {item.remarks && (
                        <div className={`p-2.5 rounded-lg border-l-2 border-blue-500/30 ${isDarkMode ? 'bg-slate-800/40' : 'bg-blue-50/50'} flex items-start gap-2`}>
                          <Info className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={14} />
                          <p className="text-[13px] font-medium leading-relaxed opacity-90">{translateValue(item.remarks, (t as any).phrases)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.mapLink && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <a 
                        href={item.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-black hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        {t.openGoogleMaps} <ExternalLink size={10} />
                      </a>
                      {localHubs.some(h => h.id === item.id) && (
                        <button
                          onClick={() => handleDeleteHub(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-red-400 hover:bg-red-500/10' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                          title={t.deleteHub}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <Search size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">{t.noResults}</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-500 font-bold hover:underline"
                >
                  {t.clearSearch}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer / Info */}
      {/* Add Hub Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
              style={{ WebkitBackdropFilter: 'blur(16px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black tracking-tight">{t.addHub}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.prefecture}</label>
                  <select
                    value={newHub.prefecture}
                    onChange={(e) => setNewHub({ ...newHub, prefecture: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    {prefectures.filter(p => p !== 'すべて').map(pref => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.area}</label>
                  <input
                    type="text"
                    value={newHub.area}
                    onChange={(e) => setNewHub({ ...newHub, area: e.target.value })}
                    placeholder="例: 摩耶ふ頭"
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.destination}</label>
                  <input
                    type="text"
                    value={newHub.destination}
                    onChange={(e) => setNewHub({ ...newHub, destination: e.target.value })}
                    placeholder="例: 行先センター"
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.mapLink}</label>
                  <input
                    type="text"
                    value={newHub.mapLink}
                    onChange={(e) => setNewHub({ ...newHub, mapLink: e.target.value })}
                    placeholder="https://maps.google.com/?q=35.123,135.456"
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <p className="mt-1 text-[9px] text-slate-500 font-medium">{(t as any).mapLinkHint}</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.formHours}</label>
                  <input
                    type="text"
                    value={newHub.hours}
                    onChange={(e) => setNewHub({ ...newHub, hours: e.target.value })}
                    placeholder="例: 9:00~17:00"
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">{t.formRemarks}</label>
                  <textarea
                    value={newHub.remarks}
                    onChange={(e) => setNewHub({ ...newHub, remarks: e.target.value })}
                    placeholder="備考を入力..."
                    rows={2}
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleAddHub}
                    disabled={!newHub.area || !newHub.destination || !newHub.mapLink}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`mt-8 py-6 px-4 text-center border-t transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <p className={`text-[10px] font-medium opacity-50 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          &copy; 2026 {t.title}
        </p>
      </footer>
    </div>
  );
}
