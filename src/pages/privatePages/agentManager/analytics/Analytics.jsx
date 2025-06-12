import EnhancedInput from "@components/ui/EnhancedInput";
import { leadSources, performanceData } from "@utils/data";
import React, { useState } from "react";

const Analytics = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setIsSubmitting(true)

    console.log("formDetails", formData)
  }

  return (
    <section>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-4">
              Property Performance
            </h3>
            <div className="h-64">
              <div className="flex items-end h-48 space-x-2 mt-4">
                {performanceData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-[#28B16D] rounded-t-sm"
                      style={{ height: `${item.views / 5}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <span className="text-xs text-gray-500">Last 5 Months</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-gray-700 font-medium mb-4">Lead Sources</h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative w-40 h-40">
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
                    <span className="text-sm text-gray-700">
                      {source.source}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {source.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form action="" className="my-20 " onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-between w-full gap-4">
          <EnhancedInput
            name="userName"
            label="User Name"
            value={formData.userName}
            onChange={handleChange}
            errorMessage="Username is required"
            forceValidate={isSubmitting}
            required
          />
          <EnhancedInput
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            forceValidate={isSubmitting}
            required
          />
          <EnhancedInput
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            forceValidate={isSubmitting}
            required
          />
        </div>
        <button type="submit" className="btn btn-md" > Submit</button>
      </form>
    </section>
  );
};

export default Analytics;
