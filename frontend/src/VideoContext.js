import React, { createContext, useState, useCallback ,useEffect} from 'react';


const VideoContext = createContext({
  videoUUID: null,
  setVideoUUID: () => {},
});

export const VideoProvider = ({ children }) => {
  const [videoUUID, setVideoUUID] = useState(() => sessionStorage.getItem('videoUUID'));

  const updateVideoUUID = useCallback((newUUID) => {
    setVideoUUID(newUUID);
    sessionStorage.setItem('videoUUID', newUUID);
  }, []);

  useEffect(() => {
  if (videoUUID) {
    sessionStorage.setItem('videoUUID', videoUUID);
  } else {
    sessionStorage.removeItem('videoUUID');
  }
}, [videoUUID]);

  return (
    <VideoContext.Provider value={{ videoUUID, setVideoUUID: updateVideoUUID }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
