import { useEffect, useState } from "react";
import { getAllUsersActivity } from "../../../services/supplier";
import { trimString } from "../../../utils/helpers";

function Activity() {
  const [users, setUsers] = useState([]);

  const work = async () => {
    try {
      const {
        data: { data },
      } = await getAllUsersActivity();
      setUsers(data);
    } catch (error) {
      console.log({error})
    }
  };

  useEffect(() => {
    work();
  }, []);
  return (
    <div className="activity__table__blk">
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Item</th>
                <th scope="col">Price</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
              </tr>
            </thead>

            <tbody>
              {users?.map((value, index) => {
                return (
                  <tr>
                    <td>
                      <div className="share_table">
                        <span>
                          <img src="assets/img/share.svg" alt="" />
                        </span>{" "}
                        {value?.state}
                      </div>
                    </td>
                    <td>
                      <div className="flex__table">
                        <span className="table_thumb">
                          <img className="w-full !aspect-square !object-cover" src={value?.nftId?.cloudinaryUrl} alt="" />
                        </span>
                        {value?.nftId?.name}
                      </div>
                    </td>
                    <td>{value?.price ? value?.price : "-/-"}</td>
                    <td>
                      <span className="yellow_color">
                        {" "}
                        {value?.from?.username
                          ? value.from.username
                          : value?.from?.wallet
                            ? trimString(value.from.wallet)
                            : value?.fromWallet 
                            ? trimString(value?.fromWallet)
                            : "-/-"}
                      </span>
                    </td>
                    <td>
                      <span className="yellow_color">{" "}
                        {value?.to?.username
                          ? value?.to?.username
                          : value?.to?.wallet
                            ? trimString(value.to.wallet) 
                            : value?.toWallet 
                            ? trimString(value?.toWallet)
                            : "-/-"}</span>
                    </td>
                    <td>
                      {" "}
                      {value?.createdAt
                        ? new Date(value.createdAt)
                            .toLocaleString()
                            .slice(0, 10)
                        : "-/-"}
                    </td>
                    <td>
                      {value?.createdAt
                        ? new Date(value.createdAt).toLocaleTimeString()
                        : "-/-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activity;
