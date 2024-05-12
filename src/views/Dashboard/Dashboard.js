import { useContext, useEffect, useState } from "react"
// Components
import Sidebar from "../../components/Dashboard/Sidebar"
import Profile from "../../components/Dashboard/Sidebar/Profile"
import Create from "../../components/Dashboard/Sidebar/Create"
import Settings from "../../components/Dashboard/Sidebar/Settings"
import Curation from "../../components/Dashboard/Sidebar/Curation"
import Appreciate from "../../components/Dashboard/Sidebar/Appreciate"
import MyFavorite from "../../components/Dashboard/Sidebar/Favorite"
import MyOrders from "../../components/Dashboard/Sidebar/MyOrders"
import Artists from "../../components/Dashboard/Sidebar/Artists"
import { useLocation, useSearchParams } from "react-router-dom"
import { WalletContext } from "../../Context/WalletConnect"

function Dashboard() {
  const [tabShow, setTabShow] = useState("appreciate")
  const { sidebar, setSidebar } = useContext(WalletContext)
  const [params, setParams] = useSearchParams()

  const [profileTab, setProfileTab] = useState("All")
  const onClickMenuButton = (value) => {
    setTabShow(value)
  }
  const { search } = useLocation()

  useEffect(() => {
    console.log(search.slice(1),"search")
    setTabShow(search.slice(1))
  }, [search])

  useEffect(() => {
    console.log(params,"params")
    const val = params.get("tab")
    console.log(val,"val")
    if(val === 'create')
    setTabShow(val)
  }, [params])

  switch (tabShow) {
    case "create":
      return (
        <Create
          setProfileTab={setProfileTab}
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "appreciate":
      return (
        <Appreciate
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )
    case "curation":
      return (
        <Curation
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "artist":
      return (
        <Artists
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "myProfile":
      return (
        <Profile
          profileTab={profileTab}
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "settings":
      return (
        <Settings
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "myFavorite":
      return (
        <MyFavorite
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    case "myOrder":
      return (
        <MyOrders
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )

    default:
      return (
        <Profile
          render={
            <Sidebar
              onClickMenuButton={onClickMenuButton}
              activeTab={tabShow}
              openDialog={sidebar}
              setOpenDialog={setSidebar}
            />
          }
        />
      )
      break
  }
}

export default Dashboard
