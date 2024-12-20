import React, { useState, useEffect } from "react";
import { Camera, Image as ImageIcon, Upload, RotateCw } from "lucide-react";
import api from "../../api.js";
import img1 from "../../assets/fundraising.png";
import html2canvas from "html2canvas";

const DonorCardOverlay = ({ name, category }) => (
  <div className="absolute top-3 left-4 w-[150px]" id="donor-card-overlay">
    <div className="bg-gradient-to-b from-blue-900 to-blue-950 overflow-hidden shadow-lg">
      <div className="bg-blue-800 p-1.5 text-center">
        <h1 className="text-xs font-bold text-white tracking-wide m-0">
          AKB FOUNDATION
        </h1>
      </div>
      <div className="relative p-3">
        <div className="relative mx-auto w-12 h-12 mb-2">
          <div className="absolute inset-0 border-2 border-blue-400 shadow-lg overflow-hidden">
            <div className="w-full h-full bg-blue-200/20" />
          </div>
          <div className="absolute -inset-1 border-2 border-blue-300/30 animate-spin-slow" />
        </div>
        <div className="space-y-1.5">
          <div className="bg-white/90 text-blue-900 py-0.5 px-2 font-bold text-[8px] inline-block">
            GIVE GROCERIES TO POOR
          </div>
          <div className="text-white space-y-1">
            <p className="text-[10px] font-bold text-center uppercase m-0">
              {name || "DONOR NAME"}
            </p>
            <div className="h-px w-12 mx-auto bg-blue-400/50" />
            <p className="text-[8px] text-blue-200 italic text-center m-0">
              Making Change Together
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CameraComponent = ({ onClose, onCapture, name, category }) => {
  const videoRef = React.useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const startCamera = async (facingModeValue) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingModeValue,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Unable to access camera. Please ensure you've granted camera permissions."
      );
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    if (video) {
      // Set canvas dimensions for portrait orientation
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const donorCard = document.getElementById("donor-card-overlay");
      if (donorCard) {
        html2canvas(donorCard).then((donorCardCanvas) => {
          // Draw the donor card at the top left of the canvas
          const scale = 0.5; // Scale down the donor card
          ctx.drawImage(
            donorCardCanvas,
            20, // Adjust the x position as needed
            20, // Adjust the y position as needed
            donorCardCanvas.width * scale,
            donorCardCanvas.height * scale
          );
          const imageData = canvas.toDataURL("image/jpeg", 0.8);
          onCapture && onCapture(imageData);
        });
      } else {
        console.error("Donor card overlay not found.");
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        onCapture && onCapture(imageData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full h-[75vh]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />
        {/* Render Donor Card Overlay on top of the camera video */}
        <DonorCardOverlay name={name} category={category} />
        <button
          onClick={toggleCamera}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg"
          aria-label="Switch Camera"
        >
          <RotateCw size={20} className="text-[#407daa]" />
        </button>
      </div>

      <div className="flex gap-4 mt-4 mb-4">
        <button
          onClick={handleCapture}
          className="px-6 py-2 bg-[#407daa] text-white rounded-full font-semibold hover:bg-blue-700"
        >
          Capture
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CapturedImageComponent = ({
  imageData,
  onRetake,
  onAccept,
  name,
  category,
}) => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full h-[75vh] flex items-center justify-center">
        {/* Display Captured Image */}
        {imageData ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img
              src={imageData}
              alt="Captured"
              className="w-auto h-full object-contain rounded-md shadow-lg"
            />
          </div>
        ) : (
          <p>No image captured</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={onRetake}
          className="px-6 py-2 mb-4 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600"
        >
          Retake
        </button>
        <button
          onClick={onAccept}
          className="px-6 py-2 mb-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const ImagesGrid = ({ images }) => (
  <>
    <div className="text-xl font-semibold mt-6 mb-4">Images</div>
    <div className="grid grid-cols-3 gap-4 px-4">
      {images.map((image, index) => (
        <div key={index} className="bg-gray-200 p-2 shadow-lg rounded-md">
          <img
            alt={`Uploaded ${index + 1}`}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      ))}
    </div>
  </>
);

const GroceriesMobileComponent = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [viewUploadedImages, setViewUploadedImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    category: "",
    remaining_photos: 0,
    donation_id: null,
  });
  const [uploadedStatus, setUploadedStatus] = useState({
    bill: false,
    groceries: false,
    donation_img: false,
    additional_img: false,
  });
  const [currentType, setCurrentType] = useState("");
  const [uploadedData, setUploadedData] = useState({
    bill: null,
    groceries: null,
    donation_img: null,
    additional_img: null,
  });

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        const response = await api.get("/api/get_donor_info/", {
          params: { category: "groceries" },
        });
        if (response.data) {
          setDonorInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching donor info:", error);
      }
    };

    fetchDonorInfo();

    const handlePopState = (event) => {
      event.preventDefault();
      setShowExitConfirmation(true);
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleExit = async () => {
    try {
      await api.post("/api/unblock/");
    } catch (error) {
      console.error("Error calling unblock API:", error);
    } finally {
      window.location.href = "/select-donation-category";
    }
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
    handleCameraClose();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const handleAccept = () => {
    setUploadedData((prevData) => ({
      ...prevData,
      [currentType]: capturedImage,
    }));
    setUploadedStatus((prevStatus) => ({
      ...prevStatus,
      [currentType]: true,
    }));
    setCapturedImage(null);
    setShowCamera(false);
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedData((prevData) => ({
        ...prevData,
        [type]: URL.createObjectURL(file),
      }));
      setUploadedStatus((prevStatus) => ({
        ...prevStatus,
        [type]: true,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const convertToBlob = async (dataUrl) => {
        const response = await fetch(dataUrl);
        return await response.blob();
      };

      const billBlob = uploadedData.bill
        ? await convertToBlob(uploadedData.bill)
        : null;
      const groceriesBlob = uploadedData.groceries
        ? await convertToBlob(uploadedData.groceries)
        : null;
      const donationImgBlob = uploadedData.donation_img
        ? await convertToBlob(uploadedData.donation_img)
        : null;
      const additionalImgBlob = uploadedData.additional_img
        ? await convertToBlob(uploadedData.additional_img)
        : null;

      const formData = new FormData();
      formData.append("donation_id", donorInfo.donation_id);
      if (billBlob) formData.append("bill", billBlob);
      if (groceriesBlob) formData.append("item", groceriesBlob);
      if (donationImgBlob) formData.append("donation_img", donationImgBlob);
      if (additionalImgBlob)
        formData.append("additional_img", additionalImgBlob);

      console.log("Submitting donation with data:", formData);

      const response = await api.post(
        "/api/upload_donation2_images/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Donation submitted successfully!");
        window.location.reload(); // Reload the page after successful submission
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert(`Failed to submit donation: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Organization Dashboard
      </header>

      {showExitConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Do you want to exit?</h2>
            <p className="text-gray-600">
              Are you sure you want to leave this page? Your progress may be
              lost.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                onClick={() => setShowExitConfirmation(false)}
              >
                No
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                onClick={handleExit}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {viewUploadedImages ? (
        <ImagesGrid images={uploadedImages} />
      ) : !showCamera && !capturedImage ? (
        <>
          <div className="w-11/12 max-w-md px-4 py-6 mt-6 bg-white rounded-lg shadow-md mx-auto">
            {donorInfo.name ? (
              <>
                <p className="text-gray-800 font-semibold">
                  Name on Parcel:{" "}
                  <span className="font-normal">{donorInfo.name}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Category:{" "}
                  <span className="font-normal">{donorInfo.category}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Photos Remaining:{" "}
                  <span className="font-normal">
                    {donorInfo.remaining_photos}
                  </span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Amount:{" "}
                  <span className="font-normal">
                    {donorInfo.amount || "N/A"}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-800 font-semibold">
                No donor information available.
              </p>
            )}
          </div>

          {/* Image */}
          <div className="my-6">
            <img
              src={img1}
              alt="Parcel"
              className="w-40 h-40 object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col w-full max-w-md space-y-4 px-4 mb-6 mt-6">
            <label
              className={`mx-auto w-3/4 py-3 ${
                uploadedStatus.bill ? "bg-green-500" : "bg-[#407daa]"
              } text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer`}
            >
              <Upload size={20} />
              Upload Bill
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "bill")}
              />
            </label>
            <label
              className={`mx-auto w-3/4 py-3 ${
                uploadedStatus.groceries ? "bg-green-500" : "bg-[#407daa]"
              } text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer`}
            >
              <Upload size={20} />
              Upload Groceries
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "groceries")}
              />
            </label>
            <button
              className={`mx-auto w-3/4 py-3 ${
                uploadedStatus.donation_img ? "bg-green-500" : "bg-[#407daa]"
              } text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2`}
              onClick={() => {
                setShowCamera(true);
                setCurrentType("donation_img");
              }}
            >
              <Camera size={20} />
              Person Holding Groceries
            </button>
            <button
              className="mx-auto w-3/4 py-3 bg-[#407daa] text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => {
                setShowCamera(true);
                setCurrentType("additional_img");
              }}
            >
              <Camera size={20} />
              Add Extra Image
            </button>
          </div>
          {uploadedStatus.bill &&
            uploadedStatus.groceries &&
            uploadedStatus.donation_img && (
              <button
                className="mx-auto w-3/4 py-3 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
        </>
      ) : showCamera ? (
        <CameraComponent
          onClose={handleCameraClose}
          onCapture={handleImageCapture}
          name={donorInfo.name}
          category={donorInfo.category}
        />
      ) : (
        <CapturedImageComponent
          imageData={capturedImage}
          onRetake={handleRetake}
          onAccept={handleAccept}
          name={donorInfo.name}
          category={donorInfo.category}
        />
      )}

      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default GroceriesMobileComponent;
