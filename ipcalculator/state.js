





const revers = (text) => {
                let len = text.length;
                let result = '';
                while(len > 0){
                   result += text[len-1];
                   len -= 1;
                }
               return result;
        }


const tobin = (number) => {
              let result = '';
              while(number > 0){
                   let bit = number %2;
                   result += bit.toString();
                   number = Math.floor(number / 2);
              }
              for (x = result.length; x < 8; x++)
                  result += '0';
              return revers(result);
       }



const todec = (bits) => {
              bits = revers(bits);
              let result = 0;
              for(let i=0; i < bits.length; i++){
                  if (bits[i] == '1')
                      result += 2**i;
              }
              return result;
      }


module.exports = {revers,tobin,todec};

