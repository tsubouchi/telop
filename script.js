// DOM要素
const uploadArea = document.getElementById('upload-area');
const videoContainer = document.getElementById('video-container');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const uploadInput = document.getElementById('upload-input');
const clearMediaBtn = document.getElementById('clear-media-btn');
const image = document.getElementById('image');
const video = document.getElementById('video');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const progressHandle = document.getElementById('progress-handle');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const telopContainer = document.querySelector('.telop-container');
const addTelopBtn = document.getElementById('add-telop-btn');
const telopText = document.getElementById('telop-text');
const telopList = document.getElementById('telop-list');
const telopColor = document.getElementById('telop-color');
const telopBgColor = document.getElementById('telop-bg-color');
const telopFontSize = document.getElementById('telop-font-size');
const telopFont = document.getElementById('telop-font');
const fontPreview = document.getElementById('font-preview');
const fontIncreaseBtn = document.getElementById('font-increase-btn');
const fontDecreaseBtn = document.getElementById('font-decrease-btn');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const positionBtns = document.querySelectorAll('.position-btn');
const exportBtn = document.getElementById('export-btn');
const shareBtn = document.getElementById('share-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const downloadBtn = document.getElementById('download-btn');
const canvasContainer = document.getElementById('canvas-container');
const cardTabs = document.querySelectorAll('.card-tab');
const cardItems = document.querySelectorAll('.card-item');
const uploadAreas = document.querySelectorAll('.upload-area');
const cardImages = document.querySelectorAll('.card-image');
const uploadInputs = document.querySelectorAll('.upload-input');
const uploadCloseButtons = document.querySelectorAll('.upload-close');
const telopContainers = document.querySelectorAll('.telop-container');

// カード管理
const cards = [
  { id: 0, imageUrl: null, telops: [], selected: true },
  { id: 1, imageUrl: null, telops: [], selected: false },
  { id: 2, imageUrl: null, telops: [], selected: false },
  { id: 3, imageUrl: null, telops: [], selected: false }
];

// 状態管理
let selectedTelop = null;
let telopIdCounter = 0;
let isDragging = false;
let dragStartX, dragStartY;
let dragTelopStartX, dragTelopStartY;
let videoUrl = null;
let imageUrl = null;
let isPlaying = false;
let isSeeking = false;
let currentExtraClasses = '';

// テロップのプリセット
const telopPresets = [
  { name: '白抜き', color: '#ffffff', bgColor: '#000000', fontSize: '24px', font: 'sans-serif' },
  { name: '黄色', color: '#ffff00', bgColor: 'transparent', fontSize: '24px', font: 'sans-serif' },
  { name: '大見出し', color: '#ffffff', bgColor: '#ff0000', fontSize: '36px', font: 'sans-serif' },
  { name: '小見出し', color: '#ffffff', bgColor: '#0000ff', fontSize: '18px', font: 'sans-serif' },
  { name: '映画風', color: '#ffffff', bgColor: 'transparent', fontSize: '24px', font: 'serif' },
  { name: 'ポップ', color: '#ff00ff', bgColor: '#00ffff', fontSize: '24px', font: 'cursive' },
  // 若者向けショート動画人気スタイル
  { name: 'ネオンパープル', color: '#ff00ff', bgColor: '#6600cc', fontSize: '28px', font: 'fantasy' },
  { name: 'グラデーションオレンジ', color: '#ff9900', bgColor: 'rgba(255, 153, 0, 0.3)', fontSize: '30px', font: '"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", sans-serif' },
  { name: 'ゲーミング', color: '#00ff00', bgColor: '#000000', fontSize: '26px', font: 'monospace' },
  { name: 'TikTok風', color: '#ffffff', bgColor: 'rgba(0, 0, 0, 0.7)', fontSize: '32px', font: '"游ゴシック", "Yu Gothic", YuGothic, sans-serif' },
  { name: 'バズる見出し', color: '#ff3333', bgColor: 'rgba(255, 255, 255, 0.8)', fontSize: '40px', font: '"メイリオ", Meiryo, sans-serif' },
  // 漫画吹き出し風スタイル
  { name: '会話（右）', color: '#000000', bgColor: '#ffffff', fontSize: '18px', font: "'Comic Sans MS', 'Comic Sans', cursive", fontWeight: 'normal', fontStyle: 'normal', extraClasses: 'bubble bubble-right' },
  { name: '会話（左）', color: '#000000', bgColor: '#ffffff', fontSize: '18px', font: "'Comic Sans MS', 'Comic Sans', cursive", fontWeight: 'normal', fontStyle: 'normal', extraClasses: 'bubble bubble-left' },
  { name: 'モノローグ', color: '#333333', bgColor: '#f0f0f0', fontSize: '16px', font: "'M PLUS Rounded 1c', sans-serif", fontWeight: 'normal', fontStyle: 'italic', extraClasses: 'bubble bubble-top' },
  { name: '感情（怒り）', color: '#ffffff', bgColor: '#ff0000', fontSize: '24px', font: "'Comic Sans MS', 'Comic Sans', cursive", fontWeight: 'bold', fontStyle: 'normal', extraClasses: 'bubble' },
  { name: '感情（驚き）', color: '#000000', bgColor: '#ffff00', fontSize: '22px', font: "'Comic Sans MS', 'Comic Sans', cursive", fontWeight: 'bold', fontStyle: 'normal', extraClasses: 'bubble bubble-bottom' }
];

// フォントの選択肢
const fonts = [
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: '游ゴシック', value: '"游ゴシック", "Yu Gothic", YuGothic, sans-serif' },
  { name: '游明朝', value: '"游明朝", "Yu Mincho", YuMincho, serif' },
  { name: 'メイリオ', value: '"メイリオ", Meiryo, sans-serif' },
  { name: 'ヒラギノ角ゴ', value: '"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", sans-serif' },
  { name: 'ヒラギノ明朝', value: '"ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", serif' },
  // 若者向けショート動画人気フォント
  { name: 'ポップで丸い', value: "'M PLUS Rounded 1c', sans-serif" },
  { name: 'コミカル', value: "'Comic Sans MS', 'Comic Sans', cursive" },
  { name: 'クール', value: "'Oswald', sans-serif" },
  { name: 'カジュアル', value: "'Kosugi Maru', sans-serif" },
  { name: 'シャープ', value: "'Noto Sans JP', sans-serif" }
];

