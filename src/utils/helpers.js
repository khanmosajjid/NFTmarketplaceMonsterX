import { decodeEventLog, parseEther } from "viem";
import { waitForTransactionReceipt, getBalance,readContract } from "@wagmi/core";
import {
  config,
  createPublicClientLocal,
  createWalletClientLocal,
} from "./web3Service";
import { abi, address } from "./contract";

export const trimString = (trimString) => {
  if (!trimString) return "";
  return trimString.length > 30
    ? trimString.slice(0, 5) + "..." + trimString.slice(-4)
    : trimString;
};


export const isCurator = async (
  account
) => {
  try {
    const data = await readContract(config, {
      address: address,
      abi: abi,
      functionName: "isCurator",
      args: [account],
    });

    return data;
  } catch (e) {
    console.log("error is----->", e);
  }
};


export async function getFileFromUrl(url, name, defaultType = "image/png") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

const changeSplitPayAmount = (splitPayment) => {
  const splitPayments =
    splitPayment?.length > 0
      ? splitPayment.map((item) => ({
          paymentWallet: item.paymentWallet,
          paymentPercentage: item.paymentPercentage * 100,
        }))
      : [];
  return splitPayments;
};

export function getYouTubeVideoId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7]?.length === 11 ? match[7] : null;
}

export const handleCopyClick = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    console.log("Text copied to clipboard!");
  } catch (error) {
    console.error("Error copying text:", error);
  }
};

export const getEventValue = (logs, eventName) => {
  for (let i = 0; i < logs?.length; i++) {
    try {
      if (
        logs[i].topics[0] !==
          "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4" &&
        logs[i].topics[0] !==
          "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63"
      ) {
        const log = decodeEventLog({
          abi: abi,
          data: logs[i].data,
          topics: logs[i].topics,
        });
        if (log.eventName === eventName) {
          return log.args;
        }
      }
    } catch (error) {
      console.log({ error });
    }
  }
};

export const getEventArray = (logs, eventName) => {
  const state = [];
  for (let i = 0; i < logs?.length; i++) {
    try {
      if (
        logs[i]?.topics[0] !==
          "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4" &&
        logs[i]?.topics[0] !==
          "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63"
      ) {
        const log = decodeEventLog({
          abi: abi,
          data: logs[i].data,
          topics: logs[i].topics,
        });
        console.log("log in event array is---->",log);
        if (log.eventName === eventName) {
          state.push(log);
        }
      }
    } catch (error) {
      console.log("error is--->",{ error });
      throw error;
    }
  }
  return state;
};

export const getEthBalance = async (address) => {
  const balance = await getBalance(config, {
    address,
  });
  return Number(balance.formatted)?.toFixed(4);
};

const executeWriteFunction = async (txObj, userAddress) => {
  const publicClient = createPublicClientLocal();
  const walletClient = createWalletClientLocal();
  console.log({ txObj });
  try {
    await publicClient.estimateContractGas({ ...txObj, account: userAddress });
  } catch (error) {
    throw error;
  }
  let hash;
  try {
    const { request } = await publicClient.simulateContract({
      ...txObj,
      account: userAddress,
    });
    hash = await walletClient.writeContract(request);
  } catch (error) {
    console.log({ error });
    throw error;
  }
  return await waitForTransactionReceipt(config, {
    hash: hash,
    pollingInterval: 5000,
  });
};

export const pullTransaction = async (hash) => {
  try {
    return await waitForTransactionReceipt(config, {
      hash: hash.hash,
      pollingInterval: 5000,
    });
  } catch (error) {
    throw error;
  }
};

const getApproveAll = async (to, userAddress) => {
  const txObj = {
    address: address,
    abi: abi,
    functionName: "setApprovalForAll",
    args: [to, true],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    throw error;
  }
};

const isApproved = async (to, userAddress) => {
  const publicClient = createPublicClientLocal();
  const isTrue = publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "isApprovedForAll",
    args: [userAddress, to],
  });
  return isTrue;
};

const ownerOf = async (tokenId) => {
  const publicClient = createPublicClientLocal();
  const owner = publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "ownerOf",
    args: [tokenId],
  });
  return owner;
};

