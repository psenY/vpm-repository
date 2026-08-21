import { baseLayerLuminance, StandardLuminance } from 'https://unpkg.com/@fluentui/web-components@2.6.1';

const LISTING_URL = "https://psenY.github.io/vpm-repository/index.json";

const PACKAGES = {
  "pseny7.vrc.physbone-merger": {
    name: "pseny7.vrc.physbone-merger",
    displayName: "VRC PhysBone Merger (动骨合并与压缩工具)",
    description: "专为 VRChat 设计的高性能、非破坏性 (Non-Destructive) 动骨合并与优化工具。支持零风险严格匹配、智能碰撞体去重、实时性能等级预测及上传极晚期自动构建。",
    version: "1.0.0",
    author: {
      name: "psenY7",
      url: "https://github.com/psenY",
    },
    dependencies: {
      "com.vrchat.avatars": ">=3.4.0",
    },
    keywords: [
      "vrchat", "physbone", "optimization", "avatar", "non-destructive"
    ],
    license: "GPL-3.0",
    licensesUrl: "https://github.com/psenY/VRCPhysBoneMerger/blob/main/LICENSE",
  },
};

const setTheme = () => {
  const isDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDarkTheme()) {
    baseLayerLuminance.setValueFor(document.documentElement, StandardLuminance.DarkMode);
  } else {
    baseLayerLuminance.setValueFor(document.documentElement, StandardLuminance.LightMode);
  }
}

