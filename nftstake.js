

// setTimeout(function(){
//   PopulateNFTStakeTable();
// }, 5000);



// async function StakeNFT() {
//   if (1==1){
//     //console.log("testingek1");
//   };
//   if (typeof web3 !== "undefined") {
//     var value = document.getElementById("TEDTStake2").value;
    
//     ls = value.split(",")
   
//     console.log(ls)
//     if(value == 0 || value == null || value == "undefined"){
//       errorMessage("Enter NFT TokenIDs");
//       return;
//     }
//     stakeContract.methods.stakeNFT(ls).send({
//       from: activeAccount
//     }).then(function () {
//       successMessage("Staked NFT(s) successfully!");
//       setTimeout(function(){
//         ShownftBalance();
//         PopulateNFTStakeTable();
//       }, 4000);
//     });
//   }
// }

async function StakeNFT() {
  // Assuming web3 and stakeContract are initialized and available globally
  if (window.ethereum) {
    try {
      const value = document.getElementById("TEDTStake2").value.trim();
      const tokenIds = value.split(",").map(id => id.trim()).filter(id => id); // Trim spaces and filter out empty values

      console.log(tokenIds);

      if (tokenIds.length === 0) {
        errorMessage("Enter NFT TokenIDs");
        return;
      }

      // Ensure we have the correct account to use for the transaction
      const accounts = await window.ethereum.request({"method": "eth_requestAccounts" });
      const activeAccount = accounts[0]; // Using the first account for the transaction

      await stakeContract.methods.stakeNFT(tokenIds).send({ "from": activeAccount });

      successMessage("Staked NFT(s) successfully!");

      // Wait for a bit before updating UI components to ensure the blockchain has processed the transaction
      setTimeout(() => {
        ShownftBalance();
        PopulateNFTStakeTable();
      }, 4000);
    } catch (error) {
      console.error("Error staking NFTs:", error);
      errorMessage("Failed to stake NFT(s). Please try again.");
    }
  } else {
    console.log("Ethereum object not found. Please ensure MetaMask or another Ethereum wallet is installed.");
  }
}

// async function harvestRewards(elem){
//     if (typeof web3 !== "undefined") {
//         var stakeId = parseInt(elem.parentElement.parentElement.lastElementChild.innerHTML);
//         console.log(stakeId)
//         await stakeContract.methods.harvest(stakeId).send({
        
//         from: activeAccount
//         }).then(function () {
//             successMessage("Rewards harvested successfully!");
//             setTimeout(function(){
//             ShownftBalance();
//             ShowBalance();
//             PopulateNFTStakeTable();
//           }, 2000);
//     });
//     }

// }

async function harvestRewards(elem) {
  if (window.ethereum) {
      try {
          const stakeId = parseInt(elem.parentElement.parentElement.lastElementChild.innerHTML);
          console.log(stakeId);

          // Ensuring we have the correct account to use for the transaction
          const accounts = await window.ethereum.request({ "method": "eth_requestAccounts" });
          const activeAccount = accounts[0]; // Using the first account for transactions

          // Sending the transaction to the blockchain
          await stakeContract.methods.harvest(stakeId).send({
              "from": activeAccount
          });

          // Notifying the user of successful action
          successMessage("Rewards harvested successfully!");

          // Optionally wait for a bit before updating UI components to reflect changes
          setTimeout(() => {
              ShownftBalance();
              ShowBalance();
              PopulateNFTStakeTable();
          }, 2000);
      } catch (error) {
          console.error("Error harvesting rewards:", error);
          // Implement error handling, e.g., showing an error message to the user
      }
  } else {
      console.log("Ethereum object not found. Please ensure MetaMask or another Ethereum wallet is installed.");
  }
}

// async function EndNFTStake(elem) {
//   if (typeof web3 !== "undefined") {
//     var tokenId = parseInt(elem.parentElement.parentElement.lastElementChild.innerHTML);
//     //console.log(tokenId);
    
//     var stakeListIndex = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);
    
//    stakeContract.methods.unStakeNFT(tokenId, stakeListIndex).send({  
//         from: activeAccount  
//       })
//       .then(() => {
//         successMessage("Stake ended successfully!");
//         setTimeout(() => {
//         ShownftBalance();
//          ShowBalance();
//          PopulateNFTStakeTable();
//         }, 2000);
//     });
//   }
// }