// 初期化
function init() {
  console.log('初期化処理を開始します');
  
  // フォントの選択肢を追加
  fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font.value;
    option.textContent = font.name;
    option.style.fontFamily = font.value;
    telopFont.appendChild(option);
  });

  // プリセットボタンを追加
  const presetContainer = document.querySelector('.preset-container');
  telopPresets.forEach(preset => {
    const presetBtn = document.createElement('button');
    presetBtn.className = 'preset-btn';
    presetBtn.textContent = preset.name;
    presetBtn.addEventListener('click', () => applyPreset(preset));
    presetContainer.appendChild(presetBtn);
  });

  // カードタブのイベントリスナー
  cardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cardId = parseInt(tab.dataset.cardId);
      selectCard(cardId);
    });
  });

  // アップロードエリアのイベントリスナー
  uploadAreas.forEach(area => {
    area.addEventListener('dragover', handleDragOver);
    area.addEventListener('dragleave', handleDragLeave);
    area.addEventListener('drop', handleDrop);
  });

  // ファイル選択ボタンのイベントリスナー
  uploadInputs.forEach(input => {
    input.addEventListener('change', handleUploadInputChange);
  });

  // クリアボタンのイベントリスナー
  uploadCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const cardId = parseInt(button.dataset.cardId);
      clearCardMedia(cardId);
    });
  });
  
  // テロップ関連のイベントリスナー
  addTelopBtn.addEventListener('click', addTelop);
  telopText.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTelop();
    }
  });
  
  telopColor.addEventListener('input', updateTelopStyle);
  telopBgColor.addEventListener('input', updateTelopStyle);
  telopFontSize.addEventListener('input', updateTelopStyle);
  telopFont.addEventListener('change', updateTelopStyle);
  fontIncreaseBtn.addEventListener('click', increaseFontSize);
  fontDecreaseBtn.addEventListener('click', decreaseFontSize);
  
  // フォントスタイルボタンのイベントリスナー
  boldBtn.addEventListener('click', toggleBold);
  italicBtn.addEventListener('click', toggleItalic);
  
  positionBtns.forEach(btn => {
    btn.addEventListener('click', () => positionTelop(btn.dataset.position));
  });
  
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // 動画関連のイベントリスナーは、動画要素がある場合のみ追加
  if (typeof video !== 'undefined' && video) {
    video.addEventListener('loadedmetadata', handleVideoMetadata);
    video.addEventListener('timeupdate', updateVideoProgress);
    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', handleVideoEnded);
    
    // 再生コントロールのイベントリスナーも同様に条件付きで追加
    if (playBtn) playBtn.addEventListener('click', togglePlayPause);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePlayPause);
    if (progressBar) progressBar.addEventListener('mousedown', startSeeking);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
  
  exportBtn.addEventListener('click', exportWithTelops);
  shareBtn.addEventListener('click', shareTelops);
  copyLinkBtn.addEventListener('click', copyLink);
  downloadBtn.addEventListener('click', downloadTelops);
  
  // 画像要素があれば、そのイベントリスナーを追加
  if (typeof image !== 'undefined' && image) {
    image.addEventListener('load', handleImageLoad);
    image.addEventListener('error', handleImageError);
  }

  // フォントプレビューの更新
  telopText.addEventListener('input', updateFontPreview);
  updateFontPreview();
}

