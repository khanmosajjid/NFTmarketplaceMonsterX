import {useEffect, useState} from "react"
import {CreateSellService} from "../../../services/supplier"
import { useNavigate } from "react-router-dom"

function Earn({filter}) {
  const [earnings, setEarnings] = useState([])
  const navigate = useNavigate()

  const getEarnings = async () => {
    try {
      const sellServices = new CreateSellService()
      const {
        data: {earnings},
      } = await sellServices.getEarnings({filter: filter.filter !== 'All'? filter.filter: ''})
      setEarnings(earnings)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEarnings()
  }, [filter])
  return (
    <div className="activity__table__blk">
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Transaction Number (ID)</th>
                <th scope="col">Title</th>
                <th scope="col">Earnings</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">View Details</th>
              </tr>
            </thead>
            <tbody>
              {earnings?.length > 0 &&
                earnings?.map((earning, indes) => (
                  <tr>
                    <td>{earning?._id}</td>
                    <td>
                      <div className="flex__table">
                        <span className="table_thumb">
                          <img className="w-full !aspect-square !object-cover" src={earning?.nftId?.cloudinaryUrl} alt="" />
                        </span>
                        {earning?.nftId?.name}
                      </div>
                    </td>
                    <td>
                      <div className="share_table">
                        <span>
                          <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" />
                        </span>{" "}
                        {earning?.price} MATIC
                      </div>
                    </td>
                    <td>{earning?.createdAt
                          ? new Date(earning?.createdAt)
                              .toLocaleString()
                              .slice(0, 10)
                          : "-/-"}</td>
                    <td>
                      <div className={earning?.state === "Payment Received"? "table__inner__btn blue_bg" :"table__inner__btn"}>
                        <a href="#">{earning?.state}</a>
                      </div>
                    </td>
                    <td>
                      <a href="#" className="yellow_color yellow_border" onClick={()=> navigate('/dashboard/nft/'+earning?.nftId?._id)}>
                        View
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Earn
