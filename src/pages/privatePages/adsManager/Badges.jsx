import BadgesMarketplace from "./BadgesMarket";

const Badges = () => {
  // Handle badge purchase (integrate your API/checkout here)
  const handlePurchase = (badge) => {
    if (!badge) return;
    // console.log("Purchasing badge:", badge);
    // TODO: Call backend or payment API
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        🏅 Badge Marketplace
      </h1>
      <BadgesMarketplace onPurchase={handlePurchase} currencySymbol="₦" />
    </div>
  );
};

export default Badges;