// カード選択
function selectCard(cardId) {
  // カードの選択状態を更新
  cards.forEach(card => {
    card.selected = (card.id === cardId);
  });
  
  // カードタブUIを更新
  cardTabs.forEach(tab => {
    const tabCardId = parseInt(tab.dataset.cardId);
    tab.classList.toggle('active', tabCardId === cardId);
  });
  
  // カードアイテムUIを更新
  cardItems.forEach(item => {
    const itemCardId = parseInt(item.dataset.cardId);
    item.classList.toggle('active', itemCardId === cardId);
  });
  
  // 選択されたカードのテロップリストを表示
  updateTelopList();
  
  // 選択されたテロップをクリア
  selectedTelop = null;
  updateFontPreview();
}

// 現在選択中のカードを取得
function getSelectedCard() {
  return cards.find(card => card.selected);
}

// ドラッグオーバーの処理
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.add('dragover');
}

// ドラッグ離脱の処理
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.classList.remove('dragover');
}

// ドロップ処理
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const uploadArea = e.currentTarget;
  uploadArea.classList.remove('dragover');
  
  const cardId = parseInt(uploadArea.id.split('-')[2]);
  
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (file.type.match('image.*')) {
      loadCardImage(file, cardId);
    }
  }
}

// ファイル選択変更処理
function handleUploadInputChange(e) {
  const input = e.currentTarget;
  const cardId = parseInt(input.dataset.cardId);
  
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file.type.match('image.*')) {
      loadCardImage(file, cardId);
    }
  }
}

// カード画像の読み込み
function loadCardImage(file, cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;
  
  // 既存のURLを解放
  if (card.imageUrl) {
    URL.revokeObjectURL(card.imageUrl);
  }
  
  // 新しい画像URLを作成
  card.imageUrl = URL.createObjectURL(file);
  
  // カードの画像を更新
  const cardImage = document.querySelector(`.card-image[data-card-id="${cardId}"]`);
  cardImage.src = card.imageUrl;
  cardImage.classList.add('has-image');
  
  // アップロードエリアを非表示
  const uploadArea = document.getElementById(`upload-area-${cardId}`);
  uploadArea.classList.add('has-media');
  
  // 自動的にこのカードを選択
  selectCard(cardId);
}

