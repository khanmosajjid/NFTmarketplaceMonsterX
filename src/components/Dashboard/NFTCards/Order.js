import {useEffect, useState} from "react"
import {CreateSellService} from "../../../services/supplier"
import { useNavigate } from "react-router-dom"

function Order({searchInput, filter}) {
  const [nfts, setNfts] = useState([])
  const navigate = useNavigate()
  const getAllOrders = async () => {
    const saleService = new CreateSellService()
    const {
      data: {nfts},
    } = await saleService.getOrders({searchInput, filter: filter.filter })
    setNfts(nfts)
  }

  useEffect(() => {
    getAllOrders()
  }, [searchInput, filter])
  return (
    <div className="activity__table__blk">
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Payment Date</th>
                <th scope="col">Escrow Period</th>
                <th scope="col">Status</th>
                <th scope="col">View Details</th>
              </tr>
            </thead>
            <tbody>
              {nfts?.length > 0 &&
                nfts.filter((nft)=>(!nft?.active && !nft.ownerInfo?.[0]?.active && !nft.curationInfo?.[0].active)).map((nft, index) => {
                  const day =
                    new Date().getTime() - new Date(nft?.saleId?.ItemPurchasedOn).getTime()
                  return (
                    <tr key={index}>
                      <td>#{nft?._id}</td>
                      <td>
                        <div className="flex__table">
                          <span className="table_thumb">
                            <img
                              src={
                                nft?.cloudinaryUrl
                                  ? nft?.cloudinaryUrl
                                  : "assets/img/appreciate_thumb_8.png"
                              }
                              alt=""
                            />
                          </span>
                          {nft?.name}
                        </div>
                      </td>
                      <td>
                        {" "}
                        {nft?.saleId?.ItemPurchasedOn
                          ? new Date(nft?.saleId?.ItemPurchasedOn)
                              .toLocaleString()
                              .slice(0, 10)
                          : "-/-"}
                      </td>
                      <td>Day {Math.round(day / (1000 * 3600 * 24))}</td>
                      <td>In Escrow</td>
                      <td>
                        <a href="#" className="yellow_color yellow_border" onClick={()=>navigate('/dashboard/nft/'+nft?._id)}>
                          View
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Order
