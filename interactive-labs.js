// Lecture Exam 2 navigation patch. Muscle lab content removed.
(function(){
  document.querySelectorAll('a[href="lab.html"]').forEach(function(link){
    link.textContent='Lecture Exam 2 · Chapters 5–10';
    link.setAttribute('aria-label','Lecture Exam 2 Chapters 5 through 10');
  });
})();
