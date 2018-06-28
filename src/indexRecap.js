import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function table(data, nos, scriptHash){  
  let recap = document.getElementById("recap")
  let table = document.createElement("table")
  table.className = "table"
  let tableHead = document.createElement("thead")
  let data = [{"betText" : 'a', "groupName" : 'b', "createdAt" : 'c', "amountBet" : "d", "status" : "e", "getToken" : "f"}]
  let head = ["#", "Bet Text", "Group Name", "Created at", "Amount Bet", "Status", "Get Wins/Refunds"]
  let trHead = document.createElement('tr')
  for (let i = 0; i < head.length; i++){
    let thHead = document.createElement('th')
    thHead.scope = "col"
    thHead.innerHTML = head[i]
    trHead.appendChild(thHead)
  }
  tableHead.appendChild(trHead)
  table.appendChild(tableHead)
  
  let tableBody = document.createElement("tbody")
  let body = ["betText", "groupName", "createdAt", "amountBet", "status", "getToken"]
  for (let i = 0; i < data.length; i++){
    let trBody = document.createElement('tr')
    let thBody = document.createElement('th')
    let betStatus = ""
    thBody.scope = "col"
    thBody.innerHTML = i+1
    trBody.appendChild(thBody)
    for (let j = 0; j < body.length; j++){
      let tdBody = document.createElement('td')
      tdBody.className = data[i][body[j]]
      trBody.appendChild(tdBody)
      if (tdBody.className == "status"){
        if (data[i]["payed"] == "w"){
          tdBody.innerHTML = "Winner"
        }
        else if (data[i]["payed"] == "r"){
          tdBody.innerHTML = "Refund"
        }
        else{
          tdBody.innerHTML = "Loading" // + loading gif
        }
      }
      else if (tdBody.className == "getToken"){
        if ((data[i]["payed"] == "w") || (data[i]["payed"] == "r")){
          tdBody.innerHTML = ""
        }
        else{
            let tdStatus = tdBody.parentNode.childNodes[5]
            betStatus = indexBet.getBetStatus([0,0,0,data[i]["blocks"],0,data[i][body[j]]])
            if (betStatus != "convalidated"){
              if (betStatus == "open"){
                tdStatus.innerHTML = "Open"
              }
              else if (betStatus == "close"){
                tdStatus.innerHTML = "Closed"    
              }
              else if (betStatus == "onConvalidation"){
                tdStatus.innerHTML = "On convalidation"    
              }  
              tdBody.innerHMTL = ""
           }
           else{
            let key = data["groupName"] + data["betText"]
            let decodeOutput = false
            nos.getStorage({scriptHash, key, decodeOutput})
                .then((rawData) => {
                  nos.getAddress()
                    .then((betterAddress) => {
                      if (betterAddress){
                        betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
                        let dataBet = des.deserialize(rawData)
                        let betResult = indexBet.getBetResult(dataBet, betterAddress) //trovare un modo per num dipeople)
                        if (betResult == "win"){
                          tdStatus.innerHTML = "Winner"
                          let payButton = document.createElement("input")
                          payButton.type = "button"
                          payButton.className = "btn btn-success"
                          payButton.value = "Get win"
                          tdBody.appendChild(payButton)
                        }
                        else if (betResult == "lose"){
                          tdStatus.innerHTML = "Loser"
                          tdBody.innerHMTL = ""
                        }
                        else if (betResult == "refund"){
                          tdStatus.innerHTML = "Refund"
                          let payButton = document.createElement("input")
                          payButton.type = "button"
                          payButton.className = "btn btn-warning"
                          payButton.value = "Get refund"
                          tdBody.appendChild(payButton)
                        }
                      }
                    });
                });
              //.catch((err) => console.log(`Error: ${err.message}`));
            }
        }
        
        tdBody.innerHTML = "Loading" // + loading gif

/*        if ((data[i]["payed"] != "w") && (data[i]["payed"] != "r")){
          let tdButton = document.createElement("input")
          tdButton.type = "button"
          tdBody.value = "Get"
        }  */     
      }
      else{
        tdBody.innerHTML = data[i][body[j]]
      }
    }
    tableBody.appendChild(trBody)
  }
  table.appendChild(tableBody)
  recap.appendChild(table)
}

module.exports.table = table