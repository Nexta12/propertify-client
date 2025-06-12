import { leadSources } from "@utils/data"


const PieChart = ({title}) => {
  return (
     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-gray-700 font-medium mb-4">{title}</h3>
             <div className="flex items-center justify-center h-48">
               <div className="relative w-40 h-40">
                 {/* Simulated pie chart with divs */}
                 <div className="absolute inset-0 rounded-full border-[20px] border-[#28B16D] clip-[0 50% 50% 0]"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-[#122947] clip-[0 0 50% 50%] rotate-[126deg]"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-[#EE6002] clip-[50% 50% 0 0] rotate-[234deg]"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-[#8E9395] clip-[50% 0 0 50%] rotate-[306deg]"></div>
                 <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                   <span className="text-xl font-bold">100%</span>
                 </div>
               </div>
               <div className="ml-8">
                 {leadSources.map((source, index) => (
                   <div key={index} className="flex items-center mb-2">
                     <div
                       className="w-3 h-3 rounded-full mr-2"
                       style={{ backgroundColor: source.color }}
                     ></div>
                     <span className="text-sm text-gray-700">{source.source}</span>
                     <span className="text-sm text-gray-500 ml-2">
                       {source.percentage}%
                     </span>
                   </div>
                 ))}
               </div>
             </div>
           </div>
  )
}

export default PieChart