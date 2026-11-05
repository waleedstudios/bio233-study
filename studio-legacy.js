(() => {
  document.querySelectorAll('a[href="index.html"]').forEach(link => {
    if (/Exam 1/i.test(link.textContent)) link.href = 'exam1.html';
  });
  const navigation = document.createElement('nav');
  navigation.setAttribute('aria-label', 'Study Studio navigation');
  navigation.style.cssText = 'padding:12px 20px;background:#eeebff;color:#49327d;display:flex;gap:20px;flex-wrap:wrap;font:600 13px system-ui;border-bottom:1px solid #b9a7de';
  navigation.innerHTML = '<a href="index.html" style="color:inherit;text-decoration:none">✳ BIO 233 · Study Studio</a><a href="index.html#learn" style="color:inherit">Exam 3 · Chapters 12–13 →</a><a href="index.html#settings" style="color:inherit">Progress export & settings</a>';
  document.body.prepend(navigation);
})();
