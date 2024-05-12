import { useEffect, useRef, useState } from "react"
import Category from "../../components/Dashboard/Filters/Category"
import Footer from "../../components/Footer/Footer"
import { useAccount } from "wagmi"
import * as bootstrap from "bootstrap"
import { City, Country, State } from "country-state-city"
import _ from "lodash"
import { useNavigate, useParams } from "react-router-dom"
import {
  CategoryService,
  CreateNftServices,
  CreateSellService,
  FavoriteService,
  NftServices,
  getAllNftActivitys,
  getPrice,
} from "../../services/supplier"
import { getCookie } from "../../utils/cookie"
import {
  acceptBid,
  burnItem,
  buyItem,
  cancleBid,
  endSale,
  getEventArray,
  getEventValue,
  getMarketPlaceFee,
  getTreasury,
  handleCopyClick,
  listNft,
  placeBid,
  placeBidOnSale,
  purchaseUnmintedNft,
  putCancelRequest,
  releaseEscrow,
  releaseTime,
  requestEscrowRelease,
  resell,
  trimString,
} from "../../utils/helpers"
import {
  numberValidator,
  strDoesExist,
  validateEmail,
} from "../../utils/validators"
import MainSearch from "../../components/Dashboard/Search/MainSearch"
import { contractAddress, explorer, network } from "../../utils/config"

/**
 * MyComponent functional component.
 * @component
 */
