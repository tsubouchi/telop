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

// 状態管理
let selectedTelop = null;
let telops = [];
let telopIdCounter = 0;
let isDragging = false;
let dragStartX, dragStartY;
let dragTelopStartX, dragTelopStartY;
let videoUrl = null;
let imageUrl = null;
let isPlaying = false;
let isSeeking = false;

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
  { name: 'バズる見出し', color: '#ff3333', bgColor: 'rgba(255, 255, 255, 0.8)', fontSize: '40px', font: '"メイリオ", Meiryo, sans-serif' }
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
  
  // アップロードエリアの確認
  console.log('アップロードエリア要素:', uploadArea);
  if (!uploadArea) {
    console.error('Error: アップロードエリア要素が見つかりません');
  }
  
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

  // イベントリスナー
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);
  uploadInput.addEventListener('change', handleUploadInputChange);
  clearMediaBtn.addEventListener('click', clearMedia);
  
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
  
  video.addEventListener('loadedmetadata', handleVideoMetadata);
  video.addEventListener('timeupdate', updateVideoProgress);
  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  video.addEventListener('ended', handleVideoEnded);
  
  playBtn.addEventListener('click', togglePlayPause);
  pauseBtn.addEventListener('click', togglePlayPause);
  progressBar.addEventListener('mousedown', startSeeking);
  muteBtn.addEventListener('click', toggleMute);
  volumeSlider.addEventListener('input', updateVolume);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  exportBtn.addEventListener('click', exportWithTelops);
  shareBtn.addEventListener('click', shareTelops);
  copyLinkBtn.addEventListener('click', copyLink);
  downloadBtn.addEventListener('click', downloadTelops);
  
  image.addEventListener('load', handleImageLoad);
  image.addEventListener('error', handleImageError);

  // フォントプレビューの更新
  telopText.addEventListener('input', updateFontPreview);
  updateFontPreview();
}

// ファイルドロップ処理
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('dragover イベントが発生しました');
  uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('dragleave イベントが発生しました');
  uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('drop イベントが発生しました');
  uploadArea.classList.remove('drag-over');
  
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    console.log('ファイルがドロップされました:', e.dataTransfer.files);
    handleFiles(e.dataTransfer.files);
  } else {
    console.error('ドロップされたファイルが見つかりません');
  }
}

function handleUploadInputChange(e) {
  if (e.target.files.length > 0) {
    handleFiles(e.target.files);
  }
}

// ファイル処理
function handleFiles(files) {
  console.log('ファイル処理開始', files);
  if (!files || files.length === 0) {
    console.error('処理するファイルがありません');
    return;
  }
  
  const file = files[0];
  const fileType = file.type;
  console.log('ファイルタイプ:', fileType);
  
  // 既存のメディアをクリア
  clearMedia();
  
  if (fileType.startsWith('image/')) {
    console.log('画像ファイルを処理します');
    // 画像ファイルの処理
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    
    try {
      imageUrl = URL.createObjectURL(file);
      console.log('画像URL作成:', imageUrl);
      loadImage(imageUrl);
      
      // UIの更新
      uploadArea.classList.add('has-media');
      if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'none';
      }
    } catch (error) {
      console.error('画像の処理中にエラーが発生しました:', error);
      alert('画像の処理中にエラーが発生しました。別の画像を試してください。');
    }
  } else if (fileType.startsWith('video/')) {
    // 動画ファイルの処理
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    
    videoUrl = URL.createObjectURL(file);
    loadVideo(videoUrl);
    
    uploadArea.classList.add('has-media');
    uploadPlaceholder.style.display = 'none';
  } else {
    console.error('サポートされていないファイル形式:', fileType);
    alert('サポートされていないファイル形式です。JPEG、PNGの画像ファイルをアップロードしてください。');
  }
}

// 画像の読み込み
function loadImage(src) {
  console.log('画像を読み込みます', src);
  image.src = src;
  video.style.display = 'none';
  image.style.display = 'block';
  
  // 再生コントロールを非表示
  document.querySelector('.playback-controls').style.display = 'none';
  document.querySelector('.progress-bar').style.display = 'none';
  document.querySelector('.time-display').style.display = 'none';
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
  clearMedia();
}

// 動画の読み込み
function loadVideo(src) {
  video.src = src;
  image.style.display = 'none';
  video.style.display = 'block';
  
  // 再生コントロールを表示
  document.querySelector('.playback-controls').style.display = 'flex';
  document.querySelector('.progress-bar').style.display = 'block';
  document.querySelector('.time-display').style.display = 'flex';
  
  video.volume = volumeSlider.value;
  
  // 自動再生
  video.play().catch(e => {
    console.error('自動再生に失敗しました:', e);
  });
}

// メディアのクリア
function clearMedia() {
  console.log('メディアをクリアします');
  
  if (videoUrl) {
    URL.revokeObjectURL(videoUrl);
    videoUrl = null;
  }
  
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
    imageUrl = null;
  }
  
  video.pause();
  video.src = '';
  image.src = '';
  image.style.display = 'none';
  video.style.display = 'none';
  
  // テロップもクリア
  telopContainer.innerHTML = '';
  telops = [];
  telopList.innerHTML = '';
  selectedTelop = null;
  
  // アップロードエリアの表示を戻す
  uploadArea.classList.remove('has-media');
  uploadPlaceholder.style.display = 'flex';
  videoContainer.style.opacity = '0';
}

