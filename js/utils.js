// Shared utilities (conservative extracts from pages)
(function () {
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const [year, month, day] = String(dateStr).split('-');
      const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
      return `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
    } catch { return String(dateStr); }
  }

  function mapaUrl(evento) {
    const lat = (evento.latitude != null && evento.latitude !== '') ? Number(evento.latitude) : null;
    const lng = (evento.longitude != null && evento.longitude !== '') ? Number(evento.longitude) : null;
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    if (evento.local) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.local)}`;
    return '';
  }

  window.siteUtils = { escapeHTML, formatDate, mapaUrl };
})();
