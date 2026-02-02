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

// Get the issue key element and text for both Datacenter and Cloud
const getIssueKeyInfo = () => {
  // Datacenter selectors
  let keyElement = document.querySelector("#key-val") || document.querySelector("#issuekey-val");
  if (keyElement) {
    return { element: keyElement, key: keyElement.textContent.trim() };
  }

  // Cloud selector
  keyElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]');
  if (keyElement) {
    return { element: keyElement, key: keyElement.textContent.trim() };
  }

  return null;
}

// Get the issue summary for both Datacenter and Cloud
const getIssueSummary = () => {
  // Datacenter selector
  let summaryElement = document.querySelector("#summary-val");
  if (summaryElement) {
    return summaryElement.textContent.trim();
  }

  // Cloud selector
  summaryElement = document.querySelector('[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]');
  if (summaryElement) {
    return summaryElement.textContent.trim();
  }

  return null;
}

const addBranchIcon = () => {
  const keyInfo = getIssueKeyInfo();
  const summary = getIssueSummary();

  if (keyInfo && summary) {
    const { element: keyElement, key } = keyInfo;
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
    keyElement.insertAdjacentElement("afterend", branchIcon);
  }
}

const onMutation = (mutations, observer) => {
  // Datacenter triggers
  const datacenterTrigger = mutations.some((mut) =>
    ["summary-id", "issue-content"].includes(mut.target.id)
  );

  // Cloud triggers - check for relevant testid attributes or class changes
  const cloudTrigger = mutations.some((mut) => {
    const testId = mut.target.dataset?.testid || "";
    return testId.includes("issue.views") ||
           testId.includes("breadcrumbs") ||
           testId.includes("issue-field-summary");
  });

  if (datacenterTrigger || cloudTrigger) {
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

    // For Cloud: retry after a short delay since content loads dynamically
    if (!document.querySelector("#jirabranch-icon")) {
      setTimeout(addBranchIcon, 1000);
      setTimeout(addBranchIcon, 2500);
    }
  });
}