// カードメディアのクリア
function clearCardMedia(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;
  
  // URLを解放
  if (card.imageUrl) {
    URL.revokeObjectURL(card.imageUrl);
    card.imageUrl = null;
  }
  
  // カードの画像をクリア
  const cardImage = document.querySelector(`.card-image[data-card-id="${cardId}"]`);
  cardImage.src = '';
  cardImage.classList.remove('has-image');
  
  // アップロードエリアを表示
  const uploadArea = document.getElementById(`upload-area-${cardId}`);
  uploadArea.classList.remove('has-media');
  
  // 対応するファイル入力をリセット
  const fileInput = document.querySelector(`.upload-input[data-card-id="${cardId}"]`);
  fileInput.value = '';
}

// テロップの追加
function addTelop() {
  const selectedCard = getSelectedCard();
  if (!selectedCard) return;
  
  const text = telopText.value.trim();
  if (!text) return;
  
  const id = telopIdCounter++;
  const color = telopColor.value;
  const bgColor = telopBgColor.value;
  const fontSize = telopFontSize.value + 'px';
  const font = telopFont.value;
  const fontWeight = boldBtn.classList.contains('active') ? 'bold' : 'normal';
  const fontStyle = italicBtn.classList.contains('active') ? 'italic' : 'normal';
  
  const telop = {
    id,
    text,
    color,
    bgColor,
    fontSize,
    font,
    fontWeight,
    fontStyle,
    x: 50, // パーセント
    y: 50, // パーセント
    cardId: selectedCard.id
  };
  
  // 現在選択中のカードにテロップを追加
  selectedCard.telops.push(telop);
  
  // テロップを描画
  renderTelop(telop);
  
  // テロップリストに追加
  addToTelopList(telop);
  
  // フォームをクリア
  telopText.value = '';
  updateFontPreview();
  
  // 新しいテロップを選択
  selectTelop(telop.id);
}

// テロップの描画
function renderTelop(telop) {
  // カードIDに対応するテロップコンテナを取得
  const telopContainer = document.querySelector(`.telop-container[data-card-id="${telop.cardId}"]`);
  if (!telopContainer) {
    console.error(`カードID ${telop.cardId} のテロップコンテナが見つかりません`);
    return;
  }
  
  // 既存のテロップを削除（更新の場合）
  const existingTelop = document.getElementById(`telop-${telop.id}`);
  if (existingTelop) {
    existingTelop.remove();
  }
  
  const telopEl = document.createElement('div');
  telopEl.id = `telop-${telop.id}`;
  telopEl.className = 'telop';
  
  // 追加のクラスがある場合は適用
  if (telop.extraClasses) {
    telop.extraClasses.split(' ').forEach(cls => {
      telopEl.classList.add(cls);
    });
  }
  
  telopEl.textContent = telop.text;
  telopEl.style.color = telop.color;
  telopEl.style.backgroundColor = telop.bgColor;
  telopEl.style.fontSize = telop.fontSize;
  telopEl.style.fontFamily = telop.font;
  telopEl.style.fontWeight = telop.fontWeight;
  telopEl.style.fontStyle = telop.fontStyle;
  telopEl.style.left = `${telop.x}%`;
  telopEl.style.top = `${telop.y}%`;
  telopEl.style.transform = 'translate(-50%, -50%)';
  telopEl.dataset.id = telop.id;
  telopEl.dataset.cardId = telop.cardId;
  
  telopContainer.appendChild(telopEl);
}

// テロップリストを更新
function updateTelopList() {
  const selectedCard = getSelectedCard();
  if (!selectedCard) return;
  
  // リストをクリア
  telopList.innerHTML = '';
  
  // 選択中のカードのテロップのみを表示
  selectedCard.telops.forEach(telop => {
    addToTelopList(telop);
  });
}

// テロップリストに追加
function addToTelopList(telop) {
  const item = document.createElement('div');
  item.className = 'telop-item';
  item.dataset.id = telop.id;
  
  const telopText = document.createElement('div');
  telopText.className = 'telop-item-text';
  telopText.textContent = telop.text;
  
  const actions = document.createElement('div');
  actions.className = 'telop-actions';
  
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-secondary';
  editBtn.textContent = '編集';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectTelop(telop.id);
  });
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = '削除';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTelop(telop.id);
  });
  
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  
  item.appendChild(telopText);
  item.appendChild(actions);
  
  item.addEventListener('click', () => selectTelop(telop.id));
  
  telopList.appendChild(item);
}

