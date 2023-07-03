export class Utils {
    constructor(){}

    formatDate (d) {
        let date = new Date(d);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        //let hour = date.getHours();
        //let minutes = date.getMinutes();
  
        let monthString = '';
  
        switch (month) {
          case 1:
            monthString = 'Jan'
            break;
          case 2:
            monthString = 'Feb'
            break;
          case 3:
            monthString = 'Mar'
            break;
          case 4:
            monthString = 'Apr'
            break;
          case 5:
            monthString = 'May'
            break;
          case 6:
            monthString = 'Jun'
            break;
          case 7:
            monthString = 'Jul'
            break;
          case 8:
            monthString = 'Aug'
            break;
          case 9:
            monthString = 'Sep'
            break;
          case 10:
            monthString = 'Oct'
            break;
          case 11:
            monthString = 'Nov'
            break;
          case 12:
            monthString = 'Dec'
            break;
  
          default:
            break;
        }
  
  
        if (day < 10) {
          day = '0' + day;
        }
        // if (month < 10) {
        //     month = '0' + month;
        // }
  
        return `${monthString} ${day}, ${year}`
        //return date.split("T")[0];
    }
  
    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    }

    getStatusColor(status){
        if (status === 'pending') return 'orange';
        else if (status === 'processing') return 'primary';
        else if (status === 'completed') return 'green';
        else return 'red';
    }
}