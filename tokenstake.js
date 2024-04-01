
setTimeout(function(){
  PopulateStakeTable();
}, 5000);

//var Web3 = require('web3');
// async function StakeCoin() {
//   console.log(typeof web3)
//   if (typeof web3 !== "undefined") {
    
//     console.log(Web3.utils); // Should show the utils object
//     var value = document.getElementById("TEDTStake").value;
//     var days = document.getElementById("TEDTStakeDays").value;
//     if(days == 0 || days == null || days == "undefined" && days <= 420){
//       errorMessage("TED stake days must be > 0 or <= 420");
//       return;
//     }
//     if(value == 0 || value == null || value == "undefined"){
//       errorMessage("TED amount must be greater than 0");
//       return;
//     }
//     var candy = value * 10 ** decimals;
//     console.log(candy);
//     var balance = await rewardsContract.methods.balanceOf(activeAccount).call();
//     if(balance < candy){
//       errorMessage("Not enough TED in balance");
//       return;
//     }
//     rewardsContract.methods.stakeStart(Web3.utils.toHex(candy.toString()), days).send({
//       "from": activeAccount
//     }).then(function () {
//         successMessage("Staked successfully!");
//         setTimeout(function(){
//           ShowBalance();
//           PopulateStakeTable();
//         }, 2000);
//     });
//   }
// }

async function StakeCoin() {
  // Check for web3 availability
  if (!window.ethereum || !rewardsContract) {
    console.error("Ethereum object not found or contract not initialized. Ensure MetaMask is installed and the contract is set up.");
    return;
  }

  try {
    const value = document.getElementById("TEDTStake").value.trim();
    const days = parseInt(document.getElementById("TEDTStakeDays").value.trim(), 10);

    if (isNaN(days) || days <= 0 || days > 420) {
      errorMessage("TED stake days must be > 0 and <= 420");
      return;
    }

    if (!value || isNaN(value) || Number(value) <= 0) {
      errorMessage("TED amount must be greater than 0");
      return;
    }

    var candy = value * 10 ** decimals; // Assuming 'decimals' is similar to ETH
    console.log(candy);

    var balance = await rewardsContract.methods.balanceOf(activeAccount).call();
    console.log(balance);

    if(balance < candy){
            errorMessage("Not enough TED in balance");
            return;
          }

    await rewardsContract.methods.stakeStart(Web3.utils.toHex(candy), days.toString()).send({ "from": activeAccount });
    
    successMessage("Staked successfully!");
    setTimeout(() => {
      ShowBalance();
      PopulateStakeTable();
    }, 2000);
  } catch (error) {
    console.error("Staking operation failed:", error);
    errorMessage(`Staking failed: ${error.message}`);
  }
}


async function EndStake(elem) {
  if (typeof web3 !== "undefined") {
    var index = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);
    console.log(index)
    var stakeId = parseInt(elem.parentElement.parentElement.lastElementChild.innerHTML);
    console.log(stakeId)
    rewardsContract.methods.stakeEnd(index, stakeId).send({
      from: activeAccount
    }).then(function () {
        successMessage("Stake ended successfully!");
        setTimeout(function(){
          ShowBalance();
          PopulateStakeTable();
        }, 2000);
    });
  }
}

// async function PopulateStakeTable() {
//   var myActiveStakes;
//   var stakeTable = document.getElementById("stakeTable").lastElementChild;
//   stakeTable.innerHTML = "";
//     //get number of stakes
//   var stakeCount = await rewardsContract.methods.CountOfOwnedStakes(activeAccount).call();
//   var currentDay = await rewardsContract.methods.currentDay().call();
//   console.log(rewardsContract.methods)
//   //console.log(currentDay)
//     myActiveStakes = 0;
//     console.log("pst")
//     console.log(activeAccount)
//     for(var i = 0; i < stakeCount; i++){
//           var stake = await rewardsContract.methods.yourStakes(activeAccount, i).call();
//           //.call();
          
//           console.log(stake);
//           if(stakeCount > 0){
//             $("#frownFace").hide();
//             var index = i
//             var id = stake.stakeId
//             var savedCandy = stake.burnedTEDs;
//             var stakedTEDT = savedCandy / 10 ** decimals;
//             var stakeLength = Number(stake.stakedDays);
//             var locked = Number(stake.hiddenDay);
//             //console.log(locked)
//             var endday = locked + stakeLength
//            // console.log(endday)
//             var daysLeft = endday - Number(currentDay)
//             // console.log(daysLeft)

//             stakeTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + index + '</th><td>' + toFixedMax(stakedTEDT, 12) + ' TEDT</td><td>' + stakeLength + ' Day/s</td><td>' + daysLeft + '</td><td><button class="stakeBtn" onclick="EndStake(this)">End Stake</button></td><td>' + id + '</td></tr>');
//             myActiveStakes++;
           
