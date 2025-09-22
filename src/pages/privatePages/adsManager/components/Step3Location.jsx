import Map from "@components/map/Map";
import { NigerianStates } from "@utils/data";
import { useState } from "react";

const Step3Location = ({ formData, setFormData }) => {
  const [selectedStates, setSelectedStates] = useState(formData.location || []);
  const [choiceState, setChoiceState] = useState("");

  const toggleState = (state) => {
    setChoiceState(state);
    let updatedStates;
    if (selectedStates.includes(state)) {
      updatedStates = selectedStates.filter((s) => s !== state);
    } else {
      updatedStates = [...selectedStates, state];
    }
    setSelectedStates(updatedStates);
    setFormData({ ...formData, location: updatedStates });
  };

  const toggleAll = () => {
    let updatedStates;
    if (selectedStates.length === NigerianStates.length) {
      updatedStates = [];
    } else {
      updatedStates = NigerianStates;
    }
    setSelectedStates(updatedStates);
    setFormData({ ...formData, location: updatedStates });
  };

  return (
    <div>
      <button
        onClick={toggleAll}
        className="mb-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        {selectedStates.length === NigerianStates.length ? "Deselect All" : "Select All States"}
      </button>
      <div className="grid grid-cols-3 lg:grid-cols-8 gap-2">
        {NigerianStates.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              toggleState(item.state);
            }}
            className={`border rounded-lg p-2 text-center cursor-pointer text-sm ${
              selectedStates.includes(item.state)
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-700"
            } text-gray-800 dark:text-white text-[12px]`}
          >
            {item.state}
          </div>
        ))}
      </div>
      <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mt-3">
        <Map city={choiceState} state={"Nigeria"} zoomLevel={10} />
      </div>
    </div>
  );
};

export default Step3Location;
