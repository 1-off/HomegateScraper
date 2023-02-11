browser.menus.create({
  id: "collector",
  title: "Collect listings",
  contexts: ["all"],
});
browser.menus.create({
  id: "copy-to-clipboard",
  title: "Copy to clipboard",
  contexts: ["all"],
  parentId: "collector",
});

browser.menus.create({
  id: "save-file",
  title: "Download as file",
  contexts: ["all"],
  parentId: "collector",
});

browser.menus.onClicked.addListener((info, tab) => {
  console.log(info.menuItemId);
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { type: info.menuItemId });
  });
});
