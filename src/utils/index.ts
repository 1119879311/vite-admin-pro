

 export function debounce(fn:Function, awit:number = 16.6) {
    let timeer;
    return (...args) => {
  
      if (timeer)
        clearInterval(timeer);
      timeer = setTimeout(function() {
        fn(...args)
      }, awit);
    };
  }