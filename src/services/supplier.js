import axios from "axios"
import { getCookie } from "../utils/cookie"
import { data } from "jquery"
const server_uri =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000/api/v1"
const options = {
  baseUrl: server_uri,
  headers: {
    authorization: "Bearer " + getCookie("token"),
  },
}
const api = axios.create(options)

// api calls for nfts
export const nftServices = {
  createNft: (nftDetails) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/nft/create`, nftDetails)
  },
  getNftByUserAddress: async (limit, chain, address, cursor) => {
    if (cursor)
      return api.post(`${server_uri}/nft/nftByUserAddress`, {
        address,
        limit,
        cursur: cursor,
        chainId: chain,
      })
    return api.post(`${server_uri}/nft/nftByUserAddress`, {
      address,
      limit,
      chainId: chain,
    })
  },

  getNftByTokenId: async (chainId, address, tokenId) => {
    return api.get(
      `${server_uri}/nft/singleNft/${chainId}/${address}/${tokenId}`
    )
  },
  getListedNfts: async (limit, chainId, address, nftStatus, cursor, sort) => {
    return api.post(`${server_uri}/nft/getListedNfts/`, {
      address,
      limit,
      chainId,
      nftStatus,
      cursor,
      sort,
    })
  },
  getBids: async (limit, chainId, cursor) => {
    return api.post(`${server_uri}/nft/getBids/`, {
      limit,
      chainId,
      cursor,
    })
  },
  getSingleListedNft: async (chainId, address, tokenId) => {
    return api.get(
      `${server_uri}/nft/getSingleListedNft/${chainId}/${address}/${tokenId}`
    )
  },
  getLengths: async (limit, chain, address) => {
    return api.post(`${server_uri}/nft/getLengths/`, {
      address,
      limit,
      chainId: chain,
    })
  },
  getAllNfts: (skip, auctionId) =>
    api.get(`${server_uri}/nft/getAllExplore/${skip}/${auctionId}`),
  addLikes: (accessToken, nftId, userAddress) => {
    api.defaults.headers.common["authorization"] = accessToken
    return api.post(`${server_uri}/nft/addLikes`, {
      nftId: nftId,
      userAddress: userAddress,
    })
  },
  removeLike: (accessToken, nftId, userAddress) => {
    api.defaults.headers.common["authorization"] = accessToken
    return api.post(`${server_uri}/nft/removeLike`, {
      nftId: nftId,
      userAddress: userAddress,
    })
  },
  createListing: (nftDetails) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/nft/create-listing`, nftDetails)
  },
  transfer: (nftDetails) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/nft/transfer`, nftDetails)
  },
  nftRanking: (skip, days) => {
    return api.get(`${server_uri}/nft/nftRanking/${days}/${skip}`)
  },
}

// api calls for collections
export const collectionServices = {
  create: (data) =>
    api.post(`${server_uri}/collection/create`, data, {
      headers: {
        authorization: "Bearer " + getCookie("token"),
      },
    }),
  update: (data) =>
    api.post(`${server_uri}/collection/updateCuration`, data, {
      headers: {
        authorization: "Bearer " + getCookie("token"),
      },
    }),
  getAllCollections: (data) =>
    api.post(`${server_uri}/collection/getAllCollections`, data),
  getTrendingCollections: () =>
    api.get(`${server_uri}/nft/getTrendingCollections`),
  getCollectionById: (collectionId) =>
    api.get(`${server_uri}/collection/getCollectionById/${collectionId}`),
  getCollectionInfo: (collectionId) =>
    api.post(`${server_uri}/collection/getCollectionInfo/`, { collectionId }),
  getCollectionNfts: (data) =>
    api.post(`${server_uri}/collection/getCollectionNts/`, data),
  getUserCollections: (data) =>
    api.post(`${server_uri}/collection/getUserCollection`, data, {
      headers: {
        authorization: "Bearer " + getCookie("token"),
      },
    }),
  getUserCollectionsInfo: () =>
    api.get(`${server_uri}/collection/getUserCollectionsInfo`),
  getCollectionByAddress: (
    chainId,
    address,
    limit,
    filter,
    sort,
    skip,
    cursor
  ) =>
    api.post(`${server_uri}/nft/getCollectionByAddress`, {
      address,
      limit,
      chainId,
      filter,
      sort,
      skip,
      cursor,
    }),
  getCollectionMetadata: (chainId, address) =>
    api.post(`${server_uri}/nft/collectionMetadata`, {
      address,
      chainId,
    }),
  getAllActivitiesCollection: (data) =>
    api.post(`${server_uri}/collection/getCollectionActivities/`, data),
  getSearch: (data) => api.post(`${server_uri}/collection/search`, data),
}

// api calls for auctions
export const auctionServices = {
  placeBid: (bidDetails) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/auction/placeBid`, bidDetails)
  },
  buy: (
    nftId,
    endAuctionHash,
    userAddress,
    contractAddress,
    buyer_currency,
    txHash,
    bnbPrice
  ) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/auction/buy`, {
      nftId: nftId,
      endAuctionHash: endAuctionHash,
      userAddress,
      contractAddress,
      buyer_currency,
      txHash,
      bnbPrice,
    })
  },
  getAllExplore: (limit, skip, chain, sort, filter) =>
    api.get(
      `${server_uri}/auction/getAllExplore/${limit}/${skip}/${chain}/${sort}/${filter}`
    ),
  endSaleApi: (nftId, endAuctionHash, bnbPrice, auctionOwner) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/auction/end`, {
      nftId: nftId,
      endAuctionHash: endAuctionHash,
      bnbPrice: bnbPrice,
      auctionOwner: auctionOwner,
    })
  },
  cancelAuction: (nftId, transactionHash) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/auction/cancel`, {
      nftId: nftId,
      transactionHash: transactionHash,
    })
  },
  addViews: (auctionId, nftId) =>
    api.post(`${server_uri}/auction/addView`, {
      auctionId: auctionId,
      nftId: nftId,
    }),
}

// authentication api calls
export const authenticationServices = {
  connectWallet: ({ wallet }) =>
    api.post(`${server_uri}/user/login`, {
      wallet: wallet,
    }),
  logout: ({ accessToken }) => {
    api.defaults.headers.common["authorization"] = accessToken
    return api.delete(`${server_uri}/auth/logout`)
  },
}

// user api calls
export const userServices = {
  getSingleUser: () => {
    return api.get(`${server_uri}/user/get-single-user`, {
      headers: {
        authorization: "Bearer " + getCookie("token"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  },
  getUserById: (data) => {
    return api.post(`${server_uri}/user/get-user-by-id`, data)
  },
  getGlobalSearch: (search) =>
    api.get(`${server_uri}/users/getGlobalSearch/${search}`),
  search: (searchQuery) =>
    api.get(`${server_uri}/users/search?search=${searchQuery}`),
  getSingleUserByAddress: (address) =>
    api.get(`${server_uri}/users/getSingleUserByAddress/${address}`),

  subscribeEmail: (email, subject, content) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/users/subscribeEmail`, {
      email,
      subject,
      content,
    })
  },
  contactUs: (email, content, name, contactNumber) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return api.post(`${server_uri}/users/contact`, {
      email,
      content,
      name,
      contactNumber,
    })
  },
  updateProfile: (details) => {
    return axios.post(`${server_uri}/user/updateUserDetails`, details, {
      headers: {
        authorization: "Bearer " + getCookie("token"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  },
  getArtits: (data) => {
    return axios.post(`${server_uri}/user/getArtists`, data)
  },
}

// api calls for launchpads
export const launchpadServices = {
  applyForLaunchpad: (launchpadDetails) => {
    const token = getCookie("token")
    api.defaults.headers.common["authorization"] = token
    return axios.post(
      `${server_uri}/launchpad/applyForLaunchpad`,
      launchpadDetails,
      {
        headers: {
          authorization: token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
  },
  applyForVerification: (launchpadDetails) => {
    const token = getCookie("token")

    return axios.post(
      `${server_uri}/launchpad/applyForVerification`,
      launchpadDetails,
      {
        headers: {
          authorization: token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
  },
  getActiveLaunchpads: (launchType) =>
    api.get(`${server_uri}/launchpad/getActiveLaunchpads/${launchType}`),
  getLaunchpadById: (launchpadId) =>
    api.get(`${server_uri}/launchpad/getLaunchpadById/${launchpadId}`),
}

// api calls for activities
export const activitiesServices = {
  getAllActivities: (skip, filter, chainId) =>
    api.get(
      `${server_uri}/nft/getAllActivities/${chainId}/${filter}?skip=${skip}`
    ),
}

export class CreateSellService {
  async buyItem(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/buyNft`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async resellItem(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/sellNft`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async endSale(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/endsale`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async release(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/release`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async mintAndSale(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/mint-and-sale`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async cancelRequest(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/cancelsale`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async placeBid(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/placeBid`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async acceptBid(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/acceptBid`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async getNftBids(data) {
    return await axios.post(`${server_uri}/sale/getNftBids`, data)
  }

  async getOrders(data) {
    const token = getCookie("token")
    return axios.post(`${server_uri}/sale/orders`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async getEarnings(data) {
    const token = getCookie("token")
    return axios.post(`${server_uri}/sale/earning`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.bidId
   * @param {string} data.transactionHash
   * @returns
   */
  async cancleBidOnNft(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/cancelBid`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.nftId
   * @param {string} data.reason
   * @param {string} data.transactionHash
   * @returns
   */
  async registerDispute(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/sale/registerDispute`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }
}

export class CreateNftServices {
  async createBasicDetails(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/create-basic-details`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async createAdvancedDetails(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/add-advanced-details`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async createSellerDetails(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/add-shipment-details`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async mintAndSale(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/mint-and-sale`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.nftId
   * @returns
   */
  async removeFromDb(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/delete`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async editNft(data) {
    const token = getCookie("token")
    return await axios.post(`${server_uri}/nft/editNft`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }
}

export class NftServices {
  constructor() {
    this.token = getCookie("token")
  }

  async deleteNftDb(data) {
    return axios.post(`${server_uri}/nft/delete`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getNftByUserId(data) {
    return axios.post(`${server_uri}/nft/getNftByUserId`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getNftMintedByUser(data) {
    return axios.post(`${server_uri}/nft/getNftMintedByUser`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getNftById(id) {
    return axios.get(`${server_uri}/nft/getNftById/${id}`)
  }

  async getAllNfts(data) {
    return axios.post(`${server_uri}/nft/getAll`, data,{
      
        headers: {
          authorization: "Bearer " + this.token,
        }
    })
  }

  async addView(data) {
    return axios.post(`${server_uri}/nft/add-view`,data)
  }

  async getNftOfUser(data) {
    return axios.post(`${server_uri}/nft/getNftByUser`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }
}

export class CategoryService {
  constructor() {
    this.token = getCookie("token")
  }

  async getAllCategories(skip, limit) {
    return await axios.get(
      `${server_uri}/category/getAllCategories/${skip}/${limit}`
    )
  }
}

export class FavoriteService {
  constructor() {
    this.token = getCookie("token")
  }

  async handleLikeArtists(data) {
    return await axios.post(`${server_uri}/favorite/likeArtist/`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async handleLikeNfts(data) {
    return await axios.post(`${server_uri}/favorite/likeNft/`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async handleLikeCollections(data) {
    return await axios.post(`${server_uri}/favorite/likeCollection/`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getUserLikedNfts(data) {
    return await axios.post(`${server_uri}/favorite/userLikedNft/`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getUserLikedArtits(data) {
    return await axios.post(`${server_uri}/favorite/userLikedArtists/`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    })
  }

  async getUserLikedCollections(data) {
    return await axios.post(
      `${server_uri}/favorite/userLikedCollection/`,
      data,
      {
        headers: {
          authorization: "Bearer " + this.token,
        },
      }
    )
  }

  async getCollectionTotalLikes(data) {
    return await axios.post(
      `${server_uri}/favorite/totalLikedCollection/`,
      data
    )
  }

  async getNftTotalLikes(data) {
    return await axios.post(`${server_uri}/favorite/totalLikedNfts/`, data)
  }

  async getArtitsTotalLikes(data) {
    return await axios.post(`${server_uri}/favorite/totalLikedArtist/`, data)
  }

  async getUserReactionToArtist(data) {
    return await axios.post(
      `${server_uri}/favorite/getUserReactionToArtist/`,
      data,
      {
        headers: {
          authorization: "Bearer " + this.token,
        },
      }
    )
  }

  async getUserReactionToNft(data) {
    return await axios.post(
      `${server_uri}/favorite/getUserReactionToNft/`,
      data,
      {
        headers: {
          authorization: "Bearer " + this.token,
        },
      }
    )
  }

  async getUserReactionToCollection(data) {
    return await axios.post(
      `${server_uri}/favorite/getUserReactionToCollection/`,
      data,
      {
        headers: {
          authorization: "Bearer " + this.token,
        },
      }
    )
  }
}

export const getAllNftActivitys = async (data) => {
  return await axios.post(`${server_uri}/nft/getAllNftActivity`, data)
}

export const getAllUsersActivity = async () => {
  return await axios.get(`${server_uri}/user/getAllUsersActivity`, {
    headers: {
      authorization: "Bearer " + getCookie("token"),
    },
  })
}

export const getMedia = async () => {
  const res = await axios.get(`${server_uri}/homepage/get-media`)
  return res.data.media
}

export const getSections = async () => {
  const res = await axios.get(`${server_uri}/homepage/get-sections`)
  return res.data
}

export const getPrice = async(payload) => {
  const price = await axios.post(`${server_uri}/nft/matic-to-dolor`,payload)
  return price
}