async function EndNFTStake(elem) {
  if (window.ethereum) {
      try {
          const tokenId = parseInt(elem.parentElement.parentElement.lastElementChild.innerHTML);
          const stakeListIndex = parseInt(elem.parentElement.parentElement.firstElementChild.innerHTML);

          // Make sure to have the active account selected
          const accounts = await window.ethereum.request({ "method": "eth_requestAccounts" });
          const activeAccount = accounts[0]; // Using the first account

          await stakeContract.methods.unStakeNFT(tokenId, stakeListIndex).send({
              "from": activeAccount
          });

          successMessage("Stake ended successfully!");

          // Optional: Wait for the transaction to be mined before updating the UI
          setTimeout(() => {
              ShownftBalance();
              ShowBalance();
              PopulateNFTStakeTable();
          }, 2000);

      } catch (error) {
          console.error("Failed to end stake:", error);
          // Here, implement how you handle errors, e.g., show an error message to the user
      }
  } else {
      console.log("Ethereum object not found. Please make sure you have MetaMask installed or you are in an Ethereum-enabled browser.");
  }
}

// async function getOwnedIds(){
//   if (typeof web3 !== "undefined") {
//     owned = await nftContract.methods.walletOfOwner(activeAccount).call()
//     .then(function(owned){
//       document.getElementById("ownedWalletBalance").innerHTML = owned;
//     });

//   }
    
// }

async function getOwnedIds() {
  if (window.ethereum) {
      try {
          // Requesting access to the account, in case it's not already available
          const accounts = await window.ethereum.request({ "method": "eth_requestAccounts" });
          const activeAccount = accounts[0]; // Using the first account

          // Calling the walletOfOwner method from the NFT contract
          const ownedNfts = await nftContract.methods.walletOfOwner(activeAccount).call();

          // Updating the HTML element with the owned NFTs
          document.getElementById("ownedWalletBalance").innerHTML = ownedNfts.join(", ");
      } catch (error) {
          console.error("Error fetching owned NFTs:", error);
          // Handle errors, such as user rejecting the connection request
      }
  } else {
      console.log("Ethereum object not found. You need to install MetaMask or another Ethereum wallet.");
  }
}

async function PopulateNFTStakeTable() {
  var myActiveStakes;
  var stakeNFTTable = document.getElementById("stakeNFTTable").lastElementChild;
  stakeNFTTable.innerHTML = "";
  var stakeCount = await stakeContract.methods.CountOfOwnedStakes(activeAccount).call();
  //console.log(stakeCount);
    myActiveStakes = 0;
    for(var i = 0; i < stakeCount; i++){
          var stake = await stakeContract.methods.stakeLists(activeAccount, i).call();
          
          //console.log(stake);
          if(stakeCount > 0){
            $("#frownFace").hide();
            var index = i;
            var id = stake.tokenId;
            var rewards = await stakeContract.methods.getCurrentStakeEarned(id).call();
            //console.log(rewards);
            // Use BigInt for arithmetic operations involving BigInt values
            var rewardsInTEDs = rewards / BigInt(10 ** 12);
            // Convert the BigInt result to a string for display
            var rewardsDisplay = rewardsInTEDs.toString() + ' TEDs';

            //stakeNFTTable.insertAdjacentHTML('afterbegin', '<tr><th scope="row">' + index + '</th><td>' + parseInt(rewards / BigInt(10 ** 12)) + ' TEDs</td><td><a href='+'https://trippyeggsdefi.mypinata.cloud/ipfs/QmPDCMBbfTDVrbSVXy5xep9sdGRTXB5GK1pdLeQN7vAzWi/'+id+'.gif><img style= '+'width:100px;'+' src='+'https://trippyeggsdefi.mypinata.cloud/ipfs/QmNvsyi5HNBPP7d2Q6LXQQA9WJEahKx6eFvknu2TFavpwK/'+ id +'.PNG'+'></a></td><td><button class="stakeBtn" onclick="harvestRewards(this)">Get Rewards</button></td> <td><button class="stakeBtn" onclick="EndNFTStake(this)">End NFT Stake</button></td><td>' + id + '</td></tr>');
            stakeNFTTable.insertAdjacentHTML('afterbegin', `<tr>
                        <th scope="row">${index}</th>
                        <td>${rewardsDisplay}</td>
                        <td><a href="https://trippyeggsdefi.mypinata.cloud/ipfs/QmPDCMBbfTDVrbSVXy5xep9sdGRTXB5GK1pdLeQN7vAzWi/${id}.gif">
                            <img style="width:100px;" src="https://trippyeggsdefi.mypinata.cloud/ipfs/QmNvsyi5HNBPP7d2Q6LXQQA9WJEahKx6eFvknu2TFavpwK/${id}.PNG"></a>
                        </td>
                        <td><button class="stakeBtn" onclick="harvestRewards(this)">Get Rewards</button></td>
                        <td><button class="stakeBtn" onclick="EndNFTStake(this)">End NFT Stake</button></td>
                        <td>${id}</td>
                    </tr>`);
            myActiveStakes++;
           
          }
    document.getElementById("activeNFTStakeCount").innerHTML = stakeCount;
   }
  
}

