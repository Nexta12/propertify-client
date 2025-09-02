
import Placeholder from "@assets/img/placeholder.webp"
import LogoPlaceholder from "@assets/img/your-logo.webp"
import Button from "@components/ui/Button"
import useAuthStore from "@store/authStore"

const CoverBanner = ({company, handleNaviagete}) => {
   const { user } = useAuthStore();

 // Check if logged in user is part of company staff
  const isStaff = company?.staff?.some(
    (staffMember) => staffMember.user._id === user?.id
  );

  return (
     <div className="relative w-full h-60 md:h-80 bg-gray-200 dark:bg-gray-700">
          <img
            src={company?.coverPic || Placeholder  }
            alt="cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-12 left-14 flex justify-between items-start w-full">
            <img
              src={company?.companyLogo || LogoPlaceholder}
              alt="logo"
              className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-4 border-white dark:border-gray-800 shadow-lg object-cover"
            />
            {isStaff && (
          <div className="absolute bottom-0 right-20">
            <Button onClick={handleNaviagete} variant="success">
              Update Info
            </Button>
          </div>
        )}
          </div>
        </div>
  )
}

export default CoverBanner