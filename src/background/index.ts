// Service Worker for Dream Diary Assistant

// アクションボタンクリック時にサイドパネルを開く
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 拡張機能インストール時の初期化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Dream Diary Assistant installed');
  }
});

// サイドパネルの動作設定
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