// テロップの選択
function selectTelop(id) {
  // 現在選択されているテロップの選択を解除
  const selectedTelopEl = document.querySelector('.telop.selected');
  if (selectedTelopEl) {
    selectedTelopEl.classList.remove('selected');
  }
  
  const telopItems = document.querySelectorAll('.telop-item');
  telopItems.forEach(item => item.classList.remove('active'));
  
  // 選択中のカードのテロップから検索
  const selectedCard = getSelectedCard();
  if (selectedCard) {
    selectedTelop = selectedCard.telops.find(t => t.id === id);
    
    if (selectedTelop) {
      const telopEl = document.getElementById(`telop-${id}`);
      if (telopEl) {
        telopEl.classList.add('selected');
      }
      
      const telopItem = document.querySelector(`.telop-item[data-id="${id}"]`);
      if (telopItem) {
        telopItem.classList.add('active');
      }
      
      // フォームに値を設定
      telopText.value = selectedTelop.text;
      telopColor.value = selectedTelop.color;
      telopBgColor.value = selectedTelop.bgColor;
      telopFontSize.value = parseInt(selectedTelop.fontSize);
      telopFont.value = selectedTelop.font;
      
      // フォントスタイルボタンの状態を更新
      boldBtn.classList.toggle('active', selectedTelop.fontWeight === 'bold');
      italicBtn.classList.toggle('active', selectedTelop.fontStyle === 'italic');
      
      updateFontPreview();
    }
  }
}

// テロップの削除
function deleteTelop(id) {
  const selectedCard = getSelectedCard();
  if (!selectedCard) return;
  
  const index = selectedCard.telops.findIndex(t => t.id === id);
  if (index !== -1) {
    selectedCard.telops.splice(index, 1);
    
    const telopEl = document.getElementById(`telop-${id}`);
    if (telopEl) {
      telopEl.remove();
    }
    
    const telopItem = document.querySelector(`.telop-item[data-id="${id}"]`);
    if (telopItem) {
      telopItem.remove();
    }
    
    if (selectedTelop && selectedTelop.id === id) {
      selectedTelop = null;
      telopText.value = '';
      updateFontPreview();
    }
  }
}

// テロップのスタイル更新
function updateTelopStyle() {
  if (!selectedTelop) return;
  
  selectedTelop.color = telopColor.value;
  selectedTelop.bgColor = telopBgColor.value;
  selectedTelop.fontSize = telopFontSize.value + 'px';
  selectedTelop.font = telopFont.value;
  selectedTelop.fontWeight = boldBtn.classList.contains('active') ? 'bold' : 'normal';
  selectedTelop.fontStyle = italicBtn.classList.contains('active') ? 'italic' : 'normal';
  
  // 追加のクラスがある場合は保存
  if (currentExtraClasses) {
    selectedTelop.extraClasses = currentExtraClasses;
  }
  
  updateFontPreview();
  renderTelop(selectedTelop);
}

// フォントプレビューの更新
function updateFontPreview() {
  const text = telopText.value.trim() || 'フォントプレビュー';
  fontPreview.textContent = text;
  fontPreview.style.color = telopColor.value;
  fontPreview.style.backgroundColor = telopBgColor.value;
  fontPreview.style.fontSize = telopFontSize.value + 'px';
  fontPreview.style.fontFamily = telopFont.value;
  fontPreview.style.fontWeight = boldBtn.classList.contains('active') ? 'bold' : 'normal';
  fontPreview.style.fontStyle = italicBtn.classList.contains('active') ? 'italic' : 'normal';
}

// フォントサイズ増加
function increaseFontSize() {
  const currentSize = parseInt(telopFontSize.value);
  const newSize = Math.min(currentSize + 2, 72);
  telopFontSize.value = newSize;
  updateTelopStyle();
}