(() => {
  setTheme();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTheme();
  });

  const packageGrid = document.getElementById('packageGrid');

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', ({ target: { value = '' }}) => {
      const items = packageGrid.querySelectorAll('fluent-data-grid-row[row-type="default"]');
      items.forEach(item => {
        if (value === '') {
          item.style.display = 'grid';
          return;
        }
        if (
          item.dataset?.packageName?.toLowerCase()?.includes(value.toLowerCase()) ||
          item.dataset?.packageId?.toLowerCase()?.includes(value.toLowerCase())
        ) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  const urlBarHelpButton = document.getElementById('urlBarHelp');
  const addListingToVccHelp = document.getElementById('addListingToVccHelp');
  if (urlBarHelpButton && addListingToVccHelp) {
    urlBarHelpButton.addEventListener('click', () => {
      addListingToVccHelp.hidden = false;
    });
    const addListingToVccHelpClose = document.getElementById('addListingToVccHelpClose');
    if (addListingToVccHelpClose) {
      addListingToVccHelpClose.addEventListener('click', () => {
        addListingToVccHelp.hidden = true;
      });
    }
  }

  const vccListingInfoUrlFieldCopy = document.getElementById('vccListingInfoUrlFieldCopy');
  if (vccListingInfoUrlFieldCopy) {
    vccListingInfoUrlFieldCopy.addEventListener('click', () => {
      const vccUrlField = document.getElementById('vccListingInfoUrlField');
      vccUrlField.select();
      navigator.clipboard.writeText(vccUrlField.value);
      vccListingInfoUrlFieldCopy.appearance = 'accent';
      setTimeout(() => {
        vccListingInfoUrlFieldCopy.appearance = 'neutral';
      }, 1000);
    });
  }

  const vccAddRepoButton = document.getElementById('vccAddRepoButton');
  if (vccAddRepoButton) {
    vccAddRepoButton.addEventListener('click', () => window.location.assign(`vcc://vpm/addRepo?url=${encodeURIComponent(LISTING_URL)}`));
  }

  const vccUrlFieldCopy = document.getElementById('vccUrlFieldCopy');
  if (vccUrlFieldCopy) {
    vccUrlFieldCopy.addEventListener('click', () => {
      const vccUrlField = document.getElementById('vccUrlField');
      vccUrlField.select();
      navigator.clipboard.writeText(vccUrlField.value);
      vccUrlFieldCopy.appearance = 'accent';
      setTimeout(() => {
        vccUrlFieldCopy.appearance = 'neutral';
      }, 1000);
    });
  }

  const rowMoreMenu = document.getElementById('rowMoreMenu');
  const hideRowMoreMenu = e => {
    if (rowMoreMenu.contains(e.target)) return;
    document.removeEventListener('click', hideRowMoreMenu);
    rowMoreMenu.hidden = true;
  }

  const rowMenuButtons = document.querySelectorAll('.rowMenuButton');
  rowMenuButtons.forEach(button => {
    button.addEventListener('click', e => {
      if (rowMoreMenu?.hidden) {
        rowMoreMenu.style.top = `${e.clientY + e.target.clientHeight}px`;
        rowMoreMenu.style.left = `${e.clientX - 120}px`;
        rowMoreMenu.hidden = false;

        const downloadLink = rowMoreMenu.querySelector('#rowMoreMenuDownload');
        const downloadListener = () => {
          window.open(e?.target?.dataset?.packageUrl, '_blank');
        }
        downloadLink.addEventListener('change', () => {
          downloadListener();
          downloadLink.removeEventListener('change', downloadListener);
        });

        setTimeout(() => {
          document.addEventListener('click', hideRowMoreMenu);
        }, 1);
      }
    });
  });

  const packageInfoModal = document.getElementById('packageInfoModal');
  const packageInfoModalClose = document.getElementById('packageInfoModalClose');
  if (packageInfoModal && packageInfoModalClose) {
    packageInfoModalClose.addEventListener('click', () => {
      packageInfoModal.hidden = true;
    });

    const modalControl = packageInfoModal.shadowRoot?.querySelector('.control');
    if (modalControl) {
      modalControl.style.maxHeight = "90%";
      modalControl.style.transition = 'height 0.2s ease-in-out';
      modalControl.style.overflowY = 'hidden';
    }
  }

  const packageInfoName = document.getElementById('packageInfoName');
  const packageInfoId = document.getElementById('packageInfoId');
  const packageInfoVersion = document.getElementById('packageInfoVersion');
  const packageInfoDescription = document.getElementById('packageInfoDescription');
  const packageInfoAuthor = document.getElementById('packageInfoAuthor');
  const packageInfoDependencies = document.getElementById('packageInfoDependencies');
  const packageInfoKeywords = document.getElementById('packageInfoKeywords');
  const packageInfoLicense = document.getElementById('packageInfoLicense');

  const rowAddToVccButtons = document.querySelectorAll('.rowAddToVccButton');
  rowAddToVccButtons.forEach((button) => {
    button.addEventListener('click', () => window.location.assign(`vcc://vpm/addRepo?url=${encodeURIComponent(LISTING_URL)}`));
  });

  const rowPackageInfoButton = document.querySelectorAll('.rowPackageInfoButton');
  rowPackageInfoButton.forEach((button) => {
    button.addEventListener('click', e => {
      const packageId = e.target.dataset?.packageId;
      const packageInfo = PACKAGES?.[packageId];
      if (!packageInfo) {
        console.error(`Did not find package ${packageId}. Packages available:`, PACKAGES);
        return;
      }

      if (packageInfoName) packageInfoName.textContent = packageInfo.displayName;
      if (packageInfoId) packageInfoId.textContent = packageId;
      if (packageInfoVersion) packageInfoVersion.textContent = `v${packageInfo.version}`;
      if (packageInfoDescription) packageInfoDescription.textContent = packageInfo.description;
      if (packageInfoAuthor) {
        packageInfoAuthor.textContent = packageInfo.author.name;
        packageInfoAuthor.href = packageInfo.author.url;
      }

      if (packageInfoKeywords) {
        if ((packageInfo.keywords?.length ?? 0) === 0) {
          packageInfoKeywords.parentElement?.classList.add('hidden');
        } else {
          packageInfoKeywords.parentElement?.classList.remove('hidden');
          packageInfoKeywords.innerHTML = null;
          packageInfo.keywords.forEach(keyword => {
            const keywordDiv = document.createElement('div');
            keywordDiv.classList.add('me-2', 'mb-2', 'badge');
            keywordDiv.textContent = keyword;
            packageInfoKeywords.appendChild(keywordDiv);
          });
        }
      }

      if (packageInfoLicense) {
        if (!packageInfo.license?.length && !packageInfo.licensesUrl?.length) {
          packageInfoLicense.parentElement?.classList.add('hidden');
        } else {
          packageInfoLicense.parentElement?.classList.remove('hidden');
          packageInfoLicense.textContent = packageInfo.license ?? 'See License';
          packageInfoLicense.href = packageInfo.licensesUrl ?? '#';
        }
      }

      if (packageInfoDependencies) {
        packageInfoDependencies.innerHTML = null;
        Object.entries(packageInfo.dependencies).forEach(([name, version]) => {
          const depRow = document.createElement('li');
          depRow.classList.add('mb-2');
          depRow.textContent = `${name} @ v${version}`;
          packageInfoDependencies.appendChild(depRow);
        });
      }

      if (packageInfoModal) {
        packageInfoModal.hidden = false;
        setTimeout(() => {
          const colEl = packageInfoModal.querySelector('.col');
          if (colEl && modalControl) {
            modalControl.style.setProperty('--dialog-height', `${colEl.clientHeight + 14}px`);
          }
        }, 1);
      }
    });
  });

  const packageInfoVccUrlFieldCopy = document.getElementById('packageInfoVccUrlFieldCopy');
  if (packageInfoVccUrlFieldCopy) {
    packageInfoVccUrlFieldCopy.addEventListener('click', () => {
      const vccUrlField = document.getElementById('packageInfoVccUrlField');
      vccUrlField.select();
      navigator.clipboard.writeText(vccUrlField.value);
      packageInfoVccUrlFieldCopy.appearance = 'accent';
      setTimeout(() => {
        packageInfoVccUrlFieldCopy.appearance = 'neutral';
      }, 1000);
    });
  }

  const packageInfoListingHelp = document.getElementById('packageInfoListingHelp');
  if (packageInfoListingHelp && addListingToVccHelp) {
    packageInfoListingHelp.addEventListener('click', () => {
      addListingToVccHelp.hidden = false;
    });
  }
})();