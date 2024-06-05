
export function toFriendlyTime(date:any,  future = false) {
    const now = new Date();
    let timeDifference = 0;
  
    if (future) {
      timeDifference = date.getTime() - now.getTime();
    } else {
      timeDifference = now.getTime() - date.getTime();
    }
    // Calculate the individual components of the time difference
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    timeDifference = timeDifference - months * (1000 * 60 * 60 * 24 * 30);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    timeDifference = timeDifference - days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
    timeDifference = timeDifference - hours * (1000 * 60 * 60);
    const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
    timeDifference = timeDifference - minutes * (1000 * 60);
    const seconds = Math.floor(timeDifference / 1000) % 60;
    timeDifference = timeDifference - seconds * 60;
  
    // Build the string representation of the time elapsed
    let result = "";
  
    if (months > 0) {
      
        result += `${months} ${months > 1 ? 'months' : 'month'} `;
     
    }
  
    if (days > 0) {
      
        result += `${days} ${days > 1 ? 'days' : 'day'} `;
        if (months > 0) {
          if (!future) {
            result += " " + 'ago';
          }
  
          return result.trim();
        }
      
    }
    if (hours > 0) {
      
        result += `${hours} ${hours > 1 ? 'hours' : 'hour'} `;
  
        if (days > 0) {
          if (!future) {
            result += " " + 'ago';
          }
          return result.trim();
        }
      
    }
    if (minutes > 0) {
    
        result += `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} `;
        if (hours > 0) {
          if (!future) {
            result += " " + 'ago';
          }
          return result.trim();
        }
     
    }
    if (seconds > 0) {
   
        result += `${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;
      
    }
  
    if (timeDifference < 0 &&  !future) {
      result += " " + 'ago';
    }
  
    return result.trim();
  }