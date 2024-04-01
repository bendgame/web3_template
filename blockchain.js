// JavaScript Document

const oneDaySeconds = 86400;

//const infura = "https://polygon-rpc.com/";
const infura = "https://polygon-mainnet.infura.io/v3/d976777e5fa3410382ba081051344645"

//const infura = "https://speedy-nodes-nyc.moralis.io/5a0a41a92d196fa05f809767/polygon/mainnet";

const donationAddress = "0xde8cD0BCc9545ec18c7DE52F96Cd76d36d62663b";

const decimals = 12;

var nftContract;
var rewardsContract;
var stakeContract;

const rewardsContractAddress = "0xF3789d1C88D8A625dA7EeCAd9b6bB275fCaAc3d2";
const nftContractAddress = "0xc52B316E22526b8801475DF60c432331A1D0958E";
const stakeContractAddress = "0x2164e27d4b1B78C621eDB41561BB3B82f608CB59";

// const rewardsContractAddress = "0xCe2C336123241fC6791D85EDE0499406ddB83C7c";
// const nftContractAddress = "0x243b90e1CcAC368e715ef46f7d06B6011E130791";
// const stakeContractAddress = "0xe500f66C6e02b3634eCec4Bb3a33D7961e62CA41";

const rewardsABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_daoAdmin",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candyPrice",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			}
		],
		"name": "CandyPriceChange",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candyPrice",
				"type": "uint256"
			}
		],
		"name": "CandySale",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "beginDay",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endDay",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isAutoUpdate",
				"type": "bool"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "updaterAddr",
				"type": "address"
			}
		],
		"name": "DailyEggHuntRefresh",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "burnedTEDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hiddenCandy",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "payout",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "servedDays",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "stakerAddr",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			}
		],
		"name": "StakeEnd",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "burnedTEDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hiddenCandy",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stakedDays",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "stakerAddr",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			}
		],
		"name": "StakeStart",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "stakerAddr",
				"type": "address"
			}
		],
		"name": "CountOfOwnedStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "previousDay",
				"type": "uint256"
			}
		],
		"name": "RefreshDailyHuntData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint128",
				"name": "_candyPrice",
				"type": "uint128"
			}
		],
		"name": "SetCandyPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint40",
				"name": "_multiplier",
				"type": "uint40"
			}
		],
		"name": "SetMultiplier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_dayOverride",
				"type": "uint256"
			}
		],
		"name": "TimeWarp",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TotalTEDsCreated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "XferConTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentDay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dailyEggHuntRewards",
		"outputs": [
			{
				"internalType": "uint128",
				"name": "dayPayoutTotal",
				"type": "uint128"
			},
			{
				"internalType": "uint128",
				"name": "dayhiddenCandyTotal",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dayOverride",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "stakeIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint40",
				"name": "stakeIdParam",
				"type": "uint40"
			}
		],
		"name": "stakeEnd",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "stakeTEDsAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeDays",
				"type": "uint256"
			}
		],
		"name": "stakeStart",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakingTotals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "burnedTEDsTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nextHiddenCandyTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "candyPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dailyEggHuntCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hiddenCandyTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint40",
				"name": "latestStakeId",
				"type": "uint40"
			},
			{
				"internalType": "uint40",
				"name": "multiplier",
				"type": "uint40"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakingTotalsList",
		"outputs": [
			{
				"internalType": "uint256[9]",
				"name": "",
				"type": "uint256[9]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "yourStakes",
		"outputs": [
			{
				"internalType": "uint40",
				"name": "stakeId",
				"type": "uint40"
			},
			{
				"internalType": "uint256",
				"name": "burnedTEDs",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hiddenCandy",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hiddenDay",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakedDays",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const nftABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hiddenMetadataUri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxMintAmountPerTx",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_mintAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			}
		],
		"name": "mintForAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revealed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_approverAddress",
				"type": "address"
			}
		],
		"name": "setApprovalAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			}
		],
		"name": "setCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hiddenMetadataUri",
				"type": "string"
			}
		],
		"name": "setHiddenMetadataUri",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_maxMintAmountPerTx",
				"type": "uint256"
			}
		],
		"name": "setMaxMintAmountPerTx",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_state",
				"type": "bool"
			}
		],
		"name": "setPaused",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_state",
				"type": "bool"
			}
		],
		"name": "setRevealed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uriPrefix",
				"type": "string"
			}
		],
		"name": "setUriPrefix",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uriSuffix",
				"type": "string"
			}
		],
		"name": "setUriSuffix",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uriPrefix",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uriSuffix",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "walletOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const stakeABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokensPerBlock",
				"type": "uint256"
			}
		],
		"name": "changeTokensPerblock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "harvest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "_nftToken",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_erc20Token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_daoAdmin",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokensPerBlock",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "NftStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "NftUnStaked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC721Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenId",
				"type": "uint256[]"
			}
		],
		"name": "stakeNFT",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stakeAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fromBlock",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "toBlock",
				"type": "uint256"
			}
		],
		"name": "StakePayout",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rewardPerBlock",
				"type": "uint256"
			}
		],
		"name": "StakeRewardUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeListIndex",
				"type": "uint256"
			}
		],
		"name": "unStakeNFT",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokensPerBlock",
				"type": "uint256"
			}
		],
		"name": "updateStakingReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "stakerAddr",
				"type": "address"
			}
		],
		"name": "CountOfOwnedStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "daoAdmin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "erc20Token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getCurrentStakeEarned",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStakeContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftToken",
		"outputs": [
			{
				"internalType": "contract IERC721",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "receipt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakedFromBlock",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakeLists",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakedFromBlock",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokensPerBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

var activeAccount;
var account;
var sendok;
var accountInterval;
var web3Found;

var isDeviceMobile = function () {
	//check for mobile or desktop
	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) { //mobile
		return true;
	} else { //desktop
		return false;
	}
}

var checkProvider = function () {
	if (web3.currentProvider.isMetaMask === true) {
		return "metamask";
	} else if (typeof (mist) !== "undefined") {
		return "mist";
	} else if (web3.currentProvider.isTrust === true) {
		return "trust";
	} else if (typeof window.__CIPHER__ !== 'undefined') {
		return "cipher";
	} else if (typeof window.SOFA !== 'undefined') {
		return "toshi";
	} else {
		//errorMessage("Error detecting provider");
		return "";
	}
}
///////////////////////////////////////////////////////////////////////
setTimeout(function(){
	Connect();
}, 3000);

  
function errorMessage(message) {
	// Show an error message to the user
	console.error(message);
	// Potentially update the UI with the error message
  }

  async function Connect() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
		nftContract = new web3.eth.Contract(nftABI, nftContractAddress);
		if (nftContract){
			console.log("nftcontract");
		}
		rewardsContract = new web3.eth.Contract(rewardsABI, rewardsContractAddress);
		if (rewardsContract){
			console.log("rewardsContract");
		}
		stakeContract = new web3.eth.Contract(stakeABI, stakeContractAddress);
		if (stakeContract){
			console.log(stakeContract);
        try {
            // Request account access if needed
            await window.ethereum.request({ "method": "eth_requestAccounts" });

            console.log("Web3 Initialized with current provider:", web3.currentProvider);
            
            // // Initializing contracts
            // const nftContract = new web3.eth.Contract(nftABI, nftContractAddress);
            // console.log("NFT Contract initialized.");

            // const rewardsContract = new web3.eth.Contract(rewardsABI, rewardsContractAddress);
            // console.log("Rewards Contract initialized.");

            // const stakeContract = new web3.eth.Contract(stakeABI, stakeContractAddress);
            // console.log("Stake Contract initialized.");

            // Perform further actions here, like checking accounts and network
           //CheckAccount();
		   const accounts = await window.ethereum.request({
					"method": "eth_accounts",
					"params": []
				  });
			account = accounts[0];
			console.log("accountz");
			console.log(account);
			activeAccount = account;
			console.log(activeAccount);
			web3.eth.defaultAccount = account;
			const stakeCount = await stakeContract.methods.CountOfOwnedStakes(accounts[0]).call();
			console.log(stakeCount);
			//const stake = await stakeContract.methods.stakeLists(activeAccount, activeAccount).call().then(console.log);
			//console.log(stake);
			const rewards = await stakeContract.methods.getCurrentStakeEarned(1).call();
			console.log(rewards);
           CheckNetwork();
		   getOwnedIds();
		   ShownftBalance();
		   ShowBalance();
		   PopulateGlobalTable();
		   PopulateStakeTable();
		   PopulateNFTStakeTable();
		   console.log(window.innerWidth)
		  // ShowUserAddress();
        } catch (error) {
            // User denied account access or another error
            console.error("Error accessing the account:", error);
            errorMessage("Failed to connect to your wallet, please allow access.");
        }
    } else {
        // Ethereum object not found, handle accordingly
        console.error("Ethereum object not found. You need to install MetaMask!");
        errorMessage("No wallet found, please try with a compatible dapp browser.");
    }
}}

