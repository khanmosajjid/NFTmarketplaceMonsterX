import OwlCarousel from "react-owl-carousel"
import "owl.carousel/dist/assets/owl.carousel.css"
import "owl.carousel/dist/assets/owl.theme.default.css"
import {useNavigate} from "react-router-dom"

function NFTCards(props) {
  const navigate = useNavigate()
  const options = {
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-long-arrow-left"></i>',
      '<i class="fa fa-long-arrow-right"></i>',
    ],
    dots: false,
    autoplay: false,
    smartSpeed: 1000,
    autoplayTimeout: 3500,
    items: 4,
    margin: 25,
    slideToScroll: 1,
    center: false,
    autoplayHoverPause: true,

    responsive: {
      0: {
        stagePadding: 0,
      },
      320: {
        items: 1,
        stagePadding: 20,
      },
      450: {
        items: 1,
        stagePadding: 40,
      },
      575: {
        items: 2,
        stagePadding: 0,
      },
      768: {
        items: 2,
        stagePadding: 40,
      },
      992: {
        items: 3,
        stagePadding: 0,
      },
      1200: {
        items: 4,
        stagePadding: 0,
      },
      1360: {
        stagePadding: 0,
      },
      1449: {
        stagePadding: 0,
      },
      1500: {
        stagePadding: 0,
      },
      1600: {
        stagePadding: 0,
      },
      1700: {
        stagePadding: 0,
      },
    },
  }

  return (
    <OwlCarousel className="sport__inner__blk" {...options}>
      {props?.nfts?.length > 0 &&
        props.nfts?.map((nft, index) => {
          return (
            <div
              key={index}
              className="single__sport__blk"
              onClick={() => navigate("/dashboard/nft/" + nft?._id)}
            >
              <div className="sport__thumb">
                <img className="w-full !aspect-[4/3] !object-cover" src={nft?.cloudinaryUrl} alt="" />
              </div>
              <div className="sport__content">
                <h5>{nft?.name}</h5>
                <p>
                  Created by: <span className="!font-azeret">{nft?.artist}</span>
                </p>
                <p className="!font-bold underline !text-[#CCCCCC] !italic !text-sm">
                  {nft?.curation?.name}
                </p>
                <h4>
                  Price{" "}
                  <span>
                    <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" /> {nft?.price} MATIC
                  </span>
                </h4>
              </div>
            </div>
          )
        })}
    </OwlCarousel>
  )
}

export default NFTCards

