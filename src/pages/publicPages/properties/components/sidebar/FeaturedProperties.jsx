
const FeaturedProperties = ({featuredProperties}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold mb-4 border-b pb-2">
      Featured Properties
    </h3>
    <div className="space-y-4">
      {featuredProperties.map((property) => (
        <div
          key={property.id}
          className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <img
            src={property.image}
            alt={property.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h4 className="font-medium text-gray-800">
              {property.title}
            </h4>
            <p className="text-sm text-green-600">{property.price}</p>
            <p className="text-xs text-gray-500">
              {property.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default FeaturedProperties