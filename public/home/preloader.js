window.onload = function() {
    // Disable scrolling
    document.body.style.overflow = 'hidden';
  
    // After 3 seconds, hide the preloader and enable scrolling
    setTimeout(function() {
      var preloader = document.getElementById('preloader');
      preloader.style.display = 'none';
      document.body.style.overflow = ''; // Restore default scrolling behavior
    }, 5000); // 3000 milliseconds = 3 seconds
  };
  