// フォントサイズ減少
function decreaseFontSize() {
  const currentSize = parseInt(telopFontSize.value);
  const newSize = Math.max(currentSize - 2, 10);
  telopFontSize.value = newSize;
  updateTelopStyle();
}

// テロップの位置
function positionTelop(position) {
  if (!selectedTelop) return;
  
  switch (position) {
    case 'top-left':
      selectedTelop.x = 10;
      selectedTelop.y = 10;
      break;
    case 'top':
      selectedTelop.x = 50;
      selectedTelop.y = 10;
      break;
    case 'top-right':
      selectedTelop.x = 90;
      selectedTelop.y = 10;
      break;
    case 'left':
      selectedTelop.x = 10;
      selectedTelop.y = 50;
      break;
    case 'center':
      selectedTelop.x = 50;
      selectedTelop.y = 50;
      break;
    case 'right':
      selectedTelop.x = 90;
      selectedTelop.y = 50;
      break;
    case 'bottom-left':
      selectedTelop.x = 10;
      selectedTelop.y = 90;
      break;
    case 'bottom':
      selectedTelop.x = 50;
      selectedTelop.y = 90;
      break;
    case 'bottom-right':
      selectedTelop.x = 90;
      selectedTelop.y = 90;
      break;
  }
  
  renderTelop(selectedTelop);
}

// テロップのプリセット適用
function applyPreset(preset) {
  telopColor.value = preset.color;
  telopBgColor.value = preset.bgColor;
  telopFontSize.value = parseInt(preset.fontSize);
  telopFont.value = preset.font;
  
  // プリセットにフォントスタイルが含まれている場合は適用
  if (preset.fontWeight) {
    boldBtn.classList.toggle('active', preset.fontWeight === 'bold');
  }
  if (preset.fontStyle) {
    italicBtn.classList.toggle('active', preset.fontStyle === 'italic');
  }
  
  // 吹き出しスタイルを保存
  currentExtraClasses = preset.extraClasses || '';
  
  updateFontPreview();
  
  if (selectedTelop) {
    updateTelopStyle();
  }
}

// マウスドラッグでテロップを移動
function handleMouseDown(e) {
  if (e.target.classList.contains('telop')) {
    const selectedCard = getSelectedCard();
    if (!selectedCard) return;

    const telopId = parseInt(e.target.dataset.id);
    const telopCardId = parseInt(e.target.dataset.cardId);
    
    // 選択中のカードのテロップでない場合は何もしない
    if (telopCardId !== selectedCard.id) return;
    
    e.preventDefault();
    isDragging = true;
    selectTelop(telopId);
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragTelopStartX = selectedTelop.x;
    dragTelopStartY = selectedTelop.y;
  }
}

function handleMouseMove(e) {
  if (!isDragging || !selectedTelop) return;
  
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;
  
  // カード画像のコンテナを基準に相対的な位置を計算
  const selectedCard = getSelectedCard();
  if (selectedCard) {
    const cardImageContainer = document.querySelector(`.card-item[data-card-id="${selectedCard.id}"] .card-image-container`);
    const containerRect = cardImageContainer.getBoundingClientRect();
    
    // パーセント単位での移動量を計算
    const percentX = (deltaX / containerRect.width) * 100;
    const percentY = (deltaY / containerRect.height) * 100;
    
    selectedTelop.x = Math.max(0, Math.min(100, dragTelopStartX + percentX));
    selectedTelop.y = Math.max(0, Math.min(100, dragTelopStartY + percentY));
    
    renderTelop(selectedTelop);
  }
}

function handleMouseUp() {
  isDragging = false;
}

// 動画メタデータの処理
function handleVideoMetadata() {
  updateDuration();
  updateVideoProgress();
}

// 動画の再生時間を更新
function updateDuration() {
  const videoDuration = isFinite(video.duration) ? video.duration : 0;
  duration.textContent = formatTime(videoDuration);
}

