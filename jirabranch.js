const slugify = (text) => {
  return text
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\_/g,'-')
    .replace(/\-\-+/g, '-')
    .substring(0, 100)
    .replace(/\-$/g, '');
}

PREFIX = "";

const addBranchIcon = () => {
  const keylink = document.querySelector("#key-val") || document.querySelector("#issuekey-val");

  if (keylink) {
    const key = keylink.textContent;
    const summary = document.querySelector("#summary-val").textContent;
    const slug = slugify(summary);
    const branch = `${PREFIX}${key}-${slug}`;

    const branchIcon = document.createElement("img");
    branchIcon.id = "jirabranch-icon";
    branchIcon.src = chrome.runtime.getURL("images/icon-16.png");
    branchIcon.addEventListener("click", (event) => {
      navigator.clipboard.writeText(branch);
      copiedIndicator = document.createElement("span");
      copiedIndicator.id = "jirabranch-indicator";
      copiedIndicator.textContent = `Copied '${branch}'`;
      branchIcon.insertAdjacentElement("afterend", copiedIndicator);
      setTimeout(() => {
        copiedIndicator.style.opacity = 0;
        setTimeout(() => copiedIndicator.remove(), 500);
      }, 1000);
    });

    document.querySelector("#jirabranch-icon")?.remove();
    keylink.insertAdjacentElement("afterend", branchIcon);
  }
}

const onMutation = (mutations, observer) => {
  if (mutations.some((mut) => mut.target.id == "summary-val")) {
    addBranchIcon();
  }
}

const jira = document.querySelector("#jira");
if (jira) {
  chrome.storage.sync.get({
    prefix: ""
  }, (opts) => {
    PREFIX = opts.prefix;
    addBranchIcon();
    new MutationObserver(onMutation).observe(jira, {
      attributes: true,
      childList: true,
      subtree: true
    });
  });
}