// テロップの追加
function addTelop() {
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
    y: 50  // パーセント
  };
  
  telops.push(telop);
  renderTelop(telop);
  addToTelopList(telop);
  
  // フォームをクリア
  telopText.value = '';
  updateFontPreview();
  
  // 新しいテロップを選択
  selectTelop(telop.id);
}

// テロップの描画
function renderTelop(telop) {
  // 既存のテロップを削除（更新の場合）
  const existingTelop = document.getElementById(`telop-${telop.id}`);
  if (existingTelop) {
    existingTelop.remove();
  }
  
  const telopEl = document.createElement('div');
  telopEl.id = `telop-${telop.id}`;
  telopEl.className = 'telop';
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
  
  telopContainer.appendChild(telopEl);
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
  
  // 新しいテロップを選択
  selectedTelop = telops.find(t => t.id === id);
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

// テロップの削除
function deleteTelop(id) {
  const index = telops.findIndex(t => t.id === id);
  if (index !== -1) {
    telops.splice(index, 1);
    
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

// フォントサイズの増加
function increaseFontSize() {
  const currentSize = parseInt(telopFontSize.value);
  telopFontSize.value = Math.min(currentSize + 2, 72);
  updateTelopStyle();
}

// フォントサイズの減少
function decreaseFontSize() {
  const currentSize = parseInt(telopFontSize.value);
  telopFontSize.value = Math.max(currentSize - 2, 10);
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
  
  updateFontPreview();
  
  if (selectedTelop) {
    updateTelopStyle();
  }
}

// マウスドラッグでテロップを移動
function handleMouseDown(e) {
  if (e.target.classList.contains('telop')) {
    e.preventDefault();
    isDragging = true;
    const telopId = parseInt(e.target.dataset.id);
    selectTelop(telopId);
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragTelopStartX = selectedTelop.x;
    dragTelopStartY = selectedTelop.y;
  }
}

function handleMouseMove(e) {
  if (!isDragging || !selectedTelop) return;
  
  const containerRect = telopContainer.getBoundingClientRect();
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  
  // パーセント換算
  const percentX = (dx / containerRect.width) * 100;
  const percentY = (dy / containerRect.height) * 100;
  
  selectedTelop.x = Math.max(0, Math.min(100, dragTelopStartX + percentX));
  selectedTelop.y = Math.max(0, Math.min(100, dragTelopStartY + percentY));
  
  renderTelop(selectedTelop);
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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // キャンバスのサイズを設定
  let width, height;
  let displayWidth, displayHeight;
  
  if (image.style.display !== 'none' && image.src) {
    // 画像の場合
    width = image.naturalWidth;
    height = image.naturalHeight;
    
    // 表示サイズを取得
    const imageRect = image.getBoundingClientRect();
    displayWidth = imageRect.width;
    displayHeight = imageRect.height;
  } else if (video.style.display !== 'none' && video.src) {
    // 動画の場合
    width = video.videoWidth;
    height = video.videoHeight;
    
    // 表示サイズを取得
    const videoRect = video.getBoundingClientRect();
    displayWidth = videoRect.width;
    displayHeight = videoRect.height;
  } else {
    // メディアがない場合
    const containerRect = videoContainer.getBoundingClientRect();
    width = containerRect.width;
    height = containerRect.height;
    displayWidth = width;
    displayHeight = height;
  }
  
  // プレビューと同じアスペクト比を維持
  canvas.width = width;
  canvas.height = height;
  
  // 背景（画像または動画のフレーム）を描画
  if (image.style.display !== 'none' && image.src) {
    ctx.drawImage(image, 0, 0, width, height);
  } else if (video.style.display !== 'none' && video.src) {
    ctx.drawImage(video, 0, 0, width, height);
  } else {
    // 背景が無い場合は黒で塗りつぶす
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
  }
  
  // DOM上のテロップ要素をもとに描画する
  telops.forEach(telop => {
    ctx.save();
    
    // 表示サイズと実際のサイズの比率を計算
    const scaleX = width / displayWidth;
    const scaleY = height / displayHeight;
    
    // DOM上の実際のテロップ要素を取得
    const telopEl = document.getElementById(`telop-${telop.id}`);
    if (!telopEl) return;
    
    // テロップ要素のサイズと位置を取得
    const telopRect = telopEl.getBoundingClientRect();
    const containerRect = telopContainer.getBoundingClientRect();
    
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
      const lineY = y - (totalTextHeight / 2) + (i * lineHeight) + (lineHeight / 2);
      ctx.fillText(line, x, lineY);
    });
    
    ctx.restore();
  });
  
  return canvas;
}

// テロップ付きの画像/動画をエクスポート
function exportWithTelops() {
  const canvas = renderToCanvas();
  
  // キャンバスを画像に変換
  const dataUrl = canvas.toDataURL('image/png');
  
  // 新しいウィンドウで開く
  const win = window.open();
  win.document.write(`<img src="${dataUrl}" alt="画像付きテロップ">`);
}

// テロップをシェア
function shareTelops() {
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

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded イベントが発火しました');
  init();
}); 