// 動画の進行状況を更新
function updateVideoProgress() {
  if (isNaN(video.duration) || video.duration === 0) return;
  
  const percentage = (video.currentTime / video.duration) * 100;
  progress.style.width = `${percentage}%`;
  progressHandle.style.left = `${percentage}%`;
  
  currentTime.textContent = formatTime(video.currentTime);
}

// 再生と一時停止の切り替え
function togglePlayPause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// 再生状態の更新
function updatePlayState() {
  isPlaying = !video.paused;
  playBtn.style.display = isPlaying ? 'none' : 'flex';
  pauseBtn.style.display = isPlaying ? 'flex' : 'none';
}

// 動画が終了した時の処理
function handleVideoEnded() {
  video.currentTime = 0;
  video.pause();
}

// シーク処理の開始
function startSeeking(e) {
  isSeeking = true;
  updateSeek(e);
  
  document.addEventListener('mousemove', updateSeek);
  document.addEventListener('mouseup', endSeeking);
}

// シーク位置の更新
function updateSeek(e) {
  if (!isSeeking) return;
  
  const rect = progressBar.getBoundingClientRect();
  const clickPosition = (e.clientX - rect.left) / rect.width;
  const newTime = clickPosition * video.duration;
  
  if (isFinite(newTime)) {
    video.currentTime = Math.max(0, Math.min(video.duration, newTime));
  }
}

// シーク処理の終了
function endSeeking() {
  isSeeking = false;
  document.removeEventListener('mousemove', updateSeek);
  document.removeEventListener('mouseup', endSeeking);
}

// 消音の切り替え
function toggleMute() {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? '🔇' : '🔊';
}

// 音量の更新
function updateVolume() {
  video.volume = volumeSlider.value;
  video.muted = (video.volume === 0);
  muteBtn.textContent = (video.volume === 0) ? '🔇' : '🔊';
}

