import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { TiUpload } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import EnlargeImg from "../../../Component/ui/EnlargeImg";
import SampleImage from "../../../assets/Image/eyomn_logoS1-2-06.jpg";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  getPatientImageArchive,
  getPatientNotes,
  uploadImageArchive,
} from "../../../Service/PatientService";
import Cookies from "universal-cookie";
import Loader from "../../../Component/ui/Loader";
import SuccessModal from "../../../Component/ui/SuccessModal";
import {
  addNewImageArchive,
  setImagesArchive,
  setMedicalScribeNotes,
  setRawNotes,
} from "../../../Slice/NoteSlice";

const ScribeRecord = () => {
  const { patientId } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const user = useSelector((state) => state.reducer.user.user);
  const [patientImages, setPatientImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scribeNotes = useSelector(
    (state) => state.reducer.note.medicalScribeNotes[patientId] || []
  );
  const rawNotes = useSelector(
    (state) => state.reducer.note.rawNotes[patientId] || []
  );
  const imagesUrl = useSelector(
    (state) => state.reducer.note.images[patientId] || []
  );
  const patient = patients.find((patient) => patient.patientId === patientId);

  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken", { path: "/" });
  const refreshToken = cookies.get("refreshToken", { path: "/" });
  const [selectImgOpen, setSelectImgOpen] = useState(null);
  const images = Array.from({ length: 13 }).map(() => SampleImage);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [raw, setRaw] = useState(null);
  const [scribe, setScribe] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const reduxDispatch = useDispatch();
  const medicalRecords = [
    { id: 1, name: "Medical s Record 1", date: "2024-01-01" },
    { id: 2, name: "Medical b Record 2", date: "2024-01-02" },
  ];

  const handleNewRecord = () => {
    navigate(`/scribe/new-record/${patientId}`);
  };
  const handleCloseSuccess = () => setIsSuccess(false);
  useEffect(() => {
    sessionStorage.setItem("currentPath", location.pathname);
    if (patients.length > 0) {
      const patient = patients.find((p) => p.patientId === patientId);
      setCurrentPatient(patient);
    }
  }, [patients, patientId]);

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);

      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleOpenImg = (imageUrl) => {
    setSelectImgOpen(imageUrl);
  };

  const handleCloseImg = () => {
    setSelectImgOpen(null);
  };
  const handleBack = () => {
    navigate("/scribe", { state: { resetSelected: true } });
    sessionStorage.removeItem("currentPatientId");
  };
  useEffect(() => {
    if (location.pathname === "/scribe") {
      setHasSelected(false);
    }
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location]);

  const handleUploadImage = async () => {
    setIsLoading(true);
    try {
      const response = await uploadImageArchive(
        patientId,
        imageFile,
        user.firebaseUid,
        accessToken,
        refreshToken
      );
      if (response) {
        setPatientImages((prevData) => [...patientImages, response.url]);
        reduxDispatch(
          addNewImageArchive({
            [patientId]: response.url,
          })
        );
        setIsSuccess(true);
        setImageFile(null);
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (
          !rawNotes ||
          rawNotes.length === 0 ||
          !scribeNotes ||
          scribeNotes.length === 0
        ) {
          const notesResponse = await getPatientNotes(
            patientId,
            user.firebaseUid,
            accessToken,
            refreshToken
          );
          if (notesResponse) {
            const { rawNotes, soapNotes } = notesResponse;

            reduxDispatch(setRawNotes({ [patientId]: rawNotes }));
            reduxDispatch(setMedicalScribeNotes({ [patientId]: soapNotes }));
            setRaw(notesResponse);
          }
        } else {
          setRaw(rawNotes);
          setScribe(scribeNotes);
        }

        if (!imagesUrl || imagesUrl.length === 0) {
          const imagesResponse = await getPatientImageArchive(
            patientId,
            user.firebaseUid,
            accessToken,
            refreshToken
          );
          if (
            imagesResponse &&
            imagesResponse.imageUrls &&
            Array.isArray(imagesResponse.imageUrls)
          ) {
            setPatientImages(imagesResponse.imageUrls);
            reduxDispatch(
              setImagesArchive({ [patientId]: imagesResponse.imageUrls })
            );
          } else {
            console.log("No images found");
          }
        } else {
          setPatientImages(imagesUrl);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId && user.firebaseUid) {
      fetchData();
    }
  }, [patientId]);

  const handleClickRawNotes = (noteId) => {
    navigate(`/scribe/raw-note/${patientId}/${noteId}`);
    sessionStorage.setItem(
      "currentPath",
      `/scribe/raw-note/${patientId}/${noteId}`
    );
  };

  const handleClickSoap = (noteId) => {
    navigate(`/scribe/soap-record/${patientId}/${noteId}`);
    sessionStorage.setItem(
      "currentPath",
      `/scribe/soap-record/${patientId}/${noteId}`
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="p-4 md:p-6 lg:p-8 h-full font-Poppins text-f-dark">
        <div className="flex justify-between mb-8">
          <div className="flex flex-col">
            <p
              className="flex gap-2 text-p-sc md:text-p-sm  hover:cursor-pointer"
              onClick={handleBack}
            >
              <AiOutlineArrowLeft className="h-5 w-5" /> Back
            </p>
            <h1 className="text-p-sm md:text-p-rg font-medium flex justify-center items-center">
              {currentPatient
                ? `${currentPatient.first_name} ${currentPatient.last_name}`
                : "Loading..."}
            </h1>
          </div>
          <div
            className="h-auto flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
            onClick={handleNewRecord}
          >
            <FiPlus className="h-5 w-5 md:mr-2" />
            <h1>Create New Note</h1>
          </div>
        </div>

        <div className="w-full text-f-dark">
          <nav className="flex items-end h-14">
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 0
                  ? `h-12 bg-[#FFF8DF] text-p-sm md:text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sc md:text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(0)}
            >
              Medical Scribe
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 1
                  ? `h-12 bg-[#FFF8DF] text-p-sm md:text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sc md:text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(1)}
            >
              Raw Form
            </button>
            <button
              className={`w-44 flex items-center justify-center rounded-t-lg transition-all duration-300 ease-in-out font-medium ${
                currentCardIndex === 2
                  ? `h-12 bg-[#FFF8DF] text-p-sm md:text-p-rg`
                  : `h-8 bg-[#D2D2D2] text-p-sc md:text-p-sm opacity-70`
              }`}
              onClick={() => setCurrentCardIndex(2)}
            >
              Image Archive
            </button>
          </nav>
          {currentCardIndex === 0 && (
            <div className="w-full cursor-pointer">
              {scribeNotes.length > 0 ? (
                <div className="w-full cursor-pointer">
                  {scribeNotes ? (
                    <>
                      {scribeNotes.map((note, index) => (
                        <div
                          key={note.noteId || index}
                          className="px-6 py-4 rounded-sm flex h-20 mb-2 items-center justify-between font-medium bg-white hover:bg-bg-sub"
                          onClick={() => handleClickSoap(note.noteId)}
                        >
                          <div className="flex items-center gap-3">
                            <p>{note.name || `Scribe Note ${index + 1}`}</p>
                          </div>
                          <p>
                            {note.createdAt
                              ? note.createdAt.split("T")[0]
                              : "Unknown Date"}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <p className="text-center">No medical case record found.</p>
                </div>
              )}
            </div>
          )}
          {currentCardIndex === 1 && (
            <div>
              {rawNotes.length > 0 ? (
                <div className="w-full cursor-pointer">
                  {rawNotes ? (
                    <>
                      {rawNotes.map((note, index) => (
                        <div
                          key={note.noteId || index}
                          className="px-6 py-4 rounded-sm flex h-20 mb-2 items-center justify-between font-medium bg-white hover:bg-bg-sub"
                          onClick={() => handleClickRawNotes(note.noteId)}
                        >
                          <div className="flex items-center gap-3">
                            <p>{note.name || `Raw Note ${index + 1}`}</p>
                          </div>
                          <p>
                            {note.createdAt
                              ? note.createdAt.split("T")[0]
                              : "Unknown Date"}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <p className="text-center">No medical case record found.</p>
                </div>
              )}
            </div>
          )}
          {currentCardIndex === 2 && (
            <div className="w-full h-full pt-6 flex gap-2 md:gap-6">
              <div className="w-1/6">
                <div
                  className={`relative justify-center items-center rounded-md aspect-square ${
                    image
                      ? `border-none`
                      : `border-dashed border-2 border-c-gray3`
                  }`}
                >
                  {!image ? (
                    <FileUploader
                      handleChange={handleImageUpload}
                      name="file"
                      types={["JPG", "PNG", "GIF"]}
                      maxSize={50 * 1024 * 1024}
                    >
                      <div className="flex flex-col justify-center items-center w-full h-full text-c-gray3 gap-2">
                        <TiUpload className="h-10 w-10" />
                        <h1 className="text-p-sm md:text-p-rg text-center hidden md:block">
                          Upload an Image
                        </h1>
                      </div>
                    </FileUploader>
                  ) : (
                    <div className="relative w-full h-full">
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-3 -right-4 md:top-2 md:right-2 bg-c-gray3 text-white pt-1 px-3 rounded-full text-2xl hover:bg-c-red"
                      >
                        &times;
                      </button>
                      <img
                        src={image}
                        alt="Uploaded preview"
                        className="rounded-md w-full h-full border border-c-gray3"
                      />
                    </div>
                  )}
                </div>
                {image && (
                  <button
                    className="bg-c-primary text-f-light text-p-sm md:text-p-rg rounded-md font-semibold py-1 md:py-3 w-full mt-3"
                    onClick={handleUploadImage}
                  >
                    Save
                  </button>
                )}
              </div>

              <div className="w-full h-full overflow-y-auto">
                {patientImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-8 ">
                    {patientImages.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Patient Image ${index + 1}`}
                        className="cursor-pointer rounded-md h-[250px] w-[400px]"
                        onClick={() => handleOpenImg(imageUrl)}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-center">
                      No images found for this patient.
                    </p>
                  </div>
                )}
                {selectImgOpen !== null && (
                  <EnlargeImg
                    imageUrl={selectImgOpen}
                    onClose={handleCloseImg}
                    fileName={images}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <SuccessModal
        title={"Image Uploaded Successfully!"}
        description={
          "Your image has been uploaded successfully. You can now view it in the gallery."
        }
        isOpen={isSuccess}
        onClose={handleCloseSuccess}
      />
    </>
  );
};

export default ScribeRecord;