// Example error message function
function errorMessage(msg) {
    console.error(msg);
    // Implement UI error message display or any other error handling mechanism
}

//Placeholder functions for account and network checks
// async function CheckAccount() {
//     const accounts = await window.ethereum.request({
// 		"method": "eth_accounts",
// 		"params": []
// 	  });
// 	account = accounts[0]
// 	getOwnedIds()
// 	ShowUserAddress();
// 	ShowBalance();
// 	ShownftBalance();
// 	getOwnedIds();
// 	PopulateNFTStakeTable();
// 	PopulateStakeTable();
// 	PopulateGlobalTable();
// 	ids = getOwnedIds
// 	console.log(ids)
//     console.log("Accounts:", accounts);
//     // Perform account-related checks or updates here
// }

async function CheckNetwork() {
    const networkId = await window.ethereum.request({
		"method": "eth_chainId",
		"params": []
	  });
    console.log("Network ID:", networkId);
    // Perform network-related checks or updates here
}





// async function Connect() {
// 	if (window.ethereum) {
// 		web3 = new Web3(ethereum);
// 		console.log("2");
// 			console.log(web3.currentProvider);
// 			console.log("2");
// 	}
// 	nftContract = new web3.eth.Contract(nftABI, nftContractAddress);
// 	if (nftContract){
// 		console.log("nftcontract");
// 	}
// 	rewardsContract = new web3.eth.Contract(rewardsABI, rewardsContractAddress);
// 	if (rewardsContract){
// 		console.log("rewardsContract");
// 	}
// 	stakeContract = new web3.eth.Contract(stakeABI, stakeContractAddress);
// 	if (stakeContractAddress){
// 		console.log("stakeContractAddress");
// 	}
// 	if (window.ethereum == undefined) {
// 		errorMessage("No wallet found, please try with a compatible dapp browser.");
// 		console.log("Defaulting to infura for view only");
// 	}
// 	if (typeof web3 !== "undefined") {
// 		// Modern dapp browsers...
// 		if (window.ethereum) {
// 			web3 = new Web3(ethereum);
// 			console.log("Window Ethereum");
// 			try {
// 				// Request account access if needed
// 				ethereum.enable().then(function () {
// 					CheckAccount();
// 					CheckNetwork();
// 					if (!web3Found) {
// 						web3Found = true;
// 						console.log("Web3 Found!");
// 						console.log(web3.version);
// 					}
// 				});
// 				// Acccounts now exposed
// 			} catch (error) {
// 				// User denied account access...
// 				if (!web3Found) {
// 					web3Found = true;
// 					web3 = new Web3(new Web3.providers.HttpProvider(infura));
// 					console.error;
// 					console.log("Defaulting to infura for view only");
// 					errorMessage("Failed to connect to your wallet, allow access to use <b>HEX</b>OTC");
// 					return;
// 				}
// 			}
// 		}
// 		// Legacy dapp browsers...
// 		else if (window.web3) {
// 			web3 = new Web3(window.web3.currentProvider);
// 			console.log(web3.currentProvider);
// 			if (!web3Found) {
// 				web3Found = true;
// 				console.log("Web3 sdfFound!");
// 				console.log(web3.version);
// 				CheckAccount();
// 				CheckNetwork();
// 			}
// 		}
// 		// Non-dapp browsers...
// 		else {
// 			//non detected;
// 			if (!web3Found) {
// 				web3Found = true;
// 				errorMessage("Failed to connect to your wallet, please try again.");
// 				console.log("Defaulting to infura for view only");
// 				return;
// 			}
// 		}
// 	} else { //no web3 provider found
// 		if (!web3Found) {
// 			web3Found = true;
// 			errorMessage("No wallet found, please try with a compatible dapp browser.");
// 			console.log("Defaulting to infura for view only");
// 		}
// 	}
// }


