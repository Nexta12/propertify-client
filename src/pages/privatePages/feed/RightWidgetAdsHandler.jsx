
import { apiClient } from "@api/apiClient";
import { endpoints } from "@api/endpoints";
import WidgetPost from "@components/propertyCard/WidgetPost";
import { ErrorFormatter } from "@pages/errorPages/ErrorFormatter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const RightWidgetAdsHandler = () => {
 const [widgetPosts, setWidgetPosts] = useState([]);

  const fetchWidgetPosts = async () => {
    try {
      const res = await apiClient.post(endpoints.fetchWidgetPosts)
      setWidgetPosts(res.data.data); 
    } catch (err) {
      toast.error(ErrorFormatter(err))
    }
  };

  useEffect(() => {
    fetchWidgetPosts(); // fetch immediately on load

    const interval = setInterval(() => {
      fetchWidgetPosts(); // fetch again every 1 minutes
    }, 1 * 60 * 1000); // 1 minutes in ms

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="sidebar-widget">
      {widgetPosts.map((post) => (
        <WidgetPost key={post._id} property={post} />
      ))}
    </div>
  )
}

export default RightWidgetAdsHandler


