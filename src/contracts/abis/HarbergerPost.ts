export const HarbergerPostABI = [
  {
    type: "function",
    name: "buySquare",
    stateMutability: "payable",
    inputs: [
      { name: "squareId", type: "uint256" },
      { name: "newPrice", type: "uint256" },
      { name: "depositAmount", type: "uint256" },
      { name: "contentUri", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "setPrice",
    stateMutability: "nonpayable",
    inputs: [
      { name: "squareId", type: "uint256" },
      { name: "newPrice", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "depositCarry",
    stateMutability: "payable",
    inputs: [{ name: "squareId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "withdrawCarry",
    stateMutability: "nonpayable",
    inputs: [
      { name: "squareId", type: "uint256" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "updateContent",
    stateMutability: "nonpayable",
    inputs: [
      { name: "squareId", type: "uint256" },
      { name: "contentUri", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getSquareState",
    stateMutability: "view",
    inputs: [{ name: "squareId", type: "uint256" }],
    outputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "price", type: "uint256" },
          { name: "deposit", type: "uint256" },
          { name: "lastTaxTime", type: "uint256" },
          { name: "contentUri", type: "string" },
          { name: "isForSale", type: "bool" }
        ],
        name: "state",
        type: "tuple"
      }
    ]
  },
  {
    type: "function",
    name: "floorPrice",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "event",
    name: "SquareBought",
    inputs: [
      { name: "squareId", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "price", type: "uint256", indexed: false },
      { name: "deposit", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "PriceUpdated",
    inputs: [
      { name: "squareId", type: "uint256", indexed: true },
      { name: "newPrice", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "ContentUpdated",
    inputs: [
      { name: "squareId", type: "uint256", indexed: true },
      { name: "contentUri", type: "string", indexed: false }
    ]
  }
] as const;
