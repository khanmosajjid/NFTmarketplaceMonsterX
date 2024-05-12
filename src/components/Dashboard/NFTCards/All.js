import { useEffect, useState } from "react"
import { NftServices } from "../../../services/supplier"
import { Link } from "react-router-dom"
import useDebounce from "../../../customHook/useDebounce"

function All({tab, category, searchInput, filter}) {
  const [nfts, setNfts] = useState([])

  const nftService = new NftServices()
  async function getUserNfts() {
    try{
      if(tab !== "Profile"){
        const dat = await nftService.getAllNfts({skip: 0, limit: 0, category: category?.name, searchInput: searchInput? searchInput: "", filter: filter.filter})
        setNfts(dat.data.success ? dat.data.nfts[0].data : [])
      }else{
        const {data:{nfts}} = await nftService.getNftOfUser({searchInput: searchInput? searchInput: "", filter: filter.filter})
        setNfts(nfts ? nfts : [])
      }
    }catch(e){
      setNfts([])
    }
  }

  const debounceSearch = useDebounce(getUserNfts,1000)
  useEffect(() => {
    debounceSearch()
  }, [category, searchInput, filter])

  return (
    <div className="categorie__card__blk">
      <div className="row g-4">
        {nfts?.length> 0 && nfts.filter((nft)=>(!nft?.active && !nft.ownerInfo?.[0]?.active && !nft.curationInfo?.[0].active)).map((nft,index) => (
          <Link
            to={`/dashboard/nft/${nft._id}`}
            className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6"
            key={index}
          >
            <div className="single__sport__blk">
              <div className="sport__thumb">
                <img className="w-full !aspect-[4/3] !object-cover" src={nft.cloudinaryUrl} alt=""/>
              </div>
              <div className="sport__content">
                <h5>{nft.name}</h5>
                <p className="text-[12px]">
                  Created by: <span className="!font-azeret">{nft.artist}</span>
                </p>
                <p className="!font-bold underline !text-[#CCCCCC] !italic !text-sm">
                  {nft.curation.name}
                </p>
                <h4>
                  Price{" "}
                  <span>
                    <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" /> {nft.price} MATIC
                  </span>
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default All
