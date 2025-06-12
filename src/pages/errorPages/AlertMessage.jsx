import { useEffect } from "react";
import { toast } from 'react-toastify';


const AlertMessage = ({ alert }) => {
  useEffect(() => {
    if (!alert) return;

    if (alert.errorMessage) {
      toast.error(alert.errorMessage);
    } 
    else if (alert.successMessage) {
      toast.success(alert.successMessage);
    }
  }, [alert]);

  // No need to return anything since Toastify handles rendering
  return null;
};

export default AlertMessage;