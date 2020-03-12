/*
 * class Clandar to show current month
 */
class Calendar{

  /*let monthTitles = [
    "January", "Febrary", 
    "March", "April", 
    "May", "June", 
    "July", "August", 
    "September", "October", 
    "November", "December"];*/
  
  dayNode =  "td";
  weekNode =  "tr";
  weekDays = 7;  
  
  //initialize all necessary properties that will be used for diplaying
  constructor(id, action) {
    
    this.id = id;
    this.action = action;
    this.containerCalendar = document.querySelector(this.id) || '';  
    
    // startung points of parameters date to calculate calendar displaying
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentDate.setDate(1);
    ///this.currentDate.setMonth(this.currentMonth);
     
  } 
  
  /*
   * inserting the day of the week with the date number
   */
  insertDay(dayNumber, dayWeek, content = true){
    
    let dayDrawing = document.createElement(this.dayNode);
    
    if (dayWeek === 0)
      dayDrawing.className = "last";
    
    if (dayWeek === 1)
      dayDrawing.className = "first";
    
    if (content) {
      dayDrawing.innerHTML = dayNumber;
    }
    
    return dayDrawing;
  }
  
  /*
   * creating the row for each week
   */
  insertWeek(day){
    
    const weekMonth = 4;

    let weekDrawing = document.createElement(this.weekNode);
    
    if (day > this.weekDays * (weekMonth-1)){
      weekDrawing.className = "last";
    }
      
    if (day === 1) {
      weekDrawing.className = "first";
    }
      
    return weekDrawing;
  };
  
  /*
   * check if the day of the defined month is withing the month
   */
  checkDateMonth(numberDay, numMonth){
    let checkDate= new Date();
    
    checkDate.setMonth(numMonth);
    checkDate.setDate(numberDay);
    
    if (checkDate.getMonth() !== numMonth) return false;
    
    return true;
  }
  
  /*
   * custom months represetation in table
   */  
  drawDays(numberMonth) {
    
    let i = 1;
    let j = i;
    let daysBefore;
    let dayDrawing;

    let weekDrawing = this.insertWeek(i);
    let dayWeek =  this.currentDate.getDay();
    
    console.log(numberMonth);
      
    // add first week days before the first day of the month
    if (dayWeek === 0) {
      daysBefore = this.weekDays;
    } else {
      daysBefore = dayWeek;
    }

    for (j = 1; j < daysBefore; j++){
      weekDrawing.appendChild(this.insertDay(j, j, false));
    }
    
    weekDrawing.appendChild(this.insertDay(i, dayWeek));
          
    // loop from the first to the last day of the month
    do {
      
      i++;
      this.currentDate.setDate(i);
      dayWeek = this.currentDate.getDay();
        
      if (dayWeek === 1) {
          
        if(typeof(weekDrawing) !== undefined) {
          this.containerCalendar.appendChild(weekDrawing);
        }
           
        weekDrawing = this.insertWeek(i);
      } 
        
       // creating the cell for each day
      weekDrawing.appendChild(this.insertDay(i,dayWeek));
        
    } while (this.checkDateMonth(i, numberMonth) === true);
    
    this.containerCalendar.appendChild(weekDrawing);
      
    if(dayWeek !== 0) {
      // loop for the days of the next months to the end of the week of the
      // current month
      this.currentDate.setDate(1);
      this.currentDate.setMonth(numberMonth + 1); 
      
      for (let i=1; i <= this.weekDays - dayWeek; i++) { 
        
        this.currentDate.setDate(i);
        dayWeek = this.currentDate.getDay(); 
        weekDrawing.appendChild(this.insertDay(i,dayWeek));
        
      }
      
      this.containerCalendar.appendChild(weekDrawing);
    }

    //return this.containerCalendar;

  }
  
  showEvents(){
    
    switch (this.action) {
    
    case 'month':
      this.drawDays(this.currentMonth);
      break;
  
    case 'year':
      break;
    }
  }
  
};