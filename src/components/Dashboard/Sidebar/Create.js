import { useContext, useEffect, useRef, useState } from "react";
import MainSearch from "../Search/MainSearch";
import {
  CategoryService,
  CreateNftServices,
  collectionServices,
} from "../../../services/supplier";
import * as bootstrap from "bootstrap";
import {
  getEventValue,
  listNft,
  trimString,
  getMarketPlaceFee,
  isCurator,
} from "../../../utils/helpers";
import { useAccount, useSwitchChain } from "wagmi";
import _ from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";
import { City, Country, State } from "country-state-city";
import { WalletContext } from "../../../Context/WalletConnect";
import { network } from "../../../utils/config";
import UploadImage from "../../../utils/uploadImage";
import ErrorPopup from "./Popup";
import {
  strDoesExist,
  validateEmail,
  validateUrl,
} from "../../../utils/checkUrl";
import Banner from "../../../utils/bannerUpload";
import { io } from "socket.io-client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Create(props) {
  const [bannerImage, setBannerImage] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const countries = Country.getAllCountries();
  const [step, setStep] = useState(0);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fee, setFee] = useState(0);
  //Curation states
  const [file, setFile] = useState();
  const [discriptionImage, setDiscriptionImage] = useState([]);
  const [discriptionImage1, setDiscriptionImage1] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [discription, setDiscription] = useState("");
  const [errorCuration, setErrorCuration] = useState([]);
  const [links, setLinks] = useState({
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });
  const [youtube, setYoutube] = useState([
    {
      title: "",
      url: "",
    },
  ]);
  const [numberOfInputs, setNumberOfInputs] = useState(1);
  const [numberOfInputs1, setNumberOfInputs1] = useState(1);
  const navigate = useNavigate();
  const [createNftStep1, setCreateNftStep1] = useState({});
  const [createNftStep1Attachments, setCreateNftStep1Attachments] = useState(
    []
  );

  const [createNftStep1File, setCreateNftStep1File] = useState();

  const [params, setParams] = useSearchParams();
  const [createNftStep2Conditions, setCreateNftStep2Conditions] = useState({
    freeMint: false,
    royalties: false,
    unlockable: false,
    category: false,
    split: false,
  });
  const [createNftStep2, setCreateNftStep2] = useState({});
  const [createNftStep2PropertiesInput, setCreateNftStep2PropertiesInput] =
    useState({
      type: "",
      value: "",
    });
  const [createNftStep2SplitInput, setCreateNftStep2SplitInput] = useState({
    address: "",
    percent: "",
  });
  const [createNftStep2Split, setCreateNftStep2Split] = useState([]);
  const [createNftStep2Properties, setCreateNftStep2Properties] = useState([]);

  const [banner, setBanner] = useState({
    image: "",
    link: "#",
  });
  const [message, setMessage] = useState();
  const { fetchImages } = useContext(WalletContext);

  const fetchMedia = async () => {
    const images = await fetchImages();
    setBanner(images?.mintingBanner);
  };

  const getFee = async () => {
    try {
      const fee = await getMarketPlaceFee();
      setFee(Number(fee) / 100);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    getFee();
  }, []);
  const validateData = () => {
    const arr = [];
    strDoesExist("Curation Name", collectionName, arr);
    strDoesExist("Symbol", symbol, arr);
    strDoesExist("Description", discription, arr);
    links?.facebook && validateUrl("Facebook", links.facebook, arr);
    links?.instagram && validateUrl("Instagram", links.instagram, arr);
    links?.twitter && validateUrl("Twitter", links.twitter, arr);
    links?.website && validateUrl("Website", links.website, arr);
    youtube[0]?.title?.length > 0 &&
      youtube.forEach((item, idx) => {
        strDoesExist(`Youtube title ${idx + 1}`, item.title, arr);
        validateUrl(`Youtube url ${idx + 1}`, item.url, arr);
      });
    if (discriptionImage.length === 0) arr.push("Description Image is Needed");
    if (!bannerImage) arr.push("Banner Image is Needed");
    if (!file) arr.push("Cover Image is Needed");
    setErrorCuration([...arr]);
    if (arr.length > 0) return false;
    return true;
  };

  const validateUpdateData = () => {
    const arr = [];
    strDoesExist("Curation Name", collectionName, arr);
    strDoesExist("Symbol", symbol, arr);
    strDoesExist("Description", discription, arr);
    links?.facebook && validateUrl("Facebook", links.facebook, arr);
    links?.instagram && validateUrl("Instagram", links.instagram, arr);
    links?.twitter && validateUrl("Twitter", links.twitter, arr);
    links?.website && validateUrl("Website", links.website, arr);
    youtube?.length > 0 &&
      youtube.forEach((item, idx) => {
        strDoesExist(`Youtube title ${idx + 1}`, item.title, arr);
        // validateUrl(`Youtube url ${idx + 1}`, item.url, arr)
      });
    setErrorCuration([...arr]);
    if (arr.length > 0) return false;
    return true;
  };

  const validateCreateBasicDetails = () => {
    const arr = [];
    strDoesExist("Name", createNftStep1.productName, arr);
    strDoesExist("Description", createNftStep1.productDescription, arr);
    strDoesExist("Artist", createNftStep1.artistName, arr);
    strDoesExist("Price", createNftStep1.price, arr);
    strDoesExist("curation", createNftStep1.curation, arr);
    strDoesExist("File", createNftStep1File, arr, "is empty");
    setErrorCuration([...arr]);
    if (arr.length > 0) return false;
    return true;
  };

  const validateCreateAdvanceDetails = () => {
    const arr = [];
    if (createNftStep2Conditions.royalties) {
      strDoesExist("Royalty", createNftStep2.royalty, arr);
    }
    if (createNftStep2Conditions.category) {
      strDoesExist("Category", createNftStep2.category, arr);
    }
    if (createNftStep2Conditions.unlockable) {
      if (!createNftStep2.unlockable)
        strDoesExist("Unlockable Content", createNftStep2.unlockable, arr);
      strDoesExist(
        "Unlockable Content Certificates",
        discriptionImage1[0],
        arr,
        "is empty"
      );
    }
    if (createNftStep2Conditions.split) {
      const newArr = createNftStep2Split.map((item) => ({
        address: item.address,
        percentage: item.percent,
      }));
      strDoesExist("Split Payment Details", newArr, arr, "is empty");
    }
    createNftStep2Properties.forEach((item, idx) => {
      strDoesExist(`Attributes type ${idx}`, item.type, arr);
      strDoesExist(`Attributes value ${idx}`, item.value, arr);
    });
    setErrorCuration([...arr]);
    if (arr.length > 0) return false;
    return true;
  };

  

  const [sellerInfo, setSellerInfo] = useState({
    name: "",
    email: "",
    country: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    postalCode: "",
    phone: "",
    lengths: "",
    width: "",
    height: "",
    weight: "",
    contactInfo: "",
    consent: "",
  });
