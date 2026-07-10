/** Firebase / Google Analytics 4 — from Firebase Console → 專案設定 → 你的應用程式 */
export const GA_MEASUREMENT_ID = 'G-F5WQ4D7R9S';

export function renderAnalyticsSnippet(id = GA_MEASUREMENT_ID) {
  if (!id) return '';
  return `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
  </script>`;
}