// function CheckAccount() {
// 	//get available accounts
// 	web3.eth.getAccounts(async function (err, accounts) {
// 		if (err !== null) {
// 			errorMessage("An error occurred: " + err);
// 		} 
// 		else if (accounts.length == 0) //is user logged in?
// 		{
// 			setTimeout(function () {
// 				errorMessage("Login to your wallet and allow permissions to use TrippyEggs");
// 			}, 5000);
// 		} else {
// 			account = accounts[0];
// 			activeAccount = account;
// 			web3.eth.defaultAccount = account;

// 			ShowUserAddress();
// 			ShowBalance();
// 			ShownftBalance();
// 			getOwnedIds();
// 			PopulateNFTStakeTable();
// 			PopulateStakeTable();
// 			PopulateGlobalTable();
// 			clearInterval(accountInterval);
// 			//interval for account change
// 			accountInterval = setInterval(function () {
// 				//console.log("Checking wallet presence...");
// 				ShowUserAddress();
// 				ShowBalance();
// 				ShownftBalance();
// 				getOwnedIds();
// 				PopulateGlobalTable();
// 				//PopulateNFTStakeTable();
// 				web3.eth.getAccounts(function (err, accounts) {
// 					if (accounts[0] !== activeAccount) {
// 						console.log("Wallet changed... refreshing data");
// 						location.reload();
// 					} else {
// 						//console.log("Active wallet = " + activeAccount);
// 						ShowUserAddress();
// 					}
// 				});
// 			}, 2000);
// 		}
// 	});
// }