const validateCreateSellerDetails = () => {
  try{
    const arr = [];
  strDoesExist("Name", sellerInfo?.name, arr);
  validateEmail("Email", sellerInfo?.email, arr);
  strDoesExist("Country", JSON.parse(sellerInfo?.country)?.name, arr);
  strDoesExist("Address Line 1", sellerInfo?.address1, arr);
  strDoesExist("city", sellerInfo?.city, arr);
  strDoesExist("state", JSON.parse(sellerInfo?.state)?.name, arr);
  // numberValidator("Postal Code", sellerInfo.postalCode, arr, "postal")
  // numberValidator("Phone Number", sellerInfo.phone, arr, "phone")
  setErrorCuration([...arr]);
  if (arr.length > 0) return false;
  return true;
  }catch(e){
return false;
  }
  
};

  const [nftId, setNftId] = useState("");
  const imgRef = useRef(null);

  // Nft states
  const [uri, setUri] = useState("");

  const [userCollection, setUserCollection] = useState([]);
  const [categories, setCategories] = useState([]);

  const step1AttachmentRef = useRef(null);
  const nftService = new CreateNftServices();

  const handleUpdateValues = (e) => {
    const { name, value } = e.target;
    setCreateNftStep1({
      ...createNftStep1,
      [name]: value,
    });
  };

  const handleUpdateValuesStep2 = (e) => {
    const { name, value } = e.target;
    setCreateNftStep2({
      ...createNftStep2,
      [name]: value,
    });
  };

  const handleUpdateSeller = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const parsedVal = JSON.parse(value);
      const countryStates = State.getStatesOfCountry(parsedVal.isoCode);
      setStates(countryStates);
      setCountryCode(parsedVal.isoCode);
    } else if (name === "state") {
      const parsedVal = JSON.parse(value);
      const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);
      setCities(stateCities);
    }
    setSellerInfo({
      ...sellerInfo,
      [name]: value,
    });
  };
  const handlePhoneInput = (value) => {
    setSellerInfo({
      ...sellerInfo,
      phone: value,
    });
  };
  const handleUpdateValuesStep2Split = (e) => {
    const { name, value } = e.target;
    setCreateNftStep2SplitInput({
      ...createNftStep2SplitInput,
      [name]: value,
    });
  };

  const handleUpdateValuesStep2Properties = (e) => {
    const { name, value } = e.target;
    setCreateNftStep2PropertiesInput({
      ...createNftStep2PropertiesInput,
      [name]: value,
    });
  };

  const handleChangeStep1Attachment = (i) => {
    const tempArr = [...createNftStep1Attachments];
    tempArr.splice(i, 1);

    setCreateNftStep1Attachments([...tempArr]);
  };

  const handleDiscriptionImage = (i) => {
    const tempArr = [...discriptionImage];
    tempArr.splice(i, 1);

    setDiscriptionImage([...tempArr]);
    setNumberOfInputs(numberOfInputs - 1);
  };

  const [agree, setAgree] = useState(false);
  const { address } = useAccount();

  const discriptionImageRef = useRef();

  const createCollection = async () => {
    const valid = validateData();
    let iscurator = await isCurator(address);
    console.log("curator is---->", iscurator);
    if (!iscurator) {
      const element5 = new bootstrap.Modal(
        document.getElementById("exampleModalToggl5")
      );
      element5.show();
      return;
    }

    setErrorCuration([]);

    const errElem = new bootstrap.Modal(
      document.getElementById("errorCreatingCurationModal")
    );

    if (!valid) return errElem.show();
    const element4 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle4")
    );
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl1")
    );
    try {
      element4.show();
      const data = new FormData();
      data.append("name", collectionName);
      data.append("symbol", symbol);
      data.append("discription", discription);
      data.append("instagram", links.instagram);
      data.append("facebook", links.facebook);
      data.append("website", links.website);
      data.append("twitter", links.twitter);
      data.append("youtube", JSON.stringify(youtube));
      data.append("logo", file);
      data.append("bannerImage", bannerImage);
      for (let i = 0; i < numberOfInputs; i++) {
        data.append("descriptionImage", discriptionImage[i]);
      }

      await collectionServices.create(data);
      element4.hide();
      element1.show();
      setTimeout(() => {
        element1.hide();
      }, 1000);
      props?.render?.props?.onClickMenuButton("myProfile");
      props.setProfileTab("Curation");
    } catch (error) {
      element1.hide();
      console.log({ error });
    }
  };

  const createBasicDetails = async () => {
    console.log("here is creae basic deteails ----->",createNftStep1, createNftStep1.curation);
    if(createNftStep1 && createNftStep1?.curation==undefined){
       const errElem = new bootstrap.Modal(
         document.getElementById("modalSelectCuration")
       );
       errElem.show();
       return;
      
    }
    console.log("here is creae basic deteails ----->");
    setErrorCuration([]);
    const valid = validateCreateBasicDetails();
    console.log("valid is", valid);
    const errElem = new bootstrap.Modal(
      document.getElementById("errorCreatingCurationModal")
    );
    if (!valid) {
      return errElem.show();
    }
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle4")
    );
    element1.show();
    const formData = new FormData();
    // formData.append("nftImage", createNftStep1File)
    formData.append("name", createNftStep1.productName);
    formData.append("description", createNftStep1.productDescription);
    formData.append("artist", createNftStep1.artistName);
    formData.append("price", createNftStep1.price);
    formData.append("curation", createNftStep1.curation);
    // createNftStep1Attachments.length > 0 &&
    const allFiles = [createNftStep1File, ...createNftStep1Attachments];
    for (const file of allFiles) {
      formData.append("files", file);
    }

    try {
      const res = await nftService.createBasicDetails(formData);
      setNftId(res.data.data._id);
      setStep(2);
      element1.hide();
    } catch (error) {
      element1.hide();

      if (error?.response?.status == 400) {
        console.log("herer in modal");
        const element5 = new bootstrap.Modal(
          document.getElementById("exampleModalToggl5")
        );
        element5.show();
      } else {
        errElem.show();
      }
    }
  };

  const fetchUserCollections = async () => {
    try {
      const res = await collectionServices.getUserCollections();
      console.log("curations", res);
      setUserCollection(
        res.data.collection.length > 0 ? res.data.collection : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryService = new CategoryService();
      const {
        data: { categories },
      } = await categoryService.getAllCategories(0, 0);
      setCategories(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const createAdvancedDetails = async () => {
    setErrorCuration([]);
    const valid = validateCreateAdvanceDetails();
    const errElem = new bootstrap.Modal(
      document.getElementById("errorCreatingCurationModal")
    );
    if (!valid) return errElem.show();
    const formData = new FormData();
    formData.append("nftId", nftId);

    if (createNftStep2Conditions.freeMint) {
      formData.append("freeMinting", createNftStep2Conditions.freeMint);
    }
    if (createNftStep2Conditions.royalties) {
      if (!createNftStep2.royalty) return;
      formData.append("royalty", createNftStep2.royalty);
    }
    if (createNftStep2Conditions.category) {
      if (!createNftStep2.category) return;
      formData.append("category", createNftStep2.category);
    }
    if (createNftStep2Conditions.unlockable) {
      if (!createNftStep2.unlockable) return;
      formData.append("unlockableContent", createNftStep2.unlockable);
      for (let i = 0; i < numberOfInputs1; i++) {
        formData.append("certificates", discriptionImage1[i]);
      }
    }
    formData.append("attributes", JSON.stringify(createNftStep2Properties));

    const element2 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle4")
    );
    element2.show();

    try {
      const res = await nftService.createAdvancedDetails(formData);

      setStep(3);
      setTimeout(() => {
        element2.hide();
      }, 1000);
    } catch (error) {
      console.log(error);
      element2.hide();
    }
  };

  const createSellerInfo = async () => {
    console.log("hello---->>>",sellerInfo);
    setErrorCuration([]);
    const valid = validateCreateSellerDetails();
    const errElem = new bootstrap.Modal(
      document.getElementById("errorCreatingCurationModal")
    );
    if (!valid) return errElem.show();
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle1")
    );
    const element = new bootstrap.Modal(
      document.getElementById("exampleModalToggle3")
    );
    element1.show();
    let splitPayments = [];
    if (createNftStep2Conditions.split) {
      const newArr = createNftStep2Split.map((item) => ({
        address: item.address,
        percentage: item.percent,
      }));
      splitPayments = newArr;
    }
    const data = {
      name: sellerInfo.name,
      email: sellerInfo.email,
      country: JSON.parse(sellerInfo.country).name,
      address: {
        line1: sellerInfo.address1,
        line2: sellerInfo.address2,
        city: sellerInfo.city,
        state: JSON.parse(sellerInfo.state).name,
        postalCode: sellerInfo.postalCode,
      },
      phoneNumber: sellerInfo.phone,
      shippingInformation: {
        lengths: sellerInfo.lengths,
        width: sellerInfo.width,
        height: sellerInfo.height,
        weight: sellerInfo.weight,
      },
      splitPayments,
      nftId,
    };

    console.log("here 111------->>>");

    let nftUri = "";

    try {
      const {
        data: { uri },
      } = await nftService.createSellerDetails(data);
      setUri(uri);
      nftUri = uri;
      console.log("here 2222222");
      if (!createNftStep2Conditions?.freeMint) {
        await handleMint(uri);
      } else {
        setTimeout(() => {
          element1.hide();
        }, 100);
        element.show();
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      console.log("error is--->>", { error });
      if (
        error?.response?.data?.message?.includes(
          "Advance details not found or already minted"
        )
      ) {
        if (!createNftStep2Conditions?.freeMint) {
          await handleMint(nftUri);
        } else element1.hide();
      } else element1.hide();
    }
  };

  const discardData = async () => {
    const nftService = new CreateNftServices();
    try {
      nftId && (await nftService.removeFromDb({ nftId }));
      navigate("/dashboard?tab=create");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleYoutube = (newYoutube) => {
    if (youtube !== newYoutube && youtube.length <= 2) setYoutube(newYoutube);
  };

  const handleYoutubeInput = (tag, value, index) => {
    console.log({ tag, value, index });
    const newYoutube = youtube;
    if (tag === "title") newYoutube[index].title = value;
    else newYoutube[index].url = value;
    console.log(newYoutube, "newYoutube");
    setYoutube(newYoutube);
  };

  const getCuration = async (curationId) => {
    try {
      const {
        data: { collection },
      } = await collectionServices.getCollectionById(curationId);
      setCollectionName(collection?.name);
      setSymbol(collection?.symbol);
      setDiscription(collection?.description);
      setLinks({
        twitter: collection?.twitter,
        instagram: collection?.instagram,
        facebook: collection?.facebook,
        website: collection?.website,
      });
      setYoutube(collection?.youtube);
      setFile(collection?.logo);
      setDiscriptionImage(collection?.descriptionImage);
      setNumberOfInputs(collection?.descriptionImage.length);
      setBannerImage(collection?.bannerImage);
    } catch (error) {
      console.log({ error });
    }
  };

  // useEffect(() => {
  //   if (agree) {
  //     const element0 = new bootstrap.Modal(
  //       document.getElementById("exampleModalToggle2")
  //     )
  //     const element = new bootstrap.Modal(
  //       document.getElementById("exampleModalToggle3")
  //     )
  //     element0.hide()
  //     element.hide()
  //   }
  // }, [agree])

  const viewNft = () => {
    const element = new bootstrap.Modal(
      document.getElementById("exampleModalToggle3")
    );
    element.hide();
    props?.render?.props?.onClickMenuButton("myProfile");
    props.setProfileTab("Created");
  };

  const handleMint = async (uri) => {
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle1")
    );
    const element2 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle3")
    );
    let splitPayments = [];
    try {
      if (createNftStep2Conditions.split) {
        const newArr = createNftStep2Split.map((item) => ({
          paymentWallet: item.address,
          paymentPercentage: item.percent,
        }));
        splitPayments = newArr;
      }
      const result = await listNft(
        uri,
        createNftStep1.price,
        createNftStep2Conditions?.royalties ? createNftStep2.royalty : 0,
        splitPayments,
        address
      );
      const mintLogs = getEventValue(result.logs, "AssetTokenized");
      await nftService.mintAndSale({
        nftId,
        mintHash: result.transactionHash,
        tokenId: Number(mintLogs.tokenId),
      });
      const elem = new bootstrap.Modal(
        document.getElementById("exampleModalToggle1")
      );
      elem.hide();
      element2.show();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log("error for delete nft", error);
      alert(error);
      await nftService.removeFromDb({ nftId });
      element1.hide();
      setTimeout(() => {
        element2.hide();
      }, 100);
      throw new Error(error);
    }
  };

  const joinCreate = async () => {
    try {
      let user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      user = user && JSON.parse(user);
      const socketUrl = process.env.REACT_APP_SOCKET_URL;
      const socket = io(socketUrl, {
        query: { token },
      });
      socket.emit(user._id, user._id);
      socket.on(user?._id, async (data) => {
        setMessage(data?.message);
      });
    } catch (error) {
      console.log({ error }, 2423534);
    }
  };

  useEffect(() => {
    joinCreate();
    fetchMedia();
    fetchUserCollections();
    fetchCategories();
  }, []);

  useEffect(() => {
    const val = params.get("type");
    if (val === "createCuration") {
      setStep(1);
      setSelectedType(val);
    }
    const curationId = params.get("curationId");
    setCollectionId(curationId);
    getCuration(curationId);
  }, [params]);

  const updateCuration = async () => {
    setErrorCuration([]);
    const valid = validateUpdateData();
    const errElem = new bootstrap.Modal(
      document.getElementById("errorCreatingCurationModal")
    );
    if (!valid) return errElem.show();
    const element4 = new bootstrap.Modal(
      document.getElementById("exampleModalToggle4")
    );
    const element1 = new bootstrap.Modal(
      document.getElementById("exampleModalToggl1")
    );
    try {
      element4.show();
      const data = new FormData();
      data.append("curationId", collectionId);
      collectionName && data.append("name", collectionName);
      symbol && data.append("symbol", symbol);
      discription && data.append("discription", discription);
      links.instagram && data.append("instagram", links.instagram);
      links.facebook && data.append("facebook", links.facebook);
      links.website && data.append("website", links.website);
      links.twitter && data.append("twitter", links.twitter);
      bannerImage && data.append("bannerImage", bannerImage);
      youtube?.length > 0 && data.append("youtube", JSON.stringify(youtube));
      file && data.append("logo", file);
      for (let i = 0; i < numberOfInputs; i++) {
        data.append("descriptionImage", discriptionImage[i]);
      }

      await collectionServices.update(data);
      element4.hide();
      element1.show();
      setTimeout(() => {
        element1.hide();
      }, 1000);
      props?.render?.props?.onClickMenuButton("myProfile");
      props.setProfileTab("Curation");
    } catch (error) {
      element1.hide();
      console.log({ error });
    }
  };

  const handleCuration = async () => {
    const val = params.get("type");
    console.log("value is----->", val);
    if (val === "createCuration") await updateCuration();
    else await createCollection();
  };
  const { chains, switchChain } = useSwitchChain();

  const handleNetworkChange = () => {};

  return (
    <div className="profile__wrapper">
      <MainSearch />
      {props.render}
      <div className={step !== 0 ? "d-none" : "create__area"}>
        <div className="row g-0 align-items-center">
          <div className="col-md-6">
            <div className="create__content__wrap">
              <div className="create__title">
                <span>
                  <img src="assets/img/plus_file.svg" className="" alt="" />
                </span>
                <h4>Create</h4>
              </div>
              <div className="single__create__card">
                <span class="svg-container"></span>
                <div className="create__content__blk">
                  <div className="create__content">
                    <h4>Create Curation</h4>
                    <p>
                      Become an NFT tastemaker. Create your own Curation for
                      others to mint.
                    </p>
                  </div>
                  <a
                    href="#"
                    onClick={() => {
                      setSelectedType("createCuration");
                      setStep(1);
                    }}
                  >
                    <img src="assets/img/arrow-right-ico.svg" alt="" />
                  </a>
                </div>
              </div>
              <div className="single__create__card">
                <span className="svg-container-art"></span>
                <div className="create__content__blk">
                  <div className="create__content">
                    <h4>Create Artwork NFTs</h4>
                    <p>
                      Transform your art into a collectible, with one simple
                      tap.
                    </p>
                  </div>
                  <a
                    href="#"
                    onClick={() => {
                      setSelectedType("createNFT");
                      setStep(1);
                    }}
                  >
                    <img src="assets/img/arrow-right-ico.svg" alt="" />
                  </a>
                </div>
              </div>
              <div className="single__create__card">
                <span className="svg-container-mint"></span>
                <div className="create__content__blk">
                  <div className="create__content">
                    <h4>Mint NFTs Using NFC</h4>
                    <p>
                      Bridging the physical and digital worlds: Mint NFTs with a
                      tap.
                    </p>
                  </div>
                  <a href="#">
                    <img src="assets/img/arrow-right-ico.svg" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <a
              href={banner?.link ? banner?.link : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="create__thumb"
            >
              {banner?.image && (
                <img
                  src={banner?.image}
                  alt=""
                  className="aspect-square object-cover rounded-xl w-full h-full"
                />
              )}
            </a>
          </div>
        </div>
      </div>
      <div className={selectedType === "createCuration" ? "" : "d-none"}>
        <div className="edit__profile__wrapper">
          <div className="edit__profile__title ">
            <h4>
              {selectedType === "createCuration" ? "Edit" : "Create"} Your
              Collection
            </h4>
          </div>
          <div className="connected__top__blk mb-4">
            <div className="connected__left__blk">
              <div className="connected_compas">
                <span>
                  <img src="assets/img/colormatic.svg" alt="" />
                </span>
                <div className="connected_left_text">
                  <h5>{trimString(address)}</h5>
                  <span>{network} Network</span>
                </div>
              </div>
            </div>
            <div className="connected__right__blk">
              <a href="#">Connected</a>
              {/* <span className="angle_down" onClick={handleNetworkChange}>
                <img src="assets/img/angle_down.svg" alt="" />

              </span> */}
            </div>
          </div>
          {/* <div className="connected__bottom__btn">
            <a data-bs-toggle="modal" role="button">
              Free
            </a>
            <a
              data-bs-toggle="modal"
              href="#exampleModalToggl1"
              role="button"
              className="dark_btn"
            >
              On Network
            </a>
          </div> */}

          <div className="connected__form">
            <form action="#">
              <div className="row g-4">
                <div className="col-xxl-5 col-xl-12 col-lg-12 mt-35 ">
                  {/* <div className="upload__file">
                    <div className="upload__content flex flex-col items-center justify-center">
                      <div className="uipload__ico">
                        <img src="assets/img/Upload.svg" alt="" />
                        <h5>Upload file</h5>
                      </div>
                      <p>
                        {file ? (
                          file.name
                        ) : (
                          <>
                            Drag or choose your file to upload <br />{" "}
                            <span>PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="single_upload__btn">
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload"
                      >
                        Browse file{" "}
                        <span>
                          <img src="assets/img/arrow_ico.svg" alt="" />
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        style={{display: "none"}}
                        onChange={e => setFile(e.target.files[0])}
                      />
                    </div>
                  </div> */}

                  {selectedType === "createCuration" && (
                    <UploadImage uploadfile={file} setUploadfile={setFile} />
                  )}
                </div>
                <div className="col-xxl-7 col-xl-12 col-lg-12 mt-35">
                  <div className="connected__top__form">
                    <div className="row gx-3 gy-4">
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Name* </label>
                          <input
                            type="text"
                            placeholder="Enter Collection Name"
                            onChange={(e) => setCollectionName(e.target.value)}
                            value={collectionName}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Symbol*</label>
                          <input
                            type="text"
                            placeholder="i.e: TAT"
                            onChange={(e) => setSymbol(e.target.value)}
                            value={symbol}
                          />
                        </div>
                      </div>

                      <Banner
                        bannerImage={bannerImage}
                        setBannerImage={setBannerImage}
                      />

                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Description *</label>
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            onChange={(e) => setDiscription(e.target.value)}
                            value={discription}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="common__edit__proe__wrap mt-4">
                    <div className="edit__profilfile__inner__top__blk">
                      <div className="edit__profile__inner__title">
                        <h5>Your links</h5>
                      </div>
                      <div className="edit_profile_inner_top_right">
                        {/* <div className="add_new">
                          <a href="#">
                            <span>
                              <img src="assets/img/Plus_circle.svg" alt="" />
                            </span>{" "}
                            Add New
                          </a>
                        </div> */}
                        <div className="edit__profile__angle__ico">
                          <span>
                            <img src="assets/img/angle_up.svg" alt="" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="edit__profile__form">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Website</label>
                            <input
                              type="text"
                              placeholder="Enter your website link"
                              value={links.website}
                              onChange={(e) =>
                                setLinks({ ...links, website: e.target.value })
                              }
                            />
                            <button
                              className="delete_btn"
                              type="button"
                              onClick={() => {
                                setLinks({ ...links, website: "" });
                              }}
                            >
                              <img src="assets/img/Trash.svg" alt="" />
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">X(Twitter)</label>
                            <input
                              type="text"
                              placeholder="Enter your twitter link"
                              value={links.twitter}
                              onChange={(e) =>
                                setLinks({ ...links, twitter: e.target.value })
                              }
                            />
                            <button
                              className="delete_btn"
                              type="button"
                              onClick={() => {
                                setLinks({ ...links, twitter: "" });
                              }}
                            >
                              <img src="assets/img/Trash.svg" alt="" />
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Facebook</label>
                            <input
                              type="text"
                              placeholder="Enter your facebook link"
                              value={links.facebook}
                              onChange={(e) =>
                                setLinks({ ...links, facebook: e.target.value })
                              }
                            />
                            <button
                              className="delete_btn"
                              type="button"
                              onClick={(e) =>
                                setLinks({ ...links, facebook: "" })
                              }
                            >
                              <img src="assets/img/Trash.svg" alt="" />
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="single__edit__profile__step">
                            <label htmlFor="#">Instagram</label>
                            <input
                              type="text"
                              placeholder="Enter your instagram link"
                              value={links.instagram}
                              onChange={(e) =>
                                setLinks({
                                  ...links,
                                  instagram: e.target.value,
                                })
                              }
                            />
                            <button
                              className="delete_btn"
                              type="button"
                              onClick={(e) =>
                                setLinks({ ...links, instagram: "" })
                              }
                            >
                              <img src="assets/img/Trash.svg" alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="common__edit__proe__wrap mt-4">
                    <div className="edit__profilfile__inner__top__blk">
                      <div className="edit__profile__inner__title">
                        <h5>Youtube Video Link</h5>
                      </div>
                      <div className="edit_profile_inner_top_right">
                        <div className="add_new">
                          <div
                            onClick={() =>
                              handleYoutube([
                                ...youtube,
                                {
                                  title: "",
                                  url: "",
                                },
                              ])
                            }
                          >
                            {youtube.length < 2 && (
                              <div className="flex gap-1 items-center cursor-pointer">
                                <span>
                                  <img
                                    src="assets/img/Plus_circle.svg"
                                    alt=""
                                  />
                                </span>{" "}
                                <span className="text-white font-bold lg:text-[20px]">
                                  Add New
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="edit__profile__angle__ico">
                          <span>
                            <img src="assets/img/angle_up.svg" alt="" />
                          </span>
                        </div>
                      </div>
                    </div>
                    {youtube?.map((value, index) => {
                      return (
                        <div key={index} className="edit__profile__form mb-3">
                          <div className="row g-4">
                            <div className="col-md-6">
                              <div className="single__edit__profile__step">
                                <label htmlFor="#">Title</label>
                                <input
                                  type="text"
                                  placeholder="Enter video title"
                                  defaultValue={value.title}
                                  onChange={(e) =>
                                    handleYoutubeInput(
                                      "title",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single__edit__profile__step link__input">
                                <label htmlFor="#">Video Link</label>
                                <input
                                  type="text"
                                  placeholder="Enter your website link"
                                  defaultValue={value.url}
                                  onChange={(e) =>
                                    handleYoutubeInput(
                                      "url",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                                <button className="link_ico" type="button">
                                  <img src="assets/img/link_ico.svg" alt="" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="common__edit__proe__wrap mt-4">
                    <div className="edit__profilfile__inner__top__blk">
                      <div className="edit__profile__inner__title">
                        <h5>Curation Description Image</h5>
                      </div>
                      <div className="edit_profile_inner_top_right">
                        <div className="add_new">
                          <div
                            onClick={() =>
                              setNumberOfInputs(numberOfInputs + 1)
                            }
                          >
                            {numberOfInputs < 2 && (
                              <div className="flex gap-1 items-center cursor-pointer">
                                <span>
                                  <img
                                    src="assets/img/Plus_circle.svg"
                                    alt=""
                                  />
                                </span>{" "}
                                <span className="text-white font-bold lg:text-[20px]">
                                  Add New
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="edit__profile__angle__ico">
                          <span>
                            <img src="assets/img/angle_up.svg" alt="" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="file__formate">
                      <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                    </div>
                    {_.times(numberOfInputs).map((value, index) => {
                      return (
                        <div
                          className="upload__file__padding__bottom"
                          key={index}
                        >
                          <div className="upload__file__with__name">
                            {index === 0 && (
                              <input
                                type="file"
                                id="discription-image"
                                ref={discriptionImageRef}
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (file.size > 10 * 1024 * 1024) {
                                    setShowErrorPopup(true);
                                    return;
                                  }
                                  setDiscriptionImage([
                                    ...discriptionImage,
                                    e.target.files[0],
                                  ]);
                                }}
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
                                <img src="assets/img/Upload_ico.svg" alt="" />
                              </span>
                            </button>
                            <span id="custom-text">
                              {discriptionImage[index]
                                ? "File Uploaded"
                                : "Choose File"}
                            </span>
                            <img
                              src="assets/img/Trash.svg"
                              alt=""
                              onClick={() => handleDiscriptionImage(index)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="edit__profile__bottom__btn half__width__btn">
                    <a
                      data-bs-toggle="modal"
                      href="#discardPopup"
                      role="button"
                      className="cancel"
                    >
                      Discard
                    </a>
                    <a
                      // data-bs-toggle="modal"
                      // href="#exampleModalToggle4"
                      role="button"
                      onClick={handleCuration}
                    >
                      Next{" "}
                      <span>
                        <img src="assets/img/arrow_ico.svg" alt="" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className={
          selectedType === "createNFT" ? "upload__file__padding__top" : "d-none"
        }
      >
        {/* Step 1 */}
        <div className={step > 0 ? "edit__profile__wrapper " : "d-none"}>
          <div className="edit__profile__title">
            <h4>Create New NFT</h4>
          </div>
          <div className="create__step__blk">
            <a href="#" className="single__create__step active">
              <small>1</small> Basic Details
            </a>
            <span>
              <i class="fa-solid fa-angle-right" />
            </span>
            <a
              href="#"
              className={
                step > 1
                  ? "single__create__step active"
                  : "single__create__step"
              }
            >
              <small>2</small> Advanced Details
            </a>
            <span>
              <i class="fa-solid fa-angle-right" />
            </span>
            <a
              href="#"
              className={
                step > 2
                  ? "single__create__step active"
                  : "single__create__step"
              }
            >
              <small>3</small> Seller Information
            </a>
          </div>
          <div className={step === 1 ? "connected__top__blk mb-35" : "d-none"}>
            <div className="connected__left__blk">
              <div className="connected_compas">
                <span>
                  <img src="assets/img/colormatic.svg" alt="" />
                </span>
                <div className="connected_left_text">
                  <h5>{trimString(address)}</h5>
                  <span>{network} Network</span>
                </div>
              </div>
            </div>
            <div className="connected__right__blk">
              <a href="#">Connected</a>
              {/* <span className="angle_down">
                <img src="assets/img/angle_down.svg" alt="" />

              </span> */}
            </div>
          </div>
          {/* Step 1 */}
          <div className={step === 1 ? "connected__form" : "d-none"}>
            <form action="#">
              <div className="row g-4">
                <div className="col-md-5 mt-35">
                  {/* <div className="upload__file">
                    <div className="upload__content">
                      <div className="uipload__ico">
                        <img src="assets/img/Upload.svg" alt="" />
                        <h5>Upload file</h5>
                      </div>
                      <p>
                        {createNftStep1File ? (
                          createNftStep1File.name
                        ) : (
                          <>
                            Drag or choose your file to upload <br />{" "}
                            <span>PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="single_upload__btn">
                      <label
                        htmlFor="file-upload-nft"
                        className="custom-file-upload"
                      >
                        Browse file{" "}
                        <span>
                          <img src="assets/img/arrow_ico.svg" alt="" />
                        </span>
                      </label>
                      <input
                        type="file"
                        id="file-upload-nft"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          setCreateNftStep1File(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div> */}

                  {selectedType === "createNFT" && (
                    <UploadImage
                      uploadfile={createNftStep1File}
                      setUploadfile={setCreateNftStep1File}
                    />
                  )}
                </div>
                <div className="col-md-7">
                  <div className="connected__top__form">
                    <div className="row gx-3 gy-4">
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Product name * </label>
                          <input
                            type="text"
                            placeholder="Enter Product Name"
                            name="productName"
                            value={createNftStep1.productName}
                            onChange={handleUpdateValues}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Description *</label>
                          <textarea
                            placeholder="Please describe your artwork*"
                            id=""
                            cols={30}
                            rows={10}
                            name="productDescription"
                            value={createNftStep1.productDescription}
                            onChange={handleUpdateValues}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Price *</label>
                          <input
                            type="text"
                            placeholder={0}
                            name="price"
                            value={createNftStep1.price}
                            onChange={(e) =>
                              Number(e.target.value) >= 0
                                ? handleUpdateValues(e)
                                : setCreateNftStep1({
                                    ...createNftStep1,
                                    price: "",
                                  })
                            }
                          />
                          <button className="eth" type="button">
                            MATIC
                          </button>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="listing__fee__blk">
                          <p>
                            Plateform Fee <span>{fee}%</span>
                          </p>
                          <p>
                            You will recieve{" "}
                            <span>
                              {createNftStep1.price
                                ? createNftStep1.price -
                                  (fee * createNftStep1.price) / 100
                                : 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Artist Name *</label>
                          <input
                            type="text"
                            placeholder="Enter Artist Name"
                            name="artistName"
                            value={createNftStep1.artistName}
                            onChange={handleUpdateValues}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Curation *</label>
                          <select
                            class="form-select"
                            aria-label="select curation"
                            name="curation"
                            value={createNftStep1.curation}
                            onChange={handleUpdateValues}
                          >
                            <option value="">Select Curation</option>
                            {userCollection.map((item) => {
                              return (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="common__edit__proe__wrap mt-4">
                    <div className="edit__profilfile__inner__top__blk">
                      <div className="edit__profile__inner__title">
                        <h5>Attachment</h5>
                      </div>
                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                    <div className="attachment__card__blk">
                      <div className="row gx-5 gy-4">
                        {createNftStep1Attachments.map((file, i) => (
                          <div
                            key={i}
                            className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6"
                          >
                            <div className="single__attachment__cird__blk">
                              <div className="attachment__thumb">
                                <img src={URL.createObjectURL(file)} alt="" />
                              </div>
                              <div className="attachment__content">
                                <a
                                  style={{ color: "#ddf247" }}
                                  onClick={() => handleChangeStep1Attachment(i)}
                                >
                                  Change{" "}
                                  <span>
                                    <img src="assets/img/Trash.svg" alt="" />
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                        {createNftStep1Attachments.length > 4 ? (
                          ""
                        ) : (
                          <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                            <div className="single__attachment__cird__blk">
                              <div className="attachment_upload_thumb">
                                <div className="imageWrapper">
                                  <img
                                    className="image-2"
                                    src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                                  />
                                </div>
                              </div>
                              <button className="file-upload">
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
                                    <img src="assets/img/Upload.svg" alt="" />
                                  </small>
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="edit__profile__bottom__btn half__width__btn">
                    <a
                      data-bs-toggle="modal"
                      href="#discardPopup"
                      role="button"
                      className="cancel"
                    >
                      Discard
                    </a>
                    <a href="#" onClick={createBasicDetails}>
                      Next{" "}
                      <span>
                        <img src="assets/img/arrow_ico.svg" alt="" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* Step 2 */}
          <div className={step === 2 ? "connected__form" : "d-none"}>
            <form action="#">
              <div className="nft__switch__blk">
                <div className="row g-3">
                  <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Free Minting</h6>
                        <p>Free mint your nft. You don’t eed any gas fee.</p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={createNftStep2Conditions.freeMint}
                            onChange={(e) => {
                              setCreateNftStep2Conditions({
                                ...createNftStep2Conditions,
                                freeMint: !createNftStep2Conditions.freeMint,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Royalties</h6>
                        <p>Earn a % on secondary sales</p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={createNftStep2Conditions.royalties}
                            onChange={(e) =>
                              setCreateNftStep2Conditions({
                                ...createNftStep2Conditions,
                                royalties: !createNftStep2Conditions.royalties,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Unlockable Content</h6>
                        <p>Only Owner can view this content</p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={createNftStep2Conditions.unlockable}
                            onChange={(e) =>
                              setCreateNftStep2Conditions({
                                ...createNftStep2Conditions,
                                unlockable:
                                  !createNftStep2Conditions.unlockable,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Collection</h6>
                        <p>Put this item into a Collection</p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Category</h6>
                        <p>Put this item into a Category</p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={createNftStep2Conditions.category}
                            onChange={(e) =>
                              setCreateNftStep2Conditions({
                                ...createNftStep2Conditions,
                                category: !createNftStep2Conditions.category,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="nft__single__switch__box">
                      <div className="nft__switch__text">
                        <h6>Split Payments</h6>
                        <p>Add multiple address to recieve payments. </p>
                      </div>
                      <div className="nft__switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={createNftStep2Conditions.split}
                            onChange={(e) =>
                              setCreateNftStep2Conditions({
                                ...createNftStep2Conditions,
                                split: !createNftStep2Conditions.split,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="connected__top__form">
                <div className="row gx-3 gy-4">
                  {createNftStep2Conditions.royalties && (
                    <div className="col-md-12">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Royalties </label>
                        <input
                          type="text"
                          min="0"
                          placeholder="Earn Royalties Percentage(%)"
                          name="royalty"
                          value={createNftStep2.royalty}
                          onChange={(e) =>
                            Number(e.target.value) >= 0
                              ? handleUpdateValuesStep2(e)
                              : setCreateNftStep1({
                                  ...createNftStep1,
                                  royalty: "",
                                })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {createNftStep2Conditions.unlockable && (
                    <>
                      <div className="col-md-12">
                        <div className="single__edit__profile__step">
                          <label htmlFor="#">Unlockable Content</label>
                          <textarea
                            style={{ height: 119 }}
                            name="unlockable"
                            value={createNftStep2.unlockable}
                            onChange={handleUpdateValuesStep2}
                            placeholder="Only the artwork owner can view this content and file. You may also attach a certificate of authenticity issued by a third party and a special image just for the buyer."
                            id=""
                            cols={30}
                            rows={10}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        {_.times(numberOfInputs1).map((value, index) => (
                          <div
                            className="nft__file__upload upload__file__padding__bottom"
                            key={index}
                          >
                            <div className="upload__file__with__name">
                              {index === 0 && (
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    setDiscriptionImage1([
                                      ...discriptionImage1,
                                      e.target.files[0],
                                    ])
                                  }
                                  ref={imgRef}
                                  id="real-file"
                                  hidden="hidden"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => imgRef.current.click()}
                                id="custom-button"
                              >
                                Upload{" "}
                                <span>
                                  <img src="assets/img/Upload_ico.svg" alt="" />
                                </span>
                              </button>
                              <span id="custom-text">
                                {discriptionImage1[index]
                                  ? `${discriptionImage1[index].name} file selected.`
                                  : "Choose File"}
                              </span>
                            </div>
                            <div className="add_new">
                              {index === 0 ? (
                                <a
                                  href="#"
                                  onClick={() =>
                                    setNumberOfInputs1(numberOfInputs1 + 1)
                                  }
                                >
                                  <span>
                                    <img
                                      src="assets/img/Plus_circle.svg"
                                      alt=""
                                    />
                                  </span>{" "}
                                  Add New
                                </a>
                              ) : (
                                <img
                                  src="assets/img/Trash.svg"
                                  alt=""
                                  onClick={() =>
                                    setNumberOfInputs1(numberOfInputs1 - 1)
                                  }
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {createNftStep2Conditions.category && (
                    <div className="col-md-12">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Category</label>
                        <select
                          class="form-select"
                          aria-label="select curation"
                          name="category"
                          value={createNftStep2.category}
                          onChange={handleUpdateValuesStep2}
                        >
                          <option value="">Select Category</option>
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
                  )}
                  <div className="col-md-12">
                    {createNftStep2Conditions.split && (
                      <div className="ntf__flex__input__wrap">
                        <div className="single__edit__profile__step width_430">
                          <label htmlFor="#">Split Payments</label>
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
                          style={{ width: 95 }}
                        >
                          <input
                            type="text"
                            placeholder="%"
                            name="percent"
                            value={createNftStep2SplitInput.percent}
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
                              ]);
                              setCreateNftStep2SplitInput({
                                address: "",
                                percent: "",
                              });
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
                      <div className="ntf__flex__input__wrap" key={i}>
                        <div className="single__edit__profile__step_custom width_430">
                          {item.address}
                        </div>
                        <div
                          className="single__edit__profile__step_custom"
                          style={{ width: 95 }}
                        >
                          {item.percent}%
                        </div>
                        <div className="input__add__btn">
                          <a
                            onClick={() => {
                              const tempArr = [...createNftStep2Split];
                              tempArr.splice(i, 1);
                              setCreateNftStep2Split([...tempArr]);
                            }}
                          >
                            <img src="assets/img/Trash.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-12">
                    <div className="propatis__area">
                      <div className="propertis__content">
                        <h4>Properties</h4>
                        <p>Textual Traits that show up as rectangle.</p>
                      </div>
                      <div className="ntf__flex__input__wrap">
                        <div className="single__edit__profile__step width_245">
                          <label htmlFor="#">Type</label>
                          <input
                            type="text"
                            placeholder="Type"
                            name="type"
                            value={createNftStep2PropertiesInput.type}
                            onChange={handleUpdateValuesStep2Properties}
                          />
                        </div>
                        <div className="single__edit__profile__step width_245">
                          <label htmlFor="#">Name</label>
                          <input
                            type="text"
                            placeholder="Name"
                            name="value"
                            value={createNftStep2PropertiesInput.value}
                            onChange={handleUpdateValuesStep2Properties}
                          />
                        </div>
                        <div className="input__add__btn">
                          <a
                            className="add_input_btn"
                            href="#"
                            onClick={() => {
                              createNftStep2Properties.push(
                                createNftStep2PropertiesInput
                              );
                              setCreateNftStep2PropertiesInput({
                                type: "",
                                value: "",
                              });
                            }}
                          >
                            <span>
                              <img src="assets/img/Plus_circle.svg" alt="" />
                            </span>{" "}
                            Add
                          </a>
                        </div>
                      </div>
                      <div className="nft__delete__option">
                        <div className="row g-3">
                          {createNftStep2Properties.map((item, i) => (
                            <div
                              key={i}
                              className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6"
                            >
                              <div className="nft__single__option">
                                <a
                                  onClick={() => {
                                    const temp = [...createNftStep2Properties];
                                    temp.splice(i, 1);
                                    setCreateNftStep2Properties([...temp]);
                                  }}
                                >
                                  <h4>{item.type}</h4>
                                  <p>{item.value}</p>
                                  <span>
                                    <img
                                      src="../../assets/img/Trash.svg"
                                      alt=""
                                    />
                                  </span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="edit__profile__bottom__btn half__width__btn">
                <a
                  data-bs-toggle="modal"
                  href="#discardPopup"
                  role="button"
                  className="cancel"
                >
                  Discard
                </a>
                <a href="#" onClick={createAdvancedDetails}>
                  Next{" "}
                  <span>
                    <img src="assets/img/arrow_ico.svg" alt="" />
                  </span>
                </a>
              </div>
            </form>
          </div>
          {/* Step 3 */}
          <div className={step === 3 ? "connected__form" : "d-none"}>
            <form action="#">
              <div className="common__edit__proe__wrap mt-4">
                <div className="edit__profilfile__inner__top__blk">
                  <div className="edit__profile__inner__title">
                    <h5>Seller Information</h5>
                  </div>
                  <div className="edit_profile_inner_top_right">
                    <div className="edit__profile__angle__ico">
                      <span>
                        <img src="assets/img/angle_up.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="edit__profile__form">
                  <div className="row gy-4 gx-3">
                    <div className="col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Name*</label>
                        <input
                          type="text"
                          placeholder="Enter Name*"
                          name="name"
                          value={sellerInfo.name}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">E-mail*</label>
                        <input
                          type="text"
                          placeholder="Email address*"
                          name="email"
                          value={sellerInfo.email}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="single__edit__profile__step_custom_2">
                        <label htmlFor="#">Country*</label>
                        <select
                          class="form-select"
                          aria-label="select curation"
                          name="country"
                          value={sellerInfo.country}
                          onChange={handleUpdateSeller}
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
              <div className="common__edit__proe__wrap mt-4">
                <div className="edit__profilfile__inner__top__blk">
                  <div className="edit__profile__inner__title">
                    <h5>Shipping Address</h5>
                  </div>
                  <div className="edit_profile_inner_top_right">
                    <div className="edit__profile__angle__ico">
                      <span>
                        <img src="assets/img/angle_up.svg" alt="" />
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
                          name="address1"
                          value={sellerInfo.address1}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Address 2</label>
                        <input
                          type="text"
                          placeholder="Enter Your Street Address*"
                          name="address2"
                          value={sellerInfo.address2}
                          onChange={handleUpdateSeller}
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
                          value={sellerInfo.state}
                          onChange={handleUpdateSeller}
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
                          value={sellerInfo.city}
                          onChange={handleUpdateSeller}
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
                          type="number"
                          placeholder="Enter Postal Code"
                          name="postalCode"
                          value={sellerInfo.postalCode}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Phone Number*</label>
                        {/* <input
                          type="tel"
                          id="mobile_code"
                          className="from-control"
                          placeholder={"0000000000"}
                          name="phone"
                          value={sellerInfo.phone}
                          onChange={handleUpdateSeller}
                        /> */}
                        <PhoneInput
                          id="mobile_code"
                          enableLongNumbers={true}
                          containerClass="phone-container"
                          buttonClass="phone-dropdown"
                          inputClass="phone-control"
                          country={"us"}
                          value={sellerInfo.phone}
                          onChange={handlePhoneInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="common__edit__proe__wrap mt-4">
                <div className="edit__profilfile__inner__top__blk">
                  <div className="edit__profile__inner__title">
                    <h5>Shipment Information</h5>
                  </div>
                  <div className="edit_profile_inner_top_right">
                    <div className="edit__profile__angle__ico">
                      <span>
                        <img src="assets/img/angle_up.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="edit__profile__form">
                  <div className="row gy-4 gx-3">
                    <div className="col-xl-3 col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Length (cm)</label>
                        <input
                          type="text"
                          placeholder="--"
                          name="lengths"
                          value={sellerInfo.lengths}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Width (cm)</label>
                        <input
                          type="text"
                          placeholder="--"
                          name="width"
                          value={sellerInfo.width}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Height (cm)</label>
                        <input
                          type="text"
                          placeholder="--"
                          name="height"
                          value={sellerInfo.height}
                          onChange={handleUpdateSeller}
                        />
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                      <div className="single__edit__profile__step">
                        <label htmlFor="#">Weight (kg)</label>
                        <input
                          type="text"
                          placeholder="--"
                          name="weight"
                          value={sellerInfo.weight}
                          onChange={handleUpdateSeller}
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
                        <img src="assets/img/angle_up.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="edit__profile__form">
                  <div className="row gy-4 gx-3">
                    <div className="col-xl-12">
                      <div className="single__edit__profile__step">
                        <textarea
                          placeholder="Please describe your product*"
                          id=""
                          cols={30}
                          rows={10}
                          name="contactInfo"
                          value={sellerInfo.contactInfo}
                          onChange={handleUpdateSeller}
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
                      Please read the following and check the appropriate boxes
                      to indicate your consent:
                    </p>
                  </div>
                  <div className="edit_profile_inner_top_right">
                    <div className="edit__profile__angle__ico">
                      <span>
                        <img src="assets/img/angle_up.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="edit__profile__form">
                  <div className="row gy-4 gx-3">
                    <div className="col-xl-12">
                      <div className="single__edit__profile__step">
                        <textarea
                          placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
                          id=""
                          cols={30}
                          rows={10}
                          name="consent"
                          value={sellerInfo.consent}
                          onChange={handleUpdateSeller}
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
                    <input type="checkbox" defaultChecked="checked" />
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
              <div className="edit__profile__bottom__btn half__width__btn">
                <a
                  data-bs-toggle="modal"
                  href="#discardPopup"
                  role="button"
                  className="cancel"
                >
                  Discard
                </a>
                <a
                  // data-bs-toggle="modal"
                  href="#exampleModalToggle"
                  role="button"
                  onClick={createSellerInfo}
                >
                  Proceed to Create NFT{" "}
                  <span>
                    <img src="assets/img/arrow_ico.svg" alt="" />
                  </span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="discardPopup"
        aria-hidden="true"
        aria-labelledby="discardPopupLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <span className="close_modal" data-bs-dismiss="modal">
                  <i className="fa fa-times" />
                </span>
                <div className="congrats__img">
                  <img
                    src="assets/img/exclamation.svg"
                    className="mx-auto w-fit"
                    alt=""
                  />
                </div>
                <div className="popup__common__title mt-20 text-center">
                  <h5>
                    If You Exit This page, the minting information Progress will
                    be lost. Do you still want to proceed?
                  </h5>
                  <div className="flex gap-8 items-center justify-center">
                    <button
                      className="font-manrope font-semibold rounded h-12 w-20 bg-white/5 text-white"
                      data-bs-dismiss="modal"
                    >
                      No
                    </button>
                    <button
                      data-bs-dismiss="modal"
                      className="font-manrope font-semibold rounded h-12 w-20 bg-[#DDF247]"
                      onClick={discardData}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <div className="popup__inner__blk text-center">
                <span className="close_modal" data-bs-dismiss="modal">
                  <i className="fa fa-times" />
                </span>
                <div className="congrats__img">
                  <img
                    src="assets/img/exclamation.svg"
                    className="mx-auto w-fit"
                    alt=""
                  />
                </div>
                <div className="popup__common__title mt-20 text-center">
                  <h5>
                    {!createNftStep1.curation ? (
                      <>
                        “You must select curation for NFT creation. Permission
                        is required to create curation. Click Learn More or
                        contact administrator.”
                      </>
                    ) : (
                      <>“Please Check if the Fields are Valid”</>
                    )}
                  </h5>
                  <div
                    className="popup__inner__button edit__profile__bottom__btn pt-20 pb-0"
                    style={{ maxWidth: 320, margin: "auto" }}
                  >
                    <a href="#" className="no_btn">
                      No
                    </a>
                    <a
                      data-bs-target="#exampleModalToggle2"
                      data-bs-toggle="modal"
                      data-bs-dismiss="modal"
                      href="#"
                    >
                      Yes
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
        id="modalSelectCuration"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <span className="close_modal" data-bs-dismiss="modal">
                  <i className="fa fa-times" />
                </span>
                <div className="congrats__img">
                  <img
                    src="assets/img/exclamation.svg"
                    className="mx-auto w-fit"
                    alt=""
                  />
                </div>
                <div className="popup__common__title mt-20 text-center">
                  <h5>
                    “You must select curation for NFT creation. Permission is
                    required to create curation. Click Learn More or contact
                    administrator.”
                  </h5>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal  common__popup__blk"
        id="exampleModalToggle1"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title mt-20">
                  <h5>NFT Creation is in Progress</h5>
                  <p>Transfer this token from your wallet to other wallet.</p>
                </div>
              </div>
              <div className="popup__progress__list">
                <div
                  className={
                    message >= 1
                      ? "single__popup__progress__list"
                      : "single__popup__progress__list disable_item"
                  }
                >
                  <a href="#">
                    <div className="popup__progress__ico">
                      <img src="assets/img/refresh_ico_1.svg" alt="" />
                    </div>
                    <div className="popup__progress__text">
                      <h5>Upload NFTs</h5>
                      <p>Uploading of all media assets and metadata to IPFS</p>
                    </div>
                  </a>
                </div>
                <div
                  className={
                    message >= 2
                      ? "single__popup__progress__list"
                      : "single__popup__progress__list disable_item"
                  }
                >
                  <a href="#">
                    <div className="popup__progress__ico">
                      <img src="assets/img/refresh_ico_1.svg" alt="" />
                    </div>
                    <div className="popup__progress__text">
                      <h5>Mint</h5>
                      <p>Send transaction to create your NFT</p>
                    </div>
                  </a>
                </div>
                <div
                  className={
                    message === 3
                      ? "single__popup__progress__list"
                      : "single__popup__progress__list disable_item"
                  }
                >
                  <a href="#">
                    <div className="popup__progress__ico">
                      <img src="assets/img/loader.gif" alt="" />
                    </div>
                    <div className="popup__progress__text">
                      <h5>Listing for sale</h5>
                      <p>Send transaction to list your NFT</p>
                    </div>
                  </a>
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
                      <img src="assets/img/information_icon_1.svg" alt="" />
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
                  style={{ maxWidth: 210, margin: "auto" }}
                >
                  <a
                    data-bs-dismiss="modal"
                    // data-bs-toggle="modal"
                    // data-bs-dismiss="modal"
                    // onClick={handleMint}
                    href="#"
                    onClick={() => {
                      const elem = new bootstrap.Modal(
                        document.getElementById("exampleModalToggle3")
                      );
                      elem.show();
                      setAgree(true);
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
                      <img src="assets/img/information_icon_1.svg" alt="" />
                    </span>{" "}
                    Error in Creating Caution is find
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
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 420 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h5 className="yellow_color mb-10">Congratulations!</h5>
                  <p className="white">Your NFT is Published.</p>
                </div>
                <div className="congrats__social__ico">
                  <div className="profile__social__ico">
                    <a href="#">
                      <i className="fab fa-twitter" />
                    </a>
                    <a href="#">
                      <i className="fas fa-paper-plane" />
                    </a>
                    <a href="#">
                      <i className="fab fa-discord" />
                    </a>
                  </div>
                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" onClick={viewNft}>
                    View NFT
                  </a>
                  <a href="#" className="cancel" data-bs-dismiss="modal">
                    Close
                  </a>
                </div>
                <div className="congrats__copy__text">
                  <div className="breadcrumb__inner__blk">
                    <div className="copy-text">
                      <input
                        type="text"
                        className="text"
                        defaultValue="https://playground.wpsmartnft.com/token/dark-theme-web-design/https://playground.wpsmartnft.com/token/dark-theme-web-design/"
                      />
                      <button>
                        <img src="assets/img/Document_ico.svg" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal  common__popup__blk"
        id="exampleModalToggle4"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img w-fit mx-auto">
                  <img src="assets/img/loader.gif" alt="" />
                </div>
                <div className="popup__common__title mt-20">
                  <h4>{message ? message : "In Progress Please Wait ..."}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl1"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img flex items-center justify-center">
                  <img src="assets/img/Check_circle.svg" alt="" />
                </div>
                <div className="popup__common__title mt-20">
                  <h4>Your Collection is Created.</h4>
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
                  <img src="assets/img/request_popup.svg" alt="" />
                </div>
                <div className="popup__common__title mt-20 text-center">
                  <h5>
                    Sorry,You Need To Be Given Permission By An Administrator To Create Curations.For More Information,Please Click
                    Learn More or Contact the Administrator
                  </h5>
                  <div className="learn_more_popup">
                    <a href="#">Learn More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorPopup
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        messege={"Please upload an image with Size less than 10MB"}
      />
    </div>
  );
}

export default Create;
