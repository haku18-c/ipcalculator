
const {revers,tobin,todec} = require('./state');


class IPAddress{
     constructor(ip, cidr){
        this.ip = ip.split('.');
        this.cidr = cidr;
     }
}


class  IPV4Address extends IPAddress{

     #version = null;
     constructor(ip, cidr){
       super(ip, cidr);
       this.raw_cidr = tobin(this.cidr);
       this.netmask = this.netmask();
       this.network = this.ipV4Network();
       this.raw_network = this.rawipV4Network();
       this.#version = 'IPV4Address';
     }

    rawIPV4Address(){
        let result = [];
        result = this.ip.map((octet) => `${tobin(octet)}`);
        return result;
    }

    rawNetmask(){
       let result, bit_cidr, temp;
       result = [];
       bit_cidr = '';
       for(let i=0; i < 32; i++){
          if(i > (this.cidr - 1))
             bit_cidr += '0';
          else
             bit_cidr += '1';
       }
       temp = 8;
       for(let i=0; i < bit_cidr.length;){
          result.push(bit_cidr.slice(i,temp));
          temp += 8;
          i+=8;
       }
       return result;
    }


    netmask(){
       let result, temp;
       temp = this.rawNetmask();
       result = [];
       for(x of temp){
           result.push(todec(x));
       }
       return result;
    }

    wilcardRawMask(){
       let result, temp,x;
       result = ['','','',''];
       temp = this.rawNetmask().join('');
       x = 0;
       for (let i of temp){
          if(i == '1')
             result[x] += '0';
          else
             result[x] += '1';
          if(result[x].length == 8)
             x += 1;
       }return result;
    }

    wilcard(){
       let result, temp;
       temp = this.wilcardRawMask();
       result = [];
       for(const i of temp)
           result.push(todec(i))
       return result;
    }

    ipV4Network(){
       let result, temp;
       result = [];
       for(let i=0; i < 4; i++){
           temp = this.netmask[i] & this.ip[i];
           result.push(temp);
       }
       return result;
    }

    rawipV4Network(){
       let result= [];
       for(const octet of this.network)
            result.push(tobin(octet))
       return result;
    }

    ipV4Broadcast(){
       let result, temp,temp2;
       temp = this.wilcard();
       temp2 = this.network;
       result = [];
       for(let i=0; i< 4; i++)
           result.push(temp[i] | temp2[i])
       return result;
     }
    version(){
        console.log(this.#version);
    }
}

class IPV4AddressClassification extends IPV4Address{


    get_bits(){
       let temp;
       if(this.class_type == 'C')
          temp = this.rawNetmask()[3];
       else if(this.class_type == 'B')
          temp = this.rawNetmask()[2] + this.rawNetmask()[3];
       else
          temp = this.rawNetmask()[1] + this.rawNetmask()[2] +  this.rawNetmask()[3];
       return temp;
    }

    subnet(){
       let temp, x;
       temp = this.get_bits();
       x = 0;
       for(let i of temp)
         if(i == '1')
           x++;
       return 2**x;
     }

    hosts(){
       let temp, x;
       temp = this.get_bits();
       x = 0;
       for (let i of temp)
          if(i == '0')
             x++;
       return (2**x)-2;
    }

    get_all_hosts(){
       let ip_net,idx, result;
       result = [];
       ip_net = this.network;
       idx = 2;
       for(let i=0;i < this.subnet() ;i++){
           for(let x=0; x<255; x++){
                 ip_net[3] += 1;
                 result.push(ip_net);
                 if(result.length == this.hosts())
                      break;
           }
           ip_net[3] = 0;
           if(i >= 255)
             ip_net[idx-1] += 1;
           else
             ip_net[idx]+=1;
      }return result;

    }

    class_type(){
      if(this.ip[0] >= 1 & this.ip[0] <= 127)
         return 'A';
      else if(this.ip[0] >= 128 & this.ip[0] <= 191)
         return 'B';
      else if(this.ip[0] >= 192 & this.ip[0] <= 254)
         return 'C';
    }
}


const ipv4 = new IPV4AddressClassification('10.10.0.1',8);
console.log(`IPV4Address \t\t${ipv4.ip} \t\t${ipv4.rawIPV4Address()}`);
console.log(`Netmask \t\t${ipv4.netmask} \t\t${ipv4.rawNetmask()}`);
console.log(`Wilcard \t\t${ipv4.wilcard()} \t\t${ipv4.wilcardRawMask()}`);
console.log(`IPV4 Network \t\t${ipv4.ipV4Network()} \t\t${ipv4.raw_network}`);
console.log(`IP Broadcast \t\t${ipv4.ipV4Broadcast()}`);
console.log(`Subnet \t\t\t${ipv4.subnet()}`);
console.log(`Allhost \t\t${ipv4.hosts()}`);
console.log(`Class Type \t\t${ipv4.class_type()}`);

/*
function tes_all(){

         const hosts = (2 ** 16)-2;
         let ipadd = [192,168,43,0];
         let len = 4;
         for(let i=0;i < hosts; i++){
             ipadd[len-1] +=1;
             if(ipadd[len-1] == 256 && ipadd[len-2] <= 255){
                ipadd[len-1] -=256;
                ipadd[len-2] += 1;
             }else if(ipadd[len-1]==256 && (ipadd[len-2] == 256 && ipadd[len-3] <= 255)){
                ipadd[len-1] -=256;
                ipadd[len-2] -=256;
                ipadd[len-3] += 1;
             }
             console.log(ipadd);
         }
}


tes_all();
*/