function NFTDetails() {
  const [type, setType] = useState("buy")
  const [nft, setNft] = useState()
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [createNftStep2SplitInput, setCreateNftStep2SplitInput] = useState()
  const { id } = useParams()
  const { address } = useAccount()
  const nftService = new NftServices()
  const createNftServices = new CreateNftServices()
  const navigate = useNavigate()
  const [open, setOpen] = useState({
    country: false,
    state: false,
    city: false,
  })
  const [errorCuration, setErrorCuration] = useState([])
  const [shippingAddress, setShippingAddress] = useState({
    country: "",
    state: "",
    city: "",
    line1: "",
    line2: "",
    postalCode: "",
  })
  const [discription, setDiscription] = useState("")
  const [phoneNumber, setPhoneNumber] = useState()
  const [price, setPrice] = useState()
  const [contactInfo, setContractInfo] = useState()
  const [concent, setConcent] = useState()
  const [agree, setAgree] = useState(true)
  const [request, setRequest] = useState()
  const [discriptionImage, setDiscriptionImage] = useState([])
  const [numberOfInputs, setNumberOfInputs] = useState(1)
  const discriptionImageRef = useRef()
  const [nftAcitvity, setActivity] = useState([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [now, setNow] = useState(false)
  const [messageSlice, setMessageSlice] = useState(true)
  const [descriptionSlice, setDescriptionSlice] = useState(true)
  const [bids, setBids] = useState([])
  const countries = Country.getAllCountries()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [countryCode, setCountryCode] = useState("")
  const [user, setUser] = useState()
  const [fee, setFee] = useState(0)
  const [dolorPrice, setDolorPrice] = useState(0)
  const [category, setCategory] = useState()
  const [categories, setCategories] = useState([])
  const [createNftStep1Attachments, setCreateNftStep1Attachments] = useState([])
  const [views, setViews] = useState(0)
  /**
   * The state variable representing some value.
   * @type {'buy' | 'bid'}
   * @default 'buy'
   */
  const [txType, setTxType] = useState("buy")
  const favoriteService = new FavoriteService()
  const step1AttachmentRef = useRef(null)
  const handleChangeStep1Attachment = i => {
    const tempArr = [...createNftStep1Attachments]
    tempArr.splice(i, 1)

    setCreateNftStep1Attachments([...tempArr])
  }

  const fetchCategories = async () => {
    try {
      const categoryService = new CategoryService()
      const {
        data: { categories },
      } = await categoryService.getAllCategories(0, 0)
      setCategories(categories)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateValuesStep2Split = e => {
    const { name, value } = e.target
    setCreateNftStep2SplitInput({
      ...createNftStep2SplitInput,
      [name]: value,
    })
  }

  const getFee = async () => {
    try {
      const fee = await getMarketPlaceFee()
      setFee(Number(fee) / 100)
    } catch (error) {
      console.log({ error })
    }
  }

  const handleView = async () => {
    try {
      const previosIpAddress = localStorage.getItem("ipAddress")
      const {
        data: { views, ipAddress },
      } = await nftService.addView({ nftId: id, ip: previosIpAddress })
      console.log({ ipAddress, views }, "rlafh")
      localStorage.setItem("ipAddress", ipAddress)
      setViews(views)
    } catch (error) {
      console.log({ error })
    }
  }
  useEffect(() => {
    getFee()
    fetchCategories()
    handleView()
  }, [])

  const validateDataBuyBid = () => {
    const tempArr = []
    if (txType === "bid" && (!price || price <= 0))
      tempArr.push("Price cannot be less than or equal to zero")
    strDoesExist("Name", name, tempArr)
    validateEmail("Email", email, tempArr)
    strDoesExist("Country", JSON.parse(shippingAddress.country).name, tempArr)
    strDoesExist("Address 1", shippingAddress.line1, tempArr)
    strDoesExist("State", JSON.parse(shippingAddress.state).name, tempArr)
    strDoesExist("City", shippingAddress.city, tempArr)
    // numberValidator(
    //   "Postal Code",
    //   shippingAddress.postalCode,
    //   tempArr,
    //   "postal",
    // );
    // numberValidator("Phone", phoneNumber, tempArr, "phone");
    if (tempArr.length > 0) {
      setErrorCuration([...tempArr])
      return false
    }
    return true
  }

  /**
   *
   * @param {import("react").ChangeEvent<HTMLSelectElement>} e
   */
  const handleUpdateShippingAddress = e => {
    const { name, value } = e.target
    if (name === "country") {
      const parsedVal = JSON.parse(value)
      const countryStates = State.getStatesOfCountry(parsedVal.isoCode)
      setStates(countryStates)
      setCountryCode(parsedVal.isoCode)
    } else if (name === "state") {
      const parsedVal = JSON.parse(value)
      const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode)
      setCities(stateCities)
    }
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    })
  }

  const getNftInfo = async () => {
    try {
      const {
        data: { nft },
      } = await nftService.getNftById(id)
      setNft(nft)
      setDiscription(nft?.description)
      setCreateNftStep1Attachments(nft?.attachments)
      console.log(nft?.category?.name, "name")
      setCategory(nft?.category?.name)
      const user = getCookie("user")
      user && setUser(JSON.parse(user))
      if (nft?.owner?.wallet?.toLowerCase() === address?.toLowerCase()) {
        if (
          nft?.saleId?.saleStatus === "Sold" ||
          nft?.saleId?.saleStatus === "Cancelled" ||
          nft?.saleId?.saleStatus === "NotForSale"
        )
          setType("resell")
        else if (nft?.saleId?.saleStatus === "CancellationRequested")
          setType("CancelRequested")
        else if (nft?.saleId?.saleStatus === "Ordered") {
          const purchaseDate = new Date(nft?.saleId?.ItemPurchasedOn).getTime()
          const time = await releaseTime()
          if (purchaseDate + time <= new Date().getTime())
            setType("EscrowReleaseRequest")
          else setType("inEscrow")
        } else {
          setType("remove")
        }
      } else {
        if (
          nft?.saleId?.saleStatus === "Sold" ||
          nft?.saleId?.saleStatus === "Cancelled" ||
          nft?.saleId?.saleStatus === "NotForSale"
        )
          setType("bid")
        else if (
          nft?.saleId?.saleStatus === "CancellationRequested" ||
          nft?.saleId?.saleStatus === "Ordered"
        ) {
          if (nft?.saleId?.saleWinner === JSON.parse(user)?._id)
            setType("release")
          else setType("NotForSale")
        } else if (nft?.saleId?.saleStatus === "Active") setType("buy")
        else setType("bid")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleModel7 = () => {
    try {
      const isValid = validateDataBuyBid()
      const errElem = new bootstrap.Modal(
        document.getElementById("errorCreatingCurationModal")
      )
      if (!isValid) return errElem.show()
      const elemPrent = new bootstrap.Modal(
        document.getElementById("exampleModalToggle6")
      )
      const elem = new bootstrap.Modal(
        document.getElementById("exampleModalToggl7")
      )
      elemPrent.hide()
      elem.show()
    } catch (error) {
      console.log(error)
    }
  }

  const buyNft = async () => {
    try {
      if (!agree) throw new Error("Please agree to terms")
      const { transactionHash } = await buyItem(nft.tokenId, address)
      const data = {
        nftId: id,
        name,
        email,
        country: JSON.parse(shippingAddress.country).name,
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: JSON.parse(shippingAddress.state).name,
          postalCode: shippingAddress.postalCode,
        },
        phoneNumber,
        contactInformation: contactInfo,
        concent,
        buyHash: transactionHash,
      }
      const saleService = new CreateSellService()
      await saleService.buyItem(data)
      const element1 = new bootstrap.Modal(
        document.getElementById("exampleModalToggl9")
      )
      element1.show()
    } catch (error) {
      console.log({ error })
    }
  }

  const removeFromSale = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl11")
    )
    try {
      element1.show()
      let result
      if (nft?.minted) result = await endSale(nft?.tokenId, address)
      const saleService = new CreateSellService()
      const data = {
        nftId: nft._id,
        endsaleHash: result?.transactionHash,
      }
      await saleService.endSale(data)
      await getNftInfo()
      setTimeout(() => {
        element1.hide()
      }, 1000)
    } catch (error) {
      element1.hide()
      console.log({ error })
    }
  }

  const cancelRequest = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl5")
    )
    const elem = new bootstrap.Modal(
      document.getElementById("exampleModalToggl11")
    )
    elem.show()
    try {
      const formData = new FormData()
      formData.append("nftId", nft?._id)
      formData.append("request", request)
      for (const file of discriptionImage) {
        formData.append("files", file)
      }
      const { transactionHash } = await putCancelRequest(
        nft?.tokenId,
        request,
        address
      )
      formData.append("transactionHash", transactionHash)
      const saleService = new CreateSellService()
      await saleService.cancelRequest(formData)
      await getNftInfo()
      elem.hide()
      setTimeout(() => {
        element1.hide()
      }, 1000)
    } catch (error) {
      elem.hide()
      element1.hide()
      console.log({ error })
    }
  }

  const purchase = async () => {
    if (nft?.minted) await buyNft()
    else await purchaseUnminted()
  }

  const reSellNft = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl5")
    )
    element1.show()
    try {
      if (!agree) throw new Error("Please agree to terms")
      const { transactionHash } = await resell(nft.tokenId, price, address)
      const data = {
        nftId: id,
        name,
        email,
        country: JSON.parse(shippingAddress.country).name,
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: JSON.parse(shippingAddress.state).name,
          postalCode: shippingAddress.postalCode,
        },
        phoneNumber,
        contactInformation: contactInfo,
        concent,
        saleHash: transactionHash,
        price,
      }
      const saleService = new CreateSellService()
      await saleService.resellItem(data)
      await getNftInfo()
      setTimeout(() => {
        element1.hide()
      }, 1000)
    } catch (error) {
      element1.hide()
      console.log({ error })
    }
  }

  const purchaseUnminted = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl9")
    )
    try {
      const createNftServices = new CreateNftServices()
      let splitPayments = []
      splitPayments =
        nft?.walletAddresses?.length > 0
          ? nft?.walletAddresses[0].percentage
            ? nft?.walletAddresses?.map(item => ({
              paymentWallet: item.address,
              paymentPercentage: item.percentage,
            }))
            : []
          : []
      const result = await purchaseUnmintedNft(
        nft?.uri,
        nft?.price,
        nft?.owner?.wallet,
        address,
        nft?.royalty ? nft.royalty : 0,
        splitPayments
      )
      const data = {
        nftId: id,
        name,
        email,
        country: JSON.parse(shippingAddress.country).name,
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: JSON.parse(shippingAddress.state).name,
          postalCode: shippingAddress.postalCode,
        },
        phoneNumber,
        contactInformation: contactInfo,
        concent,
        buyHash: result?.transactionHash,
      }
      const saleService = new CreateSellService()
      const mintLogs = getEventValue(result.logs, "AssetTokenized")
      await createNftServices.mintAndSale({
        nftId: nft?._id,
        mintHash: result.transactionHash,
        tokenId: Number(mintLogs.tokenId),
      })
      await saleService.buyItem(data)
      setTimeout(() => {
        element1.hide()
      }, 1000)
    } catch (error) {
      element1.hide()
      throw new Error(error)
    }
  }

  const release = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl12")
    )
    const elemFin = new bootstrap.Modal(
      document.getElementById("exampleModalToggl11Success")
    )
    element1.show()
    try {
      const user = JSON.parse(getCookie("user"))
      const { logs, transactionHash } = await releaseEscrow(nft?.tokenId, address)
      console.log("logs are---->", logs);
      let eventRoyaltyReceived = getEventArray(logs, "RoyaltyReceived")
      let eventPaymentSplitReceived = getEventArray(
        logs,
        "PaymentSplitReceived"
      )
      let escrowReleasedReceived = getEventArray(logs, "EscrowReleased")
      let feeReceived = getEventArray(logs, "FeeReceived")
      const newArr = [
        ...eventRoyaltyReceived,
        ...eventPaymentSplitReceived,
        ...escrowReleasedReceived,
        ...feeReceived,
      ]
      let states = []
      for (const arr of newArr) {
        if (
          arr.eventName === "RoyaltyReceived" &&
          Number(arr?.args?.royaltyAmount) !== 0
        ) {
          const data = {
            nftId: nft?._id,
            state: "Royalty Received",
            from: user?._id,
            toWallet: arr?.args?.wallet,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.royaltyAmount) / Math.pow(10, 18),
          }
          states.push(data)
        }
        if (
          arr.eventName === "PaymentSplitReceived" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const data = {
            nftId: nft?._id,
            state: "Payment Received",
            from: user?._id,
            toWallet: arr?.args?.wallet,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.feeAmount) / Math.pow(10, 18),
          }
          states.push(data)
        }
        if (
          arr.eventName === "EscrowReleased" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const data = {
            nftId: nft?._id,
            state: "Escrow Payment Received",
            from: user?._id,
            toWallet: arr?.args?.seller,
            date: new Date(),
            to: nft?.owner,
            actionHash: transactionHash,
            price: Number(arr?.args?.amount) / Math.pow(10, 18),
          }
          states.push(data)
        }
        if (
          arr.eventName === "FeeReceived" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const treasury = await getTreasury()
          const data = {
            nftId: nft?._id,
            state: "Fee Received",
            from: user?._id,
            toWallet: treasury,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.feeAmount) / Math.pow(10, 18),
          }
          states.push(data)
        }
      }
      const saleService = new CreateSellService()
      const data = {
        nftId: id,
        releaseHash: transactionHash,
        states,
      }
      await saleService.release(data)
      await getNftInfo()
      element1.hide()
      elemFin.show()
    } catch (error) {
      element1.hide()
    }
  }

  const bidAPlace = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl122")
    )
    try {
      let result
      let tokenLogs
      if (nft?.minted) {
        result = await placeBidOnSale(nft?.tokenId, price, address)
      } else {
        let splitPayments = []
        splitPayments =
          nft?.walletAddresses?.length > 0
            ? nft?.walletAddresses[0].percentage
              ? nft?.walletAddresses?.map(item => ({
                paymentWallet: item.address,
                paymentPercentage: item.percentage,
              }))
              : []
            : []
        result = await placeBid(
          nft?.uri,
          price,
          nft?.price,
          nft?.owner?.wallet,
          address,
          nft?.royalty ? nft?.royalty : 0,
          splitPayments
        )
        tokenLogs = getEventValue(result.logs, "AssetTokenized")
        const createNftServices = new CreateNftServices()
        await createNftServices.mintAndSale({
          nftId: nft?._id,
          mintHash: result.transactionHash,
          tokenId: Number(tokenLogs.tokenId),
        })
      }
      const logs = getEventValue(result.logs, "BidPlaced")
      const saleService = new CreateSellService()
      const data = {
        nftId: id,
        name,
        email,
        country: JSON.parse(shippingAddress.country).name,
        address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: JSON.parse(shippingAddress.state).name,
          postalCode: shippingAddress.postalCode,
        },
        phoneNumber,
        contactInformation: contactInfo,
        concent,
        bidHash: result.transactionHash,
        bidValue: price,
        bidId: Number(logs.bidId),
        tokenId: Number(tokenLogs?.tokenId),
      }
      await saleService.placeBid(data)
      await getNftInfo()
      await getBids()
      element1.hide()
    } catch (error) {
      console.log({ error })
      element1.hide()
    }
  }

  const handleTxCall = async () => {
    try {
      if (txType === "buy") await purchase()
      else await bidAPlace()
    } catch (err) {
      console.log(err)
    }
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  const acceptBidByOwner = async bid => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl9")
    )
    try {
      const { transactionHash } = await acceptBid(
        nft?.tokenId,
        bid?.bidId,
        address
      )
      const saleService = new CreateSellService()
      const data = {
        nftId: id,
        bidId: bid._id,
        transactionHash,
      }
      await saleService.acceptBid(data)
      await getNftInfo()
      await getBids()
      element1.show()
    } catch (error) {
      element1.hide()
    }
  }

  const cancelBidByOwner = async bid => {
    const element = new bootstrap.Modal(
      document.getElementById("exampleModalTogglCancelBid")
    )
    try {
      element.show()
      const { transactionHash } = await cancleBid(bid.bidId, address)
      const data = {
        bidId: bid._id,
        transactionHash,
      }
      const createSellService = new CreateSellService()
      await createSellService.cancleBidOnNft(data)
      await getNftInfo()
      await getBids()
      element.hide()
    } catch (error) {
      console.log({ error })
      element.hide()
    }
  }

  const putOnSale = async () => {
    if (nft?.minted) await reSellNft()
    else await handleMint()
  }

  const handleMint = async () => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl5")
    )
    try {
      let splitPayments = []
      splitPayments =
        nft?.walletAddresses?.length > 0
          ? nft?.paymentPercentage
            ? nft?.walletAddresses?.map(item => ({
              paymentWallet: item.address,
              paymentPercentage: item.percentage,
            }))
            : []
          : []
      const result = await listNft(
        nft?.uri,
        price,
        nft?.royalties ? nft.royalty : 0,
        splitPayments,
        address
      )
      const mintLogs = getEventValue(result.logs, "AssetTokenized")
      const createNftServices = new CreateNftServices()
      await createNftServices.mintAndSale({
        nftId: nft?._id,
        mintHash: result.transactionHash,
        tokenId: Number(mintLogs.tokenId),
      })
      setTimeout(() => {
        element1.hide()
      }, 1000)
    } catch (error) {
      element1.hide()
      console.log(error)
    }
  }

  const getAllNftActivity = async id => {
    try {
      const {
        data: { data },
      } = await getAllNftActivitys({ nftId: id })
      setActivity(data)
    } catch (error) {
      console.log(error)
    }
  }

  const work = async () => {
    await getNftInfo()
    await getAllNftActivity(id)
  }

  const getBids = async () => {
    try {
      const createSellService = new CreateSellService()
      const {
        data: { bids },
      } = await createSellService.getNftBids({ nftId: id })
      setBids(bids)
    } catch (error) {
      console.log(error)
    }
  }

  const editNft = async () => {
    const element = new bootstrap.Modal(
      document.getElementById("editNftToggel")
    )
    const editElement = new bootstrap.Modal(
      document.getElementById("editNftInProgress")
    )
    try {
      editElement.show()
      const formData = new FormData()
      formData.append("nftId", id)
      formData.append("description", discription)
      formData.append("category", category)
      for (const file of createNftStep1Attachments) {
        formData.append("files", file)
      }
      await createNftServices.editNft(formData)
      await work()
      editElement.hide()
      element.show()
      // setTimeout(() => {
      //   element.hide()
      // },[1000])
    } catch (error) {
      editElement.hide()
      element.hide()
      console.log(error)
    }
  }

  useEffect(() => {
    work()
    getBids()
  }, [])

  const getArtitsLikes = async () => {
    try {
      const {
        data: { totalLikedNfts },
      } = await favoriteService.getNftTotalLikes({ nftId: nft?._id })
      const {
        data: { favorite },
      } = await favoriteService.getUserReactionToNft({ nftId: nft?._id })
      setLikes(totalLikedNfts)
      setLiked(favorite)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getArtitsLikes()
  }, [nft])

  const handleLike = async () => {
    try {
      setLiked(!liked)
      if (!liked === true) setLikes(likes + 1)
      else if (!liked === false) setLikes(likes - 1)
      setNow(true)
    } catch (error) {
      console.log(error)
    }
  }

  const setMyLike = async () => {
    try {
      await favoriteService.handleLikeNfts({ nftId: nft?._id })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (now === true) setMyLike()
  }, [liked])

  const handleMessage = () => {
    setMessageSlice(!messageSlice)
  }

  const handleDescription = () => {
    setDescriptionSlice(!descriptionSlice)
  }

  const releseEscrowRequest = async () => {
    const elemFin = new bootstrap.Modal(
      document.getElementById("exampleModalToggl11Success")
    )
    try {
      const { transactionHash } = await requestEscrowRelease(
        nft?.tokenId,
        request,
        address
      )
      const data = {
        nftId: nft?._id,
        reason: request,
        transactionHash,
      }
      const sellServices = new CreateSellService()
      await sellServices.registerDispute(data)
      elemFin.show()
    } catch (error) {
      elemFin.hide()
    }
  }

  const burnNFt = async () => {
    try {
      if (nft?.minted === true) {
        await burnItem(nft?.tokenId, address)
      }
      const nftService = new NftServices()
      await nftService.deleteNftDb({ nftId: nft?._id })
      cancleBurn()
      setTimeout(() => {
        navigate("/dashboard?appreciate")
      }, 500)
    } catch (error) {
      console.log({ error })
    }
  }

  const cancleBurn = () => {
    const elemFin = new bootstrap.Modal(
      document.getElementById("exampleModalToggle2")
    )
    elemFin.hide()
  }

  const getData = async () => {
    try {
      const data={amount:nft?.price}
      const price = await getPrice(data)
      setDolorPrice(price)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [nft])

  return (
    <>
      <div className="main__area">
        <div className="mobile__menu none__desk">
          <div className="header__right__blk">
            <div className="main__menu">
              <nav className="accordion">
                <ul>
                  <li>
                    <a href="#">Appreciation</a>
                  </li>
                  <li>
                    <a href="#">Artist</a>
                  </li>
                  <li>
                    <a href="#">Curation</a>
                  </li>
                  <li>
                    <a
                      href="https://artistvaultx.wpcomstaging.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Magazine
                    </a>
                  </li>
                  <li>
                    <a href="#">How to work</a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="nft__header__btn">
              <a href="#" className="common__btn common_border__btn">
                Create RWA
              </a>
              <a href="#" className="common__btn">
                Sign In
              </a>
            </div>
          </div>
          <div className="close__menu">
            <i className="fa-solid fa-xmark" />
          </div>
        </div>
        <div className="overlay none__desk" />
        {/* =================== HEADER AREA START ===================== */}
        <header className="header__area">
          <div className="container">
            <div className="header__inner__blk">
              <div className="header__logo">
                <span onClick={() => navigate("/dashboard")}>
                  <img src="../../assets/img/brand.svg" alt="" />
                </span>
              </div>
              <div className="header__right__blk none__phone">
                <div className="main__menu">
                  <nav>
                    <ul>
                      <li className="active">
                        <a
                          href="#"
                          onClick={() => navigate("/dashboard?appreciate")}
                        >
                          Appreciation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={() => navigate("/dashboard?artist")}
                        >
                          Artist
                        </a>
                      </li>
                      <li>
                        <a
                          href="/dashboard?curation"
                          onClick={() => navigate("/dashboard?curation")}
                        >
                          Curation
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://artistvaultx.wpcomstaging.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Magazine
                        </a>
                      </li>
                      <li>
                        <a href="#">How to work</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="nft__header__btn">
                  <a href="#" className="common__btn common_border__btn">
                    Create RWA
                  </a>
                  <MainSearch py={"!py-0"} />
                </div>
              </div>
              <div className="open__menu none__desk">
                <i className="fa-solid fa-bars" />
              </div>
            </div>
          </div>
        </header>
        {/* =================== HEADER AREA END ===================== */}
        {/* =================== NFT DETAIL HERO AREA START ===================== */}
        <section className="nft__detail__hero__area">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="nft__detail__thumb__blk">
                  <img
                    src={nft?.cloudinaryUrl}
                    className="!aspect-square"
                    alt=""
                  />
                  <div className="nft__heart__blk">
                    <div className="nft__compas">
                      {/* <a href="#">
                        <img src="../assets/img/MATIC.png" alt="" />
                      </a> */}
                    </div>
                    <div className="heart__area">
                      <span>{likes}</span>
                      <div
                        className="con-like love_border_white"
                        onClick={() => handleLike()}
                      >
                        <input
                          title="like"
                          type="checkbox"
                          className="like"
                          checked={liked}
                        />
                        <div className="checkmark">
                          <svg
                            viewBox="0 0 24 24"
                            className="outlineIcon"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                          </svg>
                          <svg
                            viewBox="0 0 24 24"
                            className="filled"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                          </svg>
                          <svg
                            className="celebrate"
                            width={100}
                            height={100}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polygon points="10,10 20,20" className="poly" />
                            <polygon points="10,50 20,50" className="poly" />
                            <polygon points="20,80 30,70" className="poly" />
                            <polygon points="90,10 80,20" className="poly" />
                            <polygon points="90,50 80,50" className="poly" />
                            <polygon points="80,80 70,70" className="poly" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="nft_ico">
                    <img src="../../assets/img/nfc-icon.svg" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="nft__contect__blk">
                  <div className="nft__edit__blk">
                    <div className="nft__share__ico">
                      <a
                        href="#"
                        onClick={() => handleCopyClick(window.location.href)}
                      >
                        <img src="../../assets/img/nft_share.svg" alt="" />
                      </a>
                    </div>
                    <div className="nft__edit__ico">
                      {nft?.owner?.wallet?.toLowerCase() ===
                        address?.toLowerCase() && (
                        <a
                          data-toggle="dropdown"
                          aria-expanded="false"
                          href="#"
                        >
                          <img src="../../assets/img/nft_edit.svg" alt="" />
                        </a>
                      )}
                      <ul className="dropdown-menu dropdown-menu-end similar__dropdown">
                        <li>
                          <a
                            className="dropdown-item"
                            data-bs-target="#exampleModalToggle3"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                            href="#"
                          >
                            Edit NFT
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            href="#exampleModalToggle"
                            role="button"
                          >
                            Transfer Token
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            data-bs-target="#exampleModalToggle2"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                          >
                            Burn Token
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="theme__title">
                    <h4>{nft?.name}</h4>
                  </div>
                  <div className="nft__profile">
                    <div className="single__nft__profile">
                      <a href="#">
                        <div className="nft__profile__thumb">
                          <img
                            src={
                              nft?.owner?.avatar?.url
                                ? nft?.owner?.avatar?.url
                                : "../../assets/img/themes_img_1.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="nft__profile__text">
                          <p>Owned by:</p>
                          <h6>
                            {nft?.owner?.username
                              ? nft?.owner?.username
                              : trimString(nft?.owner?.wallet)}
                          </h6>
                        </div>
                      </a>
                    </div>
                    <div className="single__nft__profile">
                      <a href="#">
                        <div className="nft__profile__thumb">
                          <img
                            src={
                              nft?.mintedBy?.avatar?.url
                                ? nft?.mintedBy?.avatar?.url
                                : "../../assets/img/themes_img_2.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="nft__profile__text">
                          <p className="text-[12px]">Created by:</p>
                          <h6>
                            {nft?.mintedBy?.username
                              ? nft?.mintedBy?.username
                              : trimString(nft?.mintedBy?.wallet)}
                          </h6>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="nft__profile__activities__btn">
                    <a href="#">
                      <span>
                        <img src="../../assets/img/eye.svg" alt="" />
                      </span>{" "}
                      {views} view
                    </a>
                    {likes && (
                      <a href="#">
                        <span>
                          <img src="../../assets/img/heart.svg" alt="" />
                        </span>{" "}
                        {likes} favorites
                      </a>
                    )}
                    {nft?.category?.name && (
                      <a href="#" className=" min-w-20 ">
                        <span>
                          <img src="../../assets/img/subscription.svg" alt="" />
                        </span>{" "}
                        {nft?.category?.name}
                      </a>
                    )}
                  </div>
                  <div className="current__price__area">
                    <div className="current__price__title">
                      <p>Current price</p>
                    </div>
                    <div className="current__price__blk">
                      <div className="current__price__text">
                        <h4>
                          {nft?.price} MATIC{" "}
                          <span>${(nft?.price * dolorPrice).toFixed(2)}</span>
                        </h4>
                      </div>
                      <div className="sale__btn">
                        {type === "buy" ? (
                          <div className="ntf__flex__column">
                            <a
                              className="common__btn common_border__btn"
                              data-bs-toggle="modal"
                              href="#exampleModalToggle6"
                              role="button"
                              onClick={() => setTxType("buy")}
                            >
                              Buy Now
                            </a>
                            <a
                              className="common__btn common_border__btn"
                              data-bs-toggle="modal"
                              href="#placeBidInitialDialog"
                              role="button"
                              // onClick={bidPlace}
                              onClick={() => setTxType("bid")}
                            >
                              Bid
                            </a>
                          </div>
                        ) : type === "release" ? (
                          <div className="sale__btn">
                            <a
                              className="common__btn common_border__btn"
                              // data-bs-toggle="modal"
                              // href="#escrowCancelModal"
                              onClick={release}
                            >
                              Release Escrow
                            </a>
                            <div className="order_btn">
                              <a
                                data-bs-toggle="modal"
                                href="#exampleModalToggle10"
                                role="button"
                              >
                                Cancel Order
                              </a>
                            </div>
                          </div>
                        ) : type === "resell" ? (
                          <a
                            className="common__btn common_border__btn"
                            data-bs-toggle="modal"
                            href="#putOnSaleInitialDialog"
                            role="button"
                          >
                            Put On Sale
                          </a>
                        ) : type === "remove" ? (
                          <a
                            className="common__btn common_border__btn"
                            // data-bs-toggle="modal"
                            // href="#exampleModalToggle4"
                            role="button"
                            onClick={removeFromSale}
                          >
                            Remove From Sale
                          </a>
                        ) : type === "bid" ? (
                          <a
                            className="common__btn common_border__btn"
                            data-bs-toggle="modal"
                            href="#placeBidInitialDialog"
                            role="button"
                            // onClick={bidPlace}
                            onClick={() => setTxType("bid")}
                          >
                            Bid
                          </a>
                        ) : type === "CancelRequested" ? (
                          <a
                            className="common__btn common_border__btn"
                            // data-bs-toggle="modal"
                            // href="#exampleModalToggle4"
                            role="button"
                          >
                            Cancel Requested
                          </a>
                        ) : type === "EscrowReleaseRequest" ? (
                          <a
                            className="common__btn common_border__btn"
                            data-bs-toggle="modal"
                            href="#escrowCancelModal"
                            role="button"
                          >
                            Escrow Release Request
                          </a>
                        ) : (
                          <a
                            className="common__btn common_border__btn"
                            // data-bs-toggle="modal"
                            // href="#exampleModalToggle4"
                            role="button"
                          >
                            In Escrow
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="over__view__area">
                    <div className="overview__title">
                      <h5>Overview</h5>
                    </div>
                    <div className="over__view__flex">
                      <div className="overview__left__blk">
                        <div className="overview__similar__text">
                          <h5>Overview</h5>
                          <p>{nft?.saleId?.sellerShippingId?.name}</p>
                        </div>
                        <div className="overview__similar__text mt-3">
                          <h5>Shipping Country</h5>
                          <p>{nft?.saleId?.sellerShippingId?.country}</p>
                        </div>
                      </div>
                      {(nft?.shippingInformation?.lengths ||
                        nft?.shippingInformation?.height ||
                        nft?.shippingInformation?.width ||
                        nft?.shippingInformation?.weight) && (
                        <div className="overview__right__blk">
                          <div className="overview__similar__text">
                            <h5>Size</h5>
                            {nft?.shippingInformation?.lengths && (
                              <p>
                                <small>Length</small> <span>:</span>{" "}
                                {nft?.shippingInformation?.lengths}cm
                              </p>
                            )}
                            {nft?.shippingInformation?.height && (
                              <p>
                                <small>Height</small> <span>:</span>{" "}
                                {nft?.shippingInformation?.height}cm
                              </p>
                            )}
                            {nft?.shippingInformation?.width && (
                              <p>
                                <small>Width</small> <span>:</span>{" "}
                                {nft?.shippingInformation?.width}cm
                              </p>
                            )}
                            {nft?.shippingInformation?.weight && (
                              <p>
                                <small>Weight</small> <span>:</span>{" "}
                                {nft?.shippingInformation?.weight}kg
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nft__thumb__area">
              <div className="row g-3">
                {nft?.attachments.map((item) => (
                  <div className="col-2">
                    <div className="single__nft__thumb">
                      <img src={item} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="description__similar__blk">
              <div className="description__title__blk">
                <div className="description__title">
                  <h4>
                    <span>
                      <img src="../../assets/img/description_ico.svg" alt="" />
                    </span>{" "}
                    Description
                  </h4>
                </div>
                <div className="description__angle__down">
                  <span>
                    <img src="../../assets/img/angle_down.svg" alt="" />
                  </span>
                </div>
              </div>
              <div className="description__content">
                {descriptionSlice ? (
                  nft?.description?.length > 400 ? (
                    <div className="inline">
                      <p className="inline">
                        {nft?.description?.slice(0, 400)}
                      </p>
                      <span
                        className="text-themeYellow font-manrope cursor-pointer inline"
                        onClick={handleDescription}
                      >
                        {" "}
                        ... {!descriptionSlice ? "" : "see more"}
                      </span>
                    </div>
                  ) : (
                    <p>{nft?.description}</p>
                  )
                ) : (
                  <div className="inline">
                    <p className="inline">{nft?.description}</p>
                    <span
                      className="text-themeYellow font-manrope cursor-pointer inline"
                      onClick={handleDescription}
                    >
                      {" "}
                      {!descriptionSlice ? "see less" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {type === "inEscrow" && (
              <div className="description__similar__blk">
                <div className="description__title__blk">
                  <div className="description__title">
                    <h4>
                      <span>
                        <img
                          src="../../assets/img/description_ico.svg"
                          alt=""
                        />
                      </span>{" "}
                      Buyer Information
                    </h4>
                  </div>
                  <div className="description__angle__down">
                    <span>
                      <img src="../../assets/img/angle_down.svg" alt="" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Name</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.buyerShippingId?.name}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Email</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.buyerShippingId?.email}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Phone</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.buyerShippingId?.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Street Address</span>
                    <span className="text-white">
                      {nft?.saleId?.buyerShippingId?.address?.line1}{" "}
                      {nft?.saleId?.buyerShippingId?.address?.line2}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Postal Address</span>
                    <span className="text-white">
                      {nft?.saleId?.buyerShippingId?.address?.postalCode}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">City</span>
                    <span className="text-white">
                      {nft?.saleId?.buyerShippingId?.address?.city}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">State</span>
                    <span className="text-white">
                      {" "}
                      {nft?.saleId?.buyerShippingId?.address?.state}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Country</span>
                    <span className="text-white">
                      {nft?.saleId?.buyerShippingId?.country}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#2e2e2e]">
                  <div className="text-themeYellow font-manrope font-bold text-lg">
                    Buyer&apos;s message
                  </div>
                  <div className="font-azeret text-white/80">
                    {messageSlice
                      ? nft?.saleId?.buyerShippingId?.contactInformation
                          ?.length > 200
                        ? nft?.saleId?.buyerShippingId?.contactInformation?.slice(
                            0,
                            200
                          )
                        : nft?.saleId?.buyerShippingId?.contactInformation
                      : nft?.saleId?.buyerShippingId?.contactInformation}
                    <span
                      className="text-themeYellow font-manrope cursor-pointer"
                      onClick={handleMessage}
                    >
                      ... {messageSlice ? "see less" : "see more"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {type === "release" && (
              <div className="description__similar__blk">
                <div className="description__title__blk">
                  <div className="description__title">
                    <h4>
                      <span>
                        <img
                          src="../../assets/img/description_ico.svg"
                          alt=""
                        />
                      </span>{" "}
                      Seller Information
                    </h4>
                  </div>
                  <div className="description__angle__down">
                    <span>
                      <img src="../../assets/img/angle_down.svg" alt="" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Name</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.sellerShippingId?.name}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Email</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.sellerShippingId?.email}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Phone</span>
                    <span className="text-themeYellow">
                      {nft?.saleId?.sellerShippingId?.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Street Address</span>
                    <span className="text-white">
                      {nft?.saleId?.sellerShippingId?.address?.line1}{" "}
                      {nft?.saleId?.sellerShippingId?.address?.line2}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Postal Address</span>
                    <span className="text-white">
                      {nft?.saleId?.sellerShippingId?.address?.postalCode}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">City</span>
                    <span className="text-white">
                      {nft?.saleId?.sellerShippingId?.address?.city}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">State</span>
                    <span className="text-white">
                      {nft?.saleId?.sellerShippingId?.address?.state}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between font-azeret">
                    <span className="text-white">Country</span>
                    <span className="text-white">
                      {nft?.saleId?.sellerShippingId?.country}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#2e2e2e]">
                  <div className="text-themeYellow font-manrope font-bold text-lg">
                    Seller&apos;s message
                  </div>
                  <div className="font-azeret text-white/80">
                    {messageSlice
                      ? nft?.saleId?.sellerShippingId?.contactInformation
                          ?.length > 200
                        ? nft?.saleId?.sellerShippingId?.contactInformation?.slice(
                            0,
                            200
                          )
                        : nft?.saleId?.sellerShippingId?.contactInformation
                      : nft?.saleId?.sellerShippingId?.contactInformation}
                    <span
                      className="text-themeYellow font-manrope cursor-pointer"
                      onClick={handleMessage}
                    >
                      ... {messageSlice ? "see less" : "see more"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {(type === "resell" || type === "remove") && bids?.length > 0 && (
              <div className="description__similar__blk">
                <div className="description__title__blk">
                  <div className="description__title">
                    <h4>
                      <span>
                        <img src="../../assets/img/activity_ico_4.svg" alt="" />
                      </span>{" "}
                      Bid Offers
                    </h4>
                  </div>
                  <div className="description__angle__down">
                    <span>
                      <img src="../../assets/img/angle_down.svg" alt="" />
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-5 font-bold gap-4 min-w-[960px]">
                    <div className="font-manrope text-sm text-white/60">
                      Price
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      USD Price
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      Placed On
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      From
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      Confirmation
                    </div>
                    {bids?.length > 0 &&
                      bids?.map((bid, index) => (
                        <>
                          <div className="w-full col-span-5 border-t border-[#2e2e2e]"></div>
                          <div className="font-azeret flex items-center gap-2 text-white">
                            <img
                              src="../../assets/img/activity_ico_4.svg"
                              alt=""
                            />
                            {bid?.bidValue}
                          </div>
                          <div className="font-azeret flex text-white items-center">
                            ${(2 * bid?.bidValue).toLocaleString("en-US")}
                          </div>
                          <div className="font-azeret flex text-white items-center">
                            {bid?.createdAt
                              ? new Date(bid?.createdAt)
                                  .toLocaleString()
                                  .slice(0, 10)
                              : "-/-"}
                          </div>
                          <div className="font-azeret flex text-themeYellow items-center">
                            {bid?.bidder?.username
                              ? bid?.bidder?.username
                              : trimString(bid?.bidder?.wallet)}
                          </div>
                          <div>
                            <button
                              className="bg-themeYellow rounded-lg font-bold font-manrope px-12 py-2"
                              onClick={() => acceptBidByOwner(bid)}
                            >
                              Accept
                            </button>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {(type === "bid" || type === "buy") && bids?.length > 0 && (
              <div className="description__similar__blk">
                <div className="description__title__blk">
                  <div className="description__title">
                    <h4>
                      <span>
                        <img src="../../assets/img/activity_ico_4.svg" alt="" />
                      </span>{" "}
                      Bid Offers
                    </h4>
                  </div>
                  <div className="description__angle__down">
                    <span>
                      <img src="../../assets/img/angle_down.svg" alt="" />
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-5 font-bold gap-4 min-w-[960px]">
                    <div className="font-manrope text-sm text-white/60">
                      Price
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      USD Price
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      Placed On
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      From
                    </div>
                    <div className="font-manrope text-sm text-white/60">
                      Confirmation
                    </div>
                    {bids?.length > 0 &&
                      bids?.map((bid, index) => (
                        <>
                          <div className="w-full col-span-5 border-t border-[#2e2e2e]"></div>
                          <div className="font-azeret flex items-center gap-2 text-white">
                            <img
                              src="../../assets/img/activity_ico_4.svg"
                              alt=""
                            />
                            {bid?.bidValue}
                          </div>
                          <div className="font-azeret flex text-white items-center">
                            ${(2 * bid?.bidValue).toLocaleString("en-US")}
                          </div>
                          <div className="font-azeret flex text-white items-center">
                            {bid?.createdAt
                              ? new Date(bid?.createdAt)
                                  .toLocaleString()
                                  .slice(0, 10)
                              : "-/-"}
                          </div>
                          <div className="font-azeret flex text-themeYellow items-center">
                            {bid?.bidder?.username
                              ? bid?.bidder?.username
                              : trimString(bid?.bidder?.wallet)}
                          </div>
                          <div>
                            <button
                              disabled={bid?.bidder?._id !== user?._id}
                              className={`${bid?.bidder?._id === user?._id ? "bg-themeYellow" : "text-themeYellow"} rounded-lg font-bold font-manrope px-12 py-2`}
                              onClick={() => cancelBidByOwner(bid)}
                            >
                              {bid?.bidder?._id === user?._id
                                ? "Cancel Bid"
                                : "Bidded"}
                            </button>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {nft?.attributes?.length !== 0 && (
              <div className="description__similar__blk">
                <div className="description__title__blk">
                  <div className="description__title">
                    <h4>
                      <span>
                        <img
                          src="../../assets/img/description_ico.svg"
                          alt=""
                        />
                      </span>{" "}
                      Properties
                    </h4>
                  </div>

                  <div className="description__angle__down">
                    <span>
                      <img src="../../assets/img/angle_down.svg" alt="" />
                    </span>
                  </div>
                </div>
                <div className="description__testing">
                  <div className="row g-3">
                    {nft?.attributes.map((item) => (
                      <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
                        <div className="nft__single__option">
                          <a href="#">
                            <h4>{item?.type}</h4>
                            <p>{item?.value}</p>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="description__similar__blk">
              <div className="description__title__blk mb-0">
                <div className="description__title">
                  <h4>
                    <span>
                      <img src="../../assets/img/arrow_up_down.svg" alt="" />
                    </span>{" "}
                    Item activity
                  </h4>
                </div>
                <div className="description__angle__down">
                  <span>
                    <img src="../../assets/img/angle_down.svg" alt="" />
                  </span>
                </div>
              </div>
              <div className="activity__table__blk">
                <div className="dashboard__table__wrapper">
                  <div className="dashboard__table mt-10">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Event</th>
                          <th scope="col">Price</th>
                          <th scope="col">From</th>
                          <th scope="col">To</th>
                          <th scope="col">Date</th>
                          <th scope="col">Time</th>
                        </tr>
                      </thead>
                      {nftAcitvity.map((value, key) => {
                        const fromAddress = value?.from?.wallet
                          ? value.from.wallet
                          : value?.fromWallet
                            ? value?.fromWallet
                            : "";
                        const toAddress = value?.to?.wallet
                          ? value.to.wallet
                          : value?.toWallet
                            ? value?.toWallet
                            : "";
                        return (
                          <tbody>
                            <tr>
                              <td>
                                <div className="share_table">
                                  <span>
                                    <img
                                      src="../../assets/img/activity_ico_1.svg"
                                      alt=""
                                    />
                                  </span>{" "}
                                  {value?.state}{" "}
                                  <a
                                    href={`${explorer}/tx/` + value.actionHash}
                                    target="_blank"
                                  >
                                    <img
                                      src="../../assets/img/send_icon.svg"
                                      alt=""
                                    />
                                  </a>
                                </div>
                              </td>
                              <td>{value?.price ? value.price : "-/-"}</td>
                              <td>
                                <span className="yellow_color flex flex-row">
                                  {value?.from?.username
                                    ? value.from.username
                                    : value?.from?.wallet
                                      ? trimString(value.from.wallet)
                                      : value?.fromWallet
                                        ? trimString(value?.fromWallet)
                                        : "-/-"}{" "}
                                  {fromAddress && (
                                    <a
                                      href={
                                        `${explorer}/address/` + fromAddress
                                      }
                                      target="_blank"
                                    >
                                      <img
                                        src="../../assets/img/send_icon.svg"
                                        alt=""
                                      />
                                    </a>
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="yellow_color flex flex-row">
                                  {value?.to?.username
                                    ? value.to?.username
                                    : value?.to?.wallet
                                      ? trimString(value?.to?.wallet)
                                      : value?.toWallet
                                        ? trimString(value?.toWallet)
                                        : "-/-"}
                                  {"  "}
                                  {toAddress && (
                                    <a
                                      href={`${explorer}/address/` + toAddress}
                                      target="_blank"
                                    >
                                      <img
                                        src="../../assets/img/send_icon.svg"
                                        alt=""
                                      />
                                    </a>
                                  )}
                                </span>
                              </td>
                              <td>
                                {value?.createdAt
                                  ? new Date(value.createdAt)
                                      .toLocaleString()
                                      .slice(0, 10)
                                  : "-/-"}
                              </td>
                              <td>
                                {value?.createdAt
                                  ? new Date(
                                      value.createdAt
                                    ).toLocaleTimeString()
                                  : "-/-"}
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {nft?.unlockableContent &&
              JSON.parse(getCookie("user"))._id == nft?.owner?._id && (
                <div className="description__similar__blk">
                  <div className="description__title__blk">
                    <div className="description__title">
                      <h4>
                        <span>
                          <img src="../../assets/img/icons8-lock.svg" alt="" />
                        </span>{" "}
                        Unlockable content
                      </h4>
                    </div>
                    <div className="description__angle__down">
                      <span>
                        <img src="../../assets/img/angle_down.svg" alt="" />
                      </span>
                    </div>
                  </div>
                  <div className="description__content">
                    <div className="row g-3">
                      <p className="inline">{nft?.unlockableContent}</p>
                      {nft?.certificates.map((item) => (
                        <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
                          <div className="nft__single__option">
                            <img src={item}></img>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            <div className="nft__details__area">
              <p>
                <span>
                  <img src="../../assets/img/details_ico_1.svg" alt="" />
                </span>{" "}
                Details
              </p>
              <p>
                <span>
                  <img src="../../assets/img/details_ico_2.svg" alt="" />
                </span>{" "}
                Erc721
              </p>
              <p className="yellow_color">
                <span>
                  <img src="../../assets/img/details_ico_3.svg" alt="" />
                </span>{" "}
                <a
                  href={
                    `${explorer}/token/${contractAddress}` +
                    (nft?.minted ? "?a=" + nft?.tokenId : "")
                  }
                >
                  View on {network} Scan{" "}
                </a>
                <a
                  href={
                    `${explorer}/token/${contractAddress}` +
                    (nft?.minted ? "?a=" + nft?.tokenId : "")
                  }
                >
                  <img src="../../assets/img/send_icon.svg" alt="" />
                </a>
              </p>
              <p className="yellow_color">
                <span>
                  <img src="../../assets/img/details_ico_4.svg" alt="" />
                </span>{" "}
                <a href={nft?.uri} target="_blank">
                  Open original on IPFS{" "}
                </a>
                <a href="#">
                  <img src="../../assets/img/send_icon.svg" alt="" />
                </a>
              </p>
            </div>
          </div>
        </section>
        {/* =================== NFT DETAIL HERO AREA END ===================== */}
        {/* =================== NEWSLETTER AREA START ===================== */}
        <section className="newsletter__area">
          <div className="container">
            <div
              className="newsltter__inner__blk"
              style={{
                backgroundImage: "url(../../assets/img/newsletter_thumb.png)",
              }}
            >
              <div className="newsletter__form">
                <h4>
                  Join our newsletter to stay up to date on features and
                  releases
                </h4>
                <form action="#">
                  <input type="text" placeholder="abcd@gmail.com" />
                  <a href="#">
                    <img src="../../assets/img/mail.svg" alt="" />
                  </a>
                  <button type="button">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/* =================== NEWSLETTER AREA END ===================== */}
        {/* =================== FOOTER AREA START ===================== */}
        <Footer />
        {/* =================== FOOTER AREA END ===================== */}
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h4>Transfer Token</h4>
                  <p>Transfer this token from your wallet to other wallet.</p>
                </div>
                <div className="popup__similar__form">
                  <div className="single__popup__input input_no_padding">
                    <label htmlFor="#">Recipient Address*</label>
                    <input type="text" placeholder="Recipient Address..." />
                  </div>
                  <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                    <a href="#">Confirm</a>
                    <a href="#" className="cancel">
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h4>Do you really want to burn this Token?</h4>
                  <p>
                    Burning token will destroy/delete the token from contract
                    permanently. You will not find this token anywhere.
                  </p>
                </div>
                <div className="popup__similar__form">
                  <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                    <a onClick={burnNFt}>Confirm</a>
                    <a href="#" className="cancel" onClick={() => cancleBurn()}>
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1180 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="popup__common__title mt-4">
                  <h4>Edit NFT</h4>
                </div>
                <div className="col-md-12 common__edit__proe__wrap ">
                  <div className="single__edit__profile__step">
                    <div className="edit__profile__inner__title">
                      <h5>Description</h5>
                    </div>
                    <div className="border-b border-[#353535] my-3"></div>
                    <textarea
                      name="#"
                      placeholder="Please describe your product"
                      id=""
                      cols={30}
                      rows={10}
                      onChange={(e) => setDiscription(e.target.value)}
                      value={discription}
                    />
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-5 mb-5">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Attachment</h5>
                    </div>
                    <div className="edit__profile__angle__ico">
                      <span>
                        <img src="../../assets/img/angle_up.svg" alt="" />
                      </span>
                    </div>
                  </div>
                  <div className="attachment__card__blk mt-3">
                    <div className="row gx-4">
                      {createNftStep1Attachments.map((file, i) => (
                        <div
                          key={i}
                          className=" col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6"
                        >
                          <div className="single__attachment__cird__blk">
                            <div className="attachment__thumb">
                              <img
                                src={
                                  typeof file === "string"
                                    ? file
                                    : URL.createObjectURL(file)
                                }
                                alt=""
                              />
                            </div>
                            <div className="attachment__content flex justify-center gap-4">
                              <a
                                href="#"
                                onClick={() => handleChangeStep1Attachment(i)}
                              >
                                Change{" "}
                              </a>
                              <span className="mt-3">
                                <img src="../../assets/img/Trash.svg" alt="" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="col-xxl-custom col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <div className="single__attachment__cird__blk">
                          <div className="attachment_upload_thumb">
                            <div className="imageWrapper">
                              <img
                                className="image-2"
                                src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                              />
                            </div>
                          </div>
                          <button className="file-upload flex flex-col">
                            <input
                              type="file"
                              className="file-input-2"
                              ref={step1AttachmentRef}
                              onChange={(e) =>
                                setCreateNftStep1Attachments([
                                  ...createNftStep1Attachments,
                                  e.target.files[0],
                                ])
                              }
                            />
                            <span>
                              Upload{" "}
                              <small>
                                <img src="../../assets/img/Upload.svg" alt="" />
                              </small>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="popup__select">
                  <div className="col-md-12">
                    <div className="single__edit__profile__step">
                      <label htmlFor="#" style={{ fontSize: "xl" }}>
                        Category
                      </label>
                      <select
                        class="form-select"
                        aria-label="select curation"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {!category && <option value="">Category</option>}
                        {categories?.map((value, index) => {
                          return (
                            <option key={index} value={value._id}>
                              {value.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-3 pb-0">
                  <a href="#" className="cancel">
                    Cancel
                  </a>
                  <a href="#" onClick={editNft}>
                    Submit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle4"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1200 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span className="close_modal" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Give a new price to put this asset for sale.</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-lg-12">
                        <div className="single__edit__profile__step">
                          <input
                            type="number"
                            placeholder="Enter Price for one piece"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ntf__flex__row__inputs upload__file__padding__top">
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Name*</label>
                            <input
                              type="text"
                              placeholder="Enter name*"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">E-mail*</label>
                            <input
                              type="text"
                              placeholder="Enter email*"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step_custom_2">
                            <label htmlFor="#">Country*</label>
                            <select
                              class="form-select"
                              aria-label="select curation"
                              name="country"
                              value={shippingAddress.country}
                              onChange={handleUpdateShippingAddress}
                            >
                              <option value="">Select</option>
                              {countries.map((item) => (
                                <option
                                  key={item.isoCode}
                                  value={JSON.stringify(item)}
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="nft__single__switch__box mt-3 ntf__flex__column">
                  <div className="ntf__flex__row">
                    <div className="nft__switch__text">
                      <h6>Split Payments</h6>
                      <p>
                        Add multiple address to recieve your payments. Only
                        Creator will be able to see it. Must total 100%.
                      </p>
                    </div>
                    <div className="nft__switch">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          defaultChecked=""
                          onChange={(e) => setSplit(e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    {split && (
                      <div className="ntf__flex__input__wrap">
                        <div className="single__edit__profile__step width_430">
                          <input
                            type="text"
                            placeholder="Address"
                            name="address"
                            value={createNftStep2SplitInput?.address}
                            onChange={handleUpdateValuesStep2Split}
                          />
                        </div>
                        <div
                          className="single__edit__profile__step"
                          style={{ width: 95 }}
                        >
                          <input
                            type="text"
                            placeholder="%"
                            name="percentage"
                            value={createNftStep2SplitInput?.percentage}
                            onChange={handleUpdateValuesStep2Split}
                          />
                        </div>
                        <div className="input__add__btn">
                          <a
                            className="add_input_btn"
                            href="#"
                            onClick={() => {
                              setCreateNftStep2Split([
                                ...createNftStep2Split,
                                createNftStep2SplitInput,
                              ])
                              setCreateNftStep2SplitInput({
                                address: "",
                                percentage: "",
                              })
                            }}
                          >
                            <span>
                              <img src="assets/img/Plus_circle.svg" alt="" />
                            </span>{" "}
                            Add
                          </a>
                        </div>
                      </div>
                    )}
                    {createNftStep2Split.map((item, i) => (
                      <div className="ntf__flex__input__wrap">
                        <div className="single__edit__profile__step_custom width_430">
                          {item.address}
                        </div>
                        <div
                          className="single__edit__profile__step_custom"
                          style={{ width: 95 }}
                        >
                          {item.percentage}%
                        </div>
                        <div className="input__add__btn">
                          <a
                            href="#"
                            onClick={() => {
                              const tempArr = [...createNftStep2Split]
                              tempArr.splice(i, 1)
                              setCreateNftStep2Split([...tempArr])
                            }}
                          >
                            <img src="../../../assets/img/Trash.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Shipping Address</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 1*</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line1}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line1: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 2</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line2}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line2: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">State*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {states.map((item) => (
                              <option
                                key={item.isoCode}
                                value={JSON.stringify(item)}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">City*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {cities.map((item) => (
                              <option key={item.isoCode} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Postal Code*</label>
                          <input
                            type="text"
                            min="0"
                            placeholder="Enter Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                postalCode:
                                  Number(e.target.value) >= 0
                                    ? e.target.value
                                    : "",
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Phone Number*</label>
                          <input
                            type="text"
                            min="0"
                            id="mobile_code"
                            className="from-control"
                            placeholder={"0000000000"}
                            name="name"
                            value={phoneNumber}
                            onChange={(e) =>
                              setPhoneNumber(
                                Number(e.target.value) >= 0
                                  ? e.target.value
                                  : ""
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Contact Information For seller</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={contactInfo}
                            onChange={(e) => setContractInfo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>
                        Consent for collection and Usage of Personal Information
                      </h5>
                      <p>
                        Please read the following and check the appropriate
                        boxes to indicate your consent:
                      </p>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={concent}
                            onChange={(e) => setConcent(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="agree__radio__btn">
                  <div className="codeplay-ck">
                    <label className="container-ck">
                      <p>I agree to all Term, Privacy Polic and fees</p>
                      <input
                        type="checkbox"
                        defaultChecked="checked"
                        onChange={(e) => setAgree(e.target.checked)}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Discard
                  </a>
                  <a
                    data-bs-toggle="modal"
                    href="#exampleModalToggl5"
                    role="button"
                    onClick={putOnSale}
                  >
                    Submit{" "}
                    <span>
                      <img src="../../assets/img/arrow_ico.svg" alt="" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl5"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we put it on sale</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalTogglCancelBid"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we cancel the bid</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle41"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1200 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span className="close_modal" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Enter a bid value</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-lg-12">
                        <div className="single__edit__profile__step">
                          <input
                            type="number"
                            placeholder="Enter Price for one piece"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ntf__flex__row__inputs upload__file__padding__top">
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Name*</label>
                            <input
                              type="text"
                              placeholder="Enter name*"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">E-mail*</label>
                            <input
                              type="text"
                              placeholder="Enter email*"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step_custom_2">
                            <label htmlFor="#">Country*</label>
                            <select
                              class="form-select"
                              aria-label="select curation"
                              name="country"
                              value={shippingAddress.country}
                              onChange={handleUpdateShippingAddress}
                            >
                              <option value="">Select</option>
                              {countries.map((item) => (
                                <option
                                  key={item.isoCode}
                                  value={JSON.stringify(item)}
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="nft__single__switch__box mt-3 ntf__flex__column">
                  <div className="ntf__flex__row">
                    <div className="nft__switch__text">
                      <h6>Split Payments</h6>
                      <p>
                        Add multiple address to recieve your payments. Only
                        Creator will be able to see it. Must total 100%.
                      </p>
                    </div>
                    <div className="nft__switch">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          defaultChecked=""
                          onChange={e => setSplit(e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="ntf__flex__input__wrap">
                      <div className="single__edit__profile__step width_430">
                        <input
                          type="text"
                          placeholder="Address"
                          name="address"
                          value={createNftStep2SplitInput.address}
                          onChange={handleUpdateValuesStep2Split}
                        />
                      </div>
                      <div
                        className="single__edit__profile__step"
                        style={{width: 95}}
                      >
                        <input
                          type="text"
                          placeholder="%"
                          name="percentage"
                          value={createNftStep2SplitInput.percentage}
                          onChange={handleUpdateValuesStep2Split}
                        />
                      </div>
                      {split && (
                        <div className="input__add__btn">
                          <a
                            className="add_input_btn"
                            href="#"
                            onClick={() => {
                              setCreateNftStep2Split([
                                ...createNftStep2Split,
                                createNftStep2SplitInput,
                              ])
                              setCreateNftStep2SplitInput({
                                address: "",
                                percentage: "",
                              })
                            }}
                          >
                            <span>
                              <img src="assets/img/Plus_circle.svg" alt="" />
                            </span>{" "}
                            Add
                          </a>
                        </div>
                      )}
                    </div>
                    {createNftStep2Split.map((item, i) => (
                      <div className="ntf__flex__input__wrap">
                        <div className="single__edit__profile__step_custom width_430">
                          {item.address}
                        </div>
                        <div
                          className="single__edit__profile__step_custom"
                          style={{width: 95}}
                        >
                          {item.percentage}%
                        </div>
                        <div className="input__add__btn">
                          <a
                            href="#"
                            onClick={() => {
                              const tempArr = [...createNftStep2Split]
                              tempArr.splice(i, 1)
                              setCreateNftStep2Split([...tempArr])
                            }}
                          >
                            <img src="../../../assets/img/Trash.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Shipping Address</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 1*</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line1}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line1: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 2</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line2}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line2: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">State*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {states.map((item) => (
                              <option
                                key={item.isoCode}
                                value={JSON.stringify(item)}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">City*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {cities.map((item) => (
                              <option key={item.isoCode} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Postal Code*</label>
                          <input
                            type="text"
                            min="0"
                            placeholder="Enter Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                postalCode:
                                  Number(e.target.value) >= 0
                                    ? e.target.value
                                    : "",
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Phone Number*</label>
                          <input
                            type="text"
                            min="0"
                            id="mobile_code"
                            className="from-control"
                            placeholder={"0000000000"}
                            name="name"
                            value={phoneNumber}
                            onChange={(e) =>
                              setPhoneNumber(
                                Number(e.target.value) >= 0
                                  ? e.target.value
                                  : ""
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Contact Information For seller</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={contactInfo}
                            onChange={(e) => setContractInfo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>
                        Consent for collection and Usage of Personal Information
                      </h5>
                      <p>
                        Please read the following and check the appropriate
                        boxes to indicate your consent:
                      </p>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={concent}
                            onChange={(e) => setConcent(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="agree__radio__btn">
                  <div className="codeplay-ck">
                    <label className="container-ck">
                      <p>I agree to all Term, Privacy Polic and fees</p>
                      <input
                        type="checkbox"
                        defaultChecked="checked"
                        onChange={(e) => setAgree(e.target.checked)}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Discard
                  </a>
                  <a
                    data-bs-toggle="modal"
                    href="#exampleModalToggl122"
                    role="button"
                    onClick={bidAPlace}
                  >
                    Submit{" "}
                    <span>
                      <img src="../../assets/img/arrow_ico.svg" alt="" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl11"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we remove it from sale</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl12"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img w-fit mx-auto">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we release the escorw</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl122"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img w-fit mx-auto">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we place a bid</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Buy Model */}
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle6"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel6"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1200 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span className="close_modal" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Buyer Information</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {txType === "bid" && (
                    <div className="edit__profile__form mb-4">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <input
                              type="number"
                              placeholder="Enter Price for one piece"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="ntf__flex__row__inputs">
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Name*</label>
                            <input
                              type="text"
                              placeholder="Enter name*"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">E-mail*</label>
                            <input
                              type="text"
                              placeholder="Enter email*"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit_profile_from">
                      <div className="row gy-4 gx-3">
                        <div className="col-lg-12">
                          <div className="single__edit__profile__step_custom_2">
                            <label htmlFor="#">Country*</label>
                            <select
                              class="form-select"
                              aria-label="select curation"
                              name="country"
                              value={shippingAddress.country}
                              onChange={handleUpdateShippingAddress}
                            >
                              <option value="">Select</option>
                              {countries.map((item) => (
                                <option
                                  key={item.isoCode}
                                  value={JSON.stringify(item)}
                                >
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Shipping Address</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 1*</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line1}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line1: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Address 2</label>
                          <input
                            type="text"
                            placeholder="Enter Your Street Address*"
                            value={shippingAddress.line2}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                line2: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">State*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {states.map((item) => (
                              <option
                                key={item.isoCode}
                                value={JSON.stringify(item)}
                              >
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="single__edit__profile__step_custom_2">
                          <label htmlFor="#">City*</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleUpdateShippingAddress}
                          >
                            <option value="">Select</option>
                            {cities.map((item) => (
                              <option key={item.isoCode} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Postal Code*</label>
                          <input
                            type="text"
                            min="0"
                            placeholder="Enter Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                postalCode:
                                  Number(e.target.value) >= 0
                                    ? e.target.value
                                    : "",
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Phone Number*</label>
                          <input
                            type="text"
                            min="0"
                            id="mobile_code"
                            className="from-control"
                            placeholder={"0000000000"}
                            name="name"
                            value={phoneNumber}
                            onChange={(e) =>
                              setPhoneNumber(
                                Number(e.target.value) >= 0
                                  ? e.target.value
                                  : ""
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Contact Information For seller</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={contactInfo}
                            onChange={(e) => setContractInfo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>
                        Consent for collection and Usage of Personal Information
                      </h5>
                      <p>
                        Please read the following and check the appropriate
                        boxes to indicate your consent:
                      </p>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={concent}
                            onChange={(e) => setConcent(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="agree__radio__btn">
                  <div className="codeplay-ck">
                    <label className="container-ck">
                      <p>I agree to all Term, Privacy Polic and fees</p>
                      <input
                        type="checkbox"
                        defaultChecked="checked"
                        onClick={(e) => setAgree(e.target.value)}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Order Summery</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="order__summery__area">
                          <div className="popup__order__summery__content">
                            <p>
                              Price{" "}
                              <span>{price ? price : nft?.price} MATIC</span>
                            </p>
                            <p>
                              Amount <span>1</span>
                            </p>
                            <p>
                              Royalty <span>{nft?.royalty}%</span>
                            </p>
                          </div>
                          <div className="popup__order__summery__content border-0 mt-25">
                            <p className="p-0">
                              You will Pay{" "}
                              <span>{price ? price : nft?.price} MATIC</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Discard
                  </a>
                  <a
                    // data-bs-dismiss="modal"
                    href="#"
                    role="button"
                    // onClick={placeBid}
                    onClick={() => {
                      toggleModel7();
                    }}
                  >
                    Submit{" "}
                    <span>
                      <img src="../../assets/img/arrow_ico.svg" alt="" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl7"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 780 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>
                    <span>
                      <img
                        src="../../assets/img/information_icon_1.svg"
                        alt=""
                      />
                    </span>{" "}
                    Caution
                  </h5>
                </div>
                <div className="popup__information__content">
                  <h6>
                    Do not disclose buyer shipping information to third parties!
                  </h6>
                  <p>
                    To maintain the confidentiality of buyer information and
                    ensure smooth transactions, please pay close attention to
                    the following points:
                  </p>
                  <p>
                    <span>1.</span> Confidentiality of Shipping Information:
                    Buyer shipping information should remain confidential to
                    sellers. Be cautious to prevent any external disclosures.
                  </p>
                  <p>
                    <span>2.</span> Tips for Safe Transactions: Handle buyer
                    shipping information securely to sustain safe and
                    transparent transactions.
                  </p>
                  <p>
                    <span>3.</span> Protection of Personal Information: As a
                    seller, it is imperative to treat buyer personal information
                    with utmost care. Avoid disclosing it to third parties.We
                    kindly request your strict adherence to these guidelines to
                    uphold transparency and trust in your transactions. Ensuring
                    a secure transaction environment benefits everyone involved.
                  </p>
                  <h5>Thank You</h5>
                </div>
                <div
                  className="popup__inner__button edit__profile__bottom__btn pt-20 pb-0"
                  style={{ maxWidth: 210, marginRight: "auto" }}
                >
                  <a
                    data-bs-dismiss="modal"
                    href="#"
                    onClick={() => {
                      const elem = new bootstrap.Modal(
                        document.getElementById("exampleModalToggle8")
                      );
                      elem.show();
                    }}
                  >
                    I Agree
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="bidInformationToggle"
        aria-hidden="true"
        aria-labelledby="bidInformationToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 780 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>
                    <span>
                      <img
                        src="../../assets/img/information_icon_1.svg"
                        alt=""
                      />
                    </span>{" "}
                    Bid Information
                  </h5>
                </div>
                <div className="popup__information__content">
                  <h6>Bid Success</h6>
                  <p>
                    If a seller accepts your bid, this bid will be converted to
                    the BuyNow stage
                  </p>
                  <h6>Bid Cancellation</h6>
                  <p>
                    If the seller does not accept the bid request within the
                    period set by the buyer in the place bid, the bid will be
                    canceled. Alternatively, if the buyer who applied for a bid
                    cancels the bid application, the transaction will be
                    cancelled.
                  </p>

                  <p>
                    If you have any questions regarding Bid, please contact us.
                  </p>

                  <h5>Thank You</h5>
                </div>
                <div
                  className="popup__inner__button edit__profile__bottom__btn pt-20 pb-0"
                  style={{ maxWidth: 210, marginRight: "auto" }}
                >
                  <a data-bs-dismiss="modal" href="#">
                    Close
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="editNftToggel"
        aria-hidden="true"
        aria-labelledby="editNftToggelLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span className="close_modal" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk text-center ">
                <div className="congrats__img flex justify-center">
                  <img src="../../assets/img/Check_circle.svg" alt="" />
                </div>
                <div className="popup__common__title mt-20">
                  <h5>Success!</h5>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" data-bs-dismiss="modal">
                    Close
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="editNftInProgress"
        aria-hidden="true"
        aria-labelledby="editNftInProgressLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img w-fit mx-auto">
                  <img src="../../assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we edit the Nft</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="bidInformationToggle"
        aria-hidden="true"
        aria-labelledby="bidInformationToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 780 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>
                    <span>
                      <img
                        src="../../assets/img/information_icon_1.svg"
                        alt=""
                      />
                    </span>{" "}
                    Escrow Release Confirmation
                  </h5>
                </div>
                <div className="popup__information__content">
                  <h6 className="font-bold text-white">
                    Did you receive the physical artwork without any issues?
                  </h6>
                  <p>
                    When escrow is released, you will receive the NFT created by
                    the artist in your wallet, and the purchase price you paid
                    will be delivered to the artist.
                  </p>
                  <p>
                    If you have properly received the physical artwork and there
                    were no problems during the transaction, click the Escrow
                    Release button below to complete the transaction.
                  </p>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Cancel
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    href="#"
                    // onClick={buyNft}
                  >
                    Escrow Release
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="putOnSaleInitialDialog"
        aria-hidden="true"
        aria-labelledby="putOnSaleInitialDialogLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 575 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>List item for sale</h5>
                  <p>
                    You are about to put {nft?.name} on sale From{" "}
                    {trimString(nft?.owner?.wallet)}
                  </p>
                </div>
                <div className="connected__top__blk popup__connected__top__blk mb-35">
                  <div className="connected__left__blk">
                    <div className="connected_compas">
                      <span>
                        <img
                          src="../../assets/img/MATIC.png"
                          className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                          alt=""
                        />
                      </span>
                      <div className="connected_left_text">
                        <h5>{trimString(address)}</h5>
                        <span>{network} Network</span>
                      </div>
                    </div>
                  </div>
                  <div className="connected__right__blk">
                    <a href="#">Connected</a>
                  </div>
                </div>
                <div className="order__summery__area">
                  <div className="popup__order__summery__content">
                    <div className="flex flex-col pb-[25px] gap-2 mt-4">
                      <p className="!pb-0">Price</p>
                      <div className="border !border-[#3A3A3A] rounded-lg px-2 !h-10 flex justify-between items-center">
                        <input
                          type="number"
                          className="flex-grow bg-inherit outline-none border-none text-white font-azeret"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <img
                          src="../../assets/img/MATIC.png"
                          className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                          alt=""
                        />
                      </div>
                    </div>
                    <p>
                      Royalties <span>{nft?.royalty}%</span>
                    </p>
                    <p>
                      Marketplace fee <span>{fee}%</span>
                    </p>
                  </div>
                  <div className="popup__order__summery__content !border-none mb-15 !pt-15">
                    <p>
                      You will get{" "}
                      <span>
                        
                        {(
                          price -
                          ((price * nft?.royalty) / 100 + (price * fee) / 100)
                        ).toFixed(2)}{" "}
                        MATIC
                      </span>
                    </p>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-0 !border-none pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Cancel
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    // data-bs-toggle="modal"
                    // href="#exampleModalToggle4"
                    role="button"
                    onClick={() => {
                      const elem = new bootstrap.Modal(
                        document.getElementById("exampleModalToggle4")
                      );
                      elem.show();
                    }}
                  >
                    Next
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="placeBidInitialDialog"
        aria-hidden="true"
        aria-labelledby="putOnSaleInitialDialogLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 575 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>Place Bid</h5>
                  <p>You are about to bid on {nft?.name}.</p>
                </div>
                <div className="connected__top__blk popup__connected__top__blk mb-35">
                  <div className="connected__left__blk">
                    <div className="connected_compas">
                      <span>
                        <img
                          src="../../assets/img/MATIC.png"
                          className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                          alt=""
                        />
                      </span>
                      <div className="connected_left_text">
                        <h5>{trimString(address)}</h5>
                        <span>{network} Network</span>
                      </div>
                    </div>
                  </div>
                  <div className="connected__right__blk">
                    <a href="#">Connected</a>
                  </div>
                </div>
                <div className="order__summery__area">
                  <div className="popup__order__summery__content">
                    <div className="flex flex-col pb-[25px] gap-2 mt-4">
                      <p className="!pb-0">Price</p>
                      <div className="border !border-[#3A3A3A] rounded-lg px-2 !h-10 flex justify-between items-center">
                        <input
                          type="number"
                          className="flex-grow bg-inherit outline-none border-none text-white font-azeret"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <img
                          src="../../assets/img/MATIC.png"
                          className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-0 !border-none pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Cancel
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    // data-bs-toggle="modal"
                    // href="#exampleModalToggle4"
                    role="button"
                    onClick={() => {
                      const elem = new bootstrap.Modal(
                        document.getElementById("exampleModalToggle6")
                      );
                      elem.show();
                    }}
                  >
                    Next
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle8"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 575 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5>Checkout</h5>
                  <p>
                    You are about to purchase {nft?.name} From{" "}
                    {trimString(nft?.owner?.wallet)}
                  </p>
                </div>
                <div className="connected__top__blk popup__connected__top__blk !mb-35">
                  <div className="connected__left__blk">
                    <div className="connected_compas">
                      <span>
                        <img
                          src="../../assets/img/MATIC.png"
                          className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                          alt=""
                        />
                      </span>
                      <div className="connected_left_text">
                        <h5>{trimString(address)}</h5>
                        <span>{network} Network</span>
                      </div>
                    </div>
                  </div>
                  <div className="connected__right__blk">
                    <a href="#">Connected</a>
                  </div>
                </div>
                <div className="order__summery__area !pt-4">
                  <div className="popup__order__summery__content">
                    <p>
                      Price{" "}
                      <span>{txType === "bid" ? price : nft?.price} MATIC</span>
                    </p>
                    <p>
                      Amount <span>1</span>
                    </p>
                    <p>
                      Royalty <span>{nft?.royalty}%</span>
                    </p>
                  </div>
                  <div className="popup__order__summery__content mb-15 mt-25">
                    <p>
                      You will Pay{" "}
                      <span>{txType === "bid" ? price : nft?.price} MATIC</span>
                    </p>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Cancel
                  </a>
                  <a data-bs-dismiss="modal" href="#" onClick={handleTxCall}>
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl9"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/Check_circle.svg" alt="" />
                </div>
                <div className="popup__common__title mt-4">
                  <h5>Purchase Success!</h5>
                  <p>Your Payment has been successfully done.</p>
                </div>
                <div className="popup__success__form">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="single__popup__success__blk">
                        <p>From</p>
                        <span>{trimString(nft?.owner?.wallet)}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="single__popup__success__blk">
                        <p>To</p>
                        <span>{trimString(address)}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="single__popup__success__blk">
                        <p>Payment Method</p>
                        <span>Polygon</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="single__popup__success__blk">
                        <p>Payment Time</p>
                        <span>11/19/2023, 11:49:57 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    className="cancel"
                    onClick={() => {
                      if (txType === "bid") {
                        const elem = new bootstrap.Modal(
                          document.getElementById("bidInformationToggle")
                        );
                        elem.show();
                      }
                    }}
                  >
                    Close
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle10"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1180 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="popup__common__title mt-20">
                  <h4>
                    <span>
                      <img src="../../assets/img/Receipt-ico.svg" alt="" />
                    </span>{" "}
                    Order Cancellation Request
                  </h4>
                </div>
                <div className="order__cancellation">
                  <p>
                    Firstly, we sincerely regret receiving your request for
                    order cancellation. Please be informed that cancellations
                    due to a change of mind are not processed in accordance with
                    our terms and conditions. However, if there are significant
                    reasons such as shipping delays or product defects, your
                    order cancellation may be approved. We strive to provide a
                    prompt and accurate assessment of your request.
                  </p>
                  <p>
                    Kindly elaborate on the reasons for your cancellation in the
                    field below. After careful review, we will communicate the
                    results and offer additional consultation through the email
                    and messenger ID you provided. Your valuable feedback is
                    essential in our commitment to delivering the best possible
                    service. Thank you.
                  </p>
                </div>
                <div className="common__edit__proe__wrap mt-20">
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Attachment</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="add_new">
                        <a
                          href="#"
                          onClick={() => setNumberOfInputs(numberOfInputs + 1)}
                        >
                          <span>
                            <img
                              src="../../assets/img/Plus_circle.svg"
                              alt=""
                            />
                          </span>{" "}
                          Add New
                        </a>
                      </div>
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="file__formate">
                    <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                  </div>
                  {_.times(numberOfInputs).map((value, index) => {
                    return (
                      <div className="upload__file__padding__bottom">
                        <div className="upload__file__with__name">
                          {index === 0 && (
                            <input
                              type="file"
                              id="discription-image"
                              ref={discriptionImageRef}
                              style={{ display: "none" }}
                              onChange={(e) =>
                                setDiscriptionImage([
                                  ...discriptionImage,
                                  e.target.files[0],
                                ])
                              }
                            />
                          )}
                          <button
                            type="button"
                            id="custom-button"
                            onClick={() =>
                              discriptionImageRef &&
                              discriptionImageRef.current.click()
                            }
                          >
                            Upload{" "}
                            <span>
                              <img
                                src="../../assets/img/Upload_ico.svg"
                                alt=""
                              />
                            </span>
                          </button>
                          <span id="custom-text">
                            {discriptionImage[index]
                              ? discriptionImage[index].name
                              : "Choose File"}
                          </span>
                          <img
                            src="../../assets/img/Trash.svg"
                            alt=""
                            onClick={() =>
                              setNumberOfInputs(numberOfInputs - 1)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel">
                    Cancel
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    role="button"
                    onClick={cancelRequest}
                  >
                    Submit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="escrowCancelModal"
        aria-hidden="true"
        aria-labelledby="escrowCancelModalLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1180 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="popup__common__title mt-20">
                  <h4 className="flex items-center">
                    <span>
                      <img src="../../assets/img/Receipt-ico.svg" alt="" />
                    </span>{" "}
                    Escrow Release Request
                  </h4>
                </div>
                <div className="order__cancellation">
                  <p>
                    Firstly, we sincerely regret receiving your request for
                    order cancellation. Please be informed that cancellations
                    due to a change of mind are not processed in accordance with
                    our terms and conditions. However, if there are significant
                    reasons such as shipping delays or product defects, your
                    order cancellation may be approved. We strive to provide a
                    prompt and accurate assessment of your request.
                  </p>
                  <p>
                    Kindly elaborate on the reasons for your cancellation in the
                    field below. After careful review, we will communicate the
                    results and offer additional consultation through the email
                    and messenger ID you provided. Your valuable feedback is
                    essential in our commitment to delivering the best possible
                    service. Thank you.
                  </p>
                </div>
                <div className="common__edit__proe__wrap mt-20">
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Details"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Attachment</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">
                      <div className="add_new">
                        <a
                          href="#"
                          onClick={() => setNumberOfInputs(numberOfInputs + 1)}
                        >
                          <span>
                            <img
                              src="../../assets/img/Plus_circle.svg"
                              alt=""
                            />
                          </span>{" "}
                          Add New
                        </a>
                      </div>
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="file__formate">
                    <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                  </div>
                  {_.times(numberOfInputs).map((value, index) => {
                    return (
                      <div className="upload__file__padding__bottom">
                        <div className="upload__file__with__name">
                          {index === 0 && (
                            <input
                              type="file"
                              id="discription-image"
                              ref={discriptionImageRef}
                              style={{ display: "none" }}
                              onChange={(e) =>
                                setDiscriptionImage([
                                  ...discriptionImage,
                                  e.target.files[0],
                                ])
                              }
                            />
                          )}
                          <button
                            type="button"
                            id="custom-button"
                            onClick={() =>
                              discriptionImageRef &&
                              discriptionImageRef.current.click()
                            }
                          >
                            Upload{" "}
                            <span>
                              <img
                                src="../../assets/img/Upload_ico.svg"
                                alt=""
                              />
                            </span>
                          </button>
                          <span id="custom-text">
                            {discriptionImage[index]
                              ? discriptionImage[index].name
                              : "Choose File"}
                          </span>
                          <img
                            src="../../assets/img/Trash.svg"
                            alt=""
                            onClick={() =>
                              setNumberOfInputs(numberOfInputs - 1)
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div> */}
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Cancel
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    role="button"
                    onClick={releseEscrowRequest}
                  >
                    Submit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl11Success"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span className="close_modal" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/Check_circle.svg" alt="" />
                </div>
                <div className="popup__common__title mt-20">
                  <h5>Success!</h5>
                  {/* <p>
                    Your order cancellation request has been successfully
                    received. We will carefully review it and contact you as
                    soon as possible. Thank you for your patience.
                  </p> */}
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" data-bs-dismiss="modal">
                    Close
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="errorCreatingCurationModal"
        aria-hidden="true"
        aria-labelledby="errorCreatingCurationLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 780 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5 className="flex items-center gap-2">
                    <span>
                      <img
                        src="../../assets/img/information_icon_1.svg"
                        alt=""
                      />
                    </span>{" "}
                    Error in the Form
                  </h5>
                </div>
                <div className="popup__information__content">
                  {errorCuration.map((err, i) => (
                    <p key={i}>
                      <span>{i + 1}.</span> {err}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NFTDetails