async function CheckAccount() {
	try {
	  const accounts = await web3.eth.getAccounts();
  
	  if (accounts.length === 0) {
		// User is not logged in to their wallet
		setTimeout(() => {
		  errorMessage("Login to your wallet and allow permissions to use TrippyEggs");
		}, 5000);
	  } else {
		// User is logged in, proceed with account setup
		const account = accounts[0];
		activeAccount = account;
		web3.eth.defaultAccount = account;
  
		// Update UI with account information and balances
		ShowUserAddress();
		ShowBalance();
		ShownftBalance();
		getOwnedIds();
		PopulateNFTStakeTable();
		PopulateStakeTable();
		PopulateGlobalTable();
  
		// Stop any previous interval that was checking for account changes
		if (window.accountInterval) clearInterval(window.accountInterval);
  
		// Set up an interval to check for account changes
		window.accountInterval = setInterval(async () => {
		  try {
			const accounts = await web3.eth.getAccounts();
			if (accounts[0] !== activeAccount) {
			  console.log("Wallet changed... refreshing data");
			  location.reload();
			} else {
			  // Active wallet remains the same; optionally update UI as needed
			  ShowUserAddress();
			}
		  } catch (err) {
			console.error("Error fetching accounts:", err);
		  }
		}, 2000);
	  }
	} catch (err) {
	  errorMessage("An error occurred: " + err.message);
	}
  }

// //////////
// function CheckNetwork() {
// 	web3.eth.net.getId().then(netId => {
// 		switch (netId) {
// 			case 137:
// 				console.log('Connected to Mainnet');
// 				//errorMessage("You are using the mainet, please change to rinkeby");
// 				sendok = true;
// 				return true;
// 			case 1:
// 				errorMessage("You are using the Ethereum mainnet, please change to Polygon/MATIC");
// 				console.log('Connected to ethereum.');
// 				return false;
// 			default:
// 				errorMessage("Network unknow, please change Polygon/MATIC");
// 				console.log('Unknown network.');
// 				console.log(netId);
// 				return false;
// 		}
// 	});
// }

function errorMessage(text) {
	console.log(text);
	document.getElementById("errorMsg").innerHTML = '<i class="fa fa-exclamation-circle"></i>&nbsp;' + text;
	document.getElementById("errorMsg").style.display = "block";
	setTimeout(function () {
		$("#errorMsg").fadeOut(1000);
	}, 3000);
}

function successMessage(text) {
	console.log(text);
	document.getElementById("successMsg").innerHTML = '<i class="fa fa-exclamation-circle"></i>&nbsp;' + text;
	document.getElementById("successMsg").style.display = "block";
	setTimeout(function () {
		$("#successMsg").fadeOut(1000);
	}, 3000);
}

function ShowUserAddress() {
	var elem = document.getElementById("userAddress");
	elem.innerHTML = activeAccount;
	//console.log('Detected Account: ' + activeAccount.toString());
}