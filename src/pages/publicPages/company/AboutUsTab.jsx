import React from 'react'
import { motion as Motion } from 'framer-motion'
import Avater from "@assets/img/avater.png"



const AboutUsTab = ({ activeTab, company}) => {
  return (
    <>
      {activeTab === "about" && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {company?.description}
             
              </p>

              <div>
                <h2 className="text-xl font-semibold mb-4">Our Team</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {company?.staff?.map((member) => (
                    <div
                      key={member?._id}
                      className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md transition"
                    >
                      <img
                        src={member?.user?.profilePic || Avater}
                        alt={member?.user?.firstName}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                     
                      <h3 className="text-center mt-3 font-medium">
                        {member?.user?.firstName} {member?.user?.lastName}
                      </h3>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        {member?.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Motion.div>
          )}
    </>
  )
}

export default AboutUsTab