// async function PopulateNFTStakeTable() {
//   var stakeNFTTable = document.getElementById("stakeNFTTable").lastElementChild;
//   stakeNFTTable.innerHTML = ""; // Clear the table first

//   var stakeCount = await stakeContract.methods.CountOfOwnedStakes(activeAccount).call();

//   // Hide the frown face if there are stakes
//   if (stakeCount > 0) {
//       $("#frownFace").hide();
//   }

//   for (let i = 0; i < stakeCount; i++) {
//       const stake = await stakeContract.methods.stakeLists(activeAccount, i).call();
//       const id = stake.tokenId;
//       const rewards = await stakeContract.methods.getCurrentStakeEarned(tokenId,id).call();

//       // Calculating rewards and ensuring division by 10**12 is handled properly
//       const formattedRewards = (parseInt(rewards) / 10 ** 12).toFixed(2); // Adjusting decimal places if needed

//       // Construct the image and gif URLs
//       const imageURL = `https://trippyeggsdefi.mypinata.cloud/ipfs/QmNvsyi5HNBPP7d2Q6LXQQA9WJEahKx6eFvknu2TFavpwK/${id}.PNG`;
//       const gifURL = `https://trippyeggsdefi.mypinata.cloud/ipfs/QmPDCMBbfTDVrbSVXy5xep9sdGRTXB5GK1pdLeQN7vAzWi/${id}.gif`;

//       // Insert a row into the table
//       const newRow = `<tr>
//                           <th scope="row">${i}</th>
//                           <td>${formattedRewards} TEDs</td>
//                           <td><a href="${gifURL}"><img style="width:100px;" src="${imageURL}"></a></td>
//                           <td><button class="stakeBtn" onclick="harvestRewards(this, ${id})">Get Rewards</button></td>
//                           <td><button class="stakeBtn" onclick="EndNFTStake(this, ${id})">End NFT Stake</button></td>
//                           <td>${id}</td>
//                       </tr>`;
//       stakeNFTTable.insertAdjacentHTML('beforeend', newRow); // Use 'beforeend' to maintain order
//   }

//   document.getElementById("activeNFTStakeCount").innerHTML = stakeCount;
// }



// async function ShownftBalance(){
//   await nftContract.methods.balanceOf(activeAccount).call().then(function(balance){
//     document.getElementById("nftwalletBalance").innerHTML = parseInt(balance) + " NFTs";
//   });
 
// }

async function ShownftBalance() {
  if (window.ethereum && nftContract) {
      try {
          // Ensuring we have access to the user's account
          const accounts = await window.ethereum.request({ "method": "eth_requestAccounts" });
          const activeAccount = accounts[0]; // Assuming we're using the first account

          // Calling the balanceOf method from the NFT contract
          const balance = await nftContract.methods.balanceOf(activeAccount).call();

          // Updating the HTML element with the NFT balance
          document.getElementById("nftwalletBalance").innerHTML = `${balance} NFTs`;
      } catch (error) {
          console.error("Error fetching NFT balance:", error);
          // Handle errors here, such as user rejecting the connection request
      }
  } else {
      console.log("Ethereum object not found or contract not initialized. Please make sure you have MetaMask installed and the contract is correctly set up.");
  }
}