// Staff / admin login is kept in sessionStorage so it ends when the tab is closed
export const session = {
  get() { try { return JSON.parse(sessionStorage.getItem('mg.admin') || 'null'); } catch { return null; } },
  set(v) { try { v ? sessionStorage.setItem('mg.admin', JSON.stringify(v)) : sessionStorage.removeItem('mg.admin'); } catch { /* ignore */ } },
};