export const listNft = async (
  uri,
  amount,
  royalty,
  splitPayment,
  userAddress,
) => {
  let etherValue = parseEther(amount);

  const splitPayments = changeSplitPayAmount(splitPayment);

  const txObj = {
    address: address,
    abi: abi,
    functionName: "listAsset",
    args: [
      uri,
      etherValue,
      { royaltyWallet: userAddress, royaltyPercentage: royalty * 100 },
      splitPayments,
    ],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const idToSaleDetails = async (tokenId) => {
  const obj = {
    address: address,
    abi: abi,
    functionName: "idToSale",
    args: [tokenId],
  };
  const publicClient = createPublicClientLocal();
  return await publicClient.readContract(obj);
};

export const getMarketPlaceFee = async () => {
  const obj = {
    address: address,
    abi: abi,
    functionName: "fee",
    args: [],
  };
  const publicClient = createPublicClientLocal();
  return await publicClient.readContract(obj);
};

export const releaseTime = async (tokenId) => {
  const obj = {
    address: address,
    abi: abi,
    functionName: "escrowReleaseTime",
    args: [],
  };
  const publicClient = createPublicClientLocal();
  const time = await publicClient.readContract(obj);
  return Number(time);
};

export const getTreasury = async (tokenId) => {
  const obj = {
    address: address,
    abi: abi,
    functionName: "treasury",
    args: [],
  };
  const publicClient = createPublicClientLocal();
  return publicClient.readContract(obj);
};

export const buyItem = async (tokenId, userAddress) => {
  const sale = await idToSaleDetails(tokenId);
  let txObj = {
    address: address,
    abi: abi,
    functionName: "purchaseAsset",
    args: [tokenId],
    value: sale[3],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    throw error;
  }
};

export const burnItem = async (tokenId, userAddress) => {
  let txObj = {
    address: address,
    abi: abi,
    functionName: "burnNft",
    args: [tokenId],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    throw error;
  }
};

export const endSale = async (tokenId, userAddress) => {
  let txObj = {
    address: address,
    abi: abi,
    functionName: "endSale",
    args: [tokenId],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    throw error;
  }
};

export const resell = async (tokenId, amount, userAddress) => {
  let etherValue = parseEther(amount);
  const isApprove = await isApproved(address, userAddress);
  if (!isApprove) await getApproveAll(address, userAddress);
  const txObj = {
    address: address,
    abi: abi,
    functionName: "reSaleAsset",
    args: [tokenId, etherValue],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const releaseEscrow = async (tokenId, userAddress) => {
  const txObj = {
    address: address,
    abi: abi,
    functionName: "releaseEscrow",
    args: [tokenId],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const putCancelRequest = async (tokenId, request, userAddress) => {
  const txObj = {
    address: address,
    abi: abi,
    functionName: "requestCancellation",
    args: [tokenId, request],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const placeBidOnSale = async (tokenId, price, userAddress) => {
  let etherValue = parseEther(price);
  const txObj = {
    address: address,
    abi: abi,
    functionName: "placeBid",
    args: [tokenId],
    value: etherValue,
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const placeBid = async (
  uri,
  price,
  nftPrice,
  sellerAddress,
  userAddress,
  royalty,
  splitPayment,
) => {
  let etherValue = parseEther(price);
  const nftValue = parseEther(nftPrice.toString());
  const splitPayments = changeSplitPayAmount(splitPayment);
  const txObj = {
    address: address,
    abi: abi,
    functionName: "placeBidUnminted",
    args: [
      uri,
      sellerAddress,
      nftValue,
      { royaltyWallet: userAddress, royaltyPercentage: royalty * 100 },
      splitPayments,
    ],
    value: etherValue,
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const acceptBid = async (tokenId, bidId, userAddress) => {
  const owner = await ownerOf(tokenId);
  if (owner.toLowerCase() === address.toLowerCase()) {
    const isApprove = await isApproved(address, userAddress);
    if (!isApprove) {
      await getApproveAll(address, userAddress);
    }
  }
  const txObj = {
    address: address,
    abi: abi,
    functionName: "acceptBid",
    args: [tokenId, bidId],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const requestEscrowRelease = async (tokenId, request, userAddress) => {
  const txObj = {
    address: address,
    abi: abi,
    functionName: "reportDispute",
    args: [tokenId, request],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const cancleBid = async (bidId, userAddress) => {
  const txObj = {
    address: address,
    abi: abi,
    functionName: "cancelBid",
    args: [bidId],
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const purchaseUnmintedNft = async (
  uri,
  price,
  sellerAddress,
  userAddress,
  royalty,
  splitPayment,
) => {
  let etherValue = parseEther(price.toString());
  const splitPayments = changeSplitPayAmount(splitPayment);
  const txObj = {
    address: address,
    abi: abi,
    functionName: "purchaseAssetUnmited",
    args: [
      uri,
      sellerAddress,
      { royaltyWallet: userAddress, royaltyPercentage: royalty * 100 },
      splitPayments,
    ],
    value: etherValue,
  };
  try {
    return await executeWriteFunction(txObj, userAddress);
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