//           }
//     document.getElementById("activeStakeCount").innerHTML = stakeCount;
//    }
//   }


  async function PopulateStakeTable() {
  if (!ethereum || !rewardsContract) {
    console.error("Ethereum object not found or contract not initialized. Ensure MetaMask is installed and the contract is set up.");
    return;
  }

  try {
    const stakeTable = document.getElementById("stakeTable").lastElementChild;
    stakeTable.innerHTML = ""; // Clear existing stakes

    var stakeCount = Number(await rewardsContract.methods.CountOfOwnedStakes(activeAccount).call());
    const currentDay = Number(await rewardsContract.methods.currentDay().call());

    if (stakeCount > 0) {
      $("#frownFace").hide(); // Assuming jQuery is used for simplicity
    }

    for (let i = 0; i < stakeCount; i++) {
      var stake = await rewardsContract.methods.yourStakes(activeAccount, i).call();
      
      var index = i;
      var id = stake.stakeId;
      const savedCandy = BigInt(stake.burnedTEDs); // Assuming this could be a BigInt
      const stakedTEDT = savedCandy / BigInt(10 ** decimals);
      const stakeLength = Number(stake.stakedDays);
      const locked = Number(stake.hiddenDay);
      const endDay = locked + stakeLength;
      const daysLeft = endDay - currentDay;

      const row = document.createElement("tr");
      row.innerHTML = `<th scope="row">${index}</th>
                       <td>${stakedTEDT.toString()} TEDT</td>  
                       <td>${stakeLength} Day/s</td>
                       <td>${daysLeft}</td>
                       <td><button class="stakeBtn" onclick="EndStake(this)">End Stake</button></td>
                       <td>${id}</td>`;
      stakeTable.appendChild(row);
    }

    document.getElementById("activeStakeCount").innerHTML = stakeCount.toString();
  } catch (error) {
    console.error("Failed to populate stake table:", error);
  }
}


  // async function PopulateGlobalTable() {
    
  //   var stakeTable = document.getElementById("tedGlobal").lastElementChild;
  //   stakeTable.innerHTML = "";
  //   var stake = await rewardsContract.methods.stakingTotals().call();
       
  //   var burned = stake[0];
  //   var candyPrice = stake[2];
  //   var latestStakeID = stake[5];
  //   var multiplier = stake[6]
  //   var daily = stake[3]
  //   stakeTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + parseInt(burned / 10 ** 12) + '</th><td>' + parseInt(candyPrice / 10 ** 12) + ' TED</td><td>' + latestStakeID  + '</td><td>' + multiplier + '</td><td>'+daily+'</td></tr>');
    
  //   }

    async function PopulateGlobalTable() {
      // Check if the rewardsContract is initialized and if the DOM element exists
      if (!window.ethereum || !rewardsContract) {
        console.error("Ethereum object not found or contract not initialized. Ensure MetaMask is installed and the contract is set up.");
        return;
      }
    
      try {
        const stakeTable = document.getElementById("tedGlobal").lastElementChild;
        stakeTable.innerHTML = ""; // Clear the table first
    
        const stake = await rewardsContract.methods.stakingTotals().call();
        const burned = stake[0];
        const candyPrice = stake[2];
        const latestStakeID = stake[5];
        const multiplier = stake[6];
        const daily = stake[3];
    
        // Create a new table row element to safely insert data, reducing XSS risks
        const row = document.createElement("tr");
        row.innerHTML = `<th scope="row">${(burned / BigInt(10 ** 12)).toString()}</th>
                          <td>${(candyPrice / BigInt(10 ** 12)).toString()} TED</td>
                          <td>${latestStakeID}</td>
                          <td>${multiplier}</td>
                          <td>${daily}</td>`;
                      
        stakeTable.appendChild(row);
      } catch (error) {
        console.error("Failed to populate the global table:", error);
        // Optionally, handle this error in the UI
      }
    }

// async function ShowBalance(){
//   rewardsContract.methods.balanceOf(activeAccount).call().then(function(balance){
//     document.getElementById("walletBalance").innerHTML = parseInt(balance / 10 ** decimals) + " TEDs";
//   });
// }

async function ShowBalance() {
  if (window.ethereum && rewardsContract) {
    try {
      // Ensuring we have access to the active account
      const accounts = await window.ethereum.request({ "method": "eth_requestAccounts" });
      const activeAccount = accounts[0]; // Assuming we're using the first account

      // Calling the balanceOf method
      const balance = await rewardsContract.methods.balanceOf(activeAccount).call();
      
      // Assuming 'decimals' is defined globally. If not, you should define it or fetch it from your contract if it's variable.
      const formattedBalance = parseInt(balance) / 10 ** decimals;

      // Updating the UI
      document.getElementById("walletBalance").innerHTML = `${formattedBalance} TEDs`;
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      // Optionally handle the error in the UI as well
    }
  } else {
    console.log("Ethereum object not found or contract not initialized. Ensure MetaMask is installed and the contract is set up.");
  }
}

function CheckDays(input){
  var isValid = (input.value <= 420 && input.value >= 1); 
  if (!isValid){
    errorMessage('Invalid stake length: min 1, max 420 days');
  }
}

/*-----------------DONATION----------------*/
function DonateEth() {
  if (typeof web3 !== "undefined") {
    Connect();
    //donate
    const input = document.getElementById('ethDonate');
    if (input.value <= 0) {
      return;
    } else {
      let donateWei = new window.web3.utils.BN(
        window.web3.utils.toWei(input.value, "ether")
      );
      window.web3.eth.net.getId().then(netId => {
        return window.web3.eth.getAccounts().then(accounts => {
          return window.web3.eth
            .sendTransaction({
              from: accounts[0],
              to: donationAddress,
              value: donateWei
            })
            .catch(e => {
              alert(e);
            });
        });
      });
    }
  }
}



/*----------HELPER FUNCTIONS------------ */

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function numStringToBytes32(num) {
  var bn = new web3.utils.BN(num).toTwos(256);
  return padToBytes32(bn.toString(16));
}

function bytes32ToNumString(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn.toString();
}

function bytes32ToInt(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  var bn = new web3.utils.BN(bytes32str, 16).fromTwos(256);
  return bn;
}

function padToBytes32(n) {
  while (n.length < 64) {
    n = "0" + n;
  }
  return "0x" + n;
}

function toFixedMax(value, dp) {
  return +parseFloat(value).toFixed(dp);
}