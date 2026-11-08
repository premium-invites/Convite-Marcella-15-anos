(() => {
  "use strict";
  const CFG = window.INVITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const editorMode = new URLSearchParams(location.search).get("editor") === "1";
  const screens = {
    opening: $("openingScreen"),
    main: $("mainScreen"),
    gifts: $("giftsScreen"),
    dress: $("dressScreen"),
    manual: $("manualScreen")
  };
  const stageFor = {
    confirm: "main", location: "main", gifts: "main", dress: "main", manual: "main",
    backGifts: "gifts", backDress: "dress", backManual: "manual"
  };
  const defaults = {
    confirm:   {label:"Confirmar presença",visible:true,left:6.8,top:45.7,width:26.9,height:15.4},
    location:  {label:"Localização",visible:true,left:35.2,top:45.7,width:29.3,height:15.4},
    gifts:     {label:"Sugestões de presentes",visible:true,left:66.4,top:45.7,width:28.3,height:15.4},
    dress:     {label:"Dress Code",visible:true,left:17.5,top:61.6,width:30.3,height:16.5},
    manual:    {label:"Manual do Convidado",visible:true,left:50.8,top:61.6,width:32.2,height:16.5},
    backGifts: {label:"Voltar — Presentes",visible:true,left:18,top:83.5,width:64,height:8},
    backDress: {label:"Voltar — Dress Code",visible:true,left:18,top:83.5,width:64,height:8},
    backManual:{label:"Voltar — Manual",visible:true,left:18,top:83.5,width:64,height:8}
  };
  const areas = Object.assign({}, structuredCloneSafe(defaults), CFG.hotspots || {});
  const hotspotEls = [...document.querySelectorAll(".hotspot[data-key]")];
  const areaSelect = $("areaSelect");
  const leftInput = $("leftInput");
  const topInput = $("topInput");
  const widthInput = $("widthInput");
  const heightInput = $("heightInput");
  const labelInput = $("labelInput");
  const visibleInput = $("visibleInput");
  const exportCode = $("exportCode");
  const editorStatus = $("editorStatus");
  const storageKey = "marcella-invite-hotspots-v2";
  let selected = "confirm";

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("active", key === name);
      el.setAttribute("aria-hidden", key === name ? "false" : "true");
    });
    requestAnimationFrame(() => syncHotspots());
  }

  function screenFor(key) {
    return stageFor[key] || "main";
  }

  function imageGeometry(stage) {
    const rect = stage.getBoundingClientRect();
    const img = stage.querySelector(".art");
    if (!rect.width || !rect.height) {
      return { rect, renderWidth: 0, renderHeight: 0, offsetX: 0, offsetY: 0 };
    }
    const naturalWidth = img && img.naturalWidth ? img.naturalWidth : 941;
    const naturalHeight = img && img.naturalHeight ? img.naturalHeight : 1672;
    const scale = Math.max(rect.width / naturalWidth, rect.height / naturalHeight);
    const renderWidth = naturalWidth * scale;
    const renderHeight = naturalHeight * scale;
    return {
      rect,
      renderWidth,
      renderHeight,
      offsetX: (rect.width - renderWidth) / 2,
      offsetY: (rect.height - renderHeight) / 2
    };
  }

  function syncHotspots() {
    hotspotEls.forEach((el) => {
      const key = el.dataset.key;
      const p = areas[key] || defaults[key];
      if (!p) return;
      const stage = el.closest(".stage");
      const g = imageGeometry(stage);
      if (!g.rect.width || !g.rect.height || !g.renderWidth || !g.renderHeight) return;
      const leftPx = g.offsetX + (p.left / 100) * g.renderWidth;
      const topPx = g.offsetY + (p.top / 100) * g.renderHeight;
      const widthPx = (p.width / 100) * g.renderWidth;
      const heightPx = (p.height / 100) * g.renderHeight;
      el.style.left = `${leftPx / g.rect.width * 100}%`;
      el.style.top = `${topPx / g.rect.height * 100}%`;
      el.style.width = `${widthPx / g.rect.width * 100}%`;
      el.style.height = `${heightPx / g.rect.height * 100}%`;
      el.textContent = editorMode ? (p.visible === false ? `${p.label} · OCULTO` : p.label) : "";
      el.hidden = !editorMode && p.visible === false;
      el.dataset.hidden = p.visible === false ? "true" : "false";
      el.classList.toggle("selected", editorMode && key === selected);
      if (editorMode && !el.querySelector(".resize-handle")) {
        const handle = document.createElement("span");
        handle.className = "resize-handle";
        handle.setAttribute("aria-hidden", "true");
        el.appendChild(handle);
      }
    });
    updateExport();
  }

  function updateExport() {
    if (!editorMode) return;
    exportCode.value = "window.INVITE_CONFIG.hotspots = " + JSON.stringify(areas, null, 2) + ";";
  }

  function syncFields() {
    if (!editorMode) return;
    const p = areas[selected];
    areaSelect.value = selected;
    leftInput.value = Number(p.left).toFixed(1);
    topInput.value = Number(p.top).toFixed(1);
    widthInput.value = Number(p.width).toFixed(1);
    heightInput.value = Number(p.height).toFixed(1);
    labelInput.value = p.label || "";
    visibleInput.checked = p.visible !== false;
  }

  function selectArea(key) {
    if (!areas[key]) return;
    selected = key;
    showScreen(screenFor(key));
    syncFields();
    syncHotspots();
  }

  function updateSelectedFromFields() {
    const p = areas[selected];
    p.left = clamp(Number(leftInput.value), 0, 99);
    p.top = clamp(Number(topInput.value), 0, 99);
    p.width = clamp(Number(widthInput.value), 1, 100 - p.left);
    p.height = clamp(Number(heightInput.value), 1, 100 - p.top);
    p.label = labelInput.value.trim() || defaults[selected].label;
    p.visible = visibleInput.checked;
    syncHotspots();
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  function openWhatsApp() {
    const number = String(CFG.whatsapp?.number || "").replace(/\D/g, "");
    const message = CFG.whatsapp?.message || "Olá! Confirmo minha presença no aniversário da Marcella.";
    if (!number) {
      alert("O número de WhatsApp ainda não foi configurado.");
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleHotspot(key) {
    if (editorMode) {
      selectArea(key);
      return;
    }
    switch (key) {
      case "confirm": openWhatsApp(); break;
      case "location":
        if (CFG.mapUrl) window.open(CFG.mapUrl, "_blank", "noopener,noreferrer");
        break;
      case "gifts": showScreen("gifts"); break;
      case "dress": showScreen("dress"); break;
      case "manual": showScreen("manual"); break;
      case "backGifts":
      case "backDress":
      case "backManual": showScreen("main"); break;
    }
  }

  $("openInvite").addEventListener("click", () => showScreen("main"));
  hotspotEls.forEach((el) => {
    const key = el.dataset.key;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleHotspot(key);
    });
    el.addEventListener("pointerdown", (event) => {
      if (!editorMode) return;
      event.preventDefault();
      event.stopPropagation();
      selectArea(key);
      const stage = el.closest(".stage");
      const geometry = imageGeometry(stage);
      const p = areas[key];
      const start = {x:event.clientX,y:event.clientY,left:p.left,top:p.top,width:p.width,height:p.height};
      const resizing = event.target.classList.contains("resize-handle");
      el.setPointerCapture(event.pointerId);
      const move = (ev) => {
        const dx = (ev.clientX - start.x) / geometry.renderWidth * 100;
        const dy = (ev.clientY - start.y) / geometry.renderHeight * 100;
        if (resizing) {
          p.width = clamp(start.width + dx, 1, 100 - start.left);
          p.height = clamp(start.height + dy, 1, 100 - start.top);
        } else {
          p.left = clamp(start.left + dx, 0, 100 - start.width);
          p.top = clamp(start.top + dy, 0, 100 - start.height);
        }
        syncFields();
        syncHotspots();
      };
      const end = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", end);
        el.removeEventListener("pointercancel", end);
        editorStatus.textContent = "Área ajustada. Copie a configuração para torná-la permanente.";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    });
  });

  if (editorMode) {
    document.body.classList.add("editor-mode", "can-edit");
    $("editOpen").hidden = true;
    $("editorPanel").hidden = false;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved) Object.assign(areas, saved);
    } catch (_) {}
    selectArea("confirm");
  } else {
    showScreen("opening");
  }

  $("editOpen").addEventListener("click", () => {
    const url = new URL(location.href);
    url.searchParams.set("editor", "1");
    location.href = url.toString();
  });

  $("closeEditor").addEventListener("click", () => {
    const url = new URL(location.href);
    url.searchParams.delete("editor");
    location.href = url.toString();
  });

  areaSelect.addEventListener("change", () => selectArea(areaSelect.value));
  [leftInput, topInput, widthInput, heightInput, labelInput, visibleInput].forEach((input) => {
    input.addEventListener("input", updateSelectedFromFields);
    input.addEventListener("change", updateSelectedFromFields);
  });

  $("saveLocal").addEventListener("click", () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(areas));
      editorStatus.textContent = "Posições salvas neste navegador. Para publicar, copie a configuração e atualize config.js.";
    } catch (_) {
      editorStatus.textContent = "Não foi possível salvar localmente. Copie a configuração abaixo.";
    }
  });

  $("copyConfig").addEventListener("click", async () => {
    updateExport();
    try {
      await navigator.clipboard.writeText(exportCode.value);
      editorStatus.textContent = "Configuração copiada. Cole o bloco em config.js.";
    } catch (_) {
      exportCode.focus();
      exportCode.select();
      editorStatus.textContent = "Configuração selecionada. Use Copiar no navegador.";
    }
  });

  $("resetAreas").addEventListener("click", () => {
    Object.keys(defaults).forEach((key) => areas[key] = structuredCloneSafe(defaults[key]));
    try { localStorage.removeItem(storageKey); } catch (_) {}
    selectArea(selected);
    editorStatus.textContent = "Posições padrão restauradas.";
  });

  syncHotspots();
  window.addEventListener("resize", () => syncHotspots());
})();