// フルスクリーンの切り替え
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen().catch(err => {
      console.error(`フルスクリーンに失敗しました: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// テロップをキャンバスに描画
function renderToCanvas() {
  const selectedCard = getSelectedCard();
  if (!selectedCard || !selectedCard.imageUrl) {
    throw new Error('画像がアップロードされていません');
  }
  
  // 新しいキャンバスを作成
  const canvas = document.createElement('canvas');
  
  // 画像を読み込んでサイズを取得
  const img = new Image();
  img.src = selectedCard.imageUrl;
  
  // 表示サイズを取得（実際の表示領域のサイズ）
  const cardImageContainer = document.querySelector(`.card-item[data-card-id="${selectedCard.id}"] .card-image-container`);
  const displayRect = cardImageContainer.getBoundingClientRect();
  const displayWidth = displayRect.width;
  const displayHeight = displayRect.height;
  
  // キャンバスサイズを設定（高品質な出力のため、実際の画像サイズを使用）
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  canvas.width = width;
  canvas.height = height;
  
  // コンテキストを取得
  const ctx = canvas.getContext('2d');
  
  // 背景色を設定して塗りつぶし
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // 画像を描画
  ctx.drawImage(img, 0, 0, width, height);
  
  // 選択中のカードのテロップを描画
  selectedCard.telops.forEach(telop => {
    ctx.save();
    
    // 表示サイズと実際のサイズの比率を計算
    const scaleX = width / displayWidth;
    const scaleY = height / displayHeight;
    
    // 位置をパーセントからピクセルに変換
    const x = (telop.x / 100) * width;
    const y = (telop.y / 100) * height;
    
    // フォントサイズをスケール適用（画面表示と同じスケールに調整）
    const fontSize = parseInt(telop.fontSize) * scaleX;
    
    // フォントとスタイルを設定
    let fontString = '';
    if (telop.fontStyle === 'italic') {
      fontString += 'italic ';
    }
    if (telop.fontWeight === 'bold') {
      fontString += 'bold ';
    }
    fontString += `${fontSize}px ${telop.font}`;
    
    ctx.font = fontString;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // テキストを複数行に分割
    const lines = telop.text.split('\n');
    const lineHeight = fontSize * 1.2; // 行間を設定
    
    // 全テキストの幅と高さを計算
    let maxTextWidth = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxTextWidth) {
        maxTextWidth = metrics.width;
      }
    }
    
    const totalTextHeight = lines.length * lineHeight;
    
    // 背景を描画
    if (telop.bgColor !== 'transparent') {
      const padding = fontSize * 0.2;
      ctx.fillStyle = telop.bgColor;
      ctx.fillRect(
        x - maxTextWidth / 2 - padding,
        y - totalTextHeight / 2 + (lineHeight / 2 - fontSize) - padding,
        maxTextWidth + padding * 2,
        totalTextHeight + padding * 2
      );
    }
    
    // 各行のテキストを描画
    ctx.fillStyle = telop.color;
    lines.forEach((line, i) => {
      const lineY = y - (lines.length - 1) * lineHeight / 2 + i * lineHeight;
      ctx.fillText(line, x, lineY);
    });
    
    ctx.restore();
  });
  
  return canvas;
}

// テロップ付きの画像をエクスポート
function exportWithTelops() {
  const selectedCard = getSelectedCard();
  if (!selectedCard || !selectedCard.imageUrl) {
    alert('画像がアップロードされていません');
    return;
  }
  
  const canvas = renderToCanvas();
  
  // キャンバスを画像に変換
  const dataUrl = canvas.toDataURL('image/png');
  
  // 新しいウィンドウで開く
  const win = window.open();
  win.document.write(`<img src="${dataUrl}" alt="画像付きテロップ">`);
}

// テロップをシェア
function shareTelops() {
  const selectedCard = getSelectedCard();
  if (!selectedCard || !selectedCard.imageUrl) {
    alert('画像がアップロードされていません');
    return;
  }
  
  // Web Share API が利用可能な場合
  if (navigator.share) {
    const canvas = renderToCanvas();
    
    canvas.toBlob(blob => {
      const file = new File([blob], 'telop-image.png', { type: 'image/png' });
      
      navigator.share({
        title: 'テロップ画像',
        text: 'テロップエディターで作成した画像です',
        files: [file]
      }).catch(error => {
        console.error('シェアに失敗しました:', error);
        // フォールバック: データURLを使用
        const dataUrl = canvas.toDataURL('image/png');
        const win = window.open();
        win.document.write(`
          <h1>画像を長押しして保存してください</h1>
          <img src="${dataUrl}" alt="画像付きテロップ">
        `);
      });
    }, 'image/png');
  } else {
    // Web Share API が利用できない場合
    const canvas = renderToCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    
    const win = window.open();
    win.document.write(`
      <h1>画像を右クリックして保存してください</h1>
      <img src="${dataUrl}" alt="画像付きテロップ">
    `);
  }
}

// リンクをコピー（今後の機能）
function copyLink() {
  alert('この機能は開発中です。');
}

// テロップ付き画像をダウンロード
function downloadTelops() {
  const selectedCard = getSelectedCard();
  if (!selectedCard || !selectedCard.imageUrl) {
    alert('画像がアップロードされていません');
    return;
  }
  
  const canvas = renderToCanvas();
  const dataUrl = canvas.toDataURL('image/png');
  
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'telop-image.png';
  a.click();
}

// 時間のフォーマット
function formatTime(seconds) {
  if (!isFinite(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 太字トグル
function toggleBold() {
  boldBtn.classList.toggle('active');
  updateTelopStyle();
}

// 斜体トグル
function toggleItalic() {
  italicBtn.classList.toggle('active');
  updateTelopStyle();
}

// 画像が読み込まれた時の処理
function handleImageLoad() {
  console.log('画像が読み込まれました');
  videoContainer.style.opacity = '1';
  uploadArea.classList.add('has-media');
  uploadPlaceholder.style.display = 'none';
}

// 画像読み込みエラー時の処理
function handleImageError() {
  console.error('画像の読み込みに失敗しました');
  alert('画像の読み込みに失敗しました。別の画像を試してください。');
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded イベントが発火しました');
  init();